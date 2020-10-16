// Copyright (c) 2016, Bastien de Luca
// All rights reserved.
//
// Source code is modified from original. Giving credit here as credit is due.

const u = require('./jsonConfigUtils.js')
const fs = require('fs')
const electron = require('electron')
const path = require('path')

module.exports = function(args = {}) {
  const {
    fileName = '/config.json',
  } = args

  const file = path.join((electron.app || electron.remote.app).getPath('userData'), fileName)

  let config = {}

  function readConfig() {
    if (!u.exists(file)) {
      fs.writeFileSync(file, '{}')
    }
    config = JSON.parse(fs.readFileSync(file))
  }

  if (
    (electron.app && electron.app.isReady()) ||
    (electron.remote && electron.remote.app && electron.remote.app.isReady())
  ) {
    readConfig()
  } else {
    (electron.app || electron.remote.app).on('ready', () => readConfig())
  }

  return {
    file: function() {
      return file
    },
    has: function(key) {
      return u.search(config, key) !== undefined
    },
    set: function(key, value) {
      u.set(config, key)(value)
      u.sync(file, config)
    },
    setBulk: function(items) {
      for (const key in items) {
        u.set(config, key)(items[key])
      }
      u.sync(file, config)
    },
    get: function(key, defaultValue) {
      const value = u.search(config, key)
      return value === undefined ? defaultValue : value
    },
    keys: function(key) {
      return Object.keys((key) ? u.search(config, key) : config)
    },
    all: function() {
      return config
    },
    delete: function(key) {
      u.remove(config, key)()
      u.sync(file, config)
    },
    deleteBulk: function(keys) {
      for (const key of keys) {
        u.remove(config, key)()
      }
      u.sync(file, config)
    },
    purge: function() {
      config = {}
      u.sync(file, config)
    },
  }
}
