import nextra from 'nextra'

const withNextra = nextra({
  latex: true,
  search: {
    codeblocks: false
  },
  defaultShowCopyCode: false
})

export default withNextra({
  reactStrictMode: true,
  i18n: {
    locales: ['en', 'fr', 'pt'],
    defaultLocale: 'en'
  }
})
