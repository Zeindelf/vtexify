const clc = require('cli-color')

const { read, authPath } = require('./utils/file')
const { diff, objectSearch, time } = require('./utils/helpers')

module.exports = () => {
  const authFile = read(authPath)
  const current = objectSearch(authFile, { active: true })

  if (!current) {
    console.log()
    console.log(clc.red('  Not logged in'))
    console.log()
    process.exit(1)
  }

  const { account, email, updatedAt } = current
  const expire = process.env.EXPIRE_TIME - diff(updatedAt)

  console.log()
  console.log(`  Account: ${clc.green(account)}`)
  console.log(`  User: ${clc.green(email)}`)
  console.log(`  Expire in: ${expire > 0 ? clc.green(time(expire)) : clc.red('Expired, please login')}`)
  console.log()
}
