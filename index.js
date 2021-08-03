const path = require('path')
const env = require('ahau-env')()
const chalk = require('chalk')
const boxen = require('boxen')
const Config = require('./ssb.config')
const karakia = require('./karakia')

module.exports = function startPataka () {
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
    // .use(require('ssb-serve-blobs'))
    .use(require('ssb-hyper-blobs'))

    .use(require('ssb-query'))
    .use(require('ssb-backlinks'))

    .use(require('ssb-settings'))
    .use(require('ssb-profile'))
    // .use(require('ssb-story'))
    // .use(require('ssb-artefact'))
    // .use(require('ssb-whakapapa'))

    .use(require('ssb-invite'))
    // .use(require('ssb-tribes')) // disable attempting decryption
    // .use(require('ssb-pataka'))
    .use(require('ssb-recps-guard'))

  const config = Config()
  const server = stack(config)

  printConfig(server)
  return server
}

function printConfig (server) {
  const { config, id } = server

  const configTxt = chalk`{blue PATAKA}

{bold host}    ${config.pataka.host || config.host}
{bold port}    ${config.port}
{bold feedId}  ${id}
{bold data}    ${config.path}
{bold config}  ${path.join(config.path, 'config')}`

  console.log(boxen(configTxt, {
    padding: 1,
    margin: 1,
    borderStyle: 'round',
    borderColor: 'blue'
  }))
}
