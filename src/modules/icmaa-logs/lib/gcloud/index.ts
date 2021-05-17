import { isEnabled } from './helper'

let tracer: any = {
  createChildSpan: () => ({ endSpan: () => {} })
}

if (isEnabled) {
  tracer = require('@google-cloud/trace-agent').start({
    /**
     * We could create a custom trace plugin for redis/minify
     * @see https://github.com/googleapis/cloud-trace-nodejs/blob/master/doc/plugin-guide.md
     */
    // projectId: 'icmaa-shop-imp-test-01',
    // keyFilename: 'key.json'
    // plugins: {
    //   'html-minifier': path.join(__dirname, 'tracer/plugins/html-minifier.js'),
    //   'redis-tag-cache': path.join(__dirname, 'tracer/plugins/redis-tag-cache.js')
    // }
  })

  require('@google-cloud/profiler').start()

  // We don't have working source-maps yet and it wont work
  // require('@google-cloud/debug-agent').start({
  //   appPathRelativeToRepository: '../../',
  //   javascriptFileExtensions: ['.js', '.ts']
  // })

  console.log('Enable Google Cloud Operations libraries')
}

export default tracer
