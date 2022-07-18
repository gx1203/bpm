<template>
  <div id="updateGroup">
    <el-dialog :title="selectOperation" :visible.sync="dialogVisible" width="60%">
        <el-form :model="groupForm" ref="groupForm" label-width="70px">
            <el-form-item :label="name" >
                <el-input clearable v-model="groupForm.name"></el-input>
            </el-form-item>
            <el-form-item :label="description" >
                <el-input clearable type="textarea" v-model="groupForm.desc"></el-input>
            </el-form-item>
            <el-col :span="12">
              <el-form-item :label="sort" >
                  <el-input clearable v-model="groupForm.sort"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="state">
                  <el-select clearable v-model="groupForm.status">
                      <el-option label="启用" value="启用"></el-option>
                      <el-option label="禁用" value="禁用"></el-option>
                  </el-select>
              </el-form-item>
            </el-col>
        </el-form>
        <el-button class="deleteGroup" type="danger" @click="deleteGroup">{{$t("deletTtheGroup")}}</el-button>
        <el-table :data="tableData" style="width: 100%">
            <el-table-column prop="name" :label="name" width="180"></el-table-column>
            <el-table-column prop="type" :label="type" width="180"></el-table-column>
            <el-table-column :label="operation" width="100">
                <template slot-scope="scope">
                    <el-button @click.native.prevent="deleteRow(scope.$index, tableData)" type="text" size="small">{{$t("delete")}}</el-button>
                </template>
            </el-table-column>
        </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button>{{$t("cancel")}}</el-button>
        <el-button type="primary"  @click.native.prevent="handleSave">{{$t("confirm")}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getGroupInfo, ajaxGroupSave, deleteGroup } from '@/bpa/api/newOrganization'
export default {
  name: "updateGroup",
  data() {
    return {
      dialogVisible: false,
      groupForm: {
          name: '',
          status: '启用'
      },
      tableData: [],
      selectOperation:this.$t("selectOperation"),
      name:this.$t("name"),
      description:this.$t("description"),
      sort:this.$t("sort"),
      state:this.$t("state"),
      operation:this.$t("operation"),
      type:this.$t("type"),
      modifyTheSuccess:this.$t("hintText.modifyTheSuccess"),
      areYouSureDelete:this.$t("hintText.areYouSureDelete"),
      successfullyDelete:this.$t("hintText.successfullyDelete"),
      Undeleted:this.$t("hintText.Undeleted"),
      hint:this.$t("hintText.hint"),
      confirm:this.$t("confirm"),
      cancel:this.$t("cancel"),
    };
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    updateGroupId: {
      type: String,
      default: ''
    }
  },
  watch: {
    value(val) {
      // console.log(val)
      this.dialogVisible = val;
    },
    dialogVisible(val) {
      this.$emit("input", val);
    },
    updateGroupId(val) {
      console.log(val)
      this.initData(val)
    }
  },
  methods: {
      initData(id) {
          getGroupInfo(id).then(res => {
            console.log(res)
            this.groupForm.name = res.data.name
            this.groupForm.status = res.data.status
            this.tableData = res.data.groupMemberFbcList
          })
      },
      // 删除组中的成员
      deleteRow(index, rows) {
        rows.splice(index, 1);
      },
      handleSave() {
        let data = {
            id: this.updateGroupId,
            groupMemberFbcList: this.tableData,
            name: this.groupForm.name,
            description: this.groupForm.desc,
            sort: this.groupForm.sort,
            status: this.groupForm.status,
            type: 'cus'
        }
        console.log(data)
        ajaxGroupSave(data).then(res => {
            console.log(res)
            this.$message({
              message: this.modifyTheSuccess,
              type: "success"
            })
            this.dialogVisible = false
            this.$emit('updateGroupSuccess', true)
        })
      },
      // 删除组
      deleteGroup() {
        this.$confirm(this.areYouSureDelete, this.hint, {
          confirmButtonText: this.confirm,
          cancelButtonText: this.cancel,
          type: 'warning'
        }).then(() => {
          deleteGroup(this.updateGroupId).then(res => {
            console.log(res)
            this.$message({
              type: 'success',
              message: this.successfullyDelete
            })
            this.dialogVisible = false
            this.$emit('updateGroupSuccess', this.updateGroupId)
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: this.Undeleted
          })
        })
      }
  }
};
</script>

<style lang="scss" scoped>
#updateGroup {
  .deleteGroup {
    float: right;
    margin-bottom: 20px;
  }
}
</style>
