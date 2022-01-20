export default class RequestError extends Error {
  protected url: string
  protected request: any
  protected response: any

  public constructor (message, url?, request?, response?) {
    super(message)

    this.name = 'RequestError'
    this.url = url
    this.request = request
    this.response = response

    if (process.env.GCLOUD_OPERATIONS_ENABLED) {
      console.error(this.gcloudStructuredLog())
      console.error(JSON.stringify(this.gcloudStructuredLog()))
    }
  }

  protected gcloudStructuredLog = function (): Record<string, any> {
    return {
      severity: 'ERROR',
      'logging.googleapis.com/labels': {
        module_id: process.env.GAE_SERVICE || '-',
        version_id: process.env.GAE_VERSION || '-',
        instance_id: process.env.GAE_INSTANCE || '-'
      },
      url: this.url,
      request: this.request,
      response: this.response,
      message: this.message
    }
  }
}
