module.exports = {
  base: '/blog/',
  title: 'Jinle Blog',
  description: 'this is my blog',
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['meta', { name: 'author', content: 'Jinle' }],
    ['meta', { name: 'keywords', content: 'Jinle，博客' }]
  ],
  markdown: {
    lineNumbers: true, // 显示代码块行号
    extractHeaders: ['h2', 'h3', 'h4'] // 侧边栏显示标题级别
  },
  plugins: ['@vuepress/nprogress', '@vuepress/back-to-top'],
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
        'React',
        'React相关库',
        'Vue',
        'TypeScript',
        'Node',
        'Koa',
        '微信小程序',
        '浏览器相关',
        '前端工程化',
        '计算机网络',
        '前端安全',
        '性能优化',
        '设计模式',
        '数据结构',
        '算法',
        'WebSocket',
        '操作系统'
      ]
    },
    sidebarDepth: '3',
    lastUpdated: '更新时间',
    // github 设置
    repo: 'JINLE0703/blog',
    repoLabel: 'Github',
    // 假如文档不是放在仓库的根目录下：
    docsDir: 'docs',
    // 假如文档放在一个特定的分支下：
    docsBranch: 'main',
    // 默认是 false, 设置为 true 来启用
    editLinks: true,
    // 默认为 "Edit this page"
    editLinkText: 'edit this page'
  }
}