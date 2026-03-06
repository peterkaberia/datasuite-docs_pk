import nextra from 'nextra'

const withNextra = nextra({
  latex: true,
  search: {
    codeblocks: false
  },
  defaultShowCopyCode: false,
  unstable_shouldAddLocaleToLinks: true
})

export default withNextra({
  reactStrictMode: true,
  i18n: {
    locales: ['en', 'fr', 'pt'],
    defaultLocale: 'en'
  }
})
