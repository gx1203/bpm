<template>
  <div class="w100">
    <el-dialog
      class="distribution"
      :visible.sync="isDialogsVisible"
      title="选择组织"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-row :gutter="20">
        <el-col :span="16" class="tree_wrap">
          <el-row>
            <el-input
              v-model="filterText"
              :placeholder="$t('placeholderText.pleaseEnterTheContent')"
              class="search_component remove-margin-b"
              clearable
              @keyup.13.native="abstractSearch"
            >
              <el-button slot="append" type="primary" @click="abstractSearch">
                {{ $t("search") }}
              </el-button>
            </el-input>
          </el-row>
        </el-col>
      </el-row>
      <el-scrollbar class="h300px">
        <ul v-if="!isSearch" id="chooserOrganizationTree" class="ztree left" />
        <ul v-if="isSearch" id="searchOrganizationTree" class="ztree left" />
      </el-scrollbar>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isDialogsVisible = false">{{
          $t("cancel")
        }}</el-button>
        <el-button type="primary" @click="confirmChoose">{{
          $t("confirm")
        }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getGroupTreeList } from "@/bpa/api/componentsApi";
import { abstractSearch } from "@/bpa/api/jobsCenter";
export default {
   props:{
      disData:{
        type:Object,
        default:()=>{}
      } 
    },
  data() {
    const self = this;
    const url = process.env.VUE_APP_HOST_URL + process.env.VUE_APP_BASE_URL;
   
    return {
      isDialogsVisible: false,
      sendState: "",
      orginalChecktion: [],
      settings: {
        async: {
          enable: true,
          contentType: "application/json",
          otherParam: self.ajaxFun,
          url: url + "/select/user/cqp/getTotalOrg1?username=" + userId,
        },
        check: {
          enable: true, // true / false 分别表示 显示 / 不显示 复选框或单选框
          chkboxType: { Y: "ps", N: "ps" },
          nocheckInherit: false,
          autoCheckTrigger: false,
        },
        data: {
          key: {
            name: "name",
          },
          simpleData: {
            enable: true,
            idKey: "id",
            pIdKey: "pid",
            rootPId: 0,
          },
        },
        view: {
          showIcon: false,
        },
        
        callback: {
          onNodeCreated: self.onNodeCreated,
          beforeCheck: self.beforeCheck,
          onCheck: self.onCheck,
          onExpand: self.onExpand,
        },
      },
      searchSettings: {
        async: {
          enable: true,
          contentType: "application/json",
          otherParam: self.ajaxFun,
          url:
            url + "/select/user/cqp/getTotalOrgByNameCopy?username=" + userId,
        },
        check: {
          enable: true, // true / false 分别表示 显示 / 不显示 复选框或单选框
          chkboxType: { Y: "ps", N: "ps" },
          nocheckInherit: false,
          autoCheckTrigger: false,
        },
        data: {
          key: {
            name: "name",
            children: "subNodes",
          },
          simpleData: {
            enable: true,
            idKey: "id",
            pIdKey: "pid",
            rootPId: 0,
          },
        },
        view: {
          showIcon: false,
        },
        callback: {
          onCheck: self.onSearchCheck,
        },
      },
      filterText: "",
      isSearch: false,
      firstZTreeData: [],
    };
  },
  methods: {
    getrequireTree() {
      getGroupTreeList({
        pid: 0,
        type: "0,1,2,4",
      }).then((res) => {
        console.log(res)
      });
    },
  },
};
</script>