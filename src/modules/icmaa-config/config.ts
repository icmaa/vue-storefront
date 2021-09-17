import fs from 'fs'
import path from 'path'

const { NODE_APP_INSTANCE: mandant } = process.env

export default function () {
  const storeViews = {}
  const configPath = path.resolve(__dirname, '../../../config')
  const regex = new RegExp('local-(' + mandant + ')-storeview-(\\w*)\\.json', 'i')

  try {
    fs.readdirSync(configPath).forEach(file => {
      if (regex.test(file)) {
        const [fileName, man, storeCode] = regex.exec(file)
        Object.assign(storeViews, { [storeCode]: require(path.resolve(configPath, fileName)) })
      }
    })
  } catch (error) {
    console.error(error)
  }

  return { storeViews }
}
