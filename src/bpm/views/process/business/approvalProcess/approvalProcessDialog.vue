<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" append-to-body>
    <el-form :model="data" ref="item" :rules="rules" label-width="auto" class="content">
      <el-form-item :label="$t('name2') + '：'" prop="approvalname">
        <el-input clearable v-model="data.approvalname" />
      </el-form-item>
      <el-form-item :label="$t('personnel') + '：'">
        <el-button @click="addList">{{ $t('add') }}</el-button>
        <table
          cellspacing="0"
          style="margin: 15px 0;text-align: center;width: 100%;border-collapse:collapse;border: 1px solid #e1eafd;"
        >
          <thead style="background: #E1EAFD; font-weight: bold; font-size: 12px">
            <tr>
              <td>{{ $t('sort') }}</td>
              <td>{{ $t('personnel') }}</td>
              <td> {{ $t('operation') }} </td>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(data,index) in data.users"
              :key="index"
              style="line-height: 16px;height: 30px;font-size: 13px;border-top: 1px solid #e1eafd;"
            >
              <td>
                <el-input clearable v-model="data.sort" type="number" onKeypress="return(/[\d]/.test(String.fromCharCode(event.keyCode)))"  style="padding:5px;width: 91%;"></el-input>
              </td>
              <td>
                <el-input clearable v-model="data.username" style="padding:5px;width: 91%;"></el-input>
              </td>
              <td>
                <el-button
                  type="text"
                  icon="el-icon-delete"
                  style="padding:5px"
                  @click="deleData(index)"
                ></el-button>
              </td>
            </tr>
          </tbody>
        </table>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel">{{ $t('cancelAction') }}</el-button>
      <el-button type="primary" @click="submit('item')">{{ $t('confirm') }}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import {
  saveOrderApproval,
  getOrderApproval
} from "@/bpm/api/process/business/approval_process";
export default {
  data() {
    return {
      data:{
        users:[]
      },
      dialogVisible: this.value,
      rules: {
        approvalname: [
          { required: true, message: this.$t('placeholderText.pleaseEnterName'), trigger: "blur" },
          { max: 30, message: this.$t('placeholderText.theMaximumLengthTheNameIs30'), trigger: "blur" }
        ]
      }
    };
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
      if(val){
        this.data = {
          users:[]
        }
        if(this.item.id){
          this.getOrderApproval()
        }
      }
    },
    dialogVisible(val) {
      this.$emit("input", val);
    }
  },
  methods: {
    getOrderApproval(){
      getOrderApproval(this.item.id).then(rt => {
        if(rt.status === "200"){
          this.data = rt.data
        }
      }).catch(() => {

      });
    },
    submit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          for(let i=0;i<this.data.users.length;i++){
            if(this.data.users[i].sort.length > 30){
              this.$message.error(this.$t('placeholderText.personSortingFieldLengthExceeds30'))
              return
            }else if(this.data.users[i].username.length > 30) {
              this.$message.error(this.$t('placeholderText.lengthAddedPersonFieldExceeds30'))
              return
            }
          }
          saveOrderApproval(this.data)
            .then(rt => {
              if (rt.status === "200") {
                this.$message({
                  message: this.$t('hintText.saveSuccessfully'),
                  type: "success"
                });
                this.dialogVisible = false;
                this.$emit("confirm", true);
              } else {
                this.$message({
                  message: this.$t('hintText.failToSave'),
                  type: "error"
                });
              }
            })
            .catch(() => {
              this.$message({
                message: this.$t('hintText.failToSave'),
                type: "error"
              });
            });
        }
      });
    },
    cancel() {
      this.dialogVisible = false;
    },
    addList() {
      this.data.users.push({});
    },
    deleData(index) {
      this.data.users.splice(index, 1);
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
</style>
