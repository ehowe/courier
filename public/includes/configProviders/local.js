const config = require('../jsonConfig')()

const get = () => {
  return config.all()
}

const write = (newConfig) => {
  config.setBulk({ ...newConfig })

  return config.all()
}

const menu = {
  label: 'Local',
  type: 'submenu',
  submenu: [],
}

module.exports = {
  get,
  write,
  menu,
  name: 'Local',
}
