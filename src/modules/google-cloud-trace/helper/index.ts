export function customSpan (name) {
  const tracer = require('@google-cloud/trace-agent').get()
  return tracer.createChildSpan({ name })
}
