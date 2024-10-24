import { defineEventHandler, getRequestURL } from 'h3'

export default defineEventHandler((event) => {
  const { method } = event.node.req

  logger.info?.(`New request: ${method} ${getRequestURL(event)}`)
})
