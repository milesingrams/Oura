
var path = require('path')
  , rootPath = path.normalize(__dirname + '/..')
  , templatePath = path.normalize(__dirname + '/../app/mailer/templates')
  , notifier = {
      APN: false,
      email: false, // true
      actions: ['comment'],
      tplPath: templatePath,
      postmarkKey: 'POSTMARK_KEY',
      parseAppId: 'PARSE_APP_ID',
      parseApiKey: 'PARSE_MASTER_KEY'
    }

module.exports = {
  development: {
    db: 'mongodb://localhost/oura-dev',
    root: rootPath,
    notifier: notifier,
    app: {
      name: 'Oura - Development'
    }
  },
  test: {
    db: 'mongodb://localhost/oura-test',
    root: rootPath,
    notifier: notifier,
    app: {
      name: 'Oura - Test'
    }
  },
  production: {
    db: 'mongodb://localhost/oura',
    root: rootPath,
    notifier: notifier,
    app: {
      name: 'Oura - Production'
    }
  }
}
