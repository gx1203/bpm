<template>
<div id="treeOrganization">
    <el-input clearable
      :placeholder="$t('placeholderText.enterKeywordsFiltering')"
      v-model="filterText">
    </el-input>
    <div class="treeWrap" style="margin-top: 10px;">
      <el-tree class="elTree"
        style="height:calc(100% - 28px);overflow: auto;"
        :props="props"
        :data="treeData"
        :load="loadNode"
        lazy
        node-key="id"
        :expand-on-click-node="false"
        @node-click='handleClick'
        :default-expanded-keys="defaultExpandedKeys"
        :filter-node-method="filterNode"
        ref="tree">
        <div class="custom-tree-node" slot-scope="{ node, data}">
          <div class="grow" :title="node.label">
            <i v-if="data.type === '1'" class="iconfont icon-leimupinleifenleileibie"></i>
            <i v-else-if="data.type === '2'" class="iconfont icon-jiedianbangzhu"></i>
           {{ node.label }}</div>
           <el-button v-if="data.type === '1' && isReadonly" @click.stop="add(data, $t('classify'))" type="text" class="iconShow" icon="el-icon-folder-add" :title="$t('addCategory')"></el-button>
           <el-button v-if="data.type === '1' && isReadonly" @click.stop="add(data, $t('businessRule'))" type="text" class="iconShow" icon="el-icon-circle-plus-outline" :title="$t('addBusinessRules')"></el-button>
           <el-button v-if="data.type === '1' && node.level !== 1 && isReadonly" @click.stop="remove(data)" type="text" class="iconShow" icon="el-icon-delete" :title="$t('deleteCategoryAndAllBusinessRulesUnderCategory')"></el-button>
           <el-button v-if="data.type === '1' && isReadonly" @click.stop="edit(data, $t('classify'))" type="text" class="iconShow" icon="el-icon-edit" :title="$t('edit')"></el-button>
           <el-button v-if="data.type === '2' && isReadonly" @click.stop="remove(data)" type="text" class="iconShow" icon="el-icon-delete" :title="$t('deleteCurrentBusinessRules')"></el-button>
        </div>
        <!-- <div class="custom-tree-node" slot-scope="{ node, data}">
          <div class="grow" :title="node.lable">
            <i v-if="data.type === '1'" class="iconfont icon-leimupinleifenleileibie"></i>
          <i v-else-if="data.type === '2'" class="iconfont icon-jiedianbangzhu"></i>
          {{ node.label }}</div>
          <el-button v-if="data.type === '1' && isReadonly" @click.stop="add(data, $t('classify'))" type="text" class="iconShow" icon="el-icon-folder-add" :title="$t('addCategory')"></el-button>
          <el-button v-if="data.type === '1' && isReadonly" @click.stop="add(data, $t('businessRule'))" type="text" class="iconShow" icon="el-icon-circle-plus-outline" :title="$t('addBusinessRules')"></el-button>
          <el-button v-if="data.type === '1' && node.level !== 1 && isReadonly" @click.stop="remove(data)" type="text" class="iconShow" icon="el-icon-delete" :title="$t('deleteCategoryAndAllBusinessRulesUnderCategory')"></el-button>
          <el-button v-if="data.type === '1' && isReadonly" @click.stop="edit(data, $t('classify'))" type="text" class="iconShow" icon="el-icon-edit" :title="$t('edit')"></el-button>
          <el-button v-if="data.type === '2' && isReadonly" @click.stop="remove(data)" type="text" class="iconShow" icon="el-icon-delete" :title="$t('deleteCurrentBusinessRules')"></el-button>
        </div> -->
      </el-tree>
    </div>
    <addOrg v-model="visible" :title="title" :item="addData" @confirm="getTableData" />
  </div>
</template>

<script>
import { getBrTree, deleteControl, getBrRecyTree } from '../../api/confinBusinessRule'
import addOrg from './addOrg'
import { createNamespacedHelpers } from "vuex";
const { mapMutations, mapGetters } = createNamespacedHelpers("processDesign");
export default {
  components: {
    addOrg
  },
  computed: {
    ...mapGetters(["processData"])
  },
  data () {
    return {
      props: {
        label: 'name',
        isLeaf: 'isParent'
      },
      defaultExpandedKeys: [],
      treeData: [],
      filterText: '',
      radioNode: '',
      visible: false,
      title: '',
      addData: {},
      isReadonly: this.$route.query.type === 'edit' || this.type === 'edit'
    }
  },
  props: {
    isRef: {
      type: Boolean
    },
    type:{
      type: String,
      default:''
    }
  },
  watch: {
    filterText (val) {
      this.$refs.tree.filter(val)
    },
    isRef (val) {
      this.getDepartment()
    }
  },
  mounted () {
    this.getDepartment()
  },
  methods: {
    add (data, type) {
      this.addData = {
        pid: data.id,
        processId: this.$route.query.processId? this.$route.query.processId:this.processData.id,
        type: type === this.$t('classify') ? '1' : '2',
        version: this.$route.query.version || this.$route.query.version === '' ? this.$route.query.version : this.processData.version
      }
      this.title = type
      this.visible = true
    },
    edit (data, type) {
      data.processId = this.$route.query.processId? this.$route.query.processId:this.processData.id
      data.version = this.$route.query.version || this.$route.query.version === '' ? this.$route.query.version : this.processData.version
      this.addData = Object.assign({}, data)
      this.title = type
      this.visible = true
    },
    remove (data) {
      // this.$confirm(`您确定要删除${data.name}吗?`, this.$t('hintText.hint'), {
      this.$confirm(this.$t('hintText.areYouSureDelete'), this.$t('hintText.hint'), {
        type: 'warning'
      }).then(() => {
        let canshu = `${data.id}?userId=${this.$store.state.basuser.user.id}&type=3`
        deleteControl(canshu).then((rt) => {
          if (rt.status === '200') {
            this.$message.success(this.$t('hintText.operateSuccessfully'))
            this.getDepartment()
            this.$emit('removeOrg')
          }
        })
      }).catch(_ => {})
    },
    clickRadioNode (event) {
      if (event) event.preventDefault()
    },
    filterNode (value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    getDepartment () {
      if (this.isReadonly) {
        getBrTree({
          'pid': 0,
          'processId': this.$route.query.processId? this.$route.query.processId:this.processData.id,
          version: this.$route.query.version || this.$route.query.version === '' ? this.$route.query.version : this.processData.version
        }).then((rt) => {
          rt.data.forEach(item => {
            item.isParent = !this.toBoolean(item.isParent)
          })
          this.treeData = rt.data
          this.defaultExpandedKeys = this.treeData.map(item => item.id)
          if (!this.$route.query.brid) {
            this.$emit('confirm', this.treeData[0])
          }
        }).catch((er) => {
          console.log(er)
        })
      } else {
        getBrRecyTree({
          'pid': 0,
          'processId': this.$route.query.processId? this.$route.query.processId:this.processData.id
        }).then((rt) => {
          rt.data.forEach(item => {
            item.isParent = !this.toBoolean(item.isParent)
          })
          this.treeData = rt.data
          if (!this.$route.query.brid) {
            this.$emit('confirm', this.treeData[0])
          }
        }).catch((er) => {
          console.log(er)
        })
      }
    },
    toBoolean (val) {
      switch (val.toLowerCase()) {
        case 'y': case 1: case 'yes': return true
        case 'n': case 0: case 'no': case null: return false
        default:return Boolean(val)
      }
    },
    loadNode (node, resolve) {
      if (node.level > 0) {
        if (this.isReadonly) {
          getBrTree({
            'pid': node.data.id,
            'processId': this.$route.query.processId? this.$route.query.processId:this.processData.id,
            version: this.$route.query.version || this.$route.query.version === '' ? this.$route.query.version : this.processData.version
          }).then((rt) => {
            rt.data.forEach(item => {
              item.isParent = !this.toBoolean(item.isParent)
            })
            resolve(rt.data)
          }).catch((er) => {
            console.log(er)
          })
        } else {
          getBrRecyTree({
            'pid': node.data.id,
            'processId': this.$route.query.processId? this.$route.query.processId:this.processData.id
          }).then((rt) => {
            rt.data.forEach(item => {
              item.isParent = !this.toBoolean(item.isParent)
            })
            resolve(rt.data)
          }).catch((er) => {
            console.log(er)
          })
        }
      }
    },
    handleClick (data, node) {
      this.$emit('confirm', data)
    },
    getTableData(val) {
      this.getDepartment()
    }
  }
}
</script>
<style lang="scss">
#treeOrganization {
  .el-input__inner{
    border: none;
    border-bottom: 1px solid $dc1;
  }
}
</style>

<style lang="scss" scoped>
.custom-tree-node {
  display: flex;
  flex: 1;
  align-items: center;
  box-sizing: border-box;
  .grow {
    flex: 1;
    max-width: 120px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .iconShow {
    color: $tc5;
    padding: 5px;
    display: none;
    &:hover {
      background: $dc1;
    }
  }
  &:hover {
    .iconShow {
      display: inherit;
    }
  }
  .el-button + .el-button{
    margin-left: 0;
  }
}
</style>
