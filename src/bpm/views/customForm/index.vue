<template>
  <div>
    <flow-form v-loading="load" @getTabData="getTabData" @savedragform="buildDatabase" ref="custom" :node="node" :formType="formType"/>
  </div>
</template>

<script>
import FlowForm from './flow_form'
import { loaddragform, loaddragformByAnotherProcessid } from '@/bpm/api/customForm'

import {createNamespacedHelpers} from 'vuex'
const { mapMutations } = createNamespacedHelpers('app')
export default {
  components: {
    FlowForm
  },
  props:{
    processData: {
      type: Object,
      default:()=>{}
    },
    nodeData: {
      type: Object,
      default: ()=> null
    },
    formType: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      isBuildDatabase: false,
      load: false,
      node: {
        applyUserDto: {},
        nodeTabLists: []
      },
      data: {},
    }
  },
  computed: {
    isLRShow (){
      return this.$store.state.custom.isLRShow;
    }
  },
  watch: {
    nodeData: {
      handler (val) {
        if (val) {
          this.filtration(val.nodeTabLists)
          this.node = val;
          document.title = val.processShowName
          this.$forceUpdate()
        }
      }
    },
    deep: true,
    immediate: true
  },
  mounted () {
    this.getStartProcessForm()
  },
  methods: {
    buildDatabase() {
      this.isBuildDatabase = true
      this.getData()
    },
    pamarsFiltration(list){
      list.forEach(item=>{
        if(item.nodeTableLists.length > 0){
          item.nodeTableLists = item.nodeTableLists.filter(val =>val.fieldName && val.fieldName !=='')
        }
        if(item.nodeTabLists.length > 0){
          this.pamarsFiltration(item.nodeTabLists)
        }
      })
    },
    copyData(){
       this.$refs.custom.copyData()
    },
    filtration(list) {
      list.forEach(item => {
        item.key = Math.random()
        if (item.nodeTableLists && item.nodeTableLists.length > 0) {
         item.nodeTableLists.forEach(val =>{
           val.key = Math.random()
           if (val.nodeTableLists && val.nodeTableLists.length > 0) {
              this.filtration(val.nodeTableLists);
            }
         })
        }
        if (item.nodeTabLists && item.nodeTabLists.length > 0) {
          this.filtration(item.nodeTabLists);
        }
      });
    },
    getTabData (processId) {
      this.load = true
      loaddragformByAnotherProcessid(processId).then(rt => {
        this.load = false
          if (rt.status === "200") {
            this.filtration(rt.data.nodeTabLists)
            this.node.nodeTabLists = rt.data.nodeTabLists;
          }
        })
        .catch(() => {
        this.load = false
        });
    },
    getData(){
      let id = this.$route.query.id ? this.$route.query.id : this.processData.id ? this.processData.id : ''
      if (id) {
        this.load = true
        loaddragform(id, {
          version: this.$route.query.version || this.$route.query.version === '' ? this.$route.query.version : this.processData.version ? this.processData.version : ''
        }).then(rt => {
          this.load = false
          console.log('🍓rt.data', rt.data)
          if(rt.data.nodeTabLists.length === 0) {
            const applyData = {
              fieldcol: 2,
              isTab: true,
              iscontains: "N",
              isdefault: "N",
              istab: "0",
              key: '',
              modalTitle: "",
              name: "区域块",
              nodeTabLists: [],
              nodeTableLists: [],
              tabname: "申请信息"
            }
            rt.data.nodeTabLists.push(applyData)
          }
          console.log('🍓1this.node', this.node)
          this.filtration(rt.data.nodeTabLists)
          this.node = rt.data;
          console.log('🍓2this.node', this.node)
          if(this.isBuildDatabase) {
            const sendData = JSON.parse(JSON.stringify(this.node))
            this.$refs.custom.builddatabaseindragform(sendData)
            this.isBuildDatabase = false
          }
          document.title = this.node.processShowName
        }).catch(er => {
          this.load = false
        });
      }
    },
    getStartProcessForm () {
      this.getData()
    }
  }
}
</script>

<style type="text/scss" lang="scss" scoped>
</style>
