<template>
  <div>
    <div style="width:88%" class="ip-tree float-l">
      <el-input clearable v-model="filterText" placeholder="输入关键字进行过滤" size="small" />
      <el-tree
        ref="tree"
        :data="protaltree"
        :props="defaultProps"
        :filter-node-method="filterNode"
        :expand-on-click-node="false"
        :render-content="renderContent"
        class="filter-tree"
        @node-click="handleNodeClick"
      />
    </div>
    <!-- 添加节点对话框 -->
    <el-dialog :visible.sync="dialogVisible" title="添加" width="30%">
      <span>
        <el-form
          ref="ruleForm"
          :model="ruleForm"
          :rules="rules"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="上级节点" prop="name1">
            <el-input clearable v-model="ruleForm.name1" size="small" disabled class="el-inputs" />
          </el-form-item>
          <el-form-item label="节点名称" prop="name2">
            <el-input clearable v-model="ruleForm.name2" size="small" class="el-inputs" placeholder="输入节点名称" />
          </el-form-item>
        </el-form>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="resetForm('ruleForm')">{{$t("cancel")}}</el-button>
        <el-button size="small" type="primary" @click="submitForm('ruleForm')">{{$t("confirm")}}</el-button>
      </span>
    </el-dialog>
    <!-- 修改节点对话框 -->
    <el-dialog :visible.sync="dialogVisible1" title="修改" width="30%">
      <span>
        <el-form
          ref="ruleForm1"
          :model="ruleForm1"
          :rules="rules1"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="节点名称" prop="name1">
            <el-input clearable
              v-model="ruleForm1.name1"
              size="small"
              class="el-inputs"
              placeholder="输入节点名称"
            />
          </el-form-item>
        </el-form>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogVisible1 = false">{{$t("cancel")}}</el-button>
        <el-button size="small" type="primary" @click="dialogVisible1 = false">{{$t("confirm")}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'ProtalTree',
  props: {},
  data() {
    return {
      isShow: '',
      filterText: '',
      isActive: '',
      datalist: '',
      childform: {
        name: '',
        type: '',
        id: ''
      },
      dialogVisible: false,
      dialogVisible1: false,
      protaltree: [
        {
          id: 10000001,
          pid: 1,
          dataid: 1,
          companycode: '101',
          name: '旺旺集团有限公司1',
          pcode: '201',
          treecode: '001001003001',
          type: '1',
          children: [
            {
              id: 20000001,
              pid: 2,
              dataid: 2,
              companycode: '102',
              name: '财务部',
              pcode: '202',
              treecode: '001001003001',
              type: '2',
              children: [
                {
                  id: 30000001,
                  pid: 3,
                  dataid: 3,
                  companycode: '103',
                  name: '小强',
                  pcode: '203',
                  treecode: '001001003001',
                  type: '3'
                }
              ]
            }
          ]
        },
        {
          id: 10000001,
          pid: 1,
          dataid: 1,
          companycode: '101',
          name: '旺旺集团有限公司2',
          pcode: '201',
          treecode: '001001003001',
          type: '1',
          children: [
            {
              id: 20000001,
              pid: 2,
              dataid: 2,
              companycode: '102',
              name: '财务部',
              pcode: '202',
              treecode: '001001003001',
              type: '2',
              children: [
                {
                  id: 30000001,
                  pid: 3,
                  dataid: 3,
                  companycode: '103',
                  name: '小强',
                  pcode: '203',
                  treecode: '001001003001',
                  type: '3'
                }
              ]
            }
          ]
        },
        {
          id: 10000001,
          pid: 1,
          dataid: 1,
          companycode: '101',
          name: '旺旺集团有限公司3',
          pcode: '201',
          treecode: '001001003001',
          type: '1',
          children: [
            {
              id: 20000001,
              pid: 2,
              dataid: 2,
              companycode: '102',
              name: '财务部',
              pcode: '202',
              treecode: '001001003001',
              type: '2',
              children: [
                {
                  id: 30000001,
                  pid: 3,
                  dataid: 3,
                  companycode: '103',
                  name: '小强',
                  pcode: '203',
                  treecode: '001001003001',
                  type: '3'
                }
              ]
            }
          ]
        }
      ],
      ruleForm: {
        name1: '',
        name2: ''
      },
      ruleForm1: {
        name1: ''
      },
      rules: {
        name1: [{ required: false, message: '', trigger: 'blur' }],
        name2: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ]
      },
      rules1: {
        name1: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ]
      },
      defaultProps: {
        children: 'children',
        label: 'name'
      }
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  methods: {
    // 过滤
    filterNode(value, data) {
      console.log(value, data)
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    // 树渲染
    renderContent(h, { node, data, store, index }) {
      if (data.type !== '3') {
        return (
          <span class='custom-tree-node'>
            <span
              class={
                this.isActive === data.id
                  ? 'custom-tree-title ipchoosecolor'
                  : 'custom-tree-title'
              }
              on-click={() => {
                this.append(data)
              }}
            >
              {data.name}
            </span>
            <span>
              <i
                class='el-icon-circle-plus-outline iplus'
                title='添加子分类'
                on-click={() => this.addchildcata(data)}
              ></i>
              <i
                class='el-icon-remove-outline iplus iremove'
                title='删除'
                on-click={() => this.delchildcata(node, data)}
              ></i>
              <i
                class='el-icon-edit iplus amend'
                title='编辑'
                on-click={() => this.amendchildcata(node, data)}
              ></i>
            </span>
          </span>
        )
      } else {
        return (
          <span class='custom-tree-node'>
            <span
              class={
                this.isActive === data.id
                  ? 'custom-tree-title ipchoosecolor'
                  : 'custom-tree-title'
              }
              on-click={() => {
                this.append(data)
              }}
            >
              {data.name}
            </span>
            <span>
              <i
                class='el-icon-remove-outline iplus iremove'
                title='删除分类'
                on-click={() => this.delchildcata(node, data)}
              ></i>
              <i
                class='el-icon-edit iplus amend'
                title='编辑'
                on-click={() => this.amendchildcata(node, data)}
              ></i>
            </span>
          </span>
        )
      }
    },
    // 添加子分类
    addchildcata(data) {
      this.dialogVisible = true
      this.childform = data
      this.ruleForm.name1 = data.name
      if (data.type === '1') {
        this.isShow = false
      } else {
        this.isShow = true
      }
    },
    // 修改分类
    amendchildcata(node, data) {
      console.log(node, data)
      this.dialogVisible1 = true
      this.ruleForm1.name1 = data.name
    },
    // 删除分类
    delchildcata(node, data) {
      console.log(data)
      const mydata = data
      const mynode = node
      this.$confirm(this.$t('hintText.areYouSureDelete'), this.$t('hintText.hint'), {
        confirmButtonText: this.$t('confirm'),
        cancelButtonText: this.$t('cancel'),
        type: 'warning'
      })
        .then(() => {
          console.log(mydata)
          this.remove(mynode, mydata)
          //   delcategory({
          //     goodsCategoryid: data.id
          //   })
          //     .then(rt => {
          //       this.$message.success(rt.message);
          //     })
          //     .catch(err => {
          //       console.log(err);
          //       this.$message.erroe(rt.message);
          //     });
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 树删除节点
    remove(node, data) {
      const parent = node.parent
      const children = parent.data.children || parent.data
      const index = children.findIndex(d => d.id === data.id)
      children.splice(index, 1)
    },
    // 当前商品分类所属类别
    append(data) {
      console.log(data)
      //   const newChild = { id: id++, name: 'testtest', children: [] }
      //   if (!this.childform.children) {
      //     this.$set(this.childform, 'children', [])
      //   }
      //   this.childform.children.push(newChild)
    },
    // 保存添加节点
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          console.log('submit!')
          //   this.append(this.ruleForm)
          this.dialogVisible = false
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 取消
    resetForm(formName) {
      this.dialogVisible = false
      this.$refs[formName].resetFields()
    },
    handleNodeClick(data) {
      console.log(data)
      this.datalist = data.name
    }
  }
}
</script>
<style scoped>
.ip-tree {
  border: 1px solid #e4e7ed;
  padding: 10px;
  font-size: 14px;
  margin-top: 20px;
}
.filter-tree {
  margin-top: 5px;
}
.ip-tree >>> .custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
.ip-tree >>> .iplus {
  font-weight: 600;
  font-size: 16px;
  color: #07de05;
  margin-right: 2px;
}
.ip-tree >>> .iremove {
  color: #f56c6c;
}
.ip-tree >>> .amend {
  color: #199edb;
}
.ip-tree >>> .custom-tree-title {
  display: inline-block;
  width: 180px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.ip-tree >>> .ipchoosecolor {
  color: #409eff;
}
.el-inputs {
  width: 80%;
}
.el-form-item {
  margin-bottom: 15px;
}
</style>
