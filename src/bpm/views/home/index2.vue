<template>
  <div style="display: flex; height: 100%">
    <codemirror v-model="code" :options="cmOptions"></codemirror>
    <div class="card" style="width: 100%">
      <el-form style="flex-grow: 1;" ref="form" label-width="80px">
        <div class="head">
          <div class="content">
            <div class="title">
              <div class="logo">
                <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOUAAAAfCAYAAAAYwAppAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDY3IDc5LjE1Nzc0NywgMjAxNS8wMy8zMC0yMzo0MDo0MiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6Q0VCNEUxRjZCMEUyMTFFODk2ODQ4RTBCNzgyRkQ3NjUiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6Q0VCNEUxRjVCMEUyMTFFODk2ODQ4RTBCNzgyRkQ3NjUiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NkJDNTREM0QxRDM0MTFFODlCQzFDMDM1MzhBRDc1QTEiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NkJDNTREM0UxRDM0MTFFODlCQzFDMDM1MzhBRDc1QTEiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4PWwtXAAAYCElEQVR42uxd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" alt="" srcset="">
              </div>
              <div class="title-text">
                参观接待申请流程单
              </div>
            </div>
            <div>
              <el-form-item style="margin-top: 20px" label="标题">
                <el-input clearable placeholder="请输入内容"></el-input>
              </el-form-item>
            </div>
          </div>
        </div>
        <div style="margin-top: 20px">
          <draggable
            :list="data"
            class="list-group"
            ghost-class="ghost"
          >
            <div :key="index" v-for="(item, index) in data">
              <el-form-item v-if="item.type === 'input'" :label="item.label">
                <el-input clearable v-model="item.value" placeholder="请输入内容"></el-input>
              </el-form-item>
              <el-form-item v-if="item.type === 'select'" :label="item.label">
                <el-select clearable v-model="item.value" :placeholder="$t('placeholderText.pleaseSelect')">
                  <el-option
                    v-for="option in item.options"
                    :key="option.value"
                    :label="option.label"
                    :value="option.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item v-if="item.type === 'dynamic'" :label="item.label">
                <dynamic-componets :ref="'dynamic' + index" :data="data" :code="item.code"></dynamic-componets>
              </el-form-item>
            </div>
          </draggable>
        </div>
      </el-form>
      <dynamic-componets :data="data" :code="code"></dynamic-componets>
      <el-button @click="handleSave" style="position: fixed;top: 10px;right: 20px;">{{ $t('save') }}</el-button>
    </div>
    <div class="buttons">
      <div @click="handleSubmit">提交</div>
      <div @click="handleClose">关闭</div>
      <div>保存</div>
      <div>打印</div>
    </div>
  </div>
</template>

<script>
import draggable from 'vuedraggable'

import DynamicComponets from '@/bpm/components/DynamicComponents'
// require component
import { codemirror } from 'vue-codemirror'
// require styles
import 'codemirror/lib/codemirror.css'

import 'codemirror/theme/base16-dark.css'
// language
import 'codemirror/mode/vue/vue.js'

import data from './data'

export default {
  components: {
    codemirror,
    DynamicComponets,
    draggable
  },
  data () {
    const code = localStorage.getItem('jiucaiyun_code') ||
      `<template>
        <div class="test">
          <el-radio-group v-model="radio">
            <el-radio :key="index" v-for="(item, index) in data[1] ? data[1].options : []" :label="item.value">
              {{ item.label }}
            </el-radio>
          </el-radio-group>
        </div>
      </template>
      <script>
        export default {
          data () {
            return {
              radio: 2,
              data: {}
            }
          },
          methods: {
            handleSubmit() {
              alert('验证未通过')
              console.log(this.data)
              return [false, { radio: this.radio  } ]
            },
            handleClose() {
              alert('您没有权限关闭')
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
    return {
      code,
      cmOptions: {
        tabSize: 2,
        styleActiveLine: true,
        lineNumbers: true,
        line: true,
        mode: 'text/x-vue',
        theme: 'base16-dark'
      },
      data
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

    callback(methodNam, cb) { // 自定义钩子函数
      const keys = Object.keys(this.$refs).filter(item => item.indexOf('dynamic') !== -1)
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
      this.callback('handleSubmit', (data) => {
        // request('post', data)
        console.log(data)
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

<style lang="scss" scoped>
.head {
  width: 100%;
  background: linear-gradient(0deg, #E2EDF9, #73A9DF);
  font-weight: bold;
  height: 110px;
  padding: 10px 150px;
  box-sizing: border-box;

  .title {
    display: flex;

    .logo {
      img {
        width: 200px;
      }
    }

    .title-text {
      font-size: 25px;
      text-align: center;
      flex-grow: 1;
    }
  }
}

.card {
  background-color: #fff;
}

.vue-codemirror {
  flex: none;
  width: 600px;
}

.CodeMirror {
  height: 100%;
}

.buttons {
  position: fixed;
  text-align: center;
  top: 40%;
  right: 50px;
  margin-left: 465px;
  width: 40px;
  padding: 5px;
  width: 34px;
  background: #4c92d6;
  z-index: 999;
  color: #fff;
}
</style>
