const dataBank = [
  {
    path: '/dataBank',
    meta: { title: '资源库', isNav: true },
    redirect: `/dataBank/businessObject`,
    component: resolve => require(['../../views/layout2'], resolve),
    children: [
      {
        name: 'businessObject',
        path: '/dataBank/businessObject',
        meta: { title: '业务对象', isNav: true },
        component: resolve => require(['../../views/resourceLibrary-views/businessObject/index.vue'], resolve)
      },
      {
        name: 'documentLibrary',
        path: '/dataBank/documentLibrary',
        meta: { title: '文档库', isNav: true },
        component: resolve => require(['../../views/resourceLibrary-views/documentLibrary/index.vue'], resolve)
      },
      {
        name: 'major',
        path: '/dataBank/major',
        meta: { title: '专业库', isNav: true },
        component: resolve => require(['../../views/resourceLibrary-views/major/index.vue'], resolve)
      },
      {
        name: 'BOR',
        path: '/dataBank/BOR',
        meta: { title: '业务对象库', isNav: true },
        component: resolve => require(['../../views/resourceLibrary-views/BOR/index.vue'], resolve)
      },
      {
        name: 'toolMagazine',
        path: '/dataBank/toolMagazine',
        meta: { title: '工具库', isNav: true },
        component: resolve => require(['../../views/resourceLibrary-views/toolMagazine/index.vue'], resolve)
      },

      {
        name: 'termBank',
        path: "/dataBank/termBank",
        meta: { title: '术语库',  isNav: true },
        component: resolve => require(['../../views/settings/wordsManage/index.vue'],  resolve)

      },
      {
        name: 'businessRelation',
        path: '/dataBank/businessRelation', // 业务关系
        meta: { title: '业务关系', isNav: false },
        component: resolve => require(['../../views/resourceLibrary-views/businessRelation/index.vue'], resolve)
      }
    ]
  }
]
export default dataBank
