module.exports = {
  base: '/blog/',
  title: 'Jinle Blog',
  description: 'this is my blog',
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['meta', { name: 'author', content: 'Jinle'}],
    ['meta', { name: 'keywords', content: 'Jinle，博客'}]
  ],
  markdown: {
    extractHeaders: ['h2', 'h3', 'h4', 'h5']
  },
  plugins: ['@vuepress/nprogress'],
  themeConfig: {
    nav: [
      { text: '主页', link: '/' },
      { text: '前端', link: '/frontend/' },
      { text: '随笔', link: 'https://jinle0703.github.io/' },
    ],
    sidebar: {
      '/frontend/': [
        ['', 'HTML'],
        'CSS',
        'JavaScript',
        'Vue',
        'Node',
        'Koa',
        '浏览器相关',
        '计算机网络',
        '前端安全',
        '性能优化',
        '设计模式'
      ]
    },
    sidebarDepth: '3',
    lastUpdated: '更新时间：'
  }
}