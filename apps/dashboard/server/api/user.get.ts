export default defineEventHandler((event) => {
  logger.log(event.context.user)
  return event.context.user
})
