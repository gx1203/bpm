<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" append-to-body>
    <el-form
      :model="item"
      ref="item"
      :rules="rules"
      v-loading="loading"
      label-width="auto"
      class="content"
    >
      <el-form-item label="移动模块名称:" prop="menuname">
        <el-input clearable v-model="item.menuname" />
      </el-form-item>
      <el-form-item label="图标地址:" prop="iconurl">
        <el-input clearable v-model="item.iconurl" />
      </el-form-item>
      <el-form-item label="所属模块:" prop="leadid">
        <el-select clearable v-model="item.leadid" :placeholder="$t('placeholderText.pleaseSelect')" class="w100">
          <el-option
            v-for="item in leadList"
            :key="item.menuid"
            :label="item.menuname"
            :value="item.menuid"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="移动端显示:" prop="isShow">
        <el-select clearable v-model="item.isShow" :placeholder="$t('placeholderText.pleaseSelect')" class="w100">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="网页加载项:" prop="iswebview">
        <el-select clearable v-model="item.iswebview" :placeholder="$t('placeholderText.pleaseSelect')" class="w100">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="链接地址:"  :required="item.iswebview ===  'Y'"  prop="webviewurl">
        <el-input clearable v-model="item.webviewurl" />
      </el-form-item>
      <el-form-item :label="$t('sort') + '：'" prop="sort">
        <el-input clearable v-model="item.sort" type="number" onKeypress="return(/[\d]/.test(String.fromCharCode(event.keyCode)))" />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel">{{ $t('cancelAction') }}</el-button>
      <el-button type="primary" @click="submit('item')">{{ $t('confirm') }}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getMobileGroupList } from "@/bpm/api/process/mobileConfig/group_config";
import { saveMobileMenu } from "@/bpm/api/process/mobileConfig/menu_config";
let webviewurl = [
  {
  required: true,
  message: "请输入链接地址",
  trigger: ['blur','change']
}
];
export default {
  data() {
    return {
      dialogVisible: this.value,
      loading: false,
      options: [
        {
          value: "Y",
          label: this.$t('yes')
        },
        {
          value: "N",
          label: this.$t('no')
        }
      ],
      leadList: [],
      rules: {
        menuname:[
           {
          required: true,
          message: "请输入移动模块名称！！",
          trigger: "blur"
        }
        ],
        iconurl:[{
          required: true,
          message: "请输入图标地址！！",
          trigger: "blur"
        }],
        leadid: [{
          required: true,
          message: "请选择所属模块！！",
          trigger: "blur"
        }],
        isShow: [{
          required: true,
          message: "请选择移动端显示！！",
          trigger: "blur"
        }],
        iswebview: [{
          required: true,
          message: "请选择网页加载项！！",
          trigger: "blur"
        }],
        sort: [{ required: true, message: "请输入排序！！", trigger: "blur" }]
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
      if (val) {
        this.getData();
      }
    },
    dialogVisible(val) {
      this.$emit("input", val);
    },
     "item.leadid": function(val) { 
       this.item.leadid = Number(this.item.leadid)
     },
    "item.iswebview": function(val) { 
      if (val === "Y") {
        Object.assign(this.rules, {
          webviewurl
        });
        setTimeout(() => {
          // 添加事件队列很重要
          this.$refs.item.validateField(["webviewurl"]);
        }, 0);
      } else {
        Object.assign(this.rules, {
          webviewurl: []
        });

        setTimeout(() => {
          // 添加事件队列很重要
          this.$refs.item.clearValidate(["webviewurl"]);
        }, 0);
      }
    }
  },
  methods: {
    getData() {
      this.loading = true;
      getMobileGroupList()
        .then(rt => {
          this.leadList = rt.data.list;
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    submit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.loading = true;
          saveMobileMenu(this.item)
            .then(rt => {
              if (rt.status === "200") {
                this.$message.success(this.$t('hintText.addedSuccess'));
                this.dialogVisible = false;
                this.$emit("confirm", this.item);
              }
              this.loading = false;
            })
            .catch(() => {
              this.loading = false;
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
