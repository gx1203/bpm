<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" append-to-body>
    <el-form :model="item" ref="item" :rules="rules" label-width="140px" class="content">
      <el-form-item :label="$t('attributeName') + '：'" prop="orgattributename">
        <el-input clearable v-model="item.orgattributename " />
      </el-form-item>
      <el-form-item :label="$t('fieldNames') + '：'" prop="orgattributefieldname">
        <el-input clearable v-model="item.orgattributefieldname" />
      </el-form-item>
      <el-form-item :label="$t('querySelectionComponent') + '：'" prop="ifselectusercomponents">
        <el-select clearable v-model="item.ifselectusercomponents" :placeholder="$t('placeholderText.pleaseSelect')" class="w100">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('remarks') + '：'">
        <el-input clearable type="textarea" v-model="item.orgattributeremark " />
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
  saveOrgattribute
} from "@/bpm/api/process/processModeling/organization";
export default {
  data() {
    return {
      dialogVisible: this.value,
      options: [
        {
          value: "1",
          label: this.$t('yes')
        },
        {
          value: "0",
          label: this.$t('no')
        }
      ],
      rules: {
        orgattributename: [
          { required: true, message: this.$t('placeholderText.pleaseEnter') + this.$t('attributeName'), trigger: "blur" },
          { max: 200, message: this.$t('attributeName') + this.$t('superLong'), trigger: "blur" },
        ],
        orgattributefieldname: [{ required: true, message: this.$t('placeholderText.pleaseEnter') + this.$t('fieldNames'), trigger: "blur" },
          { max: 200, message: this.$t('fieldNames') + this.$t('superLong'), trigger: "blur" }
        ],
        ifselectusercomponents: [
          {
            required: true,
            message: this.$t('querySelectionComponent'),
            trigger: "blur"
          }
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
    },
    dialogVisible(val) {
      this.$emit("input", val);
    }
  },
  methods: {
    submit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          saveOrgattribute(this.item)
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
      this.item.dataList.push({
        name: ""
      });
    },
    deleData(index) {
      this.item.dataList.splice(index, 1);
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
}
.w100 {
  width: 100%;
}
</style>
