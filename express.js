const express = require('express')
module.exports = function startExpress (port) {
  if (!port) return

  const app = express()

  app.use(express.static('public'))

  app.listen(port)
}
