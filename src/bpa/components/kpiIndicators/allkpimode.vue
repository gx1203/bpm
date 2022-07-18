<template>
  <div>
    <el-row class="margin-b15">
      <el-col :span="6" :offset="18" class="clear-fix">
        <el-button
          class="float-r margin-l10"
          v-if="existTabField('batchDelete', 'refer')"
          type="primary"
          icon="el-icon-delete"
          :disabled="seltargetlist.length == 0"
          @click="deltargetMore"
        >
          {{ existTabField("batchDelete", "", true) }}</el-button
        >
        <el-button
          class="float-r"
          v-if="existTabField('add', 'refer')"
          @click="addKpiIndicators('add')"
          type="primary"
          icon="el-icon-plus"
          >{{ existTabField("add", "", true) }}</el-button
        >
      </el-col>
    </el-row>
    <el-table
      :data="processVallist"
      class="main_tab"
      stripe
      @selection-change="handletargetChange"
      v-loading="loading"
    >
      <el-table-column type="selection" width="50"></el-table-column>
      <el-table-column
        v-if="existTabField('number', 'refer')"
        :label="existTabField('number', '', true)"
        type="index"
        width="50"
      ></el-table-column>
      <el-table-column
        v-if="existTabField('kpiName', 'refer')"
        prop="name"
        show-overflow-tooltip
        :label="existTabField('kpiName', '', true)"
      ></el-table-column>
      <el-table-column
        v-if="existTabField('description', 'refer')"
        prop="description"
        show-overflow-tooltip
        :label="existTabField('description', '', true)"
      ></el-table-column>
      <!--<el-table-column v-if="existTabField('target', 'refer')" prop="target" show-overflow-tooltip-->
      <!--  :label="existTabField('target', '', true)"></el-table-column>-->
      <el-table-column
        v-if="existTabField('remarks', 'refer')"
        prop="remark"
        show-overflow-tooltip
        :label="existTabField('remarks', '', true)"
      ></el-table-column>
      <el-table-column
        prop="exname"
        show-overflow-tooltip
        label="KPI值"
      ></el-table-column>
      <el-table-column
        prop="pvalue1"
        show-overflow-tooltip
        label="计划值1"
      ></el-table-column>
      <el-table-column
        prop="pvalue2"
        show-overflow-tooltip
        label="计划值2"
      ></el-table-column>
      <el-table-column
        prop="threshold"
        show-overflow-tooltip
        label="阀值"
      ></el-table-column>
      <el-table-column width="120" :label="$t('operation')">
        <template slot-scope="scope">
          <el-tooltip
            class="item"
            effect="dark"
            :content="$t('edit')"
            placement="top"
            v-if="existTabField('add', 'refer')"
          >
            <el-button
              class="no-border"
              type="text"
              icon="el-icon-edit"
              @click="addKpiIndicators('edit', scope)"
            ></el-button>
          </el-tooltip>
          <el-tooltip
            class="item"
            effect="dark"
            :content="$t('delete')"
            placement="top"
            v-if="existTabField('batchDelete', 'refer')"
          >
            <el-button
              class="no-border"
              icon="el-icon-delete"
              type="text"
              @click="deltargetOne(scope)"
            ></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- <el-pagination
      @current-change="handleProcessChange"
      :current-page="processpages.pageNum"
      background
      layout="prev, pager, next, jumper, total"
      :total="processVallist.length"
    ></el-pagination> -->
    <addkpisuk
      v-model="isprocessVisible"
      :modelid="modelid"
      :showtabfiled="showtabfiled"
      :editItem="editItem"
      @confirm="getValuelist"
      @cancel="cancel"
    />
  </div>
</template>
<script>
import {
  getListIdByModelId,
  getprocessValue,
  delTarget,
  tabField,
  controlField,
} from "@/bpa/api/processDesignCenter";
import addkpisuk from "@/bpa/components/kpiIndicators/addkpisuk.vue";
const syslists = ["QMS", "EMS", "OHSAS", "ISMS", "RMS", "EnMs"];
export default {
  components: {
    addkpisuk,
  },
  data() {
    return {
      editindex: "",
      dialogVisible: this.value,
      seltargetlist: [],
      editableTabs: [],
      showtabfiled: [],
      modelid: "",
      processpages: {
        pageSize: 10000,
        pageNum: 1,
        total: 0,
      },
      loading: false,
      syslists: JSON.parse(JSON.stringify(syslists)),
      isprocessVisible: false,
      editItem: {},
    };
  },
  props: {
    processVallist: {
      type: Array,
      default: () => [],
    },
    value: {
      type: Boolean,
      default: true,
    },
    curSelectedId: {
      type: String,
      default: "",
    },
  },
  created() {
    // if (this.processVallist.length > 0) {
    //   this.processVallist = this.data;
    // } else {
    //   this.processVallist = [];
    // }
    console.log(this.$props, "this.jzlkpidata");
    this.getShowTablist().then(() => {
      this.editableTabs.forEach((item) => {
        if (item.index == 2) {
          this.getShowTabField(item.id, 2);
          return false;
        }
      });
    });
  },
  watch: {
    // value(val) {
    //   this.dialogVisible = val;
    //   if (val) {
    //     if (this.jzlkpidata) {
    //       this.processVallist = this.jzlkpidata;
    //     } else {
    //       this.processVallist = [];
    //     }
    //     this.getShowTablist().then(() => {
    //       this.editableTabs.forEach((item) => {
    //         if (item.index == 2) {
    //           this.getShowTabField(item.id, 2);
    //           return false;
    //         }
    //       });
    //     });
    //   }
    // },
    dialogVisible(val) {
      this.$emit("input", val);
    },
  },
  methods: {
    addKpiIndicators(type, item) {
      this.editItem = {};
      this.isprocessVisible = true;
      if (type === "edit") {
        this.editItem = Object.assign({}, item.row);
        this.editindex = item.$index;
      }
    },
    async getShowTablist() {
      const res = await controlField({
        attr: {},
        filters: [],
        logic: "and",
        orderby: "createon",
        pageNum: 1,
        pageSize: 100,
        sort: "desc",
      });
      this.editableTabs = [];
      res.list.forEach((item) => {
        if (item.state == "1") {
          this.editableTabs.push({
            index: parseInt(item.sort),
            name: item.name,
            enname: item.enname,
            id: item.id,
          });
        }
      });
      return new Promise((resolve, reject) => {
        resolve();
      });
    },
    // 获取显示Tab字段的名称/表格内容
    async getShowTabField(id, type) {
      const res = await tabField({
        attr: {},
        filters: [
          { key: "sheetid", opt: "LIKE", type: "S", value: id },
          { key: "type", opt: "LIKE", type: "S", value: "0" },
        ],
        logic: "and",
        orderby: "createon",
        pageNum: 1,
        pageSize: 100,
        sort: "desc",
      });
      this.showtabfiled = [];
      res.list.forEach((item) => {
        if (item.state == "1") {
          this.showtabfiled.push({
            name: item.name,
            enname: item.enname,
            pname: item.pname,
            necessary: item.necessary,
          });
        }
      });
      if (type == 0) {
        this.syslists.forEach((item) => {
          if (!this.showtabfiled.some((value, index) => value.pname == item)) {
            this.syslists.splice(this.syslists.indexOf(item), 1);
          }
        });
      }
    },
    // 判断条件
    existTabField(pname, type, bool) {
      let obj = {};
      this.showtabfiled.forEach((item) => {
        if (item.pname === pname) {
          obj = JSON.parse(JSON.stringify(item));
          return false;
        }
      });
      let lang = localStorage.getItem("language");
      if (type == "refer") {
        return !!obj.pname;
      } else if (type == "necessary") {
        return obj.necessary == "1";
      } else {
        return obj.pname && lang === "cn"
          ? obj.name + (!bool ? ":" : "")
          : obj.pname && lang === "en"
          ? obj.enname + (!bool ? ":" : "")
          : obj.enname + (!bool ? ":" : "");
      }
    },
    cancel() {
      this.dialogVisible = false;
    },
    handletargetChange(val) {
      this.seltargetlist = val;
    },
    deltarget(data) {
      this.$confirm(
        this.existTabField("areYouSureDeleteTheSelectedPerformance", "", true),
        this.$t("hintText.hint"),
        {
          confirmButtonText: this.$t("confirm"),
          cancelButtonText: this.$t("cancel"),
          type: "warning",
        }
      )
        .then(async () => {
          let res = await delTarget(data);
          this.getValuelist(this.processpages.pageNum);
          this.$message({
            type: "success",
            message: this.$t("hintText.successfullyDelete"),
          });
        })
        .catch(() => {});
    },
    deltargetMore() {
      let arr = [];
      for (let index = this.processVallist.length - 1; index >= 0; index--) {
        this.seltargetlist.forEach((ele, key) => {
          if (ele == this.processVallist[index]) {
            this.processVallist.splice(index, 1);
          }
        });
      }
    },
    deltargetOne(item) {
      this.processVallist.splice(item.$index, 1);
    },
    cancel() {
      this.editindex = "";
    },
    getValuelist(val) {
      if (this.editindex !== "") {
        // this.processVallist[this.editindex] = val;
        this.$set(this.processVallist, [this.editindex], val);
        this.editindex = "";
      } else {
        this.processVallist.push(val);
      }
      // this.processpages.total = this.processpages.length;
      // this.loading = true;
      // getprocessValue({
      //   filters: [{ key: "listid", value: this.modelid }],
      //   orderby: "createon",
      //   pageNum: !pageNum ? 1 : pageNum,
      //   pageSize: 10,
      //   sort: "desc",
      // })
      //   .then((res) => {
      //     this.loading = false;
      //     this.processVallist = res.list;
      //     this.processpages.total = res.total;
      //   })
      //   .catch(() => {
      //     this.loading = false;
      //   });
    },
    handleProcessChange(val) {
      this.processpages.pageNum = val;
      this.getValuelist(val);
    },
  },
};
</script>

<style lang="scss" scoped>
.addKpiIndexDialog {
  /deep/ .el-dialog__body {
    max-height: 60vh;
    padding: 15px;
  }
}
</style>
