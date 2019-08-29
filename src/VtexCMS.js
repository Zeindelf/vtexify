class VtexCMS {
  constructor() {
    this.foo = 'VTEX CMS Class';
    this.token = 'TOKEN';
  }

  download() {
    return this.foo;
  }

  upload(files = '') {
    this.token = files;
    return this.token;
  }
}

module.exports = new VtexCMS();
