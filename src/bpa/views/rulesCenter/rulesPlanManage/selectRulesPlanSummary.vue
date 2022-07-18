<template>
  <div>
    <!-- 计划汇总 -->
    <el-dialog
      :title="title ? title : '选择计划'"
      class="SelectPeople"
      :visible.sync="dialogVisible"
      append-to-body
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="60%"
      top="5vh"
    >
      <el-row :gutter="18">
        <el-col :span="24">
          <el-row class="searchIcon">
            <el-col :span="8">
              <el-input
                @keyup.enter.native="getData"
                placeholder="请输入内容"
                v-model.trim="searchName"
                class="search_component"
              >
                <el-button @click="getData" type="primary" slot="append"
                  >搜索</el-button
                >
              </el-input>
            </el-col>
          </el-row>
          <el-table
            v-if="!isMore"
            class="main_tab"
            key="0"
            :data="content.list"
            border
            :header-cell-style="{ 'text-align': 'center' }"
            style="width: 100%; margin: 10px 0"
            :highlight-current-row="highlight"
            @row-click="handleSelectedChange"
          >
            <el-table-column label="选择" width="55" align="center">
              <template slot-scope="scope">
                <el-radio v-model="selectIndex" :label="scope.$index">{{
                  ""
                }}</el-radio>
              </template>
            </el-table-column>
            <el-table-column
              label="序号"
              align="center"
              width="55"
              type="index"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column
              prop="theme"
              label="计划主题"
              align="center"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column
              prop="year"
              label="计划年度"
              width="120"
              align="left"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column
              prop="department"
              label="创建部门"
              align="center"
              width="150"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column
              prop="createby"
              label="创建人"
              align="center"
              width="150"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column
              prop="createtime"
              label="创建时间"
              align="center"
              width="150"
              show-overflow-tooltip
            ></el-table-column>
          </el-table>
          <el-table
            v-else
            class="main_tab"
            :data="content.list"
            key="1"
            border
            :header-cell-style="{ 'text-align': 'center' }"
            style="width: 100%; margin: 10px 0"
            ref="multipleTable"
            tooltip-effect="dark"
            :row-key="getRowKey"
            @selection-change="handleSelectionChange"
          >
            <el-table-column
              type="selection"
              :reserve-selection="true"
              align="center"
              width="55"
            ></el-table-column>
            <el-table-column
              label="序号"
              align="center"
              width="55"
              type="index"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column
              prop="theme"
              label="计划主题"
              align="center"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column
              prop="year"
              label="计划年度"
              align="left"
              width="120"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column
              prop="department"
              label="创建部门"
              align="center"
              width="150"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column
              prop="createby"
              label="创建人"
              align="center"
              width="150"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column
              prop="createtime"
              label="创建时间"
              align="center"
              width="150"
              show-overflow-tooltip
            ></el-table-column>
          </el-table>
          <el-pagination
            background
            v-if="content.list && content.list.length > 0"
            @current-change="handleCurrentChange"
            :page-size="pageSize"
            :current-page.sync="pageNum"
            :total="content.total"
          ></el-pagination>
        </el-col>
      </el-row>
      <div style="margin-top: 10px" v-if="radioChecked.theme && !isMore">
        <span class="checkList">
          {{ radioChecked.theme }}
          <i
            @click="close"
            v-if="isDeleteShow"
            style="margin-left: 5px; cursor: pointer; font-weight: 600"
            class="el-icon-close"
          ></i>
        </span>
      </div>
      <div style="margin-top: 10px" v-if="isMore">
        <span
          class="checkList"
          v-for="(item, index) in dataList"
          :key="index"
          style="margin: 0 10px 10px 0"
        >
          {{ item.theme }}
          <el-button
            @click="del(index)"
            v-if="isDeleteShow"
            icon="el-icon-delete"
            type="text"
            title="删除"
            style="color: #fff; margin-left: 5px"
          ></el-button>
        </span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getInstitutionQueryAllPlanList,
  getDetailByids,
  queryForTk,
} from "@/bpa/api/rulesCenter/rulesPlanManage";
import { getFormateDate } from "@/utils/common";


const delay = (function () {
  let timer = 0;
  return function (callback, ms) {
    clearTimeout(timer);
    timer = setTimeout(callback, ms);
  };
})();

export default {
  components: {},
  data() {
    return {
      dialogVisible: false,
      highlight: false,
      content: {},
      treeData: [],
      selectIndex: -1,
      pageLoading: false,
      iechoEcho: false,
      multipleSelection: [],
      dataList: [],
      pageSize: 10,
      pageNum: 1,
      searchName: "",
      checkTree: {},
      radioChecked:{}
    };
  },
  props: {
    value: {
      type: Boolean,
    },
    title: {
      type: String,
    },
    isMore: {
      type: Boolean,
    },
    isTrack: {
      type: Boolean,
    },
    isDeleteShow: {
      type: Boolean,
      default: true,
    },
    isForm: {
      type: String,
      default: "noForm",
    },
    itemList: {
      type: Array,
    },
    radioChecked: {
      type: Object,
      default() {
        return {};
      },
    },
    userAll: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  watch: {
    value(val) {
      this.dialogVisible = val;
      if (val) {
        this.searchName = "";
        this.selectIndex = -1;
        this.$nextTick(() => {
          if (this.isMore) {
            this.$refs.multipleTable.clearSelection();
          }
        });
        this.iechoEcho = true;
        this.pageNum = 1;
        this.multipleSelection = JSON.parse(JSON.stringify(this.userAll));
        this.dataList = JSON.parse(JSON.stringify(this.userAll));
        this.getData();
      } else {
        this.radioChecked = {};
        this.dataList = [];
      }
    },
    selectIndex(val) {
      if (val !== -1) {
        this.radioChecked = this.content.list[val];
      }
    },
    dialogVisible(val) {
      this.$emit("input", val);
    },
    searchName(val) {
      delay(() => {
        this.pageNum = 1;
        this.getData();
      }, 500);
    },
  },
  methods: {
    getRowKey(row) {
      return row.id;
    },
    defaultCheck() {
      if (this.radioChecked.id) {
        this.selectIndex = this.content.list.findIndex(
          (item) => item.id === this.radioChecked.id
        );
      } else {
        this.selectIndex = -1;
      }
    },
    del(index) {
      this.iechoEcho = true;
      this.content.list.forEach((e, i) => {
        if (e.id === this.dataList[index].id) {
          this.$refs.multipleTable.toggleRowSelection(e, false);
        }
      });
      this.iechoEcho = false;
      this.dataList.splice(index, 1);
      this.$forceUpdate();
    },
    mergeUser() {
      let _this = this;
      // let _ids = _this.content.list.map(item => item.id)
      let _userIds = _this.multipleSelection.map((item) => item.id);
      let _userAllIds = _this.dataList.map((item) => item.id);
      _this.multipleSelection.forEach((val) => {
        if (_userAllIds.indexOf(val.id) === -1) {
          // 如果list不存在选中的则新增
          _this.dataList.push(val);
        }
      });
      // let _list = _this.content.list.filter(item=>!_this.multipleSelection.some(ele=>ele.id!==item.id))
      // 获取未选中的listid
      let _listIds = _this.content.list
        .filter((item) => !_userIds.includes(item.id))
        .map((item) => item.id);
      // 获取未选中listid对应的obj
      let checkList = _this.dataList.filter(
        (item) => !_listIds.includes(item.id)
      );
      _this.dataList = checkList;
    },
    getData() {
      this.pageLoading = true;
      let _this = this;
      if (_this.isTrack) {
        queryForTk({
          pageNum: _this.pageNum,
          pageSize: _this.pageSize,
          logic: "and",
          attr: { jstatus: "0" },
          filters: [
            {
              key: "theme",
              opt: "LIKE",
              type: "S",
              value: this.searchName,
            },
            {
              key: "status",
              opt: "LIKE",
              type: "S",
              value: "1",
            },
          ],
        }).then((rt) => {
          _this.content = rt;
          if (_this.isMore && _this.itemList) {
            _this.check();
          }
          if (_this.isMore && _this.dataList) {
            _this.userCheck();
          }
          if (!_this.isMore && _this.radioChecked) {
            _this.defaultCheck();
          }
          _this.pageLoading = false;
        });
      } else {
        getInstitutionQueryAllPlanList({
          orderby: "createtime",
          pageNum: _this.pageNum,
          pageSize: _this.pageSize,
          sort: "desc",
          logic: "and",
          attr: { jstatus: "0" },
          filters: [
            {
              key: "theme",
              opt: "LIKE",
              type: "S",
              value: this.searchName,
            },
            {
              key: "status",
              opt: "LIKE",
              type: "S",
              value: "1",
            },
          ],
        }).then((rt) => {
          _this.content = rt;
          if (_this.isMore && _this.itemList) {
            _this.check();
          }
          if (_this.isMore && _this.dataList) {
            _this.userCheck();
          }
          if (!_this.isMore && _this.radioChecked) {
            _this.defaultCheck();
          }
          _this.pageLoading = false;
        });
      }
    },
    check() {
      let _this = this;
      this.$nextTick(() => {
        _this.content.list.forEach((item) => {
          _this.itemList.forEach((v) => {
            if (item.id === v) {
              if (_this.$refs.multipleTable) {
                _this.$refs.multipleTable.toggleRowSelection(item, true);
              }
            }
          });
        });
      });
    },
    userCheck() {
      let _this = this;
      this.iechoEcho = true;
      _this.$refs.multipleTable.clearSelection();
      this.$nextTick(() => {
        _this.content.list.forEach((item) => {
          _this.dataList.forEach((v) => {
            if (item.id === v.id) {
              if (_this.$refs.multipleTable) {
                _this.$refs.multipleTable.toggleRowSelection(item, true);
              }
            }
          });
        });
        this.iechoEcho = false;
        this.$forceUpdate();
      });
    },
    handleCurrentChange(val) {
      this.selectIndex = -1;
      this.getData();
    },
    handleSelectedChange(val) {
      if (val) {
        this.highlight = true;
        this.selectIndex = this.content.list.findIndex(
          (item) => item.id === val.id
        );
      }
    },
    handleSelectionChange(val, row) {
      if (!this.iechoEcho) {
        this.multipleSelection = val;
        this.mergeUser();
      }
    },
    close(i) {
      this.highlight = false;
      this.selectIndex = -1;
      this.radioChecked = {};
    },
    confirm() {
      if (this.isMore) {
        if (!this.dataList.map((item) => item.id).join(",")) {
          this.$message.error("请选择计划！！");
          return false;
        }
        getDetailByids(this.dataList.map((item) => item.id).join(",")).then(
          (rt) => {
            this.$emit("confirm", rt);
          }
        );
      } else {
        if (this.radioChecked.id) {
          getDetailByids(this.radioChecked.id).then((rt) => {
            this.$emit("confirm", rt);
          });
        } else {
          this.$emit("confirm", []);
        }
      }
    },
  },
};
</script>
<style lang="scss">
.SelectPeople {
  .flow-item input.el-input__inner {
    border: 1px solid $dc1;
  }
}
</style>

<style lang="scss" scoped>
.SelectPeople .checkList {
  color: #ffffff;
  background: #3792d8;
  display: inline-block;
  padding: 5px 10px;
}
// .searchIcon {
//   & /deep/ .el-input-group__append {
//     color: rgb(255, 255, 255);
//     background-color: rgb(7, 150, 249);
//     border: 0;
//   }
//   & /deep/ .el-input__inner{
//     color: #0796F9;
//     border: 1px solid #0796F9;
//     border-top-left-radius: 2px;
//   }
// }
</style>
