const fs = require('fs')

const templateList = fs.readdirSync('../lib/template')

templateList.forEach(name => {
  console.log(`  ${name}`)
});