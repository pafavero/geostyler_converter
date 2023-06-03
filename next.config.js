/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

module.exports = {
  serverRuntimeConfig: {
      PROJECT_ROOT: __dirname
  }
}
