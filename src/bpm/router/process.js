const processRoute = {
  name: 'process',
  path: '/process',
  meta: { title: '流程管理中心', icon: 'el-icon-s-platform', isNav: true },
  component: resolve => require(['../views/parent'], resolve),
  redirect: { name: 'processClassification' },
  children: [
    {
      name: 'processClassification',
      path: 'processClassification',
      meta: { title: '流程建模管理', icon: 'el-icon-s-custom', isNav: true },
      component: resolve => require(['../views/layout'], resolve),
      redirect: { name: 'Classification' },
      children: [
        {
          name: 'Classification',
          path: 'Classification',
          meta: {
            title: '流程分类管理',
            icon: 'icon-leixingpeizhix',
            isNav: true
          },
          component: resolve =>
            require([
              '../views/process/processModeling/processClassification'
            ], resolve),
          children: [
            {
              name: 'classifyHandle',
              path: 'classifyHandle',
              meta: { title: '流程分类操作' },
              component: resolve =>
                require([
                  '../views/process/processModeling/processClassification/classifyHandle'
                ], resolve)
            }
          ]
        },
        {
          name: '/process/processClassification/configurationFlow',
          path: 'configurationFlow',
          meta: {
            title: '配置流程模型',
            icon: 'icon-leixingpeizhi',
            isNav: false
          },
          component: resolve =>
            require([
              '../views/process/processModeling/classificationModel/configurationFlow'
            ], resolve),
          children: [
            {
              name: 'workflowConfiguration',
              path: 'workflowConfiguration',
              meta: { title: '配置流程信息' },
              component: resolve =>
                require([
                  '../views/process/processModeling/classificationModel/configurationFlow/workflowConfiguration'
                ], resolve)
            },
            {
              name: 'flowNode',
              path: 'flowNode',
              meta: { title: '配置节点信息' },
              component: resolve =>
                require([
                  '../views/process/processModeling/classificationModel/configurationFlow/flowNode'
                ], resolve)
            },
            {
              name: 'essentialInformation',
              path: 'essentialInformation',
              meta: { title: '配置基本信息' },
              component: resolve =>
                require([
                  '../views/process/processModeling/classificationModel/configurationFlow/essentialInformation'
                ], resolve)
            }
          ]
        },
        {
          name: '/process/processClassification/processManagement',
          path: 'processManagement',
          meta: { title: '流程版本', icon: 'icon-moban1', isNav: true },
          component: resolve =>
            require([
              '../views/process/processModeling/processManagement'
            ], resolve)
        },
        {
          name: '/process/processClassification/approveType',
          path: 'approveType',
          meta: { title: '审批类型', icon: 'icon-shenpi', isNav: true },
          component: resolve =>
            require(['../views/process/processModeling/approveType'], resolve)
        },
        {
          name: '/process/processClassification/nodeType',
          path: 'nodeType',
          meta: {
            title: '节点类型配置',
            icon: 'icon-leixingpeizhix',
            isNav: true
          },
          component: resolve =>
            require(['../views/process/processModeling/nodeType'], resolve)
        },
        {
          name: 'institutionalFramework',
          path: 'institutionalFramework',
          meta: {
            title: '组织机构流程管理',
            icon: 'icon-liuchengtu',
            isNav: true
          },
          component: resolve =>
            require([
              '../views/process/processModeling/institutionalFramework'
            ], resolve)
        },
        {
          name: 'fixedApproval',
          path: 'fixedApproval',
          meta: { title: '固定审批', icon: 'icon-639', isNav: false },
          component: resolve =>
            require(['../views/process/processModeling/fixedApproval'], resolve)
        },
        {
          name: 'organization',
          path: 'organization',
          meta: { title: '组织属性', icon: 'icon-zuzhijiagou', isNav: true },
          component: resolve =>
            require(['../views/process/processModeling/organization'], resolve)
        },
        {
          name: '/process/processClassification/reportConfig',
          path: 'reportConfig',
          meta: { title: '报表配置', icon: 'icon-leixingpeizhix', isNav: true },
          component: resolve =>
            require(['../views/process/processModeling/reportConfig'], resolve)
        },
        {
          name: 'modelList',
          path: 'modelList',
          meta: { title: '模型列表', icon: 'icon-biaodanpeizhi', isNav: true },
          component: resolve =>
            require(['../views/process/processModeling/modelList'], resolve)
        },
        {
          name: 'processDefinition',
          path: 'processDefinition',
          meta: { title: '流程定义', icon: 'icon-biaodanpeizhi', isNav: true },
          component: resolve =>
            require([
              '../views/process/processModeling/processDefinition'
            ], resolve)
        },
        {
          name: 'deployedManifest',
          path: 'deployedManifest',
          meta: {
            title: '已部署清单',
            icon: 'icon-biaodanpeizhi',
            isNav: true
          },
          component: resolve =>
            require([
              '../views/process/processModeling/deployedManifest'
            ], resolve)
        },
        {
          name: '/process/processClassification/fieldMaintenance',
          path: 'fieldMaintenance',
          meta: { title: '公共字段库', icon: 'icon-navicon-xxwh', isNav: true },
          component: resolve =>
            require([
              '../views/process/advancedConfig/fieldMaintenance'
            ], resolve)
        }
      ]
    },
    {
      name: 'processAudit ',
      path: 'processAudit',
      meta: { title: '流程审计', isNav: true },
      redirect: { name: 'adminLog' },
      component: resolve => require(['../views/layout'], resolve),
      children: [
        {
          name: 'adminLog',
          path: 'adminLog',
          meta: {
            title: '管理员日志',
            icon: 'icon-zhuanxierizhi',
            isNav: true
          },
          component: resolve =>
            require(['../views/process/processAudit/adminLog'], resolve)
        },
        {
          name: 'archiveInfo',
          path: 'archiveInfo',
          meta: { title: '数据库归档信息', icon: 'icon-guidang', isNav: true },
          component: resolve =>
            require(['../views/process/processAudit/archiveInfo'], resolve)
        }
      ]
    },
    {
      name: 'reportdev',
      path: 'reportdev',
      meta: { title: '报表开发', isNav: true },
      redirect: { name: 'chartConfig' },
      component: resolve => require(['../views/layout'], resolve),
      children: [
        {
          name: 'chartConfig',
          path: 'chartConfig',
          meta: { title: '图表配置', icon: 'icon-leixingpeizhix', isNav: true },
          component: resolve =>
            require(['../views/process/processModeling/chartConfig'], resolve)
        },
        {
          name: 'formConfiguration',
          path: 'formConfiguration',
          meta: { title: '表单配置', icon: 'icon-biaodanpeizhi', isNav: true },
          component: resolve =>
            require([
              '../views/process/processModeling/formConfiguration'
            ], resolve)
        }
      ]
    },
    {
      name: 'advancedConfig ',
      path: 'advancedConfig',
      meta: { title: '高级配置', isNav: true },
      redirect: { name: 'adminLog' },
      component: resolve => require(['../views/layout'], resolve),
      children: [
        {
          name: 'configModule',
          path: 'configModule',
          meta: { title: '配置模块', icon: 'icon-icon-test', isNav: false },
          component: resolve =>
            require(['../views/process/advancedConfig/configModule'], resolve)
        }
      ]
    },
    {
      name: 'productReleaseFile',
      path: 'productReleaseFile',
      meta: { title: '产品发布', isNav: true },
      redirect: { name: 'productRelease' },
      component: resolve => require(['../views/layout'], resolve),
      children: [
        {
          name: 'productRelease',
          path: 'productRelease',
          meta: { title: '产品发布', icon: 'icon-navicon-xxwh', isNav: true },
          component: resolve =>
            require([
              '../views/process/productReleaseFile/productRelease'
            ], resolve)
        }
      ]
    },
    {
      name: 'database',
      path: 'database',
      meta: { title: '数据模型开发', isNav: true },
      component: resolve => require(['../views/layout'], resolve),
      redirect: { name: 'databaseManage' },
      children: [
        {
          name: '/process/database/databaseManage',
          path: 'databaseManage',
          meta: { title: '数据模型管理', icon: 'icon-jihua', isNav: true },
          component: resolve =>
            require(['../views/configManage/database/databaseManage'], resolve)
        }
      ]
    },
    {
      name: 'configScheduledTask',
      path: 'configScheduledTask',
      meta: { title: '计划任务', isNav: true },
      component: resolve => require(['../views/layout'], resolve),
      redirect: { name: 'dataDictorary' },
      children: [
        {
          name: '/process/configScheduledTask/scheduledTask',
          path: 'scheduledTask',
          meta: { title: '计划任务', icon: 'icon-jihua', isNav: true },
          component: resolve =>
            require(['../views/configManage/scheduledTask'], resolve)
        }
      ]
    },
    {
      name: 'moduledev',
      path: 'moduledev',
      meta: { title: '模块开发', isNav: true },
      redirect: { name: 'dataConfig' },
      component: resolve => require(['../views/layout'], resolve),
      children: [
        {
          name: '/process/moduledev/dataConfig',
          path: 'dataConfig',
          meta: { title: '基础数据维护', icon: 'icon-shouquan3', isNav: true },
          component: resolve =>
            require(['../views/process/administrativeTool/dataConfig/DataConfig.vue'], resolve)
        },
        {
          name: '/process/moduledev/visualDataConfig',
          path: 'visualDataConfig',
          meta: { title: '可视化数据', icon: 'icon-shujuquanxian', isNav: true },
          component: resolve =>
            require(['../views/process/administrativeTool/visualDataConfig'], resolve)
        },
        {
          name: '/process/moduledev/formPageConfig',
          path: 'formPageConfig',
          meta: {
            title: '表单页面配置',
            icon: 'icon-shujuquanxian',
            isNav: true
          },
          component: resolve =>
            require([
              '../views/process/administrativeTool/formPageConfig'
            ], resolve)
        }
      ]
    },

    {
      name: 'processBasic',
      path: 'processBasic',
      meta: { title: '流程基本配置', isNav: true },
      redirect: { name: 'processDesign' },
      component: resolve => require(['../views/layout'], resolve),
      children: [
        {
          name: '/process/processBasic/processDesign',
          path: 'processDesign',
          meta: {
            title: '流程设计向导',
            icon: 'icon-zhuanxierizhi',
            isNav: true
          },
          component: resolve =>
            require(['../views/process/processBasic/processDesign'], resolve)
        }
      ]
    }
  ]
}
export default processRoute
