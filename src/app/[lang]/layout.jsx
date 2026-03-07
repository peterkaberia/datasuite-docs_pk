/* eslint-env node */
import { Footer, Layout, Navbar } from 'nextra-theme-docs'
import { Search } from 'nextra/components'
import { getPageMap } from 'nextra/page-map'
import 'nextra-theme-docs/style.css'
import '../../../public/css/custom.css'

export default async function RootLayout({ children, params }) {
  const { lang } = await params
  const pageMap = await getPageMap(`/${lang}`)

  const translations = {
    en: {
      themeSwitch: { dark: 'Dark', light: 'Light', system: 'System' },
      toc: { title: 'On This Page', backToTop: 'Scroll to top' },
      feedback: { content: 'Question? Give us feedback' },
      searchPlaceholder: 'Search...',
      download: 'Download'
    },
    fr: {
      themeSwitch: { dark: 'Sombre', light: 'Clair', system: 'Système' },
      toc: { title: 'Sur cette page', backToTop: 'Retour en haut' },
      feedback: { content: 'Une question ? Donnez-nous votre avis' },
      searchPlaceholder: 'Rechercher...',
      download: 'Télécharger'
    },
    pt: {
      themeSwitch: { dark: 'Escuro', light: 'Claro', system: 'Sistema' },
      toc: { title: 'Nesta página', backToTop: 'Voltar ao topo' },
      feedback: { content: 'Tem alguma pergunta? Envie-nos seu feedback' },
      searchPlaceholder: 'Pesquisar...',
      download: 'Baixar'
    }
  }

  const t = translations[lang] || translations.en

  return (
    <html lang={lang} dir="ltr" suppressHydrationWarning>
      <body>
        <Layout
          navbar={
          <Navbar 
            logo={
              <>
                <svg width="24" height="24" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M14.683 14.828a4.055 4.055 0 0 1-1.272.858a4.002 4.002 0 0 1-4.875-1.45l-1.658 1.119a6.063 6.063 0 0 0 1.621 1.62a5.963 5.963 0 0 0 2.148.903a6.035 6.035 0 0 0 3.542-.35a6.048 6.048 0 0 0 1.907-1.284c.272-.271.52-.571.734-.889l-1.658-1.119a4.147 4.147 0 0 1-.489.592z M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10s10-4.486 10-10S17.514 2 12 2zm0 2c2.953 0 5.531 1.613 6.918 4H5.082C6.469 5.613 9.047 4 12 4zm0 16c-4.411 0-8-3.589-8-8c0-.691.098-1.359.264-2H5v1a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2h2a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-1h.736c.166.641.264 1.309.264 2c0 4.411-3.589 8-8 8z"
                  />
                </svg>
                <span style={{ marginLeft: '.4em', fontWeight: 800 }}>
                  DataSuite
                </span>
              </>
            }
            align = 'left'
            projectLink={`/${lang}/downloads`}
            projectIcon={<span className="download-btn">{t.download}</span>}
          />
        }
          footer={<Footer>{new Date().getFullYear()} © African Population Health and Research Center.</Footer>}
          docsRepositoryBase="https://github.com/aphrcwaro/datasuite_public"
          sidebar={{ defaultMenuCollapseLevel: 1 }}
          pageMap={pageMap}
          i18n={[
            { locale: 'en', name: 'English' },
            { locale: 'fr', name: 'Français' },
            { locale: 'pt', name: 'Português' }
          ]}
          themeSwitch={t.themeSwitch}
          toc={t.toc}
          feedback={t.feedback}
          editLink={null}
          search={<Search placeholder={t.searchPlaceholder} />}
        >
          {children}
        </Layout>
      </body>
    </html>
  )
}
