<!-- 自定义弹出框页面内容 -->
<template>
  <div v-if="showDataForm != null">
    <el-dialog
      :title="pageTitle"
      :visible.sync="isVisible"
      append-to-body
      width="70%"
      :before-close="onClose"
    >
      <div v-if="showDataForm.data.length > 0">
        <!-- 数据只有一组 -->
        <div v-if="showDataForm.data.length == 1">
          <div
            class="areaClass"
            v-for="(areaItem, areaIndex) in showDataForm.data[0].area"
            :key="'area' + areaIndex"
          >
            <el-divider v-if="areaIndex > 0"></el-divider>
            <div style="font-weight: bold" v-if="areaItem.areaTitle != ''">
              <h2 style="color: #409eff">{{ areaItem.areaTitle }}</h2>
            </div>

            <!-- 表单区域 -->
            <div v-if="areaItem.areaType == 'form'">
              <myForm :areaData="areaItem"></myForm>
            </div>

            <!-- 表格区域 -->
            <div v-else-if="areaItem.areaType == 'table'">
              <myTable :areaData="areaItem"></myTable>
            </div>
          </div>
        </div>

        <!-- 数据存在多组 -->
        <el-tabs v-else v-model="activeName" @tab-click="handleClick">
          <el-tab-pane
            v-for="(item, index) in showDataForm.data"
            :key="'tabPane' + index"
            :label="item.tabsTitle"
            :name="'tab' + index"
          >
            <div
              class="areaClass"
              v-for="(areaItem, areaIndex) in item.area"
              :key="'area' + areaIndex"
            >
              <el-divider v-if="areaIndex > 0"></el-divider>
              <div style="font-weight: bold" v-if="areaItem.areaTitle != ''">
                <h2 style="color: #409eff">{{ areaItem.areaTitle }}</h2>
              </div>

              <!-- 表单区域 -->
              <div v-if="areaItem.areaType == 'form'">
                <myForm :areaData="areaItem"></myForm>
              </div>

              <!-- 表格区域 -->
              <div v-else-if="areaItem.areaType == 'table'">
                <myTable :areaData="areaItem"></myTable>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import myForm from './myForm'
import myTable from './myTable'
// import dataForm from './dataForm'
import handleData from './handleData'

export default {
  name: 'customDialogForm',
  components: {
    myForm,
    myTable,
  },
  data() {
    return {
      pageTitle: '',
      activeName: 'tab0',
      isVisible: false,
      showDataForm: null,
      //当前选择项的索引
      dialogIndex: 0,
      //页面名称
      dialogTabName: '',
      // 原始数据（全部）
      nodeTabLists: null,
      // 原始数据 （当前索引值）
      dialogNodeTableLists: null,
    }
  },
  props: {
    value: {
      type: Boolean,
      default: true,
    },
    itemColumn: {
      type: Object,
      default() {
        return {}
      },
    },
    parent: {
      type: Object,
    },
  },
  watch: {
    value(newVal) {
      this.isVisible = newVal
    },
    itemColumn() {
      this.getItemColumn()
    },
  },
  mounted() {},
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
      this.pageTitle = this.showDataForm.pageTitle + '_' + tab.label;
    },
    getItemColumn() {
      this.pageTitle = '';
      this.activeName = 'tab0';
      this.showDataForm = null;
      this.nodeTabLists = this.$store.state.app.nodeData.nodeTabLists;
      this.dialogIndex = this.itemColumn.index;
      this.dialogTabName = this.itemColumn.column.fieldShowName;

      this.nodeTabLists.forEach((element, elementIndex) => {
        if (element.tabname == this.dialogTabName) {
          this.showDataForm = handleData(
            this.dialogTabName,
            element,
            this.dialogIndex
          )

          if (this.showDataForm.data.length == 0) {
            this.onClose()
            this.$message.error('未获取到相关数据')
          }

          // 设置初始化dialog标题
          if (this.showDataForm.data.length > 1) {
            this.pageTitle =
              this.showDataForm.pageTitle +
              '_' +
              this.showDataForm.data[0].tabsTitle;
          } else {
            this.pageTitle = this.showDataForm.pageTitle;
          }

          console.log(JSON.stringify(this.showDataForm))
        }
      })
    },
    onClose() {
      this.$emit('close')
    },
  },
}
</script>
<style lang='scss' scoped>
</style>