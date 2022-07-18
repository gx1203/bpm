<template>
  <el-dialog id="postDialog" :title="title" :visible.sync="dialogVisible" append-to-body>
    <el-form ref="item" label-width="auto">
      <el-row>
        <el-col :span="8" :offset="2">
          <el-form-item :label="$t('postGroup') + '：'">
            <el-input clearable v-model.trim="filter.serviceAttrFilter"
              :placeholder="$t('placeholderText.pleaseEnterPostGroupSearch')" />
          </el-form-item>
        </el-col>
        <el-col :span="8" :offset="2">
          <el-form-item :label="$t('businessAttributes') + '：'">
            <el-input clearable v-model.trim="filter.postGroupFilter"
              :placeholder="$t('placeholderText.pleaseEnterBusinessAttributeSearch')" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-row class="content">
      <el-tree class="elTree" style="overflow: auto;" :props="props" :data="treeData" node-key="id"
        @check-change="checkChange" :default-checked-keys="postGroupList" check-strictly
        :default-expanded-keys="expandList" show-checkbox ref="tree">
        <span class="custom-tree-node" slot-scope="{ node }">
          <span>{{ node.label }}</span>
        </span>
      </el-tree>
    </el-row>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel">{{ $t('cancelAction') }}</el-button>
      <el-button type="primary" @click="handleClick">{{ $t('confirm') }}</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { getPositionsList } from "@/bpm/api/configManage/institutionalFramework/post_manage.js";
import { getBusinessAttributeList } from "@/bpm/api/process/business/service_attribute";
export default {
  data () {
    return {
      dialogVisible: this.value,
      postGroupList: [],
      props: {
        label: "name",
        isLeaf: "isParent"
      },
      expandList: [],
      filter: {
        serviceAttrFilter: "",
        postGroupFilter: ""
      },
      treeData: [],
      dataOrigin: []
    };
  },
  components: {},
  props: {
    value: {
      type: Boolean,
      default: false
    },
    postGroupIds: {
      type: String,
      default: ""
    },
    title: {
      type: String
    }
  },
  watch: {
    value (val) {
      if (val) {
        (this.filter = {
          serviceAttrFilter: "",
          postGroupFilter: ""
        }),
          this.getDepartment();
        this.postGroupList = [];
        if (this.postGroupIds) {
          let _list = this.postGroupIds.split(",");
          _list.forEach(item => {
            if (item.indexOf("_") !== -1) {
              let str = item.split("_");
              this.postGroupList.push(str[0]);
              if (str[1].indexOf("-") !== -1) {
                str[1].split("-").forEach(val => {
                  this.postGroupList.push(str[0] + "_" + val);
                });
              } else {
                this.postGroupList.push(str[0] + "_" + str[1]);
              }
            } else {
              this.postGroupList.push(item);
            }
          });
        }
      }
      this.dialogVisible = val;
    },
    dialogVisible (val) {
      this.$emit("input", val);
    },
    filter: {
      handler (val) {
        this.filterFn();
      },
      deep: true
    }
  },
  methods: {
    filterFn () {
      this.expandList = [];
      let list = JSON.parse(JSON.stringify(this.dataOrigin));
      if (this.filter.serviceAttrFilter) {
        list = list.filter(item => {
          return item.name.indexOf(this.filter.serviceAttrFilter) !== -1;
        });
        this.expandList = list.map(item => item.id);
      }
      if (this.filter.postGroupFilter) {
        list.forEach(item => {
          item.children = item.children.filter(val => {
            return val.name.indexOf(this.filter.postGroupFilter) !== -1;
          });
        });
        this.expandList = list.map(item => item.id);
      }
      this.treeData = list;
    },
    cancel () {
      this.dialogVisible = false;
    },
    clickRadioNode (event) {
      if (event) event.preventDefault();
    },
    checkChange (data, bool) {
      if (!bool && !data.pid) {
        this.$refs.tree.getCheckedNodes().forEach(item => {
          if (data.id === item.pid) {
            this.$refs.tree.setChecked(data.id + "_" + item.fieldvalue, false);
          }
        });
      }
      let _bool = false;
      this.$refs.tree.getCheckedNodes().forEach(item => {
        if (item.pid === data.pid) {
          _bool = true;
        }
      });
      this.$refs.tree.setChecked(data.pid, _bool);
    },
    filterNode (value, data, node) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    getDepartment () {
      getPositionsList({
        attr: { userId: "test02" },
        filters: [],
        logic: "and",
        pageNum: 1,
        pageSize: 10000,
      })
        .then(rtList => {
          getBusinessAttributeList({
            logic: "and",
            filters: [{ key: "type", opt: "LIKE", type: "S", value: "0" }],
            pageNum: 1,
        pageSize: 10000,
          }).then(rt => {
            rtList.data.list.forEach(item => {
              let list = [];
              JSON.parse(JSON.stringify(rt.data.list)).forEach(element => {
                element.name = element.fieldname;
                element.pid = item.id;
                element._id = element.id;
                element.id = item.id + "_" + element.fieldvalue;
                element.pname = item.name;
                element.isParent = true;
                list.push(element);
              });
              item.children = list;
            });
            this.dataOrigin = JSON.parse(JSON.stringify(rtList.data.list));
            this.treeData = rtList.data.list;
          });
        })
        .catch(er => {
          console.log(er);
        });
    },
    handleClick (data) {
      this.$emit("confirm", this.$refs.tree.getCheckedNodes());
    }
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
<style lang="scss">
</style>
