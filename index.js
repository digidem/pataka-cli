const env = require('ahau-env')()

const Config = require('./ssb.config')
const karakia = require('./karakia')
const noop = () => {}

module.exports = function startPataka (opts) {
  /* Karakia tūwhera */
  karakia()

  const stack = require('secret-stack')(env.pataka.caps)
    .use(require('ssb-db'))
    // .use(require('ssb-master'))
    // .use(require('ssb-unix-socket'))
    // .use(require('ssb-no-auth'))

    .use(require('ssb-conn'))
    .use(require('ssb-lan'))
    .use(require('ssb-replicate'))
    .use(require('ssb-friends'))

    .use(require('ssb-blobs'))
    .use(require('ssb-serve-blobs'))
    .use(require('ssb-hyper-blobs'))

    .use(require('ssb-query'))
    .use(require('ssb-backlinks'))

    .use(require('ssb-settings'))
    .use(require('ssb-profile'))
    // .use(require('ssb-story'))
    // .use(require('ssb-artefact'))
    // .use(require('ssb-whakapapa'))

    .use(require('ssb-invite'))

    // HACK 2023-03-13 (mix) - we don't want ssb-tribes installing boxers/ unboxers
    // as this slows down the pataka. We do want some of the tribes APIs for graphql
    // queries
    .use({
      ...require('ssb-tribes'),
      init: (ssb, config) => {
        const _ssb = {
          ...ssb,
          addBoxer: noop,
          addUnboxer: noop
        }
        return require('ssb-tribes').init(_ssb, config)
      }
    })
    .use(require('ssb-recps-guard'))
    .use(require('ssb-pataka'))

  const config = Config(opts)
  const server = stack(config)

  return server
}
