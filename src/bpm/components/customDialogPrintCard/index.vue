<!-- 弹出框页面内容 -->
<template>
  <div>
    <el-dialog
      :title="pageTitle"
      :visible.sync="isVisible"
      append-to-body
      width="50%"
      :before-close="onClose"
    >
      <div class="myPrint">
        <!-- 出入证 -->
        <PrintCardCMZ
          v-if="showCard == 1"
          id="printArea"
          :childNodes="childNodes"
          :childNodeName="childProcessNodeName"
        ></PrintCardCMZ>
        <!-- 外借物资出入证 -->
        <printCardWJWZCMZ
          v-if="showCard == 2"
          id="printArea"
          :childNodes="childNodes"
          :childNodeName="childProcessNodeName"
        ></printCardWJWZCMZ>
        <!-- 打印按钮 -->
        <el-button class="myBtn" v-print="print" type="primary">打印</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import PrintCardCMZ from './printCardCMZ'
import printCardWJWZCMZ from './printCardWJWZCMZ'
export default {
  name: 'customDialogPrintCard',
  components: {
    PrintCardCMZ,
    printCardWJWZCMZ,
  },
  data() {
    return {
      pageTitle: '证件打印预览',
      isVisible: false,
      //展示哪个证件信息。1：出入证；2：外借物料出入证
      showCard: null,
      print: {
        id: 'printArea',
        popTitle: '出入证打印', // 打印配置页上方标题
        extraHead:
          '<meta http-equiv="Content-Language" content="zh-cn"/>,<style>  #printArea {  width: 100% !important; .th1 {width: 7% !important;} .th2 {width: 23% !important;} } <style>', //最上方的头部文字，附加在head标签上的额外标签,使用逗号分隔
        preview: false, // 是否启动预览模式，默认是false（开启预览模式，可以先预览后打印）
        previewTitle: '', // 打印预览的标题（开启预览模式后出现）,
        previewPrintBtnLabel: '', // 打印预览的标题的下方按钮文本，点击可进入打印（开启预览模式后出现）
        zIndex: '', // 预览的窗口的z-index，默认是 20002（此值要高一些，这涉及到预览模式是否显示在最上面）
        previewBeforeOpenCallback() {}, //预览窗口打开之前的callback（开启预览模式调用）
        previewOpenCallback() {}, // 预览窗口打开之后的callback（开启预览模式调用）
        beforeOpenCallback() {}, // 开启打印前的回调事件
        openCallback() {}, // 调用打印之后的回调事件
        closeCallback() {}, //关闭打印的回调事件（无法确定点击的是确认还是取消）
        url: '',
        standard: '',
        extraCss: '',
      },
      // 自组件参数
      childNodes: [],
      childProcessNodeName: null,
    }
  },
  props: {
    value: {
      type: Boolean,
      default: true,
    },
    routers: {
      type: Object,
      default() {
        return {}
      },
    },
    nodes: {
      type: Object,
      default() {
        return {}
      },
    },
  },
  watch: {
    value(newVal) {
      this.isVisible = newVal
    },
    nodes(newVal) {
      var thisData = JSON.parse(JSON.stringify(newVal.nodeTabLists[0].nodeTableLists));
      this.childNodes = thisData;
      // this.childProcessNodeName = newVal.processNodeName;

      // console.log(JSON.stringify(newVal.nodeTabLists[0].nodeTableLists));
      // console.log(this.childNodes);
      // console.log(this.childProcessNodeName);
    },
    routers(newVal) {
      var name = newVal.name;
      if (name == '3.2出门证') {
        this.showCard = 1
      } else if (name == '外借物资出门证') {
        this.showCard = 2
      } else {
        this.showCard = null
      }
    },
  },
  mounted() {
    console.log('证件打印初始化....')
  },
  methods: {
    getKey() {
      return new Date().getTime().toString()
    },
    onClose() {
      this.showCard = null
      this.childNodes = []
      this.childProcessNodeName = null
      this.$emit('close')
    },
  },
}
</script>
<style lang='scss' scoped>
  .myBtn{
    width: 20%;
    margin: 20px 40%;
  }
</style>

<style media="print">
@page {
  size: auto;
  margin: 1mm;
}
@media print {
  html {
    background-color: #ffffff;
    height: auto;
    margin: 0px;
    zoom: 80%;
  }
  body {
    border: solid 1px #ffffff;
    /* margin: 10mm 15mm 10mm 15mm; */
  }
  #printArea table {
    table-layout: auto !important;
    width: 100% !important;
    border: solid 1px #f2f2f2;
    table-layout: fixed !important;
  }
}
</style>
