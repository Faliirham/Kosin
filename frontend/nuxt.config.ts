export default defineNuxtConfig({
  compatibilityDate: '2026-08-20',

  ssr: true,

  components: [{ path: '~/components', pathPrefix: false }],

  css: [
    '~/assets/css/tokens.css',
    '~/assets/css/base.css',
    '~/assets/css/effects.css',
    '~/assets/css/header.css',
    '~/assets/css/toast.css',
    '~/assets/css/transitions.css',
    '~/assets/css/sections.css',
  ],

  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    head: {
      htmlAttrs: { lang: 'id' },
      title: 'Kos Finder — Temukan kos yang terasa seperti rumah',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
        {
          name: 'description',
          content:
            'Kos Finder — platform pencarian kos-kosan di seluruh Indonesia dengan data langsung dari Google Maps dan OpenStreetMap. Cari kos terdekat, bandingkan rating, dan temukan rumah yang terasa seperti rumah.',
        },
        { name: 'theme-color', content: '#0f172a' },
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: 'https://kosin.app' },
        { property: 'og:title', content: 'Kos Finder — Temukan kos yang terasa seperti rumah' },
        {
          property: 'og:description',
          content:
            'Cari kos-kosan di seluruh Indonesia. Data langsung dari Google Maps, lengkap dengan rating, foto, dan lokasi.',
        },
        { property: 'og:image', content: 'https://picsum.photos/seed/kos-og/1200/630' },
        { property: 'og:locale', content: 'id_ID' },
        { name: 'twitter:card', content: 'summary_large_image' },
      ],
      link: [
        {
          rel: 'icon',
          type: 'image/svg+xml',
          href: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='8' fill='%232563EB'/%3E%3Cpath d='M9 15.5 16 9.5l7 6V24a1.5 1.5 0 0 1-1.5 1.5h-3.5V19h-4v6.5H10.5A1.5 1.5 0 0 1 9 24z' fill='%23fff'/%3E%3C/svg%3E",
        },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Geist:wght@300..800&display=swap',
        },
      ],
      script: [
        {
          innerHTML: `(function(){try{var t=localStorage.getItem('kos-theme');if(t!=='light'&&t!=='dark')t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';document.documentElement.setAttribute('data-theme',t);var m=document.querySelector('meta[name="theme-color"]');if(m)m.setAttribute('content',t==='dark'?'#0b1220':'#0f172a');}catch(e){}})();`,
          type: 'text/javascript',
          tagPosition: 'head',
        },
      ],
    },
  },

  nitro: {
    devProxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
})