#!/usr/bin/env node

const env = require('ahau-env')()
const path = require('path')
const chalk = require('chalk')
const boxen = require('boxen')

const startSSB = require('../')
const startExpress = require('../express')
const { version } = require('../package.json')

function start () {
  const ssb = startSSB()
  startExpress(ssb.config.pataka?.webPort)

  createInvite(ssb)

  printConfig(ssb)

  if (ssb.config.pataka?.log) {
    console.log(chalk`{blue logging started...}`)
    ssb.post(m => console.log(m.value.author, m.value.sequence))
  }
}
start()

function createInvite (ssb) {
  /* auto-create a massive invite */
  // outputs to terminal
  // runs on each startup
  const inviteDetails = {
    uses: ssb.config.pataka.inviteUses,
    external: ssb.config.pataka.host || ssb.config.host,
    modern: false
  }

  ssb.invite.create(inviteDetails, (err, invite) => {
    if (err) throw err

    const inviteTxt = chalk`
      {bold invite} (${inviteDetails.uses} uses)
      {magenta ${invite}}\n\n`

    console.log(inviteTxt)
  })
}

function printConfig (ssb) {
  const { config } = ssb
  const envName = env.isProduction ? '' : ` ${env.name.toUpperCase()} `

  const configTxt = chalk`{blue PATAKA} {white.bgRed ${envName}} v${version}

{bold feedId}  ${config.keys.id}
{bold network}
    ├── host  ${config.pataka.host || config.host}
    ├── port  ${config.port}
    └── api   http://${config.pataka.host}:${config.graphql.port}/graphql

{bold config}  ${path.join(config.path, 'config')}

{bold web ui}  ${config.pataka.allowedOrigins.join('\n        ')}`

  console.log(boxen(configTxt, {
    padding: 1,
    margin: 1,
    borderStyle: 'round',
    borderColor: 'blue'
  }))
}
