// Copyright (c) 2016, Bastien de Luca
// All rights reserved.
//
// Source code is modified from original. Giving credit here as credit is due.

const fs = require('fs')

exports.exists = function(file) {
  try {
    fs.statSync(file)
    return true
  } catch (err) {
    if (err.code === 'ENOENT') {
      return false
    }
  }
}

exports.sync = function(file, object) {
  fs.writeFileSync(file, JSON.stringify(object, null, 2))
}

exports.search = function(object, key) {
  const path = key.split('.')

  for (let i = 0; i < path.length; i++) {
    if (object[path[i]] === undefined) {
      return undefined
    }
    object = object[path[i]]
  }

  return object
}

exports.set = function(object, key) {
  const path = key.split('.')
  let i

  for (i = 0; i < path.length - 1; ++i) {
    if (!object[path[i]]) {
      object[path[i]] = {}
    }
    object = object[path[i]]
  }

  return (function(object, attribute) {
    return function(value) { object[attribute] = value }
  }(object, path[i]))
}

exports.remove = function(object, key) {
  const path = key.split('.')
  let i

  for (i = 0; i < path.length - 1; ++i) {
    if (!object[path[i]]) {
      object[path[i]] = {}
    }
    object = object[path[i]]
  }

  return (function(object, attribute) {
    return function() { delete object[attribute] }
  }(object, path[i]))
}
