module.exports = {
    siteUrl: 'https://co-crm.vercel.app',
    generateRobotsTxt: true,
    changefreq: 'daily',
    priority: 0.7,
    exclude: ['/admin/*', '/secret-page'],
    robotsTxtOptions: {
      policies: [
        { userAgent: '*', allow: '/' },
        { userAgent: 'Googlebot', disallow: '/admin' },
      ],
      additionalSitemaps: [
        'https://co-crm.vercel.app/my-custom-sitemap-1.xml',
        'https://co-crm.vercel.app/my-custom-sitemap-2.xml',
      ],
    },
  };