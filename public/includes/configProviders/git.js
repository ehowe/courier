
const appConfig = require('../jsonConfig')({ fileName: '/appConfig.js' })
const fs = require('fs')
const git = require('isomorphic-git')
const http = require('isomorphic-git/http/node')
const openEditor = require('open-editor')
const pathLib = require('path')
const tmp = require('tmp')
const { app, dialog, Notification } = require('electron')
const headers = { 'User-Agent': 'git/Courier' }

const {
  getPublic,
  getPrivate,
  writePublic,
  writePrivate,
} = require('./local')

// TODO: Memoize so that pull and push do not clone everytime

function checkConfig() {
  if (Object.values(appConfig.all().gitConfig).some(prop => prop === undefined)) {
    dialog.showErrorBox('Configuration problem', 'Git is not configured. Please configure all attributes, restart the app, and then try again')

    throw new Error('Unconfigured git')
  }
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

  const {
    path,
    ref,
    repository,
    token,
  } = appConfig.all().gitConfig

  const tempDir = tmp.dirSync()

  notify(`Cloning ${repository}`)

  await git.clone({
    fs,
    http,
    dir: tempDir.name,
    url: repository,
    singleBranch: true,
    ref,
    headers,
    onAuth: () => ({ username: token }),
  })

  const commitOid = await git.resolveRef({ fs, dir: tempDir.name, ref })
  const { blob } = await git.readBlob({
    fs,
    dir: tempDir.name,
    oid: commitOid,
    filepath: path.replace(/^\//, ''),
  })

  writePublic(JSON.parse(Buffer.from(blob).toString('utf8')))

  notify(`Writing config from ${path} and reloading app`, () => {
    setTimeout(() => {
      app.relaunch()
      app.exit()
    }, 3000)
  })
}

const push = async () => {
  checkConfig()

  const {
    email,
    name,
    path,
    ref,
    repository,
    token,
  } = appConfig.all().gitConfig

  const tempDir = tmp.dirSync()

  notify(`Cloning ${repository}`)

  await git.clone({
    fs,
    http,
    dir: tempDir.name,
    url: repository,
    headers,
    ref,
    onAuth: () => ({ username: token }),
  })

  fs.writeFileSync(pathLib.join(tempDir.name, path), JSON.stringify(getPublic(), null, 2))

  notify(`Committing config to ${repository} as ${name}: ${email}`)

  await git.add({
    fs,
    dir: tempDir.name,
    filepath: path.replace(/^\//, ''),
  })

  await git.commit({
    fs,
    dir: tempDir.name,
    author: {
      name,
      email,
    },
    message: `Updated config ${new Date(new Date().toUTCString())}`,
  })

  await git.push({
    fs,
    http,
    dir: tempDir.name,
    ref,
    headers,
    onAuth: () => ({ username: token }),
  })
}

const configure = () => {
  openEditor([
    {
      file: appConfig.file(),
    },
  ])
}

const menu = {
  label: 'Git',
  type: 'submenu',
  submenu: [
    {
      label: 'Configure',
      click: () => { configure() },
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
  getPublic,
  getPrivate,
  menu,
  writePublic,
  writePrivate,
  name: 'Git',
}
