const {
  appConfigTemplate,
  configTemplate,
} = require('../src/configTemplate')

const { app, ipcMain, shell, BrowserWindow, Menu, MenuItem } = require('electron')
const axios = require('axios')
const appConfig = require('./includes/jsonConfig')({ fileName: '/appConfig.js' })
const cors = require('cors')
const express = require('express')
const https = require('https')
const isDev = require('electron-is-dev')
const path = require('path')
const { configProviders } = require('./includes/configProviders')

const isMac = process.platform === 'darwin'

let mainWindow
const menu = new Menu()

function changeActiveMenuItem(newName) {
  appConfig.setBulk({ defaultConfigProvider: newName })

  app.relaunch()
  app.exit()
}

function configureMenu() {
  const fileMenu = new MenuItem({
    label: 'File',
    submenu: [
      isMac ? { role: 'close' } : { role: 'quit' },
    ],
  })
  const sourceMenu = new MenuItem({
    id: 'source',
    label: 'Source',
    submenu: [
      {
        enabled: false,
        id: 'active-provider',
        label: `Active Config Provider: ${appConfig.all().defaultConfigProvider}`,
      },
      { type: 'separator' },
      ...Object.values(configProviders).map(provider => {
        const menu = provider.menu
        const active = provider.name === appConfig.all().defaultConfigProvider

        const activeMenuItem = {
          enabled: false,
          id: `active-${provider.name}`,
          label: 'Active',
          visible: active,
        }

        const setActiveMenuItem = {
          click: () => changeActiveMenuItem(provider.name),
          id: `set-active-${provider.name}`,
          label: 'Set Active',
          visible: !active,
        }

        menu.submenu.forEach(item => {
          item.visible = active
        })

        menu.submenu.unshift(activeMenuItem, setActiveMenuItem)

        return menu
      }),
    ],
  })

  menu.append(fileMenu)
  menu.append(sourceMenu)

  Menu.setApplicationMenu(menu)
}

function createWindow() {
  if (Object.entries(appConfig.all()).length === 0) {
    appConfig.setBulk({ ...appConfigTemplate })
  }
  const config = Object.values(configProviders).find(provider => provider.name === appConfig.all().defaultConfigProvider)

  configureMenu()

  const expressApp = express()
  expressApp.use(express.json())
  expressApp.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', '*')
    res.header('Access-Control-Allow-Headers', '*')
    res.header('Access-Control-Expose-Headers', '*')
    next()
  })

  expressApp.get('/config', cors(), (req, res, next) => {
    if (Object.entries(config.get()).length === 0) {
      config.write({ ...configTemplate })
    }
    return res.status(200).send(config.get())
  })

  expressApp.put('/config', cors(), (req, res, next) => {
    config.write({ ...req.body })

    return res.status(200).send(config.get())
  })

  expressApp.post('/api', cors(), (req, res, next) => {
    const {
      authentication,
      authProvider,
      data,
      headers,
      method,
      params,
      url,
    } = req.body.data

    const client = axios.create({
      httpsAgent: new https.Agent({
        rejectUnauthorized: false,
      }),
    })

    let auth

    if (authProvider === 'Bearer') {
      headers.Authorization = `${authentication.prefix} ${authentication.token}`
    } else if (authProvider === 'Basic') {
      auth = authentication
    }

    client.interceptors.request.use((config) => {
      config.metadata = { startTime: new Date() }
      return config
    }, function(error) {
      return Promise.reject(error)
    })

    client.interceptors.response.use((response) => {
      const endTime = new Date()
      const duration = endTime - response.config.metadata.startTime
      response.headers['response-time'] = duration
      return response
    }, function(error) {
      const endTime = new Date()
      error.response.headers['response-time'] = endTime - error.config.metadata.startTime
      return Promise.reject(error)
    })

    client.request({
      auth,
      data,
      headers,
      method,
      params,
      url,
    }).then((response) => {
      res.set(response.headers)
      return res.status(response.status).send(response.data)
    }).catch((error) => {
      res.set({ ...error.response.headers })
      return res.status(error.response.status).send(error.response.data)
    })
  })
  expressApp.listen(2468)
  mainWindow = new BrowserWindow({
    height: 768,
    show: false,
    width: 1024,
    webPreferences: {
      preload: path.join(__dirname, 'includes', 'preload.js'),
    },
  })
  const startURL = isDev ? 'http://localhost:3000' : `file://${__dirname}/../build/index.html`

  mainWindow.loadURL(startURL)
  mainWindow.maximize()

  mainWindow.once('ready-to-show', () => {
    mainWindow.show()

    ipcMain.on('open-external-window', (event, arg) => {
      shell.openExternal(arg)
    })
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

app.on('window-all-closed', () => {
  if (!isMac) {
    app.quit()
  }
})
