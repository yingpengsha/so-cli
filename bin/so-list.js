const fs = require('fs')
const path = require('path')

const templateList = fs.readdirSync(path.resolve(__dirname, '../lib/template'))

templateList.forEach(name => {
  console.log(`  ${name}`)
});