export default defineEventHandler(async (event) => {
  const { db } = event.context
  return {
    db,
    code: 200,
  }
})
