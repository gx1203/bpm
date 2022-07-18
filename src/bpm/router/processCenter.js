const processCenterRoute = {
  name: 'processCenter',
  path: '/processCenter',
  meta: { title: '流程中心', icon: 'el-icon-s-platform', isNav: true },
  component: resolve => require(['../views/parent'], resolve),
  redirect: { name: 'processModelCenter' },
  children: [
    {
      // 流程模型中心
      name: 'processModelCenter',
      path: 'processModelCenter',
      meta: { title: '流程定义', isNav: true },
      redirect: { name: 'processCommunity' },
      component: resolve => require(['../views/layout'], resolve),
      children: [
        {
          name: '/processCenter/processModelCenter/processCommunity',
          path: 'processCommunity',
          meta: { title: '流程与社区', icon: 'icon-chuanyue2', isNav: true },
          component: resolve =>
            require([
              '@/bpa/views/processModelCenter/processCommunity/index.vue'
            ], resolve)
        },
        {
          name: '/processCenter/processModelCenter/processDesignCenter',
          path: 'processDesignCenter',
          meta: { title: '流程设计', icon: 'icon-leixingpeizhi', isNav: true },
          component: resolve =>
            require([
              '@/bpa/views/processDesignCenter/child1/index.vue'
            ], resolve)
        },
        {
          name: '/processCenter/processModelCenter/processIframeCenter',
          path: 'processIframeCenter',
          meta: {
            title: '流程框架',
            icon: 'icon-jiedianleixing-',
            isNav: true
          },
          component: resolve =>
            require([
              '@/bpa/views/processModelCenter/processIframeCenter/index.vue'
            ], resolve)
        }
      ]
    },
    {
      // 相关内容
      name: 'relatedInformation',
      path: 'relatedInformation',
      meta: { title: '相关内容', isNav: true },
      redirect: { name: 'processFile' },
      component: resolve => require(['../views/layout'], resolve),
      children: [
        {
          name: '/relatedInformation/processModelCenter/processFile',
          path: 'processFile',
          meta: { title: '流程附件', isNav: true },
          component: resolve =>
            require(['@/bpa/views/processModelCenter/processFile'], resolve)
        },
        {
          name: '/relatedInformation/processModelCenter/processManage',
          path: 'processManage',
          meta: { title: '流程台账', isNav: true },
          component: resolve =>
            require(['@/bpa/views/processModelCenter/processManage'], resolve)
        },
        {
          name: '/relatedInformation/processModelCenter/terminology', // 术语
          path: 'terminology',
          meta: { title: '术语', icon: 'icon-shujuzidian', isNav: true },
          component: resolve =>
            require([
              '@/bpa/views/processModelCenter/terminology/index.vue'
            ], resolve)
        }
      ]
    },
    {
      // 相关内容
      name: 'endToEnd',
      path: 'endToEnd',
      meta: { title: '端到端价值链', isNav: true },
      redirect: { name: 'edgeToedge' },
      component: resolve => require(['../views/layout'], resolve),
      children: [
        {
          name: '/endToEnd/valueCenter/edgeToedgeMagane',
          path: 'edgeToedge',
          meta: { title: '端到端模型管理', isNav: true },
          component: resolve =>
            require(['@/bpa/views/valueCenter/edgeToedge/index.vue'], resolve)
        },
        {
          name: '/endToEnd/valueCenter/edgeToEdge',
          path: 'edgeToEdge',
          meta: { title: '端到端模型查看', isNav: true },
          component: resolve =>
            require([
              '@/bpa/views/processModelCenter/valueChain/edgeToEdge/index.vue'
            ], resolve)
        }
      ]
    }
  ]
}
export default processCenterRoute
