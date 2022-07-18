<template>
  <el-dialog id="postDialog" :title="title" :visible.sync="dialogVisible" append-to-body>
    <el-row class="content">
      <el-tree class="elTree" style="overflow: auto;" :props="props" :data="treeData" node-key="id"
        @check-change="checkChange" :default-checked-keys="businessRoleList" :filter-node-method="filterNode"
        :check-strictly='true' show-checkbox ref="tree">
        <span class="custom-tree-node" slot-scope="{ node}">
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
import { getMiddleList, getMiddleById } from '@/bpm/api/process/business/business_role.js'

export default {
  data () {
    return {
      dialogVisible: this.value,
      businessRoleList: [],
      props: {
        label: 'tablename'
      },
      treeData: []
    }
  },
  components: {},
  props: {
    value: {
      type: Boolean,
      default: false
    },
    businessRoleIds: {
      type: String,
      default: ''
    },
    title: {
      type: String
    }
  },
  watch: {
    value (val) {
      if (val) {
        this.getDepartment()
        this.businessRoleList = []
        if (this.businessRoleIds) {
          let _list = this.businessRoleIds.split(',')
          _list.forEach(item => {
            if (item.indexOf('_') !== -1) {
              let str = item.split('_')
              this.businessRoleList.push(str[0])
              if (str[1].indexOf('-') !== -1) {
                str[1].split('-').forEach(val => {
                  this.businessRoleList.push(str[0] + '_' + val)
                })
              } else {
                this.businessRoleList.push(str[0] + '_' + str[1])
              }
            } else {
              this.businessRoleList.push(item)
            }
          })
        }
      }
      this.dialogVisible = val
    },
    dialogVisible (val) {
      this.$emit('input', val)
    }
  },
  methods: {
    checkChange (data, bool) {
      if (!bool && !data.pid) {
        this.$refs.tree.getCheckedNodes().forEach(item => {
          if (data.id === item.pid) {
            this.$refs.tree.setChecked(data.id + '_' + item.fieldvalue, false)
          }
        })
      }
      let _bool = false
      this.$refs.tree.getCheckedNodes().forEach(item => {
        if (item.pid === data.pid) {
          _bool = true
        }
      })
      this.$refs.tree.setChecked(data.pid, _bool)
    },
    cancel () {
      this.dialogVisible = false
    },
    clickRadioNode (event) {
      if (event) event.preventDefault()
    },
    filterNode (value, data) {
      if (!value) return true
      return data.NAME.indexOf(value) !== -1
    },
    getDepartment () {
      getMiddleList({
        filters: [],
        logic: 'and'
      }).then((rt) => {
        rt.data.list.forEach(item => {
          item.name = item.tablename
          item.children = JSON.parse(JSON.stringify(item.roles))
          item.children.forEach(element => {
            element.tablename = element.fieldname
            element.name = element.tablename
            element.pid = item.id
            element._id = element.id
            element.id = item.id + '_' + element.fieldvalue
            element.pname = item.tablename
          })
        })
        this.treeData = rt.data.list
      }).catch((er) => {
        console.log(er)
      })
    },
    handleClick (data) {
      this.$emit('confirm', this.$refs.tree.getCheckedNodes())
    }
  }
}
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
#postDialog {
  .avatar-uploader .el-upload {
    border: 1px dashed $dc1;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
}
</style>
