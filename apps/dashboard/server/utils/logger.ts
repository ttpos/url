import { console } from 'tracer'

const logger = console({
  level: useRuntimeConfig().debug ? 0 : 4,
})

export default logger
