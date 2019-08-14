const templateList = require('../lib/list')

templateKeys = Object.keys(templateList);

templateKeys.forEach(key => {
  console.log(`  ${key}`)
});