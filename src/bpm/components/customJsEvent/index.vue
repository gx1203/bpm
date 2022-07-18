<template>
  <el-dialog title="自定义js示例" :visible.sync="dialogVisible" width="600px" top="10vh"
    :close-on-click-modal="false" :close-on-press-escape="false" append-to-body>
    <el-tabs v-model="activeName">
      <el-tab-pane label="change" name="first">
        <p class="margin-b10">js事件方法名（改变当前元素的值时触发）：nameChange</p>
        <el-row>
          <el-col :span="12">
            <el-select v-model="formData.change" @change="nameChange" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="12">
            <div>
              <p>function nameChange () {</p>
              <p style="text-indent: 1rem;">alert("这里可以调一个接口/赋值给其他字段。 我是{{formData.change}}")</p>
              <p>}</p>
            </div>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="blur" name="second">
        <p class="margin-b10">js事件方法名（当前元素失去焦点时触发）：nameBlur</p>
        <el-row>
          <el-col :span="12">
            <el-input
              placeholder="请输入内容"
              v-model="formData.blur"
              @blur="nameBlur"
              style="width: 193px;">
            </el-input>
          </el-col>
          <el-col :span="12">
            <div>
              <p>function nameBlur () {</p>
              <p style="text-indent: 1rem;">alert("这里可以调一个接口/赋值给其他字段。 我是{{formData.blur}}")</p>
              <p>}</p>
            </div>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="focus" name="third">
        <p class="margin-b10">js事件方法名（当前元素获取焦点时触发）：nameFocus</p>
        <el-row>
          <el-col :span="12">
            <el-input
              placeholder="请输入内容"
              v-model="formData.focus"
              @focus="nameFocus"
              style="width: 193px;">
            </el-input>
          </el-col>
          <el-col :span="12">
            <div>
              <p>function nameFocus () {</p>
              <p style="text-indent: 1rem;">alert("这里可以调一个接口/赋值给其他字段。 我是{{formData.focus}}")</p>
              <p>}</p>
            </div>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="click" name="fourth">
        <p class="margin-b10">js事件方法名（点击当前元素时触发）：nameClick</p>
        <el-row>
          <el-col :span="12">
            <el-button type="primary" @click="nameClick">按钮</el-button>
          </el-col>
          <el-col :span="12">
            <div>
              <p>function nameClick () {</p>
              <p style="text-indent: 1rem;">alert("这里可以调一个接口/赋值给其他字段。 我是一个按钮")</p>
              <p>}</p>
            </div>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="input" name="fiveth">
        <p class="margin-b10">js事件方法名（用户在当前元素内输入值时触发）：nameInput</p>
        <el-row>
          <el-col :span="12">
            <el-input
              placeholder="请输入内容"
              v-model="formData.input"
              @input="nameInput"
              style="width: 193px;">
            </el-input>
          </el-col>
          <el-col :span="12">
            <div>
              <p>function nameInput () {</p>
              <p style="text-indent: 1rem;">
                this.$message.success(`这里可以调一个接口/赋值给其他字段。 我是{{formData.input}}`)
              <p>}</p>
            </div>
          </el-col>
        </el-row>
      </el-tab-pane>
    </el-tabs>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel">{{ $t('cancelAction') }}</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { getTableData } from '@/bpm/api/process/processModeling/classificationModel'
import { getInfosByLink } from "@/bpm/api/flow";
export default {
  components: {
  },
  data () {
    return {
      dialogVisible: this.value,
      activeName: 'first',
      formData: {},
      options: [{
        value: '选项1',
        label: '黄金糕'
      }, {
        value: '选项2',
        label: '双皮奶'
      }, {
        value: '选项3',
        label: '蚵仔煎'
      }, {
        value: '选项4',
        label: '龙须面'
      }, {
        value: '选项5',
        label: '北京烤鸭'
      }],
      html123: `
        remoteMethod(query) {
          if (query !== '') {
          this.loading = true;
          setTimeout(() => {
          this.loading = false;
          this.options = this.list.filter(item => {
          return item.label.toLowerCase()
          .indexOf(query.toLowerCase()) > -1;
          });
          }, 200);
          } else {
          this.options = [];
          }
        }
      `
    }
  },
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    value (val) {
      this.dialogVisible = val
    },
    dialogVisible (val) {
      this.$emit('input', val)
    }
  },
  methods: {
    nameChange () {
      alert(`这里可以调一个接口/赋值给其他字段。 我是${this.formData.change}`)
    },
    nameBlur () {
      alert(`这里可以调一个接口/赋值给其他字段。 我是${this.formData.blur}`)
    },
    nameFocus() {
      alert(`这里可以调一个接口/赋值给其他字段。 我是${this.formData.focus}`)
    },
    nameClick() {
      alert(`这里可以调一个接口/赋值给其他字段。 我是一个按钮`)
    },
    nameInput() {
      this.$message.success(`这里可以调一个接口/赋值给其他字段。 我是${this.formData.input}`)
    },
    cancel () {
      this.dialogVisible = false
    }
  }
}
</script>

<style scoped>
</style>
