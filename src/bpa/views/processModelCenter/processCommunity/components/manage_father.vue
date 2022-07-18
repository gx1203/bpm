<template>
  <div class="w100">
    <div v-for="(item,index) in datas" :key="index">
      <div class="letter" :class="{'font-red ': item.id == id,'section': item.type === 'section'}">
        <el-checkbox
          v-model="item.checked"
          v-show="item.showCheckbox"
          v-if="item.type !== 'section'"
          @change="handleCheckedChange(item)"
         />
         <p class="tageContent" :title="item.tagecontent" v-show="item.tagecontent" :id="item.id" :ref="item.id">{{item.tagecontent}}</p>
        <span v-html="item.content.replace(searchWords2, `<span class='font-blue'>${searchWords}</span>`)" class="ceshi"></span>
      </div>
      <manage-child :datas="item.childrens" :id="id" @change="change" v-if="!!item.childrens && item.childrens.length > 0" />
    </div>
  </div>
</template>
<script>
import $ from 'jquery'
export default {
  name: 'manageFather',
  data () {
    return {
      content: []
    }
  },
  beforeCreate: function () {
    this.$options.components.manageChild = require('./manage_child.vue').default
  },
  props: {
    datas: {
      type: Array,
      default: () => []
    },
    id: {
      type: String,
      default: ''
    }
  },
  computed: {
    host () {
      return process.env.VUE_APP_HOST_URL + process.env.VUE_APP_BASE_URL
    },
    base_url () {
      return process.env.BASE_URL
    },
    action() {
      return `${this.host}/mangercenterdoc/uploadCopy?username=${this.userid}`
    },
    userid () {
      return JSON.parse(localStorage.getItem('portalCurrentUserInfo') || '{}').empuid
    },
    searchWords() {
      return this.$route.params.searchWords
    },
    searchWords2() {
      return new RegExp('' + this.searchWords, 'g')
    }
  },
  watch: {
    datas: {
      handler: function(val) {
        console.log(val)
        this.content = val
      },
      deep: true
    }
  },
  mounted() {
    console.log(this.datas)
    console.log(this.id)
    if (this.searchWords !== '空') {
      this.changeCss()
    }
  },
  methods: {
    handleCheckedChange (item) {
      this.$emit('change', Object.assign({}, item))
    },
    change (data) {
      this.$emit('change', Object.assign({}, data))
    },
    changeCss() {
      console.log($('.font-blue'))
      $('.font-blue').css('background-color', 'blue')
    }
  }
}
</script>

<style lang="scss" scoped>
.letter {
  word-break: break-all;
  line-height: 24px;
  text-indent: 2.3em;
  font-size: 14px;
  position: relative;
  .el-checkbox {
    width: 14px;
    position: absolute;
    left: 0;
    top: 0;
    text-indent: initial;
  }
  // &.ellipsis::after {
  //   content: "...";
  //   position: absolute;
  //   bottom: 0;
  //   right: 0;
  //   padding-left: 40px;
  //   background: -webkit-linear-gradient(left, transparent, #fff 55%);
  //   background: -o-linear-gradient(right, transparent, #fff 55%);
  //   background: -moz-linear-gradient(right, transparent, #fff 55%);
  //   background: linear-gradient(to right, transparent, #fff 55%);
  // }
}
.font-red {
    color: red !important;
}
/deep/ .font-blue {
    // color: orangered !important;
    background-color: orangered!important;
}
.section {
  font-weight: bold;
  font-size: 16px;
  line-height: 30px;
  text-indent: inherit;
}
/deep/ .el-checkbox__inner {
  background-color: orange;
}
</style>
