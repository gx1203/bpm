const module1Routes = [
  {
    path: '/settings',
    meta: { title: '系统管理', isNav: true },
    redirect: '/settings/processIframeManage',
    component: resolve => require(['../../views/layout2'], resolve),
    children: [
      // { // 用户管理
      //   name: 'userManage',
      //   path: '/settings/userManage',
      //   meta: {
      //     title: '用户管理',
      //     isNav: true,
      //     icon: 'icon-drxx12',
      //     roles: [false]
      //   },
      //   component: resolve => require(['../../views/settings/userManage/index.vue'], resolve)
      // },
      // { // 组织管理
      //   name: 'groupManage',
      //   path: '/settings/groupManage',
      //   meta: { title: '组织管理', icon: 'icon-zuzhijiagou', isNav: true },
      //   component: resolve => require(['../../views/settings/groupManage/index.vue'], resolve)
      // },
      // { // 系统角色管理
      //   name: 'systemRoleManage',
      //   path: '/settings/systemRoleManage',
      //   meta: { title: '系统角色管理', icon: 'icon-quanxian', isNav: true },
      //   component: resolve => require(['../../views/settings/systemRoleManage/index.vue'], resolve)
      // },
      // { // 审批角色管理
      //   name: 'approvalRoleManage',
      //   path: '/settings/approvalRoleManage',
      //   meta: { title: '审批角色管理', icon: 'icon-RectangleCopy', isNav: true },
      //   component: resolve => require(['../../views/settings/approvalRoleManage/index.vue'], resolve)
      // },
      // { // 流程组织员管理
      //   name: 'processGroup',
      //   path: '/settings/processGroupManage',
      //   meta: { title: '流程组织员管理', icon: 'icon-jiedianguanli', isNav: true },
      //   component: resolve => require(['../../views/settings/processGroupManage/index.vue'], resolve)
      // },
      // { // 审批时长管理
      //   name: 'approvalTimeManage',
      //   path: '/settings/approvalTimeManage',
      //   meta: {
      //     title: '审批时长管理',
      //     isNav: true,
      //     icon: 'icon-activation',
      //     roles: {
      //       isAdd: true,
      //       isDelete: true,
      //       isEdit: true
      //     }
      //   },
      //   component: resolve => require(['../../views/settings/approvalTimeManage/index.vue'], resolve)
      // },
      {
        // 企业流程框架管理
        name: '/settings/processIframeManage',
        path: '/settings/processIframeManage',
        meta: {
          title: '企业流程框架管理',
          icon: 'icon-biaodanpeizhi',
          isNav: true
        },
        component: resolve =>
          require([
            '../../views/settings/processIframeManage/index.vue'
          ], resolve)
      },
      // { // 流程变更记录
      //   name: 'processChangeRecords',
      //   path: '/settings/processChangeRecords',
      //   meta: { title: '流程变更记录', icon: 'icon-zhuanxierizhi', isNav: true },
      //   component: resolve => require(['../../views/settings/processChangeRecords/index.vue'], resolve)
      // },
      // { // 术语管理
      //   name: 'wordsManage',
      //   path: '/settings/wordsManage',
      //   meta: { title: '术语管理', icon: 'icon-shujuzidian1', isNav: true },
      //   component: resolve => require(['../../views/settings/wordsManage/index.vue'], resolve)
      // },
      {
        // 流程学习管理
        name: '/settings/processStudyManage',
        path: '/settings/processStudyManage',
        meta: {
          title: '流程学习管理',
          icon: 'icon-leixingpeizhix',
          isNav: true
        },
        component: resolve =>
          require([
            '../../views/settings/processStudyManage/index.vue'
          ], resolve)
      },
      // { // 通知公告管理
      //   name: 'noticeManage',
      //   path: '/settings/noticeManage',
      //   meta: { title: '通知公告管理', icon: 'icon-wj-cy', isNav: true },
      //   component: resolve => require(['../../views/settings/noticeManage/index.vue'], resolve)
      // },
      {
        // 模板管理
        name: 'modulesManage',
        path: '/settings/modulesManage',
        meta: { title: '模板管理', icon: 'icon-jihua', isNav: true },
        component: resolve =>
          require(['../../views/settings/modulesManage/index.vue'], resolve)
      },
      {
        // 操作手册管理
        name: 'operatingBooksManage',
        path: '/settings/operatingBooksManage',
        meta: { title: '操作手册管理', icon: 'icon-shujuzidian2', isNav: true },
        component: resolve =>
          require([
            '../../views/settings/operatingBooksManage/index.vue'
          ], resolve)
      },
      {
        // 流程管理规范
        name: 'processManagementSpecification',
        path: '/settings/processManagementSpecification',
        meta: { title: '流程管理规范', icon: 'icon-shujuzidian2', isNav: true },
        component: resolve =>
          require([
            '../../views/settings/processManagementSpecification/index.vue'
          ], resolve)
      },
      {
        // 流程模板
        name: 'processTemplateManage',
        path: '/settings/processTemplateManage',
        meta: { title: '流程模板', icon: 'icon-shujuzidian2', isNav: true },
        component: resolve =>
          require([
            '../../views/settings/processTemplateManage/index.vue'
          ], resolve)
      },
      // { // 菜单管理
      //   name: 'menusManage',
      //   path: '/settings/menusManage',
      //   meta: { title: '菜单管理', icon: 'icon-jiaoseshouquan', isNav: true },
      //   component: resolve => require(['../../views/settings/menusManage/index.vue'], resolve)
      // },
      // { // 定时任务
      //   name: 'setintervalTasks',
      //   path: '/settings/setintervalTasks',
      //   meta: { title: '定时任务', icon: 'icon-tubiao', isNav: true },
      //   component: resolve => require(['../../views/settings/setintervalTasks/index.vue'], resolve)
      // },
      // { // 流程框架审批任务
      //   name: 'processIframeAppoval',
      //   path: '/settings/processIframeAppoval',
      //   meta: { title: '流程框架审批任务', icon: 'icon-liucheng', isNav: true },
      //   component: resolve => require(['../../views/settings/processIframeAppoval/index.vue'], resolve)
      // },
      // { // 流程可见权限管理
      //   name: 'processVisibleManage',
      //   path: '/settings/processVisibleManage',
      //   meta: { title: '流程可见权限管理', icon: 'icon-icon-quanxianxg', isNav: true },
      //   component: resolve => require(['../../views/settings/processVisibleManage/index.vue'], resolve)
      // },
      {
        // 流程卡片字段维护(标签内字段)
        name: 'processCard',
        path: '/settings/processCard',
        meta: {
          title: '流程卡片字段维护(标签内字段)',
          icon: 'icon-task',
          isNav: true
        },
        component: resolve =>
          require(['../../views/settings/processCard/index.vue'], resolve)
      },
      {
        // 流程卡片字段维护(标签字段)
        name: 'processTabCard',
        path: '/settings/processTabCard',
        meta: {
          title: '流程卡片字段维护(标签字段)',
          icon: 'icon-navicon-xxwh',
          isNav: true
        },
        component: resolve =>
          require(['../../views/settings/processTabCard/index.vue'], resolve)
      },
      {
        // 体系分类管理
        name: '/settings/systemClassificationMaintenance',
        path: '/settings/systemClassificationMaintenance',
        meta: { title: '体系分类管理', icon: 'icon-fenzu', isNav: true },
        component: resolve =>
          require([
            '../../views/settings/systemClassificationMaintenance/index.vue'
          ], resolve)
      },
      {
        // 项目介绍管理
        name: '/projectIntroduction',
        path: '/settings/projectIntroduction',
        meta: { title: '项目介绍管理', icon: 'icon-shixiao', isNav: true },
        component: resolve =>
          require([
            '../../views/settings/projectIntroduction/index.vue'
          ], resolve)
      },
      {
        // 改变图例风格
        name: '/changeDesgin',
        path: '/settings/changeDesgin',
        meta: { title: '改变图例风格', icon: 'icon-banben', isNav: true },
        component: resolve =>
          require(['../../views/settings/changeDesgin/index.vue'], resolve)
      },
      {
        // 改变图例风格
        name: '/legendSettings',
        path: '/settings/legendSettings',
        meta: { title: '图例设置', icon: 'icon-banben', isNav: true },
        component: resolve =>
          require(['../../views/settings/legendSettings/index.vue'], resolve)
      },
      {
        // 绘图设置，综合图例风格和图例设置
        name: '/drawSettings',
        path: '/settings/drawSettings',
        meta: { title: '绘图设置', icon: 'icon-banben', isNav: true },
        component: resolve =>
          require(['../../views/settings/drawSettings/index.vue'], resolve)
      },
      {
        // 流程审批管理
        name: '/processApprovalManage',
        path: '/settings/processApprovalManage',
        meta: { title: '流程审批管理', icon: 'icon-639', isNav: true },
        component: resolve =>
          require([
            '../../views/settings/processApprovalManage/index.vue'
          ], resolve)
      },
      {
        // 流程框架权限管理
        name: '/processFrameworkAuthority',
        path: '/settings/processFrameworkAuthority',
        meta: {
          title: '流程框架权限管理',
          icon: 'icon-jiedianbangzhu',
          isNav: true
        },
        component: resolve =>
          require([
            '../../views/settings/processFrameworkAuthority/index.vue'
          ], resolve)
      },
      {
        // 密码重置
        name: 'resetPassword',
        path: '/settings/resetPassword',
        meta: {
          title: '修改链接地址',
          icon: 'icon-icon-quanxianxg',
          isNav: true
        },
        component: resolve =>
          require(['../../views/settings/resetPassword/index.vue'], resolve)
      },
      {
        // 规章制度管理
        name: 'ruleManage',
        path: '/settings/ruleManage',
        meta: { title: '规章制度管理', icon: 'icon-moban', isNav: true },
        component: resolve =>
          require(['../../views/settings/ruleManage/index.vue'], resolve)
      },
      {
        // 流程文档模板展示
        name: 'processTemplate',
        path: '/settings/processTemplate',
        meta: { title: 'processTemplate', icon: 'icon-moban', isNav: true },
        component: resolve =>
          require(['../../views/settings/processTemplate/index.vue'], resolve)
      },
      {
        // 部门权限清单管理
        name: 'deptJuridictionManger',
        path: '/settings/deptJuridictionManger',
        meta: { title: 'deptJuridictionManger', isNav: true },
        component: resolve =>
          require([
            '../../views/settings/deptJuridictionManger/index.vue'
          ], resolve)
      },
      {
        // 制度信息库管理
        name: 'informationManage',
        path: '/settings/informationManage',
        meta: { title: 'informationManage', isNav: true },
        component: resolve =>
          require(['../../views/settings/informationManage/index.vue'], resolve)
      },
      {
        // 数据管理
        name: 'dataManagement',
        path: '/settings/dataManagement',
        meta: { title: 'dataManagement', isNav: true },
        component: resolve =>
          require(['../../views/settings/dataManagement/index.vue'], resolve)
      }
    ]
  }
]
export default module1Routes
