export default defineTask({
  meta: {
    name: 'db:migrate',
    description: 'Run database migrations',
  },
  run({ payload, context }) {
    return { context, payload, result: 'Success' }
  },
})
