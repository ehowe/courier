const privateConfig = require('../jsonConfig')({ fileName: '/privateConfig.js' })
const config = require('../jsonConfig')()

const getPublic = () => {
  return config.all()
}

const getPrivate = () => {
  return privateConfig.all()
}

const writePublic = (newConfig) => {
  config.setBulk({ ...newConfig })

  return config.all()
}

const writePrivate = (newConfig) => {
  privateConfig.setBulk({ ...newConfig })
}

const menu = {
  label: 'Local',
  type: 'submenu',
  submenu: [],
}

module.exports = {
  getPublic,
  getPrivate,
  writePublic,
  writePrivate,
  menu,
  name: 'Local',
}
