<!-- 自定义弹出框--表格部分 -->
<template> 
    <el-dialog 
      v-if="outDoorDialogVisible"
      title="单据详情" 
      :visible.sync="outDoorDialogVisible" 
      :before-close="handleClose"
      append-to-body
      width="62%"
    > 
    <el-table
      ref="multipleTable"
      :data="itemColumn.data"
      :span-method="objectSpanMethod"
      highlight-current-row
      @selection-change="handleCurrentChange"
      border
      style="width: 100%">
      <el-table-column
        type="selection"
        width="60">
      </el-table-column>
      <el-table-column
        prop="lendNo"
        label="单据编号"
        width="150">
      </el-table-column>
      <!-- <el-table-column
        prop="materialNo"
        label="物料编号"
        width="120">
      </el-table-column> -->
      <el-table-column
        prop="materialName"
        label="物料名称"
        width="160">
      </el-table-column>
      <el-table-column
        prop="units"
        label="物料单位"
        width="100">
      </el-table-column>
      <el-table-column
        prop="qty"
        label="数量"
        width="80">
      </el-table-column>
      <!-- <el-table-column
        prop="plateNumber"
        label="车牌号码"
        width="80">
      </el-table-column> -->
      <el-table-column
        prop="status_dictText"
        label="单据状态"
        width="100">
      </el-table-column>
      <el-table-column
        prop="permitUnits"
        label="出门单位"
        width="100">
      </el-table-column>
      <el-table-column
        prop="prepaymentTime"
        label="预计归还时间"
        width="150">
      </el-table-column>
      <!-- <el-table-column
        prop="factoryNo"
        label="工厂">
      </el-table-column> -->
      <!-- <el-table-column
        prop="lendMaterialType"
        label="外借物资类型">
      </el-table-column> -->
      
      <!-- <el-table-column
        prop="operateUser"
        label="操作人">
      </el-table-column> -->
      <!-- <el-table-column
        prop="outTime"
        label="外借时间">
      </el-table-column> -->
      <!-- 
      <el-table-column
        prop="corporation"
        label="部门">
      </el-table-column>
      <el-table-column
        prop="createDate"
        label="创建时间">
      </el-table-column> -->
    </el-table>
    <span slot="footer" class="dialog-footer">
    <el-button @click="handleClose">取 消</el-button>
    <el-button type="primary" @click="submitData">确 定</el-button>
  </span>
</el-dialog> 
</template>

<script>
export default {
  name: 'outDoorDialog',
  data() {
      return {
        outDoorDialogVisible: this.value,
        selectData:[]
      };
    },
  props:{
    itemColumn: {
      type: Object,
      default: () => ({})
    },
    value:{
      type:Boolean,
      default:false
    }
  },
   watch: {
    value(val) {
      this.outDoorDialogVisible = val
    },
    outDoorDialogVisible(val) {
      this.$emit('input', val)
    }
  },
  mounted() {
    
  },
  methods: {
    handleClose(){
      this.selectData=[];
      this.outDoorDialogVisible=false;
    },
     //选择数据
      handleCurrentChange(val) {
      if (val.length > 1) {
          this.$refs.multipleTable.clearSelection()
          this.$refs.multipleTable.toggleRowSelection(val.pop())
      } else {
        this.selectData=val;
      }
      },
      //提交数据
      submitData(){
        let subData=[];
        if(this.selectData.length>=1){
          //获取单据编号相同的数据
          this.itemColumn.data.forEach(item=>{
            if(item.lendNo==this.selectData[0].lendNo){
              subData.push(item);
            }
          })
            this.$emit("submitData", subData);
            this.outDoorDialogVisible=false;
        }else{
           //数据提醒
           this.$message.warning("请选择数据!")
        }
        
      },
      // 单元格的处理方法 当前行row、当前列column、当前行号rowIndex、当前列号columnIndex
      objectSpanMethod({ row, column, rowIndex, columnIndex }){
         if (columnIndex <= 1) {
          const _row = this.flitterData(this.itemColumn.data).one[rowIndex];
          const _col = _row > 0 ? 1 : 0;
          return {
            rowspan: _row,
            colspan: _col,
          };
        }
      },
      flitterData(arr) {
        let spanOneArr = [];
        let concatOne = 0;
        arr.forEach((item, index) => {
          if (index === 0) {
            spanOneArr.push(1);
          } else {
          //注意这里的quarterly是表格绑定的字段，根据自己的需求来改
            if (item.lendNo === arr[index - 1].lendNo) {
              //第一列需合并相同内容的判断条件
              spanOneArr[concatOne] += 1;
              spanOneArr.push(0);
            } else {
              spanOneArr.push(1);
              concatOne = index;
            }
          }
        });
        return {
          one: spanOneArr,
        };
	}
      
  },
}
</script>