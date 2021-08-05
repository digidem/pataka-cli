#!/usr/bin/env node

const chalk = require('chalk')
const startSSB = require('../')
const startExpress = require('../express')

const { PATAKA_LOG, PATAKA_INVITE_USES, PATAKA_WEB_PORT } = process.env

const ssb = startSSB()
startExpress(PATAKA_WEB_PORT || 3000)

if (PATAKA_LOG) {
  console.log(chalk`{blue logging started...}`)
  ssb.post(m => console.log(m.value.author, m.value.sequence))
}

const inviteDetails = {
  uses: PATAKA_INVITE_USES || 1000,
  external: ssb.config.pataka.host || ssb.config.host,
  modern: false
}

ssb.invite.create(inviteDetails, (err, invite) => {
  if (err) throw err

  console.log(chalk`
{blue invite} (${inviteDetails.uses} uses):
  {magenta ${invite}}\n`)
})
