<template>
  <el-dialog
    :title="selectOrganizational"
    class="person_list"
    :visible.sync="dialogVisible"
    width="70%"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    append-to-body
  >
    <el-row :gutter="20" class="group_container">
      <el-col :span="9" class="tree_wrap">
        <el-scrollbar class="tree_node">
          <el-tree
            :props="props"
            :load="getFilterTreeList"
            show-checkbox
            check-strictly
            node-key="id"
            ref="groupTree"
            :default-expanded-keys="[grandParentId]"
            :default-checked-keys="expandList"
            :expand-on-click-node="false"
            @node-click="handlerNodeClick"
            @check-change="handlerNodeChecked"
            :key="countKey"
            lazy
          ></el-tree>
        </el-scrollbar>
      </el-col>
      <el-col :span="15">
        <el-row>
          <el-col :span="24">
            <el-input
              clearable
              :placeholder="pleaseEnterTheContent"
              :title="pleaseEnterTheContent"
              class="search_component"
              v-model="keyWords"
              @keyup.13.native="singleSearch"
            >
              <el-button type="primary" slot="append" @click="singleSearch">{{$t('search')}}</el-button>
            </el-input>
          </el-col>
        </el-row>
        <el-table :data="userList" class="main_tab">
          <el-table-column :label="number" type="index"></el-table-column>
          <el-table-column prop="name" :label="name"></el-table-column>
          <el-table-column prop="memberId" :label="account"></el-table-column>
          <el-table-column prop="email" :label="email"></el-table-column>
        </el-table>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pages.pageNum"
          :page-size="pages.pageSize"
          :pager-count="5"
          background
          layout="prev, pager, next, jumper, total"
          :total="pages.total"
        ></el-pagination>
      </el-col>
    </el-row>
    <div class="selected_list">
      <div class="selected_item" v-for="(item,index) in selectedList" :key="index">
        <span class="name">{{item.name}}</span>
        <i @click="deleteSelectedItem(item.id, 'delete')" class="el-icon-close"></i>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancelConfirmDialog">{{$t("cancel")}}</el-button>
      <el-button type="primary" @click="handlerConfirmDialog">{{$t("confirm")}}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getUserList, requireChecked } from "@/bpa/api/componentsApi";
import { getTreeList } from "@/bpa/api/settings/groupManage";

import paginations from "@/bpa/mixins/pagination_mixin.js";
export default {
  name: "SelectIframe",
  data() {
    let _this = this;
    return {
      countKey: 1,
      userList: [],
      keyWords: "",
      selectedList: [],
      selected: [],
      grandParentId: "",
      expandList: [],
      pages: {
        pageSize: 10,
        pageNum: 1,
        total: 0
      },
      times: 0,
      dialogVisible: false,
      orgid: "",
      props: {
        label: "name",
        children: "childList",
        disabled: function(data, node) {
          if (_this.selectTree.indexOf(data.type) > -1) {
            return false;
          }
          return true;
        },
        isLeaf: function(data, node) {
          if (data.isParent === "true") {
            return false;
          } else {
            return true;
          }
        }
      },

      isFirst: true,
      node: "",
      resolve: "",
      selectOrganizational: this.$t("selectOrganizational"),
      pleaseEnterTheContent: this.$t("placeholderText.pleaseEnterTheContent"),
      number: this.$t("number"),
      name: this.$t("name"),
      account: this.$t("account"),
      email: this.$t("email")
    };
  },
  mixins: [paginations],
  props: {
    value: {
      type: Boolean,
      default: false
    },
    // selected: {
    //   type: Array,
    //   default: () => []
    // },
    frameworkId: {
      type: String
    },
    /**
     * 需要选择什么type类型的组织树,比如选择岗位则传['3']等
     * */
    selectTree: {
      type: Array,
      default: () => []
    },
    /**
     * 请求组织树
     * 0代表组织树的根部,1代表公司, 2代表部门, 3代表岗位, 4代表科与组
     * */
    showTree: {
      type: String,
      default: "1,2,3,4"
    }
  },
  watch: {
    value(val) {
      console.log("初始化数据");
      this.dialogVisible = val;
      //  禁掉了，点击确认或取消后 会把选中的数组的第一位删掉了
      // this.$nextTick(() => {
      //   this.$refs.groupTree.setCheckedNodes([])
      // })
      if (val) {
        requireChecked(this.frameworkId).then(res => {
          this.countKey++;
          this.expandList = [];
          this.selected = res.map(item => {
            let obj = {};
            for (let i in item) {
              let str = i.toLowerCase();
              obj[str] = item[i];
            }
            this.expandList.push(obj.id);
            obj.id = parseInt(item.id);
            return obj;
          });
          this.selectedList = JSON.parse(JSON.stringify(this.selected));
        });
      }
    },
    dialogVisible(val) {
      this.$emit("input", val);
      // 关闭组件时，清空树内容，下次打开组件才会重新加载内容
      if (!this.isFirst) {
        this.node.childNodes = [];
        this.getFilterTreeList(this.node, this.resolve);
      }
    }
  },
  mounted() {},
  methods: {
    getFilterTreeList(node, resolve) {
      let id = node.data ? node.data.id : "0";
      getTreeList(id).then(res => {
        if (id === "0") {
          this.grandParentId = res[0].id;
          this.orgid = this.grandParentId;
          this.getList();
        }
        resolve(res);
      });
    },
    // 获取使用者的列表
    getList() {
      getUserList({
        attr: { orgid: this.orgid },
        orderby: "",
        pageNum: this.pages.pageNum,
        pageSize: this.pages.pageSize,
        sort: "desc",
        logic: "or",
        filters: [
          { key: "cnname", opt: "LIKE", type: "S", value: this.keyWords },
          { key: "empuid", opt: "LIKE", type: "S", value: this.keyWords }
        ]
      }).then(res => {
        this.userList = res.list;
        this.pages.total = res.total;
      });
    },
    // 节点的点击事件
    handlerNodeClick(data, node) {
      this.orgid = data.id;
      this.getList();
    },
    handlerNodeChecked(item, isChecked) {
      console.log(
        "勾选操作",
        item,
        isChecked,
        this.expandList,
        this.$refs.groupTree
          .getHalfCheckedKeys()
          .concat(this.$refs.groupTree.getCheckedKeys())
      );
      if (isChecked) {
        getUserList({
          attr: { orgid: item.id },
          orderby: "",
          pageNum: this.pages.pageNum,
          pageSize: this.pages.pageSize,
          sort: "desc",
          logic: "or",
          filters: [
            { key: "cnname", opt: "LIKE", type: "S", value: this.keyWords },
            { key: "empuid", opt: "LIKE", type: "S", value: this.keyWords }
          ]
        }).then(res => {
          this.userList = res.list;
          this.pages.total = res.total;
          item.person = this.userList.length ? this.userList[0] : {};
          let count = 0;
          this.selectedList.forEach(val => {
            if (item.id == val.id) {
              count++;
              return false;
            }
          });
          if (!count) {
            this.selectedList.push(item);
          }
        });
      } else {
        this.deleteSelectedItem(item.id, "noChecked");
      }
    },
    // 取消选中事件
    deleteSelectedItem(id, type) {
      // this.$refs.groupTree.setCheckedKeys([id])
      for (let i = 0; i < this.selectedList.length; i++) {
        if (this.selectedList[i].id == id) {
          this.selectedList.splice(i, 1);
          break;
        }
      }
      if (type === "delete") {
        this.$nextTick(function() {
          if (this.selectedList.length === 0) {
            this.$refs.groupTree.setCheckedNodes([]);
          } else {
            this.$refs.groupTree.setCheckedNodes(this.selectedList);
          }
        });
      }
    },
    // 确定的点击事件
    handlerConfirmDialog() {
      let temp = [];
      this.selectedList.forEach(item => {
        let obj = {};
        for (let i in item) {
          let str = i.toLowerCase();
          obj[str] = item[i];
        }
        temp.push(obj);
      });
      this.$emit("confirm", temp);
      this.dialogVisible = false;
      this.selectedList = "";
    },
    // 取消
    cancelConfirmDialog() {
      this.dialogVisible = false;
      this.selectedList = "";
    }
  }
};
</script>

<style lang="scss" scoped>
.tree_node {
  height: 487px;
}
.selected_list {
  margin-top: 10px;
  &::after {
    content: "";
    display: block;
    clear: both;
  }
  .selected_item {
    float: left;
    padding: 4px 6px;
    background: $active-color;
    border-radius: 3px;
    margin-right: 5px;
    margin-bottom: 5px;
    .name {
      color: #fff;
      font-size: 12px;
      display: inline-block;
      vertical-align: middle;
    }
    i {
      font-size: 12px;
      color: #fff;
      cursor: pointer;
      display: inline-block;
      vertical-align: middle;
    }
    &:after {
      content: "";
      display: inline-block;
      height: 100%;
      vertical-align: middle;
    }
  }
}
</style>
