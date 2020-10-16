
const appConfig = require('../jsonConfig')({ fileName: '/appConfig.js' })
const fs = require('fs')
const git = require('isomorphic-git')
const http = require("isomorphic-git/http/node")
const local = require('./local')
const openEditor = require('open-editor')
const tmp = require('tmp')
const { app, dialog, Notification } = require('electron')

function checkConfig() {
  if (Object.values(appConfig.all().gitConfig).some(prop => prop === undefined)) {
    dialog.showErrorBox("Configuration problem", "Git is not configured. Please configure all attributes, restart the app, and then try again")

    throw new Error("Unconfigured git")
  }
}

const get = () => {
  return local.get()
}

const write = (config) => {
  return local.write(config)
}

const notify = (body, show = () => {}) => {
  const notification = new Notification({
    title: 'Git Config',
    body,
  })

  notification.on('show', show)

  notification.show()
}

const pull = async () => {
  checkConfig()
  
  const config = {
    path,
    ref,
    repository,
  } = appConfig.all().gitConfig

  const tempDir = tmp.dirSync()

  notify(`Cloning ${repository}`)

  await git.clone({
    fs,
    http,
    dir: tempDir.name,
    url: repository,
    singleBranch: true,
    depth: 1 
  })
  
  let commitOid = await git.resolveRef({ fs, dir: tempDir.name, ref })
  let { blob } = await git.readBlob({
    fs,
    dir: tempDir.name,
    oid: commitOid,
    filepath: path.replace(/^\//, ''),
  })
  
  local.write(JSON.parse(Buffer.from(blob).toString('utf8')))

  notify(`Writing config from ${path} and reloading app`, () => {
    setTimeout(() => {
      app.relaunch()
      app.exit()    
    }, 3000)
  })
}

const push = () => {
  console.log('not implemented')
}

const configure = () => {
  openEditor([
    {
      file: appConfig.file(),
    }
  ])
}

const menu = {
  label: 'Git',
  type: 'submenu',
  submenu: [
    {
      label: 'Configure',
      click: () => { configure() }
    },
    {
      label: 'Pull',
      click: () => { pull() },
    },
    {
      label: 'Push',
      click: () => { push() },
    },
  ],
}

module.exports = {
  get,
  menu,
  write,
  name: 'Git',
}
