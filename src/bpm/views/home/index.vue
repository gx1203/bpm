<template>
  <div id="onlineEdit">
    <codemirror v-model="code" :options="cmOptions"></codemirror>
    <div class="card" style="width: 100%">
      <el-form style="flex-grow: 1;" ref="form" label-width="80px">
        <div class="head">
          <div class="title">
            <div class="logo">
              <img :src="logo" alt="" srcset="" />
            </div>
            <div class="title-text">
              参观接待申请流程单
            </div>
          </div>
          <el-row style="margin-top: 20px;">
            <el-form-item label="标题">
              <el-input
                clearable
                type="number"
                placeholder="请输入内容"
                v-model="titleContent"
              ></el-input>
            </el-form-item>
          </el-row>
        </div>
        <div class="main" style="margin-top: 20px">
          <draggable :list="data" class="list-group" ghost-class="ghost">
            <el-row :key="index" v-for="(item, index) in data">
              <el-form-item v-if="item.type === 'input'" :label="item.label">
                <el-input
                  clearable
                  v-model="item.value"
                  placeholder="请输入内容"
                ></el-input>
              </el-form-item>
              <el-form-item v-if="item.type === 'select'" :label="item.label">
                <el-select
                  clearable
                  v-model="item.value"
                  :placeholder="$t('placeholderText.pleaseSelect')"
                >
                  <el-option
                    v-for="option in item.options"
                    :key="option.value"
                    :label="option.label"
                    :value="option.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <!--<el-form-item v-if="item.type === 'dynamic'" :label="item.label">-->
              <dynamic-componets
                v-if="item.type === 'dynamic'"
                :ref="'dynamic' + index"
                :data="data"
                :code="item.code"
              ></dynamic-componets>
              <!--</el-form-item>-->
            </el-row>
          </draggable>
        </div>
      </el-form>
      <dynamic-componets
        :data="data"
        :code="code"
        class="dynamicComponets"
      ></dynamic-componets>
      <el-button
        @click="handleSave"
        style="position: fixed;top: 10px;right: 20px;"
        >{{ $t('save') }}</el-button
      >
    </div>
    <!--<div class="buttons">-->
    <!--<div @click="handleSubmit">提交</div>-->
    <!--<div @click="handleClose">关闭</div>-->
    <!--<div>保存</div>-->
    <!--<div>打印</div>-->
    <!--</div>-->
  </div>
</template>

<script>
const code =
  localStorage.getItem('jiucaiyun_code') ||
  `<template>
  <el-form class="test" label-width="80px">
    <el-form-item label="自定义：">
      <el-radio-group v-model="radio">
        <el-radio :key="index" v-for="(item, index) in list" :label="item.value">
          {{ item.label }}
    		</el-radio>
    	</el-radio-group>
      <ul>
        <li v-for="item in list">{{item}}</li>
  		</ul>
    </el-form-item>
  </el-form>
</template>
<script>
  export default {
    data () {
      return {
        radio: '2',
        list: [{
          value: '1',
          label: '黄金糕'
        }, {
          value: '2',
          label: '双皮奶'
        }, {
          value: '3',
          label: '蚵仔煎'
        }, {
          value: '4',
          label: '龙须面'
        }, {
          value: '5',
          label: '北京烤鸭'
        }]
      }
    },
    methods: {
      handleSubmit() {
        alert('验证未通过');
        console.log(this.data);
        return [false, { radio: this.radio  } ]
      },
      handleClose() {
        alert('您没有权限关闭');
        return false
      }
    },
  }
<\/script>
<style>
  .test {
    background: #fff
  }
</style>`
import draggable from 'vuedraggable'

import DynamicComponets from '@/bpm/components/DynamicComponents'
// require component
import { codemirror } from 'vue-codemirror'
// require styles
import 'codemirror/lib/codemirror.css'

import 'codemirror/theme/mbo.css'
// language
import 'codemirror/mode/vue/vue.js'

import data from './data'

import logo from '@/bpm/assets/img/common/logo-blue.png'

export default {
  components: {
    codemirror,
    DynamicComponets,
    draggable
  },
  data() {
    return {
      titleContent: '',
      logo,
      code,
      cmOptions: {
        tabSize: 2,
        styleActiveLine: true,
        lineNumbers: true,
        line: true,
        mode: 'text/x-vue',
        theme: 'mbo',
        smartIndent: true,
        // lineWrapping: true,
        extraKeys: {
          'Ctrl-Q': function(cm) {
            cm.foldCode(cm.getCursor())
          }
        },
        foldGutter: true,
        gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter']
      },
      data
    }
  },

  watch: {
    titleContent: {
      handler(val) {}
    }
  },

  methods: {
    handleSave() {
      localStorage.setItem('jiucaiyun_code', this.code)
      this.data.push({
        label: '自定义：',
        type: 'dynamic',
        code: this.code
      })
    },

    callback(methodNam, cb) {
      // 自定义钩子函数
      const keys = Object.keys(this.$refs).filter(
        item => item.indexOf('dynamic') !== -1
      )
      if (keys.length === 0) {
        cb && cb()
        return
      }
      keys.forEach(item => {
        const [success, data] = this.$refs[item][0].component[methodNam]()
        success && cb && cb(data)
      })
    },

    handleSubmit() {
      this.callback('handleSubmit', data => {
        // request('post', data)
        alert(this.$t('hintText.saveSuccessfully'))
      })
    },

    handleClose() {
      this.callback('handleClose', () => {
        alert('关闭成功')
      })
    }
  }
}
</script>

<style type="text/scss" lang="scss" scoped>
#onlineEdit {
  display: flex;
  height: 100%;
  .vue-codemirror {
    flex: none;
    width: 600px;
    /deep/ .CodeMirror {
      height: 100%;
      font-family: 'Courier NEW', 'Consolas', serif;
    }
  }
}
.dynamicComponets {
}
.head {
  width: 100%;
  /*background: linear-gradient(0deg, #E2EDF9, #73A9DF);*/
  font-weight: bold;
  height: 110px;
  padding: 10px 100px;
  box-sizing: border-box;

  .title {
    display: flex;
    align-items: center;

    .logo {
      img {
        width: 260px;
      }
    }

    .title-text {
      height: 36px;
      line-height: 36px;
      font-size: 22px;
      text-align: center;
      flex-grow: 1;
    }
  }
}

.card {
  background-color: #fff;
}

.buttons {
  position: fixed;
  text-align: center;
  top: 40%;
  right: 50px;
  margin-left: 465px;
  padding: 5px;
  width: 34px;
  background: #4c92d6;
  z-index: 999;
  color: #fff;
}
</style>
