const { app, BrowserWindow } = require('electron')
const axios = require('axios')
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
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
    next()
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
    width: 800,
    height: 600,
    show: false,
  })
  const startURL = isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`

  mainWindow.loadURL(startURL)

  mainWindow.once('ready-to-show', () => mainWindow.show())
  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', createWindow)
