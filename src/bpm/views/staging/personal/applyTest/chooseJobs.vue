<template>
  <el-dialog :title="$t('chooseAPosition')" :visible.sync="dialogVisible">
    <el-form  ref="item" label-width="140px" class="content">
      <el-form-item :label="$t('chooseAPosition') + '：'"required>
        <el-select clearable v-model="positionId" class="w100" :placeholder="$t('placeholderText.pleaseSelect')">
          <el-option
            v-for="data in positionList"
            :key="data.id"
            :label="data.name"
            :value="data.id"
          >
            <span style="float: left">{{data.name}}</span>
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
export default {
  data() {
    return {
      dialogVisible: this.value,
      positionId: '',
      positionList: []
    };
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    item: {
      type: Array,
      default: () => {
        return [];
      }
    },
  },
  watch: {
    value(val) {
      this.dialogVisible = val;
      if(val){
          this.positionList= this.item
      }
    },
    dialogVisible(val) {
      this.$emit("input", val);
    }
  },
  methods: {
    submit(formName) {
        if(!this.positionId){
            this.$message.error(this.$t('hintText.pleaseChoosePosition'))
            return false
        }
        this.dialogVisible = false
        this.$emit("confirm", this.item.filter(item => item.id === this.positionId));
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
  width: 100%;
}
</style>
