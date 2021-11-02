import config from 'config'
import path from 'path'
import { path as rootPath } from 'app-root-path'
import glob from 'glob'

export default function () {
  console.log('Collect and merge configs from modules.')

  const serverExtensions = glob.sync('src/modules/*/config.{ts,js}')
  serverExtensions.map(serverModule => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const module = require(path.resolve(rootPath, serverModule))
      const extendedConfig = module.default()
      config.util.extendDeep(config, extendedConfig)
    } catch (error) {
      console.error('Error during config-extension' + error.message)
    }
  })
}
