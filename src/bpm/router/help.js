const helpRoute = {
    name: 'help',
    path: '/help',
    meta: { title: '在线帮助', icon: 'el-icon-s-platform', isNav: true },
    component: resolve => require(['../views/parent'], resolve),
    redirect: { name: 'onlineHelp' },
    children: [
      {
        name: 'onlineHelp',
        path: 'onlineHelp',
        meta: {title: '在线帮助', isNav: true},
        component: resolve => require(['../views/layout'], resolve),
        redirect: { name: 'helpDocument' },
        children: [
          {
            name: 'helpDocument',
            path: 'helpDocument',
            meta: {title: '帮助文档', icon: 'icon-bangzhu', isNav: true},
            component: resolve => require(['../views/help/onlineHelp'], resolve),
          }
        ]
      },
      {
        name: 'productUpdateFile',
        path: 'productUpdateFile',
        meta: { title: '产品更新', isNav: true },
        redirect: { name: 'productUpdate' },
        component: resolve => require(['../views/layout'], resolve),
        children: [
          {
            name: 'productUpdate',
            path: 'productUpdate',
            meta: { title: '产品更新', icon: 'icon-navicon-xxwh', isNav: true },
            component: resolve => require(['../views/help/productUpdateFile/productUpdate'], resolve)
          },
        ]
      },
    ]
  }
  export default helpRoute
  