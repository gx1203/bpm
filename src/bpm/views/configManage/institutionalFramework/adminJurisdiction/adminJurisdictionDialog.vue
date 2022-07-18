<template>
  <el-dialog id="adminJurisdictionDialog" :title="title" :visible.sync="dialogVisible">
    <el-form :model="item" ref="item" label-width="auto" class="content">
      <el-form-item label="管理员:" required>
        <el-input clearable type="textarea" @click.native="peopleDialog = true" v-model="item.name"/>
      </el-form-item>
      <el-form-item label="组织机构:" required>
        <el-input clearable v-model="item.companyName" @click.native="companyVisible = true"/>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel">{{ $t('cancelAction') }}</el-button>
      <el-button type="primary" @click="submit('item')">{{ $t('confirm') }}</el-button>
    </span>
    <company-dialog v-model="companyVisible" @confirm="saveSuccess"/>
    <select-people :isMore="true" v-model="peopleDialog" @confirm="getUser"/>
  </el-dialog>
</template>
<script>
import companyDialog from '@/bpm/components/company/companyDialog'
import SelectPeople from '../../../process/components/SelectPeople'
export default {
  name: 'adminJurisdictionDialog',
  data() {
    return {
      dialogVisible: this.value,
      companyVisible: false,
      peopleDialog: false
    };
  },
  components: {
    companyDialog,
    SelectPeople
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    item: {
      type: Object,
      default: () => {
        return {};
      }
    },
    title: {
      type: String,
      default: false
    }
  },
  watch: {
    value(val) {
      this.dialogVisible = val;
    },
    dialogVisible(val) {
      this.$emit("input", val);
    }
  },
  methods: {
    saveSuccess (data) {
      if (data) {
        this.item.companyName = data.NAME
      }
      this.companyVisible = false
    },
    getUser(data) {
       this.item.name = data.map(item => item.cnname).join('、')
      this.item.id = data.map(item => item.empuid).join(',')
    },
    submit(formName) {},
    cancel() {
      this.dialogVisible = false;
    }
  },
  mounted() {
  }
};
</script>

<style scoped>
.content {
  height: 50vh;
  width: 60%;
  margin: 0 auto;
  overflow: auto;
  padding: 0 10px;
}
.w100 {
  width: 100%;
}
</style>

