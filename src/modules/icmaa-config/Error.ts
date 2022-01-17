export default class RequestError extends Error {
  protected url: string
  protected request: string

  public constructor (message, url?, request?) {
    super(message)

    this.name = 'RequestError'
    this.url = url
    this.request = request
  }
}
