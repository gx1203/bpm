<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" v-if="dialogVisible" append-to-body width="70%"
    :close-on-click-modal="false">
    <quill-editor v-model="msg" ref="myQuillEditor" :options="editorOption" @blur="onEditorBlur($event)"
      @focus="onEditorFocus($event)" @change="onEditorChange($event)"></quill-editor>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel">{{ $t('cancelAction') }}</el-button>
      <el-button type="primary" @click="submit">{{ $t('confirm') }}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { quillEditor } from "vue-quill-editor"; // 调用编辑器
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
export default {
  components: {
    quillEditor
  },
  data () {
    return {
      dialogVisible: false,
      editorOption: {
        placeholder: this.$t('placeholderText.pleaseEditRichTextHere'),
        modules: {
          toolbar: {
            container: [
              ["bold", "italic", "underline", "strike"], // 加粗，斜体，下划线，删除线
              ["blockquote", "code-block"], // 引用，代码块
              [{ header: 1 }, { header: 2 }], // 标题，键值对的形式；1、2表示字体大小
              [{ indent: "-1" }, { indent: "+1" }], // 缩进
              [{ direction: "rtl" }], // 文本方向
              [{ size: ["small", false, "large", "huge"] }], // 字体大小
              [{ header: [1, 2, 3, 4, 5, 6, false] }], // 几级标题
              [{ color: [] }, { background: [] }], // 字体颜色，字体背景颜色
              [{ font: [] }], // 字体
              [{ align: [] }], // 对齐方式
              ["image"] // 上传图片
            ]
          }
        }
      },
      msg: ''
    }
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    content: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    }
  },
  watch: {
    value (val) {
      this.dialogVisible = val;
      if (val) {
        this.msg = this.content
      }
    },
    dialogVisible (val) {
      this.$emit("input", val);
    }
  },
  methods: {
    onEditorBlur () { }, // 失去焦点事件
    onEditorFocus () { }, // 获得焦点事件
    onEditorChange (event) {
      // console.log(event)
      // console.log(this.content)
      // this.$emit('confirm', this.content)
      // event.quill.deleteText(800, 4)
    },
    submit () {
      console.log(this.msg)
      this.$emit('confirm', this.msg)
      this.dialogVisible = false;
    },
    cancel () {
      this.dialogVisible = false;
    }
  },
  mounted () {
  }
};
</script>

<style scoped>
</style>
