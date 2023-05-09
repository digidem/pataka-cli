const Config = require('ssb-config/defaults')
const fs = require('fs')
const path = require('path')
const env = require('ahau-env')()
const crypto = require('crypto')
const envPaths = require('env-paths')
const merge = require('lodash.merge')

const appPath = envPaths(env.pataka.appName, { suffix: '' }).data
const configPath = path.join(appPath, 'config')

const { PATAKA_LOG, PATAKA_HOST, PATAKA_INVITE_USES, PATAKA_WEB_PORT } = process.env

const core = {
  path: appPath,
  port: Number(process.env.PORT) || env.pataka.port, // ssb port
  pataka: {
    host: PATAKA_HOST || 'localhost',
    webPort: Number(PATAKA_WEB_PORT) || 3000,
    log: Boolean(PATAKA_LOG),
    inviteUses: Number(PATAKA_INVITE_USES) || 1000
  },
  graphql: {
    corsOpen: true,
    port: env.pataka.graphql.port
  },
  allowPrivate: true, // used for making local invite codes
  // HACK: There is a problem with ssb-invite where it look for a public incoming connection in the config which does not exist
  // and then throws an error.
  // When allowPrivate:true it settles on a private/local address,
  // then invite.create({external}) overwrites the ip address of that address :(
  // Possible solution would be to pass host and port to ssb-invite and have it skip getAddress
  caps: env.pataka.caps,
  // caps = capabilities, only apps with:
  // - the same shs ("secret handshake") key can connect to each other
  // - thas same sign can verify (+replicatie) messages with each other
  friends: { hops: 2 },
  lan: {
    legacy: false
    // disables legacy UDP announce (which doesn't respect caps.shs!)
  },
  serveBlobs: {
    port: env.pataka.serveBlobs.port,
    cors: true,
    csp: ''
  },
  hyperBlobs: {
    pataka: true,
    port: env.pataka.hyperBlobs.port
  },
  recpsGuard: {
    allowedTypes: [
      'contact', // needed for ssb-invite
      'profile/pataka'
    ]
  }
}

let config = null

module.exports = function (opts = {}) {
  if (config) return config

  const persisted = loadPersisted(configPath)
  if (!persisted.mixpanelId) {
    persisted.mixpanelId = generateId()
    // write a copy of customConfig to configPath so that:
    // - we can persist our unique mixpanel ID for anonymous analytics
    fs.writeFileSync(
      configPath,
      JSON.stringify(persisted, null, 2),
      (err) => {
        if (err) throw err
      }
    )
  }

  config = Config(env.pataka.appName, merge({}, core, persisted, opts))

  config.pataka.allowedOrigins ||= unique(
    `http://${config.pataka.host}:${config.pataka.webPort}`,
    `http://localhost:${config.pataka.webPort}`
  )

  return config
}

function loadPersisted (configPath) {
  try {
    const persistedConfig = fs.readFileSync(configPath, 'utf8')
    return JSON.parse(persistedConfig) || {}
  } catch (err) {
    if (err.message.match(/no such file/)) return {}

    console.log('Invalid JSON in', configPath)
    throw err
  }
}

function generateId () {
  return crypto.randomBytes(32).toString('base64')
}

function unique (...arr) {
  return Array.from(new Set(arr))
}
