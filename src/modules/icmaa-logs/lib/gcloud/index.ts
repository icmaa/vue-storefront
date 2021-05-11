import { isEnabled } from './helper'

/**
 * Add gcloud trace-agent, debugger and profiler – see `icmaa-logs` module
 */
if (isEnabled) {
  require('@google-cloud/trace-agent').start()
  require('@google-cloud/profiler').start()
  // We don't have working source-maps yet and it wont work
  // require('@google-cloud/debug-agent').start({
  //   appPathRelativeToRepository: '../../',
  //   javascriptFileExtensions: ['.js', '.ts']
  // })

  console.log('Enable Google Cloud Operations libraries')
}
