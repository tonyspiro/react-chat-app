// config.js
export default {
  bucket: {
    slug: process.env.COSMIC_BUCKET || 'cosmic-js-chat',
    type_slug: 'messages'
  },
  server: {
    host: process.env.APP_URL || 'http://localhost:3000'
  }
}
