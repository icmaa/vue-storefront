export default class RequestError extends Error {
  protected url: string
  protected request: string

  public constructor (message, url?, request?) {
    super(message)

    this.name = 'RequestError'
    this.url = url
    this.request = request

    if (process.env.GCLOUD_OPERATIONS_ENABLED) {
      console.error(this.gcloudStructuredLog())
    }
  }

  protected gcloudStructuredLog () {
    return {
      severity: 'ERROR',
      'logging.googleapis.com/labels': {
        module_id: process.env.GAE_SERVICE || '-',
        version_id: process.env.GAE_VERSION || '-',
        instance_id: process.env.GAE_INSTANCE || '-'
      },
      url: this.url,
      request: this.request,
      message: this.message
    }
  }
}
