/** @type {import('next').NextConfig} */

const withVideos = require('next-videos')
const nextTranslate = require('next-translate-plugin')

const nextConfig = {
  ...nextTranslate(),
  reactStrictMode: true,
  compiler: {
    removeConsole: process.env.NODE_ENV !== 'development'
  },
  images: {
    domains: [
      'localhost',
      '10.10.18.212',
      'poc.here.news',
      'staging-server-dot-phonic-jetty-356702.uc.r.appspot.com',
      'staging-dot-phonic-jetty-356702.uc.r.appspot.com',
      'production-dot-phonic-jetty-356702.uc.r.appspot.com',
      'here.news',
      'api.here.news'
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**'
      },
      {
        protocol: 'http',
        hostname: '**'
      }
    ]
  },
  experimental: {
    scrollRestoration: true
  }
}
module.exports = withVideos(nextConfig)
