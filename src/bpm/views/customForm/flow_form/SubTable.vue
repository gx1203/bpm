<template>
  <div class="sub-table">
    <div class="sub-table-head">
      <span v-if="item.isrequired === 'required' && item.editstate === 'W'" style="color: red">*</span>
      <span>{{item.fieldShowName}}</span>
      <div class="fill"></div>
    </div>
    <div class="sub-table-body border0" :class="item.nodeTableLists.length > 0 ? 'border0' : ''">
      <table>
        <draggable
          element="thead"
          v-model="item.nodeTableLists"
          :options="dragOptions2"
          :class="item.nodeTableLists.length === 0? 'draH' : ''"
        >
          <th v-for="(column, index1) in item.nodeTableLists" class="pos-relative"   :class="{'bg-outline':bgClick=== column.key}" @click.stop="formHandle(column,index1)" :key="index1">
            <span v-if="column.isrequired === 'required'" style="color: red">*</span>
            {{column.fieldShowName}}
            <el-button type="text"  v-if="isLRShow"  class="red delete-but" @click.stop="handleDelete(column)">
              <i class="el-icon-delete"/>
            </el-button>
          </th>
        </draggable>
      </table>
    </div>
  </div>
</template>
<script>
import FlowItem from "./FlowItem";
import { createNamespacedHelpers } from "vuex";
const { mapGetters } = createNamespacedHelpers("app");
export default {
  name: "SubTable",
  components: {
    FlowItem
  },
  data() {
    return {
      bizData2: [],
      key: new Date().getTime()
    };
  },
  props: {
    item: {
      type: Object,
      default: () => ({})
    },
    bizData: {
      type: Object,
      default: () => ({})
    },
    bgClick:{
      type: [Number,String],
      default: -1
    }
  },
  computed: {
    ...mapGetters(["errorsShow"]),
    // 拖拽表单2
    dragOptions2() {
      return {
        animation: 0,
        ghostClass: "ghost",
        group: {
          // 只允许放置shared的控件,禁止pull
          put: ["shared"]
        }
      };
    },
    isLRShow (){
      return this.$store.state.custom.isLRShow;
    }
  },
  watch: {
    bizData: {
      handler(val) {
        this.initData(this.item);
      }
    }
  },
  methods: {
    initData(val) {
      if (!val.rows) {
        this.$set(val, "rows", []);
      }
      Object.keys(this.bizData).forEach(key => {
        if (key === val.fieldName) {
          this.bizData2 = this.bizData[key];
          this.bizData[key].forEach((item, index) => {
            let _nodeTableLists = JSON.parse(
              JSON.stringify(val.nodeTableLists)
            );
            val.rows.push({
              nodeTableLists: _nodeTableLists
            });
          });
        }
      });
    },
    handleDelete(item) {
      this.$emit('handleDelete',item)
    },
    delItem(index) {
      let rows = JSON.parse(JSON.stringify(this.item.rows));
      rows.splice(index, 1);
      this.bizData2.splice(index, 1);
      this.item.rows.splice(index, 1);
    },
    formHandle(data){
      this.$emit('formHandle',data)
    },
  },
  mounted() {
    this.initData(this.item);
  }
};
</script>

<style type="text/scss" lang="scss" scoped>
.sub-table {
  /*display: table-cell;*/
  vertical-align: middle;
  padding-right: 10px;
  width: 100%;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  -ms-box-sizing: border-box;
  box-sizing: border-box;
  .red{
    color: red
  }
  .delete-but {
    position: absolute;
    top: 0px;
    opacity: 0;
    right: 5px;
  }
  .pos-relative:hover .delete-but{
    opacity: 1;
  }
  .draH{
    height: 36px;
    width: 100%;
    display: inline-block;
  }
  &-head {
    display: flex;
    align-items: flex-end;
    margin-bottom: 10px;
    .fill {
      flex-grow: 1;
    }
  }
  &-body {
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    overflow-x: auto;
    // border: solid 1px $dc1;
    table {
      min-width: 100%;
      table-layout: fixed;
      border-collapse: collapse;
    }
    th {
      background: #f5f5f5;
      padding: 7px 10px;
      text-align: center;
      border: 1px solid #ebeef5;
    }
    tbody {
      td {
        text-align: center;
        padding: 10px 5px;
        position: relative;
        border: 1px solid #ebeef5;
        /deep/ .el-input {
          min-width: 130px;
        }
        .checkText {
          width: 90%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          position: absolute;
          bottom: 2px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
