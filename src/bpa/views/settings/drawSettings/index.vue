<template>
  <div id="drawSettings" style="position:relative;">
    <el-tabs v-model="editableTabsValue" type="card">
      <el-tab-pane
        label="图例风格"
        name="0" style="padding-top: 10px">
        <change-design/>
      </el-tab-pane>
      <!-- <el-tab-pane
        label="图例设置"
        name="1"
        class="legend-settings">
        <legend-setting :change-style="selectedStyleValue"/>
      </el-tab-pane> -->
    </el-tabs>
    <div style="position:absolute;top:10px;right:30px" v-show="editableTabsValue==='1'">
      <el-select
        v-model="selectedStyleValue"
        placeholder="请选择">
<!--        @change="(val)=>{this.selectedStyleValue=val}">-->
        <el-option
          label="黑白"
          value="0">
        </el-option>
        <el-option
          label="彩色"
          value="1">
        </el-option>
      </el-select>
    </div>
  </div>
</template>

<script>
import changeDesign from '../changeDesgin'
// import legendSetting from '../legendSettings'

export default {
  name: "drawSettings",
  components: {
    changeDesign
    // legendSetting
  },
  data() {
    return {
      editableTabsValue: '0',
      selectedStyleValue: '0',
    }
  }
}
</script>

// <style lang="scss" scoped>
#drawSettings{
  height: 100%;
  padding: 10px 30px 10px 10px;
  box-sizing: border-box;
  overflow-x: hidden;
  .legend-settings {
    padding-top: 10px;
    width: 100%;
    height: calc(100vh - 170px);
    overflow-y: scroll;
  }
}
</style>
