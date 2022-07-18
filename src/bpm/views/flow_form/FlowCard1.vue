<template>
  <div class="card" ref="card">
    <div v-if="data.tabname" class="header">
      <span class="title">
        {{data.tabname}}
      </span>
      <el-button v-if="!isPrint" type="text" class="collapse-btn" @click="expand = !expand">{{expand ? $t('putAway') : $t('unfold')}}</el-button>
    </div>
      <div class="form">
      <div
        :span="item.inputtype === 'subtable' || item.inputtype === 'ckeditor' ? 24 : 8"
        :style="'width:' + (item.inputtype === 'subtable' || item.inputtype === 'ckeditor' ? '100%' : '33.3%')"
        v-for="(item, index) in data.nodeTableLists"
        :key="index"
        class="form-item">
        <div v-if="item.inputtype !== 'subtable'" class="form-item-head">
          <span v-if="item.required === 'Y' && item.editstate === 'W'" style="color: red">*</span>
          <span>{{item.fieldShowName}}</span>
        </div>
        <sub-table v-if="item.inputtype === 'subtable'" :item="item" :is-print="isPrint"/>
        <div v-else class="form-item-value">
          <flow-item :item="item" :is-print="isPrint" @externalFun ="externalFun"/>
        </div>
      </div>
    </div>

    <div v-for="(item, index) in data.nodeTabLists" :key="index">
      <flow-card :data="item"/>
    </div>
 
  </div>
</template>

<script>
import SubTable from './SubTable'
import FlowItem from './FlowItem'

export default {
  name: 'FlowCard1',
  components: {
    SubTable,
    FlowItem
  },
  data () {
    return {
      expand: true,
      timer: null
    }
  },
  props: {
    data: {
      type: Object,
      default: () => ({})
    },
    isPrint: {
      type: Boolean
    }
  },
  watch: {
    data: {
      handler (val) {
        val.nodeTableLists.sort((a, b) => a.sort - b.sort)
      },
      immediate: true
    },
    expand (val) {
      this.slideToggle(val)
    }
  },
  methods: {
    externalFun (type) {
      window[type](this, this.data.nodeTableLists).then(rt => {
        // this.item = rt;
      })
    },
    getRules (item) {
      return {
        required: item.required !== 'Y',
        message: `${item.fieldShowName}不能为空`,
        trigger: item.inputtype === 'text' || item.inputtype === 'textarea' ? 'blur' : 'change'
      }
    },
    slideToggle (show) {
      const parent = this.$refs['card']
      console.log(parent.lastElementChild.getBoundingClientRect())
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
  }
}
</script>

<style lang="scss" scoped>
  .card {
    padding: 0 0 5px 15px;
    background: white;
    border-bottom: 1px solid $dc1;
    transition-duration: 0.5s;
    box-sizing: border-box;
    .header {
      margin-right: 15px;
      display: flex;
      .title {
        height: 35px;
        line-height: 35px;
        color: $tc1;
        font-weight: bold;
      }
      .collapse-btn {
        flex-grow: 1;
        text-align: right;
      }
    }
    .form {
      display: flex;
      flex-wrap: wrap;
      width: 100%;
      .form-item {
        margin-bottom: 15px;
        .form-item-head {
          min-width: 145px;
          padding-right: 15px;
          display: table-cell;
          vertical-align: middle;
          text-align: right;

          span {
            line-height: 28px;
          }
        }
        .form-item-value {
          width: 100%;
          display: table-cell;
          vertical-align: middle;
          padding-right: 15px;
        }
      }
    }
  }
</style>
