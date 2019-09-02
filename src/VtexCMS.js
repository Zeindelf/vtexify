const axios = require('axios');
const cheerio = require('cheerio');

class VtexCMS {
  setAccount(account, authCookie) {
    this.account = account;
    this.authCookie = authCookie;
    this.uri = `https://${account}.vtexcommercestable.com.br`;
    this.api = axios.create({
      baseURL: this.uri,
      headers: {
        'Cache-Control': 'no-cache',
        Accept: '*/*',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
      timeout: 10000,
    });
  }

  async getRequestToken() {
    this.api.interceptors.request.use((config) => {
      config.headers.post['Cookie'] = `VtexIdclientAutCookie=${this.authCookie};`; // eslint-disable-line
      return config;
    });

    const { data } = await this.api.post('/admin/a/PortalManagement/AddFile?fileType=js');
    const $ = cheerio.load(data);
    const requestToken = $('#fileUploadRequestToken').val();

    if (!requestToken) {
      throw new Error('Couldn\'t get request token!');
    }

    this.requestToken = requestToken;
  }

  async getLegacyTemplateId(templateName, type, isSub = false) {
    const templatesList = await this.getTemplates(type, isSub);
    const regex = new RegExp(`(${templateName})([\\s\\S]+?)(templateId=)([\\s\\S]+?(?="))`);
    const templateMatch = templatesList.match(regex);

    if (!templateMatch) {
      throw new Error('Template not found');
    }

    return templateMatch[4];
  }

  /**
   * Get a list of templates
   * @param {String} type Template type [viewTemplate|shelfTemplate]
   * @param {Boolean} [isSub=false] Is subTemplate
   */
  async getTemplates(type, isSub = false) {
    this.getTemplates.cache = this.getTemplates.cache || {};
    const key = `${type}-${isSub}`;
    const endpoint = `admin/a/PortalManagement/GetTemplateList?type=${type}&IsSub=${isSub ? 1 : 0}`;

    this.api.interceptors.request.use((config) => {
      config.headers.post['Cookie'] = `VtexIdclientAutCookie=${this.authCookie};`; // eslint-disable-line
      config.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8'; // eslint-disable-line
      return config;
    });

    if (!this.getTemplates.cache[key]) {
      const { data } = await this.api.post(endpoint);
      this.getTemplates.cache[key] = data;
    }

    return this.getTemplates.cache[key];
  }
}

module.exports = new VtexCMS();
