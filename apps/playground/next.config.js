const path = require('path')

const { PHASE_DEVELOPMENT_SERVER } = require('next/constants')
// const { redirects } = require('./src/redirects.json')

/**
 * @type {import('next').NextConfig}
 */
const baseConfig = {
  pageExtensions: ['jsx', 'js', 'ts', 'tsx', 'mdx', 'md'],
  reactStrictMode: true,
  i18n: {
    // These are all the locales you want to support in
    // your application
    locales: ['en-US', 'zh-CN'],
    // This is the default locale you want to be used when visiting
    // a non-locale prefixed path e.g. `/hello`
    defaultLocale: 'en-US',
  },
  async redirects() {
    return [
      {
        source: '/zh-CN', // automatically handles all locales
        destination: '/playground', // automatically passes the locale on
        locale: false,
        permanent: false,
      },
    ]
  },
  env: {
    SANDPACK_BARE_COMPONENTS: process.env.SANDPACK_BARE_COMPONENTS,
    YJS_SERVER: process.env.YJS_SERVER,
  },
  images: {
    domains: ['cloudflare-ipfs.com'],
  },
  compiler: {
    styledComponents: true,
  },
}

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = (phase, { defaultConfig }) => {
  const config = {
    ...defaultConfig,
    ...baseConfig,
  }
  if (phase === PHASE_DEVELOPMENT_SERVER) {
    return config
  }

  return {
    ...config,
    output: 'standalone',
    experimental: {
      ...baseConfig.experimental,
      outputFileTracingRoot: path.join(__dirname, '../../'),
    },
  }
}

module.exports = nextConfig
