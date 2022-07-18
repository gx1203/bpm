<template>
  <div class="w100 manage_child">
    <div v-for="(item,index) in datas" :key="index">
      <div class="letter" :class="{'font-red ': item.id == id,'section ': item.type === 'section'}" :id="item.id" :ref="item.id">
        <div class="label" :id="item.tag_id">
          <el-tag type="" :title="item.tag_content" class="tagContent" :id="item.tag_id" v-if="item.tag_content == null ? false : true">{{item.tag_content}}</el-tag>
        </div>
        <el-checkbox
          v-model="item.checked"
          v-show="item.showCheckbox"
          v-if="item.type !== 'section'"
          @change="handleCheckedChange(item)"
        />
        <p
          class="tageContent"
          :title="item.tagecontent"
          v-show="item.tagecontent"
        >{{item.tagecontent}}</p>
        <span v-html="item.content.replace(searchWords2, `<span class='font-orange'>${searchWords}</span>`)"></span>
        <div class="annotation" :id="item.tag_id" v-if="item.ann_description == null? false : true">
          <el-tag type="warning" :title="item.ann_id" class="tagContent" effect="dark">{{item.ann_description}}</el-tag>
        </div>
      </div>
      <manage-father
        :datas="item.childrens"
        :id="ids"
        @change="change"
        v-if="!!item.childrens && item.childrens.length > 0"
      />
    </div>
  </div>
</template>
<script>
import $ from 'jquery'
export default {
  name: 'manageChild',
  data() {
    return {
      ids: '',
      childIds: '',
      childBoolean: false
    }
  },
  beforeCreate: function() {
    this.$options.components.manageFather = require('./manage_father.vue').default
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
  watch: {
    datas: {
      handler: function(val) {
        console.log(val)
      },
      deep: true
    }
  },
  computed: {
    host() {
      return process.env.VUE_APP_HOST_URL + process.env.VUE_APP_BASE_URL
    },
    base_url() {
      return process.env.BASE_URL
    },
    action() {
      return `${this.host}/mangercenterdoc/uploadCopy?username=${this.userid}`
    },
    userid() {
      return JSON.parse(localStorage.getItem('portalCurrentUserInfo') || '{}')
        .empuid
    },
    searchWords() {
      return this.$route.params.searchWords
    },
    searchWords2() {
      return new RegExp('' + this.searchWords, 'g')
    }
  },
  // watch:{
  //   id() {

  //   }
  // },
  mounted() {
    console.log(this.id)
    console.log(this.searchWords)
    console.log(this.searchWords2)
    if (this.searchWords !== '空') {
      console.log('执行改变css样式')
      this.changeCss()
    }
  },
  methods: {
    handleCheckedChange(item) {
      this.$emit('change', Object.assign({}, item))
    },
    change(data) {
      this.$emit('change', Object.assign({}, data))
    },
    changeCss() {
      $('.font-orange').css('background-color', 'orange')
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
  .tageContent {
    width: 80px;
    height: 100%;
    position: absolute;
    left: -95px;
    top: 0;
    word-break: break-all;
    font-size: 14px;
    line-height: 20px;
    overflow: hidden;
    padding: 5px;
    box-sizing: border-box;
    text-indent: initial;
    border-bottom: 1px solid #929292;
    text-align: center;
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
}
.font-red {
    color: red !important;
}
/deep/ .font-orange {
    color: orangered !important;
}
.section {
  font-weight: bold;
  font-size: 16px;
  line-height: 30px;
  text-indent: inherit;
}
.manage_child {
  .letter {
    position: relative;
    .label {
      width: 168px;
      height: 72px;
      // background-color: aqua;
      position: absolute;
      top: 0px;
      left: -180px;
      .tagContent {
        width: 140px;
        height: 20px;
        line-height: 20px;
        display: inline-block;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        text-align: left;
        vertical-align: -webkit-baseline-middle;
      }
    }
    .annotation {
      width: 168px;
      height: 72px;
      position: absolute;
      top: 0px;
      right: -150px;
      .tagContent {
        width: 140px;
        height: 20px;
        line-height: 20px;
        display: inline-block;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        text-align: left;
        vertical-align: -webkit-baseline-middle;
      }
    }
  }
}
/deep/ .el-checkbox__inner {
  background-color: orange;
}
</style>
