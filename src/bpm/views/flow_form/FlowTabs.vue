<template>
  <el-tabs v-model="activeName" type="card">
    <el-tab-pane v-for="(item, index) in data" :key="index" :label="item.tabname" :name="item.tabname" :disabled="isPrint">
      <flow-card v-for="(item2, index2) in item.nodeTabLists.filter(el => el.istab === '0')" :data="item2" :key="index2" :is-print="isPrint" />
      <flow-tabs v-for="(item2, index2) in tabsList[index]" :data="item2" :key="index2" v-if="item.istab === '1'" :is-print="isPrint" />
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import FlowCard from './FlowCard'
export default {
  name: 'FlowTabs',
  components: {
    FlowCard
  },
  data () {
    return {
      tabsList: [],
      activeName: ''
    }
  },
  props: {
    data: {
      type: Array,
      default: () => ([])
    },
    isPrint: {
      type: Boolean
    }
  },
  watch: {
    data: {
      handler (val) {
        this.tabsList = []
        if (val.length > 0) {
          this.activeName = val[0].tabname
        }
        val.forEach((item, index) => {
          this.tabsList.push([])
          this.tabsList[index] = item.nodeTabLists.filter(el => {
            return el.istab === '1'
          })
          // item.nodeTableLists.sort((a, b) => a.sort - b.sort)
        })
      },
      immediate: true
    },
    expand (val) {
      this.slideToggle(val)
    }
  },
  methods: {
    getRules (item) {
      return {
        required: item.required !== 'Y',
        message: `${item.fieldShowName}` + this.$t('hintText.canNotEmpty'),
        trigger: item.inputType === 'text' || item.inputType === 'textarea' ? 'blur' : 'change'
      }
    },
    slideToggle (show) {
      const parent = this.$refs['card']
      if (show) {
        parent.style.overflow = 'hidden'
        parent.style.height = (40 + parent.lastElementChild.offsetHeight) + 'px'
        if (this.timer) {
          clearTimeout(this.timer)
        }
        this.timer = setTimeout(() => {
          parent.style.overflow = 'auto'
          parent.style.height = 'auto'
        }, 500)
      } else {
        parent.style.overflow = 'hidden'
        parent.style.height = (40 + parent.lastElementChild.offsetHeight) + 'px'
        setTimeout(() => {
          parent.style.overflow = 'hidden'
          parent.style.height = '35px'
        }, 10)
      }
    }
  },
  mounted () {
  }
}
</script>

<style type="text/scss" lang="scss" scoped>
  .el-tabs {
    padding-left: 15px;
    margin-top: 20px;
    .el-tab-pane {
      .card {
        border-bottom: none;
      }
    }
  }
</style>
