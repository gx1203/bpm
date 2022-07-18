<template>
  <div id="handbookFiles" class="dashboard-container">
    <el-col :span="6">
      <el-card>
        <el-input clearable v-model="personalinfoset.title" placeholder="标题名称" />
        <el-select clearable v-model="personalinfoset.size" placeholder="表单大小">
          <el-option label="mini" value="mini" />
          <el-option label="small" value="small" />
          <el-option label="medium" value="medium" />
        </el-select>
        <el-button type="primary" @click="openpersonalset()">个人信息</el-button>
        <poral-personalset :options="personalinfoset" :personaldata="personalinfo" />
      </el-card>
    </el-col>
    <el-col :span="7">
      <el-card>
        <poral-logininfo :options="logininfoset" :logindata="logininfo" />
      </el-card>
    </el-col>
    <el-col :span="6">
      <el-card>
        <p>图片上传：</p>
        <poral-imgupload />
      </el-card>
    </el-col>
    <el-col :span="12">
      <el-card>
        <p>轮播图：</p>
        <poral-swiper />
      </el-card>
    </el-col>
    <el-col :span="12">
      <el-card>
        <span>导出excel按钮</span>
        <portal-export :options="exportdata" />
      </el-card>
    </el-col>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
// 个人信息设置
import PoralPersonalset from '@/bpa/components/protal/Portalpersonalsetting'
// 登录人卡片
import PoralLogininfo from '@/bpa/components/protal/portallogininfo'

// 图片上传
import PoralImgupload from '@/bpa/components/protal/Protalimgupload'
// 轮播图
import PoralSwiper from '@/bpa/components/protal/Protalswiper'
// 导出excel按钮
import PortalExport from '@/bpa/components/protal/PortalExport'

export default {
  name: 'Dashboard',
  components: {
    PoralPersonalset,
    PoralLogininfo,
    PoralImgupload,
    PoralSwiper,
    PortalExport
  },
  data() {
    return {
      personalinfoset: {
        disabled: true, // true 启用，false禁用
        size: 'mini', // medium / small / mini 说的是整体的放大缩小比例
        dateformet: 'yyyy-MM-dd', // 日期格式
        showClose: false, // 是否显示关闭按钮,false 不显示，true 显示
        title: '个人设置', // 标题名称
        top: '3vh'
      },
      personalinfo: {
        imgurl:
          '/static/img/logo.026b645.png',
        list: [
          {
            type: 'text',
            name: '姓名',
            value: '黄金龙',
            isrequired: false,
            isedit: true
          },
          {
            type: 'text',
            name: '账号',
            value: '100051',
            isrequired: false,
            isedit: true
          },
          {
            type: 'text',
            name: '部门',
            value: '人力资源部',
            isrequired: false,
            isedit: true
          },
          {
            type: 'text',
            name: '职位',
            value: '人力经理',
            isrequired: false,
            isedit: true
          },
          {
            type: 'text',
            name: '手机号码',
            value: '13567289935',
            isrequired: true,
            isedit: false
          },
          {
            type: 'select',
            name: '主题风格',
            value: '天海一色（蓝）',
            isrequired: true,
            isedit: true,
            option: [
              { label: '天海一色（蓝）', value: '天海一色（蓝）' },
              { label: '萤光之森（绿）', value: '萤光之森（绿）' }
            ]
          },
          {
            type: 'text',
            name: '办公电话',
            value: '0755-7289935',
            isrequired: false,
            isedit: false
          },
          {
            type: 'select',
            name: '状态',
            value: '在岗',
            isrequired: true,
            isedit: false,
            option: [
              { label: '出差', value: '出差' },
              { label: '在岗', value: '在岗' },
              { label: '会议', value: '会议' },
              { label: '休假', value: '休假' },
              { label: '回家', value: '回家' }
            ]
          },
          {
            type: 'text',
            name: '其他电话',
            value: '0755-123456',
            isrequired: false,
            isedit: false
          },
          {
            type: 'date',
            name: '生日',
            value: '2019-02-02',
            isrequired: false,
            isedit: false
          },
          {
            type: 'text',
            name: '邮箱',
            value: 'haitianJ',
            style: 'width:100%',
            isrequired: true,
            isedit: false
          },
          {
            type: 'select',
            name: '@',
            value: 'sina.com',
            isrequired: true,
            isedit: false,
            option: [
              { label: 'sina.com', value: 'sina.com' },
              { label: 'ali.cn', value: 'ali.cn' },
              { label: 'qq.com', value: 'qq.com' }
            ]
          },
          {
            type: 'password',
            name: '邮箱密码',
            value: '123456',
            isrequired: true,
            isedit: false
          },
          {
            type: 'textarea',
            name: '状态描述',
            value: '呼啦啦啦啦啊呀呀呀呀',
            rows: '5',
            style: 'width:100%',
            isrequired: false,
            isedit: false
          }
        ],
        uploadurl: ''
      },
      // 登录人卡片
      logininfoset: {
        disabled: 'true', // true 启用，false禁用
        showtext: true, // 等级进度展示百分比
        isneedhonor: true, // 是否有进入荣誉墙
        customColors: [
          // 等级颜色
          { color: '#f56c6c', percentage: 20 },
          { color: '#e6a23c', percentage: 40 },
          { color: '#6f7ad3', percentage: 100 }
        ]
      },
      logininfo: {
        imageUrl:
          '/static/img/logo.026b645.png',
        name: '黄金龙',
        levelname: '黄金荣耀',
        level: 'Lv5',
        levelscore: '48',
        levelscoretotal: '64',
        levelcolor: 'blue'
      },

      themeopt: {
        disabled: false // true 启用，false禁用
      },
      themeopt2: {
        disabled: false, // true 不可操作，false 可操作
        size: 'mini', // medium / small / mini
        popperclass: 'theme-picker-dropdown', // 下拉框类名
        predefine: [
          '#409EFF',
          '#1890ff',
          '#304156',
          '#212121',
          '#11a983',
          '#13c2c2',
          '#6959CD',
          '#f5222d'
        ] // 预定义颜色
      },
      exportdata: {
        tHeader: ['组织名称', '维度', '维度查看', '知识上传'],
        filterVal: ['title', 'applyusername', 'accepttime', 'accepttime'],
        exportdata: []
      }
    }
  },
  computed: {
    ...mapGetters(['name', 'roles'])
  },
  watch: {},
  created() {
  },
  methods: {
    openpersonalset() {
      this.personalinfoset.disabled = true
      //   this.personalinfoset.size = 'mini'
      this.personalinfoset.showClose = false
      //   this.personalinfoset.title = '自定义标题'
    },
    changetheme() {
      this.themeopt.disabled = true
      console.log(this.themeopt)
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
<style scoped>
.dashboard-container{
  /* width: 100%; */
}
.dashboard-container >>> .swiper-css {
  line-height: 30px;
  text-align: center;
}
.dashboard-container >>> .swiper-active {
  line-height: 30px;
  text-align: center;
  border-bottom: 2px solid #0eec66;
}
</style>
