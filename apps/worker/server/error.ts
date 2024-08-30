import type { H3Error, H3Event } from 'h3'

export default defineNitroErrorHandler((error: H3Error, event: H3Event) => {
  setResponseHeader(event, 'Content-Type', 'text/json')
  return send(
    event,
    JSON.stringify({
      statusCode: error.statusCode,
      message: error.message,
      stack: useRuntimeConfig().debug ? error?.stack?.split('\n') : undefined,
    }),
  )
})
