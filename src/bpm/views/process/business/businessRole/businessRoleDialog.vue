<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" append-to-body>
    <el-form :model="item" ref="item" :rules="rules" label-width="auto" class="content">
      <el-form-item :label="$t('businessRoleName') + '：'" prop="tablename">
        <el-input clearable v-model="item.tablename" />
      </el-form-item>
      <el-form-item :label="$t('description2') + '：'" prop="tabledesc">
        <el-input clearable type="textarea" v-model="item.tabledesc" />
      </el-form-item>
      <el-form-item :label="$t('correspondingBusinessTable') + '：'" prop="tablevalue">
        <el-input clearable v-model="item.tablevalue" />
      </el-form-item>
      <el-form-item :label="$t('condition') + '：'" prop="filters">
        <el-button @click="addList">{{ $t('add') }}</el-button>
        <table
          cellspacing="0"
          style="margin: 15px 0;text-align: center;width: 100%;border-collapse:collapse;border: 1px solid #e1eafd;"
        >
          <thead style="background: #E1EAFD; font-weight: bold; font-size: 12px">
            <tr>
              <td>{{ $t('conditionType') }}</td>
              <td>{{ $t('fieldValue') }}</td>
              <td>{{ $t('alias') }}</td>
              <td> {{ $t('operation') }} </td>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(data,index) in item.filters"
              :key="index"
              style="line-height: 16px;height: 30px;font-size: 13px;border-top: 1px solid #e1eafd;"
            >
              <td>
                <el-input clearable v-model="data.fieldname" style="padding:5px;width: 91%;"></el-input>
              </td>
              <td>
                <el-input clearable v-model="data.fieldvalue" style="padding:5px;width: 91%;"></el-input>
              </td>
              <td>
                <el-input clearable v-model="data.attribute1" style="padding:5px;width: 91%;"></el-input>
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
      <el-form-item :label="$t('role') + '：'" prop="roles">
        <el-button @click="addRoleList">{{ $t('add') }}</el-button>
        <table
          cellspacing="0"
          style="margin: 15px 0;text-align: center;width: 100%;border-collapse:collapse;border: 1px solid #e1eafd;"
        >
          <thead style="background: #E1EAFD; font-weight: bold; font-size: 12px">
            <tr>
              <td>{{ $t('characterName') }}</td>
              <td>{{ $t('fieldValue') }}</td>
              <td> {{ $t('operation') }} </td>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(data,index) in item.roles"
              :key="index"
              style="line-height: 16px;height: 30px;font-size: 13px;border-top: 1px solid #e1eafd;"
            >
              <td>
                <el-input clearable v-model="data.fieldname" style="padding:5px;width: 91%;"></el-input>
              </td>
              <td>
                <el-input clearable v-model="data.fieldvalue" style="padding:5px;width: 91%;"></el-input>
              </td>
              <td>
                <el-button
                  type="text"
                  icon="el-icon-delete"
                  style="padding:5px"
                  @click="deleRoleData(index)"
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
  getMiddleById,
  saveMiddle
} from "@/bpm/api/process/business/business_role.js";
export default {
  data() {
    return {
      dialogVisible: this.value,
      item: {
        roles: [],
        filters: []
      },
      rules: {
        tablename: [
          { required: true, message: this.$t('placeholderText.pleaseEnter') + this.$t('businessRoleName'), trigger: "blur" },
          { max: 100, message: this.$t('businessRoleName') + this.$t('superLong'), trigger: "blur" }
        ],
        tablevalue: [
          { required: true, message: this.$t('placeholderText.pleaseEnter') + this.$t('correspondingBusinessTable'), trigger: "blur" },
          { max: 100, message: this.$t('correspondingBusinessTable') + this.$t('superLong'), trigger: "blur" }
        ],
        tabledesc: [{ required: true, message: this.$t('placeholderText.pleaseEnter') + this.$t('description2'), trigger: "blur" }],
        filters: [{ required: true, message: this.$t('pleaseAddConditions'), trigger: "blur" }],
        roles: [{ required: true, message: this.$t('pleaseAddRole'), trigger: "blur" }]
      }
    };
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    itemId: {
      type: String,
      default: ""
    },
    title: {
      type: String
    }
  },
  watch: {
    value(val) {
      this.dialogVisible = val;
      if (val && this.itemId) {
        this.getData();
      } else {
        this.item = {
          roles: [],
          filters: []
        };
      }
    },
    dialogVisible(val) {
      this.$emit("input", val);
    }
  },
  methods: {
    getData() {
      getMiddleById(this.itemId)
        .then(rt => {
          this.item = rt.data;
        })
        .catch(() => {});
    },
    isValidate() {
      for (let index = 0; index < this.item.filters.length; index++) {
        if (
          !this.item.filters[index].fieldname ||
          !this.item.filters[index].fieldvalue ||
          !this.item.filters[index].attribute1
        ) {
          this.$message.error(`条件第${index + 1}行请填写完整数据！！`);
          return false;
        }else if(this.item.filters[index].fieldname.length > 40){
          this.$message.error(`条件第${index + 1}行条件类型超长！！`);
          return false;
        }else if(this.item.filters[index].fieldvalue.length > 30){
          this.$message.error(`条件第${index + 1}行字段值超长！！`);
          return false;
        }else if(this.item.filters[index].attribute1.length > 100){
          this.$message.error(`条件第${index + 1}行别名超长！！`);
          return false;
        }
      }
      for (let index = 0; index < this.item.roles.length; index++) {
        if (
          !this.item.roles[index].fieldname ||
          !this.item.roles[index].fieldvalue
        ) {
          this.$message.error(`角色第${index + 1}行请填写完整数据！！`);
          return false;
        }else if(this.item.roles[index].fieldname.length > 40){
          this.$message.error(`角色第${index + 1}行角色名称超长！！`);
          return false;
        }else if(this.item.roles[index].fieldvalue.length > 30){
          this.$message.error(`角色第${index + 1}行字段值超长！！`);
          return false;
        }
      }
      return true;
    },
    submit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid && this.isValidate()) {
          saveMiddle(this.item)
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
      this.item.filters.push({});
    },
    deleData(index) {
      this.item.filters.splice(index, 1);
    },
    addRoleList() {
      this.item.roles.push({});
    },
    deleRoleData(index) {
      this.item.roles.splice(index, 1);
    }
  }
};
</script>

<style scoped>
.content {
  height: 50vh;
  margin: 0 auto;
  overflow: auto;
  padding: 0 10px;
}
</style>
