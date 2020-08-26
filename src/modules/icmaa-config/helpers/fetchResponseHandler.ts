/**
 * The fetch API don't throws an error if the status isn't successfull
 * so we need to that on our own.
 * @see https://www.tjvantoll.com/2015/09/13/fetch-and-errors/
 */

const errorHandler = (response: Response): Response => {
  if (!response.ok) {
    throw Error(response.statusText)
  }
  return response
}

export default errorHandler
