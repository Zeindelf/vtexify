const clc = require('cli-color')

const vtexCMS = require('./VtexCMS')

module.exports = async () => {
  console.log(clc.green(vtexCMS.download()))
}
