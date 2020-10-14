const {
  configTemplate,
} = require('../src/configTemplate')

const { app, ipcMain, shell, BrowserWindow } = require('electron')
const axios = require('axios')
const config = require('electron-json-config')
const cors = require('cors')
const express = require('express')
const https = require('https')
const isDev = require('electron-is-dev')
const path = require('path')

require('electron-reload')(__dirname, {
  electron: path.join(__dirname, 'node_modules', '.bin', 'electron'),
})

let mainWindow

function createWindow() {
  const expressApp = express()
  expressApp.use(express.json())
  expressApp.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', '*')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
    next()
  })

  expressApp.get('/config', cors(), (req, res, next) => {
    if (Object.entries(config.all()).length === 0) {
      config.setBulk({ ...configTemplate })
    }
    return res.status(200).send(config.all())
  })

  expressApp.put('/config', cors(), (req, res, next) => {
    config.setBulk({ ...req.body })

    return res.status(200).send(config.all())
  })

  expressApp.post('/api', cors(), (req, res, next) => {
    const {
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

    client.request({
      data,
      headers,
      method,
      params,
      url,
    }).then((response) => {
      res.set(response.headers)
      return res.status(response.status).send(response.data)
    }).catch((error) => {
      res.set({ ...error.repsonse.headers })
      return res.status(error.response.status).send(error.response.data)
    })
  })
  expressApp.listen(2468)
  mainWindow = new BrowserWindow({
    height: 768,
    show: false,
    width: 1024,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
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
  app.quit()
})
