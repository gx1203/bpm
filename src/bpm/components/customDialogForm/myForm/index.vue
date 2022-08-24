<!-- 自定义表单弹出框--表单部分 -->
<template>
  <div v-if="areaData != null">
    <el-form :label-width="labelWidth">
      <div
        v-for="(formItemItem, formItemIndex) in areaData.Column"
        :key="'formItem' + formItemIndex"
      >
        <el-form-item
          class="el-col"
          :class="
            'el-col-' +
            setGridOccupancy(formItemItem.type, formItemItem.gridOccupancy)
          "
          v-if="formItemItem.isShow"
          :label="formItemItem.label"
        >
          <!-- text -->
          <el-input
            v-if="formItemItem.type == 'text'"
            v-model="formItemItem.value"
            :disabled="isDisabled"
          >
            <template v-if="formItemItem.unit != ''" slot="append">{{
              formItemItem.unit
            }}</template>
          </el-input>

          <!-- textarea -->
          <div v-else-if="formItemItem.type == 'textarea'">
            <div v-if="formItemItem.peg == 'json'">
              <el-link
                v-for="(imgItem, imgIndex) in beJsonImg(formItemItem.value)"
                :underline="false"
                :key="'img' + imgIndex"
                :href="imgItem.DOWNURL"
                type="primary"
                target="_blank"
                >{{ imgItem.FILENAME }}</el-link
              >
            </div>
            <el-input
              v-else
              type="textarea"
              :disabled="isDisabled"
              v-model="formItemItem.value"
              :autosize="{ minRows: 4, maxRows: 8}"
            ></el-input>
          </div>

          <!-- date -->
          <el-date-picker
            v-else-if="formItemItem.type == 'date'"
            v-model="formItemItem.value"
            type="date"
            :disabled="isDisabled"
          >
          </el-date-picker>

          <!-- link -->
          <el-link
            v-else-if="formItemItem.type == 'link'"
            :href="formItemItem.value"
            target="_blank"
            :underline="false"
            type="primary"
            >{{ formItemItem.value }}</el-link
          >

          <!-- image -->
          <el-row :gutter="10" v-else-if="formItemItem.type == 'image'">
            <el-col
              :span="6"
              v-for="(imgItem, imgIndex) in formItemItem.value"
              :key="'img' + imgIndex"
            >
              <el-image
                :src="imgItem"
                :preview-src-list="formItemItem.value"
              ></el-image>
            </el-col>
          </el-row>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'myFrom',
  props: {
    areaData: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      elRowGutter: 24,
      elColSpan: 6,
      labelWidth: '180px',
      isDisabled: true,
      key: 'table1',
    }
  },
  mounted() {},
  methods: {
    //为防止显示页面混乱，固定显示比例 为一行1,2,3,4列 （24栅格制）
    //若 type == 'textarea' 则默认独占一列
    setGridOccupancy(type, gridOccupancy) {
      var returnGridOccupancy = 24
      if (type == 'textarea' || type == 'image') {
        returnGridOccupancy = 24
      } else {
        // if (gridOccupancy <= 6) {
        //   //4列
        //   returnGridOccupancy = 6;
        // } else if (gridOccupancy > 6 && gridOccupancy <= 8) {
        //   //3列
        //   returnGridOccupancy = 8;
        // } else if (gridOccupancy > 8 && gridOccupancy <= 12) {
        //   //2列
        //   returnGridOccupancy = 12;
        // } else {
        //   //1列
        //   returnGridOccupancy = 24;
        // }

        returnGridOccupancy = gridOccupancy
      }

      return returnGridOccupancy
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
.el-form .el-form-item {
  padding: 0 10px;
}
.formItemDiv {
  margin: 10px;
}
.areaClass,
.el-form {
  display: inline-block;
  width: 100%;
}

.el-row {
  margin: 0 !important;
}
.el-divider__text {
  font-weight: bold;
}

.el-link {
  margin-right: 15px;

  .el-link--inner {
    font-size: 16px !important;
  }
}
</style>