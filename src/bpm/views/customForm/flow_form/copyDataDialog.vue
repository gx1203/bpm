<template>
  <el-dialog :title="$t('selectProcess')" :visible.sync="dialogVisible" append-to-body>
    <el-form  ref="item" label-width="140px" class="content">
      <el-form-item :label="$t('selectProcess') + '：'" required>
        <el-select clearable filterable v-model="positionId" class="w100" :placeholder="$t('placeholderText.pleaseEnterProcessNameSearch')">
          <el-option
            v-for="data in processList"
            :key="data.processId"
            :label="data.processNamecn"
            :value="data.processId"
          >
            <span style="float: left">{{data.processNamecn}}</span>
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel">{{ $t('cancelAction') }}</el-button>
      <el-button type="primary" @click="submit()">{{ $t('confirm') }}</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { getAllocatedProcess } from "@/bpm/api/process/processBasic/process_design";
export default {
  data() {
    return {
      dialogVisible: this.value,
      positionId: '',
      processList: [],
    };
  },
  props: {
    value: {
      type: Boolean,
      default: true
    },
  },
  watch: {
    value(val) {
      this.dialogVisible = val;
      if(val){
        this.getData()
      }
    },
    dialogVisible(val) {
      this.$emit("input", val);
    }
  },
  methods: {
    submit(formName) {
        if(!this.positionId){
            this.$message.error(this.$t('placeholderText.pleaseSelectTheProcessToBeCopied'))
            return false
        }
        this.dialogVisible = false
        this.$emit("confirm", this.positionId);
    },
    getData: function() {
      getAllocatedProcess()
        .then(rt => {
          if (rt.status === "200") {
            this.processList = rt.data;
          }
        })
        .catch(() => {

        });
    },
    cancel() {
      this.dialogVisible = false;
    },
  }
};
</script>
<style scoped>
.content {
  height: 30vh;
  width: 60%;
  margin: 0 auto;
  overflow: auto;
}
.w100 {
  width: calc(100% - 2px);
}
</style>
