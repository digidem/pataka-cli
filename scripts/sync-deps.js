const fs = require('fs')
const path = require('path')
// NOTE! assumes you have npm linked patkaka repo!
const pataka = require('pataka/package.json')
const patakaCli = require('../package.json')

let needsInstall = false

console.log('Syncing dependencies with pataka:')
Object.entries(patakaCli.dependencies).forEach(([name, version]) => {
  if (pataka.dependencies[name] && pataka.dependencies[name] !== version) {
    console.log(`  ${name}: ${version} > ${pataka.dependencies[name]}`)
    patakaCli.dependencies[name] = pataka.dependencies[name]
    needsInstall = true
  }
})

if (needsInstall) {
  fs.writeFile(path.join(__dirname, '..', 'package.json'), JSON.stringify(patakaCli, null, 2), (err) => {
    if (err) {
      console.error(' failed to write package.json updates!')
      console.log(err)
      return
    }

    console.log('\n  ✓ DONE!')
    console.log('  please run `npm install` to install updates\n')
  })
} // eslint-disable-line
else console.log('  ✓ no updates needed\n')
