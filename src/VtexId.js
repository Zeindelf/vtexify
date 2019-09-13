const axios = require('axios')
const { stringify } = require('qs')

class VtexId {
  setAccount (account) {
    this.account = account
    this.uri = `https://${account}.myvtex.com/api/vtexid/pub/authentication`
    this.api = axios.create({
      baseURL: this.uri
    })
  }

  async getToken () {
    const { data } = await this.api.get('/start', {
      params: {
        callbackUrl: `${this.uri}/finish`,
        user: null,
        locale: 'pt-BR',
        accountName: this.account,
        appStart: true
      }
    })

    if (data && data.authenticationToken) {
      return data.authenticationToken
    }

    return false
  }

  async getAccessKey (token, email) {
    await this.api.post('/accesskey/send', stringify({
      email,
      authenticationToken: token,
      locale: 'pt-BR'
    }))
  }

  async validateToken (token, login, accesskey) {
    const { data } = await this.api.post('/accesskey/validate', stringify({
      login,
      accesskey,
      authenticationToken: token
    }))

    return data.authCookie.Value
  }
}

module.exports = new VtexId()
