<template>
  <el-dialog :title="title" :visible.sync="dialogVisible"  top="15px" append-to-body class="BasNavigationSelect bas">
    <div class="content">
        <el-tree
            class="elTree"
            :props="props"
            :data="treeData"
            show-checkbox
            :load="loadNode"
            style="height:calc(100% - 28px);overflow: auto;"
            lazy
            node-key="id"
            check-strictly
            :expand-on-click-node="false"
            @check-change="fnCheckChange"
            :filter-node-method="filterNode"
            :default-checked-keys="defaultCheckedKeys"
            ref="tree"
        >
        </el-tree>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel">{{ $t('cancelAction') }}</el-button>
      <el-button type="primary" @click="submit()">{{ $t('confirm') }}</el-button>
    </span>
  </el-dialog>
</template>
<script>
export default {
  name:'BasNavigationSelect',
  data () {
    return {
      dialogVisible: false,
      loading: false,
      title:'选择菜单',
      props: {
        label: "name",
        isLeaf: "isParent"
      },
      treeData: [],
      defaultCheckedKeys:[],
      treeDataUrl:'/navigation/get/',
      getSubTreeUrl:'/navigation/getSubTree/',
      newSelectedList:[]
    }
  },
  props: {
    value: {
      type: Boolean
    },
    multiple:{
      type: Boolean,
      default: true
    }
  },
  watch: {
    value(val) {
      this.dialogVisible = val;
      this.initParams()
    },
    dialogVisible(val) {
      this.$emit("input", val);
    },
  },
  methods: {
    initParams(){
      this.newSelectedList = []
      if(this.treeData.length===0){
        // 原来 id 是 0，但是没有数据，目前改为 1
        this.fnGetTreeData(1)
      }else{
        this.$refs.tree.setCheckedKeys([]);
      }
    },
    submit () {
      if(!this.multiple){
        if(this.newSelectedList.length>1){
          this.$message.error(this.$t("theCurrentOptionIsSingle") + "！！");
          return ;
        }
      }
      let result = []
      for(let i = 0 ; i < this.newSelectedList.length ; i++ ){
        result.push({
          id:this.newSelectedList[i].id,
          name:this.newSelectedList[i].name,
          url:this.newSelectedList[i].url
        })
      }
      this.$emit("callBack", result);
      this.dialogVisible = false
    },
    cancel () {
      this.dialogVisible = false
    },
    loadNode(node, resolve) {
      if (node.level > 0) {
        this.$http({
            url: this.getSubTreeUrl+node.data.id+'/default',
            method: "GET",
            data: {}
        })
        .then(rt => {
             rt.data.forEach(item => {
              if (item.type === "item") {
                item.isParent = true;
              }
            });
            resolve(rt.data);
        })
        .catch(() => {
            console.log(er);
        });
      }
    },
    fnCheckChange(data, checked, deep) {
      if(checked){
        this.newSelectedList.push(data)
      }else{
        this.newSelectedList = this.newSelectedList.filter(t => t.id != data.id)
      }
    },
    filterNode(value, data) {
    },
    fnGetTreeData(id){
        this.$http({
            url: this.treeDataUrl+id+'/default',
            method: "GET",
            data: {}
        })
        .then(rt => {
            if (rt.status === '200') {
                rt.data.disabled = true
                this.treeData = [rt.data];
            }else{
            }
        })
        .catch(() => {
            console.log(er);
        });
    }
  },
  mounted () {
  }
}
</script>

<style scoped>
.content{
    height: 450px;
}
</style>
