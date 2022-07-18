const knowRoutes = [
  {
    // 内容管理中心
    path: '/knowLedge',
    meta: { title: '内容管理中心', isNav: true },
    redirect: `/knowLedge/index`,
    component: resolve => require(['@/bpa/views/layout'], resolve),
    children: [
      {
        // 知识首页
        name: 'index',
        path: '/knowLedge/index',
        meta: { title: '知识首页', isNav: true },
        component: resolve => require(['@/bpa/views/knowLedgeCenter/home'], resolve)
      },
      {
        // 知识详情（不用写入路由，通过点击进入）
        name: 'detail',
        path: '/knowLedge/detail',
        meta: { title: '知识详情', isNav: true },
        component: resolve => require(['@/bpa/views/knowLedgeCenter/detail'], resolve)
      },
      {
        // 我的收藏
        name: 'favorite',
        path: '/knowLedge/favorite',
        meta: { title: '我的收藏', isNav: true },
        component: resolve => require(['@/bpa/views/knowLedgeCenter/favorite'], resolve)
      },
      {
        // 我的上传
        name: 'upload',
        path: '/knowLedge/upload',
        meta: { title: '我的上传', isNav: true },
        component: resolve => require(['@/bpa/views/knowLedgeCenter/upload'], resolve)
      },
      {
        // 我分享的
        name: 'share',
        path: '/knowLedge/share',
        meta: { title: '我分享的', isNav: true },
        component: resolve => require(['@/bpa/views/knowLedgeCenter/share'], resolve)
      },
      {
        // 分享给我
        name: 'shareTo',
        path: '/knowLedge/shareTo',
        meta: { title: '分享给我', isNav: true },
        component: resolve => require(['@/bpa/views/knowLedgeCenter/shareTo'], resolve)
      },
      {
        // 荣誉墙
        name: 'honor',
        path: '/knowLedge/honor',
        meta: { title: '荣誉墙', isNav: true },
        component: resolve => require(['@/bpa/views/knowLedgeCenter/honor'], resolve)
      },
      {
        // 回收站
        name: 'recycle',
        path: '/knowLedge/recycle',
        meta: { title: '回收站', isNav: true },
        component: resolve => require(['@/bpa/views/knowLedgeCenter/recycle'], resolve)
      },
      {
        // 权限管理
        name: 'permission',
        path: '/knowLedge/permission',
        redirect: `/knowLedge/permission/user`,
        meta: { title: '权限管理', isNav: true },
        component: resolve => require(['@/bpa/views/knowLedgeCenter/permission'], resolve),
        children: [
          {
            // 用户维度
            name: 'user',
            path: 'user',
            meta: { title: '用户维度', isNav: true },
            component: resolve => require(['@/bpa/views/knowLedgeCenter/permission/user.vue'], resolve)
          },
          {
            // 组织维度
            name: 'orgpermission',
            path: 'orgpermission',
            meta: { title: '组织维度', isNav: true },
            component: resolve => require(['@/bpa/views/knowLedgeCenter/permission/orgpermission.vue'], resolve)
          },
          {
            // 用户知识
            name: 'userknowledge',
            path: 'userknowledge',
            meta: { title: '用户知识', isNav: true },
            component: resolve => require(['@/bpa/views/knowLedgeCenter/permission/userknowledge.vue'], resolve)
          },
          {
            // 组织知识
            name: 'orgknowledge',
            path: 'orgknowledge',
            meta: { title: '组织知识', isNav: true },
            component: resolve => require(['@/bpa/views/knowLedgeCenter/permission/orgknowledge.vue'], resolve)
          },
          {
            // 管理员权限矩阵
            name: 'adminpermission',
            path: 'adminpermission',
            meta: { title: '管理员权限矩阵', isNav: true },
            component: resolve => require(['@/bpa/views/knowLedgeCenter/permission/adminpermission.vue'], resolve)
          }
        ]
      },
      {
        // 知识管理
        name: 'manage',
        path: '/knowLedge/manage',
        meta: { title: '知识管理', isNav: true },
        component: resolve => require(['@/bpa/views/knowLedgeCenter/manage'], resolve)
      }
    ]
  }
]
export default knowRoutes
