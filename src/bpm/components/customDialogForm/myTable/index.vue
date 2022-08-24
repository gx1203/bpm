<!-- 自定义弹出框--表格部分 -->
<template>
  <div v-if="areaData != null">
    <el-table :data="areaData.Data" border style="width: 100%">
      <template v-for="(item, index) in areaData.Column">
        <el-table-column
          :key="'tableColumn' + index"
          :prop="item.prop"
          :label="item.label"
          sortable
          v-if="item.isShow"
        >
          <template slot-scope="scope">
            <div v-if="item.peg == 'json'">
              <el-link
                v-for="(imgItem, imgIndex) in beJsonImg(
                  areaData.Data[scope.$index][item.prop]
                )"
                :underline="false"
                :key="'img' + imgIndex"
                :href="imgItem.DOWNURL"
                type="primary"
                target="_blank"
                >{{ imgItem.FILENAME }}</el-link
              >
            </div>
            <div v-else>
              <el-date-picker
                v-if="item.type == 'date'"
                v-model="areaData.Data[scope.$index][item.prop]"
                type="date"
                size="mini"
                disabled
              >
              </el-date-picker>
              <span v-else>{{ areaData.Data[scope.$index][item.prop] }}</span>
            </div>
          </template>
        </el-table-column>
      </template>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'myTable',
  props: {
    areaData: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      align: 'center',
    }
  },
  methods: {
    console(itemData, item) {
      console.log(JSON.stringify(itemData))
      console.log(JSON.stringify(item))
    },
    beJsonImg(imgJson) {
      var thisJson = imgJson;
      // thisJson = imgJson.replace(/&quot;/g, '"');
      // thisJson = JSON.parse(thisJson);
      return thisJson;
    },
  },
}
</script>
<style lang='scss' scoped>
.el-link {
  display: grid !important;

  .el-link--inner {
    font-size: 16px !important;
  }
}
</style>