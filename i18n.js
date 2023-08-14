const i18n = {
  defaultLocale: 'en',
  locales: ['en', 'zh-cn', 'zh-tw'],
  pages: {
    '*': ['common'],
    '/': ['landing']
  },
  keySeparator: ':',
  loadLocaleFrom: (lang, ns) => {
    // You can use a dynamic import, fetch, whatever. You should
    // return a Promise with the JSON file.
    const m = require(`./src/lib/localization/${lang}/${ns}.json`)
    return Promise.resolve(m)
  }
}

module.exports = i18n
