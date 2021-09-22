module.exports = (req) => {
  const fs = require('fs')
  const path = require('path')

  let icmaaConfig = { map: [] }

  const configPath = path.resolve(__dirname, '../../../config')
  const { NODE_APP_INSTANCE: mandant } = process.env

  const regex = new RegExp('local-(' + mandant + ')-storeview-(\\w*)\\.json', 'i')

  return new Promise((resolve, reject) => {
    try {
      fs.readdirSync(configPath).forEach(file => {
        if (regex.test(file)) {
          const [fileName, man, storeCode] = regex.exec(file)
          icmaaConfig.map.push({ storeCode, ...require(path.resolve(configPath, fileName)) })
        }
      })

      resolve({ icmaa_config: icmaaConfig })
    } catch (error) {
      reject(error)
    }
  })
}
