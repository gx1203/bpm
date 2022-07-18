<template>
  <div>
    <div>
      <div id="area">
        地区选择插件
      </div>
      <portal-area-picker
        :options="areaOptions"
        @chosedArea="fun"/>
      <div>我选择的结果是 {{ chosedArea }}</div>
    </div>
    <div>
      <el-table
        id="table"
        :data="tableData"
        style="width: 100%">
        <el-table-column
          prop="date"
          label="日期"
          width="180"/>
        <el-table-column
          prop="name"
          label="姓名"
          width="180"/>
        <el-table-column
          prop="address"
          label="地址"/>
      </el-table>
      <portal-pagination
        id="pagination"
        :pagination-obj="pagination"
        @handleSizeChange="SizeChange"
        @handleCurrentChange="CurrentChange"
      />
      <div id="desc">element-ui默认的语言环境是en，分页插件本地使用时注意语言环境</div>
      <div id="guide">
        <portal-guide :steps="stepsList"/>
      </div>
      <div>
        <portal-weather-info :weather-options="WeatherOptions"/>
      </div>
    </div>
    <div>
      页面滚动到指定位置会在右下角出现返回顶部按钮
      可自定义按钮的样式、show/hide、出现的高度、返回的位置 如需文字提示，可在外部使用Element的el-tooltip元素
    </div>
    <div style="height: 100px"/>
    回到顶部
    <portal-back-to-top :custom-style="myBackToTopStyle" :visibility-height="300" :back-position="50" transition-name="fade" />
  </div>
</template>

<script>
import PortalAreaPicker from '@/bpa/components/protal/AreaPicker'
import PortalPagination from '@/bpa/components/protal/Pagination'
import PortalGuide from '@/bpa/components/protal/Guide'
import PortalBackToTop from '@/bpa/components/protal/BackToTop'
import PortalWeatherInfo from '@/bpa/components/protal/WeatherInfo'
export default {
  name: 'TestForYan',
  components: {
    PortalAreaPicker,
    PortalPagination,
    PortalGuide,
    PortalBackToTop,
    PortalWeatherInfo
  },
  data() {
    return {
      // customizable button style, show/hide critical point, return position
      myBackToTopStyle: {
        right: '50px',
        bottom: '50px',
        width: '40px',
        height: '40px',
        'border-radius': '4px',
        'line-height': '45px', // 请保持与高度一致以垂直居中 Please keep consistent with height to center vertically
        background: '#e7eaf1'// 按钮的背景颜色 The background color of the button
      },
      areaOptions: {
        value: [],
        placeholder: '请选择123',
        disabled: false, // 禁用
        size: 'medium', // medium / small / mini 说的是整体的放大缩小比例
        clearable: true, // 是否支持清空选项
        showAllLevels: true, // 输入框中是否显示选中值的完整路径
        separator: '-', // 选项分隔符与showAllLevels不能同时生效
        popperClass: '', // 自定义浮层类名(在顶层设置样式)
        selectClass: '', // 自定义select样式
        leaf: 2 // 展示箭头层级
      },
      chosedArea: '',
      tableData: [
        {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄'
        },
        {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄'
        },
        {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        }],
      pagination: {
        total: 0, // 总条数
        currentPage: 1, // 当前页
        pageSizes: [5, 10, 15], // 每页显示个数选择器的下拉框类名
        pageSize: 10, // 每页显示条数
        layout: '->, prev, pager, next, jumper, sizes', // 组件布局
        small: false, // 是否显示小型分页
        background: true, // 是否为分页添加背景色
        popperClass: '', // 每页显示个数选择器的下拉框类名
        prevText: '<', // 替代图标显示的上一页文字
        nextText: '>', // 替代图标显示的下一页文字
        disabled: false, // 是否禁用
        hidePage: false // 只有一页时是否隐藏
      },
      // 高亮组件数组
      stepsList: [
        {
          element: '#area',
          popover: {
            title: 'area',
            description: 'Open && Close 地区组件',
            position: 'bottom'
          }
        },
        {
          element: '#table',
          popover: {
            title: 'table',
            description: 'Open && Close 表格组件',
            position: 'bottom'
          }
        },
        {
          element: '#pagination',
          popover: {
            title: 'pagination',
            description: 'Open && Close 分页组件',
            position: 'bottom'
          }
        },
        {
          element: '#desc',
          popover: {
            title: 'desc',
            description: 'Open && Close ui描述',
            position: 'bottom'
          }
        },
        {
          element: '#guide',
          popover: {
            title: 'guide',
            description: 'Open && Close 高亮组件',
            position: 'bottom'
          }
        }
      ],
      timePickerValue: '', // 展示国际化效果
      WeatherOptions: {
        style: '', // 行内样式
        className: '', // class类
        width: 290,
        height: 100,
        fontColor: '000000', // 文字颜色
        align: 'center', // 对齐方式 center left right
        air_quality: '0', // 是否开始空气质量显示 0 / 1
        city_select: '1', // 是否开启城市选择
        showItem: '2', // 显示几天的天气
        iconSize: '0' // 图标大小 0 / 1
      }
    }
  },
  computed: {
    locallan() {
      return this.$store.getters.language
    }
  },
  methods: {
    fun(val) {
      console.log(val)
      this.chosedArea = Object.values(val)
    },
    SizeChange() {},
    CurrentChange() {}
  }
}
</script>

<style lang="scss" scoped>
.el-row {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .el-col {
    border-radius: 4px;
  }
  .bg-purple-dark {
    background: #99a9bf;
  }
  .bg-purple {
    background: #d3dce6;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
</style>
