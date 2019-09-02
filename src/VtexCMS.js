const axios = require('axios');
const cheerio = require('cheerio');
const FormData = require('form-data');
const { createReadStream } = require('fs-extra');

class VtexCMS {
  setAccount(account, authCookie) {
    const headers = {
      Accept: '*/*',
      'Cache-Control': 'no-cache',
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    };
    const config = {
      baseURL: `https://${account}.vtexcommercestable.com.br`,
      timeout: 10000,
      headers,
    };

    this.account = account;
    this.authCookie = authCookie;
    this.api = axios.create(config);
  }

  async getRequestToken() {
    const headers = {
      Cookie: `VtexIdclientAutCookie=${this.authCookie};`,
    };

    const { data } = await this.api.post('/admin/a/PortalManagement/AddFile?fileType=js', null, { headers });
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

    if (!templateMatch || !templateMatch[4]) {
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
    const headers = {
      Cookie: `VtexIdclientAutCookie=${this.authCookie};`,
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    };

    if (!this.getTemplates.cache[key]) {
      const { data } = await this.api.post(endpoint, null, { headers });
      this.getTemplates.cache[key] = data;
    }

    return this.getTemplates.cache[key];
  }

  async saveFile(filepath) {
    const form = new FormData();
    const config = {
      headers: {
        Cookie: `VtexIdclientAutCookie=${this.authCookie};`,
        'Content-Type': form.getHeaders()['content-type'],
      },
    };

    form.append('Filename', filepath);
    form.append('fileext', '*.jpg;*.png;*.gif;*.jpeg;*.ico;*.js;*.css');
    form.append('folder', '/uploads');
    form.append('Upload', 'Submit Query');
    form.append('requestToken', this.requestToken);
    form.append('Filedata', createReadStream(filepath));

    const { data } = await this.api.put('/admin/a/FilePicker/UploadFile', form, config);

    return data;
  }
}

module.exports = new VtexCMS();
