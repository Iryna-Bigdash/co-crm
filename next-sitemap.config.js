module.exports = {
  siteUrl: process.env.SITE_URL || process.env.NEXTAUTH_URL || 'http://localhost:3001',
  generateRobotsTxt: true,
  changefreq: 'daily',
  priority: 0.7,
  exclude: ['/signin', '/denied'],
};
