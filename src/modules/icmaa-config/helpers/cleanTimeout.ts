/**
 * Set a timer and clear it with it's component destroyer to prevent JS memory-leaks.
 *
 * Example:
 * ```js
 * setCleanTimeout.call(this, () => { }, 1000)
 * ```
 *
 * @param callback Function
 * @param timeout number
 * @return number The timer you created
 */
export const setCleanTimeout = function (callback: Function, timeout: number): number {
  const timer = setTimeout(callback, timeout)
  this.$once('hook:destroyed', () => {
    clearTimeout(timer)
  })
  return timer
}
