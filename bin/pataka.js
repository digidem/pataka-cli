#!/usr/bin/env node

const env = require('ahau-env')()
const path = require('path')
const chalk = require('chalk')
const boxen = require('boxen')

const startSSB = require('../')
const startExpress = require('../express')

const { PATAKA_LOG, PATAKA_INVITE_USES, PATAKA_WEB_PORT } = process.env
const webPort = PATAKA_WEB_PORT || 3000

function start () {
  const ssb = startSSB({
    pataka: {
      allowedOrigins: [
        `http://localhost:${webPort}`
      ]
    }
  })
  startExpress(webPort)
  createInvite(ssb, PATAKA_INVITE_USES)

  printConfig(ssb)

  if (PATAKA_LOG) {
    console.log(chalk`{blue logging started...}`)
    ssb.post(m => console.log(m.value.author, m.value.sequence))
  }
}
start()

function createInvite (ssb, uses = 1000) {
  /* auto-create a massive invite */
  // outputs to terminal
  // runs on each startup
  const inviteDetails = {
    uses,
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
  const { config, id } = ssb
  const envName = env.isProduction ? '' : ` ${env.name.toUpperCase()} `

  const configTxt = chalk`{blue PATAKA} {white.bgRed ${envName}}

{bold web ui}  http://localhost:${webPort}
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
