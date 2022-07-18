const configRoute = {
  name: 'config',
  path: '/config',
  meta: { title: '配置管理', icon: 'el-icon-s-platform', isNav: true },
  component: resolve => require(['../views/parent'], resolve),
  redirect: { name: 'institutional' },
  children: [
    {
      name: 'institutional',
      path: 'institutional',
      meta: { title: '组织机构', isNav: true },
      component: resolve => require(['../views/layout'], resolve),
      redirect: { name: 'staffManage' },
      children: [
        {
          name: '/config/institutional/staffManage',
          path: 'staffManage',
          meta: { title: '员工管理', icon: 'icon-yuangongguanli', isNav: true },
          component: resolve =>
            require([
              '../views/configManage/institutionalFramework/staffManage'
            ], resolve)
        },
        {
          name: '/config/institutional/postManage',
          path: 'postManage',
          meta: { title: '岗位组管理', icon: 'icon-drxx12', isNav: true },
          component: resolve =>
            require([
              '../views/configManage/institutionalFramework/postManage'
            ], resolve)
        },

        {
          name: '/config/institutional/organizationManager',
          path: 'organizationManager',
          meta: { title: '组织机构管理员', icon: 'icon-drxx12', isNav: true },
          component: resolve =>
            require([
              '../views/configManage/institutionalFramework/organizationManager'
            ], resolve)
        },

        // {
        //   name: 'configureJobs',
        //   path: 'configureJobs',
        //   meta: {title: '配置岗位组', isNav: false},
        //   component: resolve => require(['../views/configManage/institutionalFramework/postManage/configureJobs.vue'], resolve),
        // },
        {
          name: '/config/institutional/institutionalOrganization',
          path: 'institutionalOrganization',
          meta: { title: '组织机构', icon: 'icon-zuzhijiagou', isNav: true },
          component: resolve =>
            require([
              '../views/configManage/institutionalFramework/organization'
            ], resolve)
        },
        {
          name: 'adminJurisdiction',
          path: 'adminJurisdiction',
          meta: {
            title: '管理员权限',
            icon: 'icon-jiaosequanxian',
            isNav: false
          },
          component: resolve =>
            require([
              '../views/configManage/institutionalFramework/adminJurisdiction'
            ], resolve)
        },
        {
          name: 'groupPermissions',
          path: 'groupPermissions',
          meta: { title: '组织权限', icon: 'icon-RectangleCopy', isNav: false },
          component: resolve =>
            require([
              '../views/configManage/institutionalFramework/groupPermissions'
            ], resolve)
        },
        {
          name: 'positionManage',
          path: 'positionManage',
          meta: { title: '职务管理', icon: 'icon-zhiwuguanli', isNav: false },
          component: resolve =>
            require([
              '../views/configManage/institutionalFramework/positionManage'
            ], resolve)
        },
        {
          name: '/config/institutional/areaManage',
          path: 'areaManage',
          meta: { title: '片区管理', icon: 'icon-zhiwuguanli', isNav: false },
          component: resolve =>
            require([
              '../views/configManage/institutionalFramework/areaManage'
            ], resolve)
        },
        {
          name: '/config/institutional/departmentManage',
          path: 'departmentManage',
          meta: { title: '部门管理', icon: 'icon-zhiwuguanli', isNav: false },
          component: resolve =>
            require([
              '../views/configManage/institutionalFramework/departmentManage'
            ], resolve)
        },
        {
          name: '/config/institutional/postManagement',
          path: 'postManagement',
          meta: { title: '岗位管理', icon: 'icon-zhiwuguanli', isNav: false },
          component: resolve =>
            require([
              '../views/configManage/institutionalFramework/postManagement'
            ], resolve)
        },
        {
          name: '/config/institutional/companyManagement',
          path: 'companyManagement',
          meta: { title: '公司管理', icon: 'icon-zhiwuguanli', isNav: false },
          component: resolve =>
            require([
              '../views/configManage/institutionalFramework/companyManagement'
            ], resolve)
        },
        {
          name: 'authorityGroup',
          path: 'authorityGroup',
          meta: { title: '系统组管理', icon: 'icon-zhiwuguanli', isNav: false },
          component: resolve =>
            require([
              '../views/configManage/institutionalFramework/authorityGroup'
            ], resolve)
        },
        {
          name: 'customGroups',
          path: 'customGroups',
          meta: {
            title: '自定义组管理',
            icon: 'icon-zhiwuguanli',
            isNav: false
          },
          component: resolve =>
            require([
              '../views/configManage/institutionalFramework/customGroups'
            ], resolve)
        },
        {
          name: '/config/institutional/functionPermission',
          path: 'functionPermission',
          meta: {
            title: '功能权限管理',
            icon: 'icon-zhiwuguanli',
            isNav: false
          },
          component: resolve =>
            require([
              '../views/configManage/institutionalFramework/functionPermission'
            ], resolve)
        }
      ]
    },
    {
      name: 'settings',
      path: 'settings',
      meta: { title: '系统管理', isNav: true },
      redirect: {name: 'processIframeManage'},
      component: resolve => require(['../views/layout'], resolve),
      children: [
        {
          // 企业流程框架管理
          name: '/config/settings/processIframeManage',
          path: 'processIframeManage',
          meta: {title: '企业流程框架管理',icon: 'icon-biaodanpeizhi', isNav: true},
          component: resolve =>
            require(['@/bpa/views/settings/processIframeManage/index.vue'], resolve)
        },
        {
          // 流程框架权限管理
          name: '/config/settings/processFrameworkAuthority',
          path: 'processFrameworkAuthority',
          meta: {title: '流程框架权限管理', icon: 'icon-jiedianbangzhu', isNav: true},
          component: resolve =>
            require(['@/bpa/views/settings/processFrameworkAuthority/index.vue'], resolve)
        },
        {
          // 规章制度管理
          name: '/config/settings/ruleManage',
          path: 'ruleManage',
          meta: { title: '规章制度管理', icon: 'icon-moban', isNav: true },
          component: resolve =>
            require(['@/bpa/views/settings/ruleManage/index.vue'], resolve)
        },
        {
        // 项目介绍管理
        name: '/config/settings/projectIntroduction',
        path: 'projectIntroduction',
        meta: { title: '项目介绍管理', icon: 'icon-shixiao', isNav: true },
        component: resolve =>
          require(['@/bpa/views/settings/projectIntroduction/index.vue'], resolve)
        },
        {
          // 流程学习管理
          name: '/config/settings/processStudyManage',
          path: 'processStudyManage',
          meta: { title: '流程学习管理', icon: 'icon-leixingpeizhix', isNav: true},
          component: resolve =>
           require([
              '@/bpa/views/settings/processStudyManage/index.vue'
            ], resolve)
        },
        {
          // 流程管理规范
          name: '/config/settings/processManagementSpecification',
          path: 'processManagementSpecification',
          meta: { title: '流程管理规范', icon: 'icon-shujuzidian2', isNav: true },
          component: resolve =>
            require([
              '@/bpa/views/settings/processManagementSpecification/index.vue'
            ], resolve)
        },
        {
          // 流程模板
          name: '/config/settings/processTemplateManage',
          path: 'processTemplateManage',
          meta: { title: '流程模板', icon: 'icon-shujuzidian2', isNav: true },
          component: resolve =>
            require([
              '@/bpa/views/settings/processTemplateManage/index.vue'
            ], resolve)
        },
        {
          // 流程卡片字段维护(标签内字段)
          name: '/config/settings/processCard',
          path: 'processCard',
          meta: {title: '流程卡片字段维护(标签内字段)', icon: 'icon-task', isNav: true},
          component: resolve =>
            require(['@/bpa/views/settings/processCard/index.vue'], resolve)
        },
        {
          // 流程卡片字段维护(标签字段)
          name: '/config/settings/processTabCard',
          path: 'processTabCard',
          meta: { title: '流程卡片字段维护(标签字段)',icon: 'icon-navicon-xxwh', isNav: true},
          component: resolve =>
            require(['@/bpa/views/settings/processTabCard/index.vue'], resolve)
        },
        {
          // 绘图设置，综合图例风格和图例设置
          name: '/config/settings/drawSettings',
          path: 'drawSettings',
          meta: { title: '绘图设置', icon: 'icon-banben', isNav: true },
          component: resolve =>
            require(['@/bpa/views/settings/drawSettings/index.vue'], resolve)
        },
        {
          // 流程审批管理
          name: '/config/settings/processApprovalManage',
          path: 'processApprovalManage',
          meta: { title: '流程审批管理', icon: 'icon-639', isNav: true },
          component: resolve =>
            require([
              '@/bpa/views/settings/processApprovalManage/index.vue'
            ], resolve)
        },
        {
          name: '/config/dataBank/termBank',
          path: "termBank",
          meta: { title: '术语库', icon: 'icon-639', isNav: true },
          component: resolve => 
            require([
              '@/bpa/views/settings/wordsManage/index.vue'
            ],  resolve)
  
        },
      ]
    },
    {
      // 流程模型中心
      path: 'processModelCenter',
      meta: { title: '流程中心', isNav: true },
      redirect:  {name: 'processCommunity'},
      component: resolve => require(['../views/layout'], resolve),
      children: [
        {
          name: '/config/processModelCenter/processCommunity',
          path: 'processCommunity',
          meta: { title: '流程与社区', icon: 'icon-chuanyue2', isNav: true },
          component: resolve => require(['@/bpa/views/processModelCenter/processCommunity/index.vue'], resolve)
        },
        {
          name: '/config/processModelCenter/processDesignCenter',
          path: 'module2Child1',
          meta: { title: '流程设计', icon: 'icon-leixingpeizhi', isNav: true },
          component: resolve => require(['@/bpa/views/processDesignCenter/child1/index.vue'], resolve)
        }
      ]
    },
    {
      name: 'navManage',
      path: 'navManage',
      meta: { title: '导航权限', isNav: true },
      component: resolve => require(['../views/layout'], resolve),
      redirect: { name: 'navConfig' },
      children: [
        {
          name: '/config/navManage/navConfig',
          path: 'navConfig',
          meta: { title: '导航配置', icon: 'icon-icon-test', isNav: true },
          component: resolve =>
            require(['../views/configManage/navManage/navConfig'], resolve)
        },
        {
          name: 'navGroupPermissions',
          path: 'navGroupPermissions',
          meta: {
            title: '组织权限分配',
            icon: 'icon-jiaoseshouquan',
            isNav: true
          },
          component: resolve =>
            require([
              '../views/configManage/navManage/groupPermissions'
            ], resolve)
        },
        {
          name: '/config/navManage/roleManage',
          path: 'roleManage',
          meta: { title: '角色管理', icon: 'icon-jiaoseguanli', isNav: true },
          component: resolve =>
            require([
              '../views/configManage/authorityManage/roleManage'
            ], resolve)
        },
        {
          name: 'acctionAuthority',
          path: 'acctionAuthority',
          meta: { title: '功能权限分配', icon: 'icon-quanxian', isNav: true },
          component: resolve =>
            require([
              '../views/configManage/navManage/acctionAuthority'
            ], resolve)
        }
      ]
    },
    {
      name: 'authorityManage',
      path: 'authorityManage',
      meta: { title: '权限管理', isNav: false },
      component: resolve => require(['../views/layout'], resolve),
      redirect: { name: 'navGroupPermissions' },
      children: [
        {
          name: 'authorityGroupPermissions',
          path: 'authorityGroupPermissions',
          meta: {
            title: '组织权限分配',
            icon: 'icon-jiaoseshouquan',
            isNav: false
          },
          component: resolve =>
            require([
              '../views/configManage/navManage/groupPermissions'
            ], resolve)
        },
        {
          name: 'authorityAllocation',
          path: 'authorityAllocation',
          meta: { title: '功能权限分配', icon: 'icon-quanxian', isNav: false },
          component: resolve =>
            require([
              '../views/configManage/navManage/acctionAuthority'
            ], resolve)
        },
        {
          name: 'groupManage',
          path: 'groupManage',
          meta: { title: '组管理', icon: 'icon-zuzhijiagou', isNav: false },
          component: resolve =>
            require([
              '../views/configManage/authorityManage/groupManage'
            ], resolve)
        }
      ]
    },
    {
      name: 'international',
      path: 'international',
      meta: { title: '国际化', isNav: true },
      component: resolve => require(['../views/layout'], resolve),
      redirect: { name: 'navGroupPermissions' },
      children: [
        {
          name: 'internationalSql',
          path: 'internationalSql',
          meta: {
            title: '国际化模块SQL配置',
            icon: 'icon--peizhiSQL',
            isNav: true
          },
          component: resolve =>
            require([
              '../views/configManage/international/internationalSql'
            ], resolve)
        },
        {
          name: '/config/international/internationalConfig',
          path: 'internationalConfig',
          meta: { title: '国际化配置', icon: 'icon-world', isNav: true },
          component: resolve =>
            require([
              '../views/configManage/international/internationalConfig'
            ], resolve)
        }
      ]
    },
    {
      name: 'configPersonalDataDictorary',
      path: 'configPersonalDataDictorary',
      meta: { title: '数据字典', isNav: true },
      component: resolve => require(['../views/layout'], resolve),
      redirect: { name: 'dataDictorary' },
      children: [
        {
          name: '/config/configPersonalDataDictorary/dataDictorary',
          path: 'dataDictorary',
          meta: { title: '数据字典', icon: 'icon-shujuzidian', isNav: true },
          component: resolve =>
            require(['../views/configManage/dataDictorary'], resolve)
        }
      ]
    },
    {
      name: 'linkConfiguration',
      path: 'link',
      meta: { title: '链接配置', icon: 'icon-leixingpeizhix', isNav: true },
      redirect: { name: 'projectLinkConfiguration' },
      component: resolve => require(['../views/layout'], resolve),
      children: [
        {
          name: 'projectLinkConfiguration', // stagingToolQueryCenter
          path: 'link_configuration',
          meta: { title: '项目配置', icon: 'icon-leixingpeizhi', isNav: true },
          component: resolve =>
            require(['../views/configManage/link/link_configuration'], resolve)
        },
        {
          name: 'LinkConfigurationType',
          path: 'link_type',
          meta: {
            title: '链接类型配置',
            icon: 'icon-leixingpeizhix',
            isNav: true
          },
          component: resolve =>
            require(['../views/configManage/link/link_type'], resolve)
        }
      ]
    },
    {
      name: 'dataIntegration',
      path: 'dataIntegration',
      meta: { title: '数据集成', icon: 'icon-leixingpeizhix', isNav: true },
      redirect: { name: 'tgpmsEmpAccountRel' },
      component: resolve => require(['../views/layout'], resolve),
      children: [
        {
          name: 'tgpmsEmpAccountRel',
          path: 'tgpmsEmpAccountRel',
          meta: {
            title: 'tgpmsEmpAccountRel',
            icon: 'icon-shouquan3',
            isNav: true
          },
          component: resolve =>
            require([
              '../views/process/administrativeTool/tgpmsEmpAccountRel'
            ], resolve)
        },
        {
          name: 'tgpmsOwnerAccountRel',
          path: 'tgpmsOwnerAccountRel',
          meta: {
            title: 'tgpmsOwnerAccountRel',
            icon: 'icon-shouquan3',
            isNav: true
          },
          component: resolve =>
            require([
              '../views/process/administrativeTool/tgpmsOwnerAccountRel'
            ], resolve)
        },
        {
          name: 'tgpmsOwnerSystemRel',
          path: 'tgpmsOwnerSystemRel',
          meta: {
            title: 'tgpmsOwnerSystemRel',
            icon: 'icon-shouquan3',
            isNav: true
          },
          component: resolve =>
            require([
              '../views/process/administrativeTool/tgpmsOwnerSystemRel'
            ], resolve)
        }
      ]
    },
    {
      name: 'administrativeTool ',
      path: 'administrativeTool',
      meta: { title: '管理工具', isNav: true },
      redirect: { name: 'administrativeTool' },
      component: resolve => require(['../views/layout'], resolve),
      children: [
        {
          name: '/config/administrativeTool/dataCleaning',
          path: 'dataCleaning',
          meta: { title: '数据清除', icon: 'icon-delete', isNav: true },
          component: resolve =>
            require([
              '../views/process/administrativeTool/dataCleaning'
            ], resolve)
        },
        {
          name: 'dataList',
          path: 'dataList/:menukey',
          meta: { title: '数据维护展示', icon: 'icon-shouquan3', isNav: false },
          component: resolve =>
            require([
              '../views/process/administrativeTool/dataConfig/DataList.vue'
            ], resolve)
        },
        {
          name: 'basDataList',
          path: 'basDataList',
          meta: { title: '数据维护展示', icon: 'icon-shouquan3', isNav: true },
          component: resolve =>
            require(['../components/visualBasDataList/index.vue'], resolve)
        },
        {
          name: '/config/administrativeTool/outAuthorization',
          path: 'outAuthorization',
          meta: { title: '外出授权管理', icon: 'icon-shouquan3', isNav: true },
          component: resolve =>
            require([
              '../views/process/administrativeTool/outAuthorization'
            ], resolve)
        },
        {
          name: 'businessAuthorization',
          path: 'businessAuthorization',
          meta: { title: '业务授权管理', icon: 'icon-shouquan3', isNav: true },
          component: resolve =>
            require([
              '../views/process/administrativeTool/businessAuthorization'
            ], resolve)
        },
        {
          name: '/config/administrativeTool/dataPermission',
          path: 'dataPermission',
          meta: {
            title: '数据权限管理',
            icon: 'icon-shujuquanxian',
            isNav: true
          },
          component: resolve =>
            require([
              '../views/process/administrativeTool/dataPermission'
            ], resolve)
        },
        {
          name: '/config/administrativeTool/auditLog',
          path: 'auditLog',
          meta: {
            title: '管理员日志',
            icon: 'icon-zhuanxierizhi',
            isNav: true
          },
          component: resolve =>
            require(['../views/process/administrativeTool/adminLog'], resolve)
        },
        {
          name: '/config/administrativeTool/flowManagement',
          path: 'flowManagement',
          meta: { title: '流程管理', icon: 'icon-zuzhijiagou', isNav: true },
          component: resolve =>
            require([
              '../views/process/administrativeTool/flowManagement'
            ], resolve)
        },

        {
          name: '/config/administrativeTool/agentsChange',
          path: 'agentsChange',
          meta: { title: '待办变更', icon: 'icon-daiban', isNav: true },
          component: resolve =>
            require([
              '../views/process/administrativeTool/agentsChange'
            ], resolve)
        },
        {
          name: '/config/administrativeTool/processChanges',
          path: 'processChanges',
          meta: { title: '流程变更管理', icon: 'icon-daiban', isNav: true },
          component: resolve =>
            require([
              '../views/process/administrativeTool/processChanges'
            ], resolve)
        }
        ,
        {
          name: '/config/administrativeTool/orgAuthorization',
          path: 'orgAuthorization',
          meta: {
            title: '组织授权管理',
            icon: 'icon-shujuquanxian',
            isNav: true
          },
          component: resolve =>
            require([
              '../views/process/administrativeTool/orgAuthorization'
            ], resolve)
        },
        {
          name: '/config/administrativeTool/jobsChange',
          path: 'jobsChange',
          meta: { title: '岗位变更', icon: 'icon-drxx12', isNav: true },
          component: resolve =>
            require(['../views/process/administrativeTool/jobsChange'], resolve)
        },
        {
          name: '/config/administrativeTool/archivedData',
          path: 'archivedData',
          meta: {
            title: '归档流程数据查看',
            icon: 'icon-guidang',
            isNav: true
          },
          component: resolve =>
            require([
              '../views/process/administrativeTool/archivedData'
            ], resolve)
        },
        {
          name: 'myarchivedData',
          path: 'myarchivedData',
          meta: { title: '我的归档流程', icon: 'icon-guidang', isNav: true },
          component: resolve =>
            require([
              '../views/process/administrativeTool/myarchivedData'
            ], resolve)
        },

        {
          name: 'processRolePermissions',
          path: 'processRolePermissions',
          meta: {
            title: '流程角色权限管理',
            icon: 'icon-jiaosequanxian',
            isNav: true
          },
          component: resolve =>
            require([
              '../views/process/administrativeTool/processRolePermissions'
            ], resolve)
        },
        {
          name: 'roleProcessPermissions',
          path: 'roleProcessPermissions',
          meta: {
            title: '角色流程权限管理',
            icon: 'icon-quanxian',
            isNav: true
          },
          component: resolve =>
            require([
              '../views/process/administrativeTool/roleProcessPermissions'
            ], resolve)
        },
        {
          name: '/config/administrativeTool/processJobsPermissions',
          path: 'processJobsPermissions',
          meta: {
            title: '流程岗位权限管理',
            icon: 'icon-RectangleCopy',
            isNav: true
          },
          component: resolve =>
            require([
              '../views/process/administrativeTool/processJobsPermissions'
            ], resolve)
        },
        {
          name: '/config/administrativeTool/jobProcessInquiry',
          path: 'jobProcessInquiry',
          meta: { title: '岗位流程查询', icon: 'icon-chuanyue2', isNav: true },
          component: resolve =>
            require([
              '../views/process/administrativeTool/jobProcessInquiry'
            ], resolve)
        },
        {
          name: 'processActive',
          path: 'processActive',
          meta: { title: '流程激活', icon: 'icon-activation', isNav: true },
          component: resolve =>
            require([
              '../views/process/administrativeTool/processActive'
            ], resolve)
        }
      ]
    },
    {
      name: 'business',
      path: 'business',
      meta: { title: '业务规则', isNav: true },
      redirect: { name: 'transactionAuthorization' },
      component: resolve => require(['../views/layout'], resolve),
      children: [
        {
          name: 'transactionAuthorization',
          path: 'transactionAuthorization',
          meta: { title: '业务授权管理', icon: 'icon-shouquan3', isNav: false },
          component: resolve =>
            require([
              '../views/process/business/transactionAuthorization'
            ], resolve)
        },
        {
          name: 'businessGroupType',
          path: 'businessGroupType',
          meta: {
            title: '业务组类型',
            icon: 'icon-shenpileixing',
            isNav: false
          },
          component: resolve =>
            require(['../views/process/business/businessGroupType'], resolve)
        },
        {
          name: 'businessGroupManagement',
          path: 'businessGroupManagement',
          meta: {
            title: '业务组管理',
            icon: 'icon-leixingpeizhi',
            isNav: false
          },
          component: resolve =>
            require([
              '../views/process/business/businessGroupManagement'
            ], resolve)
        },
        {
          name: '/config/business/ruleManagement',
          path: 'ruleManagement',
          meta: { title: '流程规则管理', icon: 'icon-yewu', isNav: true },
          component: resolve =>
            require(['../views/process/business/ruleManagement'], resolve)
        },
        // {
        //   name: 'rulesRecycling',
        //   path: 'rulesRecycling',
        //   meta: { title: '业务规则回收站', icon: 'icon-huishouzhan', isNav: true },
        //   component: resolve => require(['../views/process/business/rulesRecycling'], resolve)
        // },
        {
          name: '/config/business/businessRole',
          path: 'businessRole',
          meta: {
            title: '业务角色维护',
            icon: 'icon-leixingpeizhi',
            isNav: true
          },
          component: resolve =>
            require(['../views/process/business/businessRole'], resolve)
        },
        {
          name: '/config/business/serviceAttribute',
          path: 'serviceAttribute',
          meta: {
            title: '业务属性管理',
            icon: 'icon-yewubaobiao',
            isNav: true
          },
          component: resolve =>
            require(['../views/process/business/serviceAttribute'], resolve)
        },
        {
          name: '/config/business/processRoles',
          path: 'processRoles',
          meta: {
            title: '流程角色配置',
            icon: 'icon-zuzhijiagou',
            isNav: true
          },
          component: resolve =>
            require(['../views/process/business/processRoles'], resolve)
        },
        {
          name: 'approvalProcess',
          path: 'approvalProcess',
          meta: {
            title: '审批顺序管理',
            icon: 'icon-shuzishunxu',
            isNav: true
          },
          component: resolve =>
            require(['../views/process/business/approvalProcess'], resolve)
        },
        {
          name: 'processPermissions',
          path: 'processPermissions',
          meta: {
            title: '流程规则权限管理',
            icon: 'icon-icon-quanxianxg',
            isNav: true
          },
          component: resolve =>
            require(['../views/process/business/processPermissions'], resolve)
        },
        {
          name: 'processHelp',
          path: 'processHelp',
          meta: {
            title: '流程帮助信息',
            icon: 'icon-icon-quanxianxg',
            isNav: true
          },
          component: resolve =>
            require(['../views/process/business/processHelp'], resolve)
        },
        {
          name: 'flowChartConfiguration',
          path: 'flowChartConfiguration',
          meta: {
            title: '流程图节点类型配置',
            icon: 'icon-jiedianguanli',
            isNav: true
          },
          component: resolve =>
            require([
              '../views/process/processModeling/flowChartConfiguration'
            ], resolve)
        }
      ]
    },
    {
      name: 'mobileConfig',
      path: 'mobileConfig',
      meta: { title: '移动配置', icon: 'icon-leixingpeizhix', isNav: true },
      redirect: { name: 'mobileProcess' },
      component: resolve => require(['../views/layout'], resolve),
      children: [
        {
          name: '/config/mobileConfig/mobileProcess',
          path: 'mobileProcess',
          meta: { title: '配置流程', icon: 'icon-icon-test', isNav: true },
          component: resolve =>
            require(['../views/process/mobileConfig/mobileProcess'], resolve)
        },
        {
          name: 'groupConfig',
          path: 'groupConfig',
          meta: { title: '移动模块分组配置', icon: 'icon-fenzu', isNav: false },
          component: resolve =>
            require(['../views/process/mobileConfig/groupConfig'], resolve)
        },
        {
          name: 'deviceManagement',
          path: 'deviceManagement',
          meta: {
            title: '移动设备管理',
            icon: 'icon-yidongshebei',
            isNav: false
          },
          component: resolve =>
            require(['../views/process/mobileConfig/deviceManagement'], resolve)
        },
        {
          name: 'menuConfig',
          path: 'menuConfig',
          meta: { title: '移动菜单模块配置', icon: 'icon-menu', isNav: false },
          component: resolve =>
            require(['../views/process/mobileConfig/menuConfig'], resolve)
        },
        {
          name: 'mobileAuthority',
          path: 'mobileAuthority',
          meta: {
            title: '移动模块权限配置',
            icon: 'icon-jiaoseshouquan',
            isNav: false
          },
          component: resolve =>
            require(['../views/process/mobileConfig/mobileAuthority'], resolve)
        }
      ]
    },
    {
      name: 'mncs',
      path: 'mncs',
      meta: { title: '模拟测试', isNav: true },
      redirect: { name: 'automatedTest' },
      component: resolve => require(['../views/layout'], resolve),
      children: [
        {
          name: '/config/mncs/automatedTest',
          path: 'automatedTest',
          meta: {
            title: '全实例测试',
            icon: 'icon-zhuanxierizhi',
            isNav: true
          },
          component: resolve =>
            require([
              '../views/process/processBasic/automatedTest/index1'
            ], resolve)
        },
        {
          name: '/config/mncs/applyTest',
          path: 'applyTest',
          meta: { title: '单实例测试', icon: 'icon-chuanyue1', isNav: true },
          component: resolve =>
            require(['../views/staging/personal/applyTest'], resolve)
        },
        {
          name: '/config/mncs/mockTest',
          path: 'mockTest',
          meta: { title: '模拟测试', icon: 'icon-chuanyue1', isNav: true },
          component: resolve =>
            require(['../views/process/mockTest'], resolve)
        },
      ]
    },
    {
      name: 'application',
      path: 'application',
      meta: { title: '应用维护', isNav: true },
      component: resolve => require(['../views/layout'], resolve),
      redirect: { name: 'applicationMaintenance' },
      children: [
        {
          name: '/config/application/applicationMaintenance',
          path: 'applicationMaintenance',
          meta: { title: '计划任务', icon: 'icon-jihua', isNav: true },
          component: resolve =>
            require([
              '../views/configManage/application/applicationMaintenance'
            ], resolve)
        }
      ]
    },
    {
      name: 'leaveCalendar',
      path: 'leaveCalendar',
      meta: { title: '假期日历配置', isNav: true },
      component: resolve => require(['../views/layout'], resolve),
      redirect: { name: 'leaveCalendarManage' },
      children: [
        {
          name: '/config/leaveCalendar/leaveCalendarManage',
          path: 'leaveCalendarManage',
          meta: { title: '假期日历配置', icon: 'icon-jihua', isNav: true },
          component: resolve =>
            require(['../views/configManage/leaveCalendar'], resolve)
        }
      ]
    },
    {
      name: 'plan',
      path: 'plan',
      meta: { title: '计划管理', isNav: true },
      component: resolve => require(['../views/layout'], resolve),
      redirect: { name: 'planManage' },
      children: [
        {
          name: 'planManage',
          path: 'planManage',
          meta: { title: '计划管理', icon: 'icon-jihua', isNav: true },
          component: resolve =>
            require(['../views/configManage/plan/planManage'], resolve)
        }
      ]
    }
  ]
}
export default configRoute
