<template>
  <el-dialog :title="title" :visible.sync="dialogVisible">
    <el-form :model="item" ref="item" :rules="rules" label-width="auto" class="content">
      <el-form-item :label="$t('name2') + '：'" prop="name">
        <el-input clearable v-model="item.name" />
      </el-form-item>
      <el-form-item :label="$t('type') + '：'" prop="type">
        <el-select clearable v-model="item.type" class="w100" :placeholder="$t('placeholderText.pleaseSelect')">
          <el-option
            v-for="item in typeList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('sqlStatement2') + '：'" v-if="item.type !== '2'" required>
        <el-input clearable v-model="item.SQL" />
        <el-button type="primary">{{ $t('testSqlStatement') }}</el-button>
      </el-form-item>
      <el-form-item label="拖拽页面名称:" v-else required>
        <el-input clearable v-model="item.dropPageName" @click.native="peopleDialog = true"/>
      </el-form-item>
      <el-form-item label="URL:">
        <!-- <el-input clearable v-model="item.grantor" /> -->
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel">{{ $t('cancelAction') }}</el-button>
      <el-button type="primary" @click="submit('item')">{{ $t('confirm') }}</el-button>
    </span>
    <drag-page v-model="peopleDialog" @confirm="getUser"></drag-page>
  </el-dialog>
</template>
<script>
import dragPage from './dragPage'
export default {
  data() {
    return {
      dialogVisible: this.value,
      peopleDialog: false,
      rules: {
        name: [
          { required: true, message: "请输入业务组类型名称", trigger: "blur" }
        ],
        type: [
          { required: true, message: this.$t('placeholderText.pleaseChooseTheType'), trigger: "blur" }
        ]
      },
      typeList: [
        {
          value: "1",
          label: "SQL语句"
        },
        {
          value: "2",
          label: "拖拽页面"
        },
        {
          value: "3",
          label: "表维护"
        }
      ]
    };
  },
  components: {
    dragPage
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
    getUser(data) {
      this.item.name = data.map(item => item.cnname).join('、')
      this.item.id = data.map(item => item.empuid).join(',')
    },
    submit(formName) {
         this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.item.type !== '2') {
            if(!this.item.SQL){
              this.$message.error('请输入sql语句！！')
              return
            }
          }else {
            if(!this.item.dropPageName){
              this.$message.error('请输入拖拽页面名称！！')
              return
            }
          }
          saveBusinessGroupType(this.item)
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
