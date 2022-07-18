<template>
  <el-dialog
    ref
    :title="title"
    :visible.sync="dialogVisible"
    append-to-body
    @close="closeDialog"
  >
    <el-form
      ref="item"
      :model="item"
      :rules="rules"
      label-width="auto"
      class="content"
    >
      <el-form-item :label="$t('calendarName') + '：'" prop="name">
        <el-input v-model="item.name" clearable />
      </el-form-item>
      <el-form-item :label="$t('date') + '：'" prop="startDate">
        <el-row>
          <el-col :span="11">
            <el-date-picker
              style="width: 158px"
              v-model="item.startDate"
              @change="changeStartDate"
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="选择日期"
            >
            </el-date-picker>
          </el-col>
          <el-col :span="2" style="text-align: center"> ~ </el-col>
          <el-col :span="11">
            <el-date-picker
              style="width: 158px; float: right"
              value-format="yyyy-MM-dd"
              v-model="item.endDate"
              @change="changeEndtime"
              type="date"
              placeholder="选择日期"
            >
            </el-date-picker>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item :label="$t('state') + '：'" prop="state">
        <el-radio v-model="item.state" :label="0">{{
          $t("takeEffect")
        }}</el-radio>
        <el-radio v-model="item.state" :label="1">{{
          $t("loseEfficacy")
        }}</el-radio>
      </el-form-item>
      <el-form-item
        :label="$t('creator') + '：'"
        v-if="title === '编辑假期日历' && item.createby"
      >
<!--        <el-input v-model="item.createby" readonly />-->
        <el-input v-model="item.createname" readonly />
      </el-form-item>
      <el-form-item
        :label="$t('createTime') + '：'"
        v-if="title === '编辑假期日历' && item.createon"
      >
<!--        <el-input v-model="item.createon" readonly />-->
        <el-input v-model="item.creatTime" readonly />
      </el-form-item>
      <el-form-item :label="$t('remarks')">
        <el-input
          type="textarea"
          :rows="2"
          autosize
          v-model="item.remark"
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('selectOrganizational')">
        <el-input
          type="textarea"
          :rows="2"
          autosize
          v-model="item.orgnames"
          @focus="orgHandle"
        ></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel">{{ $t("cancelAction") }}</el-button>
      <el-button type="primary" @click="submit('item')">{{
        $t("confirm")
      }}</el-button>
    </span>
    <bas-organieation
      v-model="organieationShow"
      :selectedElement="selectedElement"
      :isSpecifiedGroupBut="false"
      :isShowBustomGroupsBut="false"
      :selectElement="selectElement"
      :showElement="showElement"
      :title="orgtitle"
      @fnCallBack="fnBasOrganieationCallBack"
    />
  </el-dialog>
</template>
<script>
import { saveHolidayCalendar } from "@/bpm/api/configManage/leaveCalendar";
import BasComponent from "bas-component";
Vue.use(BasComponent);
import "bas-component/lib/BasComponent.css";
import { getDictionaryOption } from "@/bpm/api/process/processModeling/classificationModel";
import { getOrgTree } from "@/bpm/api/app";
import { orgSave } from "@/bpm/api/configManage/institutionalFramework/org_info";
export default {
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    item: {
      type: Object,
      default: () => {
        return {};
      },
    },
    title: {
      type: String,
      default: false,
    },
  },
  data() {
    return {
      selectElement: ["0", "1", "2"],
      organieationShow: false,
      orgtitle: this.$t("selectOrganizational"),
      showElement: [],
      selectedElement: {},
      dialogVisible: this.value,
      options: [],
      rules: {
        name: [
          {
            required: true,
            message: this.$t("pleaseWrite") + this.$t("calendarName"),
            trigger: "blur",
          },
          {
            max: 255,
            message: this.$t("calendarName") + this.$t("superLong"),
            trigger: "blur",
          },
        ],
        startDate: [
          {
            required: true,
            message: this.$t("pleaseSelect") + this.$t("date"),
            trigger: "change ",
          },
        ],
        state: [
          {
            required: true,
            message: this.$t("pleaseSelect") + this.$t("state"),
            trigger: "change ",
          },
        ],
      },
    };
  },
  watch: {
    value(val) {
      this.dialogVisible = val;
    },
    dialogVisible(val) {
      this.$emit("input", val);
    },
  },
  mounted() {},
  mounted() {},
  methods: {
    orgHandle() {
      console.log(this.item, "item");
      this.selectedElement = {};
      if (this.item.orgids) {
        this.getOrgTree(this.item.orgids);
      } else {
        this.organieationShow = true;
      }
    },
    getOrgTree(ids) {
      getOrgTree({
        logic: "and",
        filters: [{ key: "id", opt: "IN", type: "S", value: ids }],
        pageNum: 1,
        pageSize: 10000,
      })
        .then((rt) => {
          if (rt.status === "200") {
            this.selectedElement = {
              id: rt.data.list.map((item) => item.id).join(","),
              name: rt.data.list.map((item) => item.name).join("&"),
              idType: rt.data.list
                .map((item) => {
                  return `${item.id}-${item.type}`;
                })
                .join(";"),
            };
            this.organieationShow = true;
          }
        })
        .catch((er) => {});
    },
    fnBasOrganieationCallBack(data) {
      this.$set(this.item, "pname", data.name.split("&").join(","));
      this.$set(this.item, "pid", data.id);
      this.$set(this.item, "pcode", data.id);
      this.$set(this.item, "attribute2", data.idType);
      this.item.orgnames = this.item.pname;
      this.item.orgids = this.item.pid;
      this.organieationShow = false;
      console.log(this.item);
    },
    closeDialog() {
      this.$refs.item.resetFields();
    },
    submit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = true;
          saveHolidayCalendar(this.item)
            .then((rt) => {
              if (rt.status === "200") {
                this.$message.success(this.$t("hintText.addedSuccess"));
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
    changeEndtime() {
      console.log(this.item.startDate, this.item.endDate, "111111");
      if (this.item.startDate && this.item.endDate) {
        if (this.item.endDate < this.item.startDate) {
          this.$message({
            message: "结束时间不能小于开始时间!",
            type: "warning",
          });
          this.item.endDate = "";
          return false;
        }
      }
    },
    changeStartDate() {
      console.log(this.item.startDate, this.item.endDate, "222222");
      if (this.item.startDate && this.item.endDate) {
        if (this.item.startDate > this.item.endDate) {
          this.$message({
            message: "开始时间不能大于开始时间!",
            type: "warning",
          });
          this.item.startDate = "";
          return false;
        }
      }
    },
    cancel() {
      this.dialogVisible = false;
    },
  },
};
</script>

<style scoped>
.content {
  width: 72%;
  margin: 0 auto;
  pad: 0 10px;
  overflow: auto;
}
</style>
