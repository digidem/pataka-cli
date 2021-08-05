const express = require('express')
module.exports = function startExpress (port = 80) {
  const app = express()

  app.use(express.static('public'))

  app.listen(port)
}
