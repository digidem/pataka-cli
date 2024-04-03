const env = require('ahau-env')()

const Config = require('./ssb.config')
const plugins = require('./ssb.plugins')
const karakia = require('./karakia')
const noop = () => {}

module.exports = function startPataka (opts) {
  /* Karakia tūwhera */
  karakia()

  const stack = require('secret-stack')(env.pataka.caps)
    .use(plugins)

  const config = Config(opts)
  const server = stack(config)

  return server
}
