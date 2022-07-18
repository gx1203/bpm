<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    width="700px"
    class="jobsChangeDialog"
  >
    <el-form :model="item" ref="item" label-width="auto" class="content">
      <el-form-item :label="$t('changeUser') + '：'" required>
        <el-input
          v-model="item.oldusername"
          @click.native="checkHandle('olduserrName')"
        />
      </el-form-item>
      <el-form-item :label="$t('jobInformation') + '：'" required>
        <el-table
          :data="dataList"
          v-if="delayshow"
          class="margin-t10"
          stripe
          :header-cell-style="{ background: '#E1EAFD !important' }"
          highlight-current-row
        >
          <el-table-column
            :label="$t('post')"
            show-overflow-tooltip
            prop="pname"
            width="80"
          >
          </el-table-column>
          <el-table-column
            :label="$t('department')"
            show-overflow-tooltip
            prop="dname"
          >
          </el-table-column>
          <el-table-column
            :label="$t('owningProcess')"
            show-overflow-tooltip
            prop="processname"
          >
          </el-table-column>
          <el-table-column
            :label="$t('replaceUser')"
            show-overflow-tooltip
            prop="newusername"
          >
            <template slot-scope="scope">
              <el-input
                v-model="scope.row.newusername"
                style="padding: 5px; width: 91%"
                @click.native="checkHandle(scope.$index)"
              />
            </template>
          </el-table-column>
        </el-table>
        <!--        <table-->
        <!--          cellspacing="0"-->
        <!--          style="margin: 15px 0;text-align: center;width: 100%;border-collapse:collapse;border: 1px solid #e1eafd;"-->
        <!--        >-->
        <!--          <thead style="background: #E1EAFD; font-weight: bold; font-size: 12px">-->
        <!--            <tr>-->
        <!--              <td>{{ $t('post') }}</td>-->
        <!--              <td>{{ $t('department') }}</td>-->
        <!--              <td>{{ $t('owningProcess') }}</td>-->
        <!--              <td>{{ $t('replaceUser') }}</td>-->
        <!--            </tr>-->
        <!--          </thead>-->
        <!--          <tbody>-->
        <!--            <tr-->
        <!--              v-for="(data,index) in dataList"-->
        <!--              :key="index"-->
        <!--              style="line-height: 16px;height: 30px;font-size: 13px;border-top: 1px solid #e1eafd;"-->
        <!--            >-->
        <!--              <td>{{data.pname}}</td>-->
        <!--              <td>{{data.dname}}</td>-->
        <!--              <td>{{data.processname}}</td>-->
        <!--              <td style="width:80px">-->
        <!--                <el-input clearable-->
        <!--                  v-model="data.newusername"-->
        <!--                  style="padding:5px;width: 91%;"-->
        <!--                  @click.native="checkHandle(index)"-->
        <!--                />-->
        <!--              </td>-->
        <!--            </tr>-->
        <!--          </tbody>-->
        <!--        </table>-->
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel">{{ $t("cancelAction") }}</el-button>
      <el-button type="primary" @click="submit('item')">{{
        $t("confirm")
      }}</el-button>
    </span>
    <bas-organieation
      v-model="peopleDialog"
      :selectedElement="selectedElement"
      :isSpecifiedGroupBut="false"
      :multiple="false"
      :isShowBustomGroupsBut="false"
      :selectElement="selectElement"
      :showElement="showElement"
      :title="orgtitle"
      @fnCallBack="getUser"
    />
    <!-- <select-people  :radioChecked="radioChecked" v-model="peopleDialog" @confirm="getUser"></select-people> -->
  </el-dialog>
</template>
<script>
import BasComponent from "bas-component";
Vue.use(BasComponent);
import "bas-component/lib/BasComponent.css";
import {
  basBpmUserChange,
  saveBpmUserChange,
} from "@/bpm/api/process/administrativeTool/agents_change";
export default {
  data() {
    return {
      delayshow: true,
      dialogVisible: this.value,
      peopleDialog: false,
      selectedUsers: {},
      dataList: [],
      radioChecked: "",
      selectedElement: {},
      showElement: [],
      check: "",
      selectElement: ["9"],
      orgtitle: "",
    };
  },
  components: {
    // SelectPeople
  },
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
  watch: {
    value(val) {
      this.dialogVisible = val;
      if (val) {
        this.dataList = [];
      }
    },
    dialogVisible(val) {
      this.$emit("input", val);
    },
    peopleDialog (val) {
      if (val) {
        console.log('selectedElement===',this.selectedElement)
      }
    }
  },
  methods: {
    checkHandle(type) {
      console.log("dataList==",this.dataList);
      console.log("type==",type);
      console.log("item==",this.item);
      this.check = type;
      this.selectedElement = {};
      if (this.check === "olduserrName") {
        if (this.item.olduser) {
          this.selectedElement = {
            id: this.item.olduser,
            name: this.item.oldusername,
            idType: `${this.item.olduser}-9`,
          };
        }
      } else {
        if (this.dataList[type].newuser) {
          this.selectedElement = {
            id: this.dataList[type].newuser,
            name: this.dataList[type].newusername,
            idType: `${this.dataList[type].newuser}-9`,
          };
        }
      }
      this.peopleDialog = true;
    },
    isVerify() {
      if (!this.item.oldusername) {
        this.$message.error(
          this.$t("placeholderText.pleaseSelect") + " " + this.$t("replaceUser")
        );
        return false;
      }
      return true;
    },
    submit(formName) {
      if (!this.isVerify()) return;
      this.item.post = this.dataList
        .filter((item) => item.newusername != null)
        .map((item) => item.pid)
        .join(",");
      this.item.dept = this.dataList
        .filter((item) => item.newusername != null)
        .map((item) => item.dname)
        .join(",");
      this.item.newuser = this.dataList
        .filter((item) => item.newusername != null)
        .map((item) => item.newuser)
        .join(",");
      if (!this.item.post) {
        this.$message.error(
          this.$t("placeholderText.pleaseSelect") + " " + this.$t("replaceUser")
        );
        return;
      }
      saveBpmUserChange({
        ...this.item,
        type: "2",
      })
        .then((rt) => {
          if (rt.status === "200") {
            this.$message({
              message: this.$t("hintText.saveSuccessfully"),
              type: "success",
            });
            this.dialogVisible = false;
            this.$emit("confirm", true);
          }
        })
        .catch(() => {});
    },
    cancel() {
      this.dialogVisible = false;
    },
    getPost() {
      basBpmUserChange(this.item.olduser).then((rt) => {
        if (rt.status === "200") {
          this.dataList = rt.data;
        }
      });
    },
    getUser(data) {
      this.peopleDialog = false;
      this.delayshow = false;
      if (this.check === "olduserrName") {
        this.orgtitle =
          this.$t("placeholderText.select") + this.$t("changeUser");
        this.item.oldusername = data.name;
        this.item.olduser = data.id;
        this.$set(this.item, "oldusername", data.name);
        this.$set(this.item, "olduser", data.id);
        if (this.item.olduser) {
          this.getPost();
        }
      } else {
        this.orgtitle =
          this.$t("placeholderText.select") + this.$t("replaceUser");
        this.dataList[Number(this.check)].newusername = data.name;
        this.dataList[Number(this.check)].newuser = data.id;
        this.$set(this.dataList[Number(this.check)], "oldusername", data.name);
        this.$set(this.dataList[Number(this.check)], "newuser", data.id);
      }
      setTimeout(() => {
        this.delayshow = true;
      }, 50);
      console.log(this.dataList, "this.dataList");
    },
  },
};
</script>

<style lang="scss" scoped>
.jobsChangeDialog {
  /deep/ .el-dialog__body {
    max-height: 60vh;
  }
}
.content {
  width: 90%;
  margin: 0 auto;
}
.w100 {
  width: 100%;
}
</style>
