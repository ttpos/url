export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)

  await sendRedirect(event, `${config.app.cdnURL}favicon.ico`)
})
