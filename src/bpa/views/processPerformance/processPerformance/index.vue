<template>
    <div class="detail">
        <div class="showTitle">
            <el-row>
                <!-- <el-col :span="12"> -->
                    <!-- <span class="title">采购流程绩效</span> -->
                    <!-- <span class="commonNum" :class="{'active': showdetail == 1}" @click="showpage(1)">1</span> -->
                    <!-- <span class="commonNum" :class="{'active': showdetail == 2}" @click="showpage(2)">2</span> -->
                    <!-- <span class="commonNum" :class="{'active': showdetail == 3}" @click="showpage(3)">3</span> -->
                    <!-- <span class="commonNum" :class="{'active': showdetail == 4}" @click="showpage(4)">4</span> -->
                <!-- </el-col> -->
                <el-col :span="24">
                    <div class="float-r selector">
                        <el-select  v-if="showdetail == 2" v-model="valueChainvalue" @change='valueChainchange' placeholder="选择价值链">
                            <el-option  v-for="(i,index) in valueChain" :key=index :label="i.name"   :value="i.id">
                            </el-option>
                        </el-select>
                        <!-- <el-select clearable v-model="value" placeholder="选择片区">
                            <el-option
                            label="1"
                            value="1">
                            </el-option>
                        </el-select> -->
                        <!-- <el-select clearable v-model="value" placeholder="选择子公司">
                            <el-option
                            label="1"
                            value="1">
                            </el-option>
                        </el-select> -->
                        <!-- <el-select clearable v-model="value" placeholder="分子公司排名">
                            <el-option
                            label="1"
                            value="1">
                            </el-option>
                        </el-select> -->
                    </div>
                </el-col>
            </el-row>
        </div>
        <div class="content1">
            <!-- <important-key v-if="showdetail == 1"></important-key> -->
            <second-part :ZCGetJsonList="ZCGetJsonList" v-if="showdetail == 2"></second-part>
            <!-- <common  v-if="showdetail == 3"> -->
                <!-- <thirdpart></thirdpart> -->
            <!-- </common> -->
            <!-- <forth  v-if="showdetail == 4"></forth> -->
        </div>
    </div>
</template>

<script>
import importantKey from './components/importantKey.vue'
import secondPart from './components/secondPart.vue'
import common from './../components/common.vue'
import forth from './components/forth.vue'
import thirdpart from './components/thirdpart.vue'
import {getModellistjsonname,getZCGetJson,getZCGetJsonTwo} from '@/bpa/api/processPerformance/processPerformance'
export default {
  components: {
    importantKey,
    secondPart,
    common,
    thirdpart,
    forth
  },
  data() {
    return {
      value: '',
      showdetail: 2,
      valueChain:[],
      valueChainvalue:"",
      ZCGetJsonList:[]
    }
  },
  mounted(){
    this.getModellistjsonname()
    this.getZCGetJson()
  },
  methods: {
    showpage (data) {
      console.log('data',data);
      this.showdetail = data
      if(data==2 ){
         this.getZCGetJson()
      }
    },
    valueChainchange(){
       this.getZCGetJson()
    },
 
    getModellistjsonname(){
     getModellistjsonname({}).then(res=>{
         console.log(res);
         this.valueChain=res
         if(this.$route.query.id){
          this.valueChainvalue=this.$route.query.id
             setTimeout(() => {
                this.showdetail=2
             }, 500);
         }else{
             if(this.$route.query.pid){
             this.showdetail=this.$route.query.pid
           }
           this.valueChainvalue=res[0].id
         }
         this.getZCGetJson()
         console.log( this.valueChain);
     })
    },
    getZCGetJson(){
      if (!this.valueChainvalue && this.valueChainvalue == '') {
        getZCGetJsonTwo(this.valueChainvalue).then(res=>{
            console.log(res);
            this.ZCGetJsonList=res
        })
      } else {
          getZCGetJson(this.valueChainvalue).then(res=>{
            console.log(res);
            this.ZCGetJsonList=res
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
* {
    box-sizing: border-box;
}
.detail {
    width: 100%;
    height: 1000px;
    .showTitle{
        padding: 18px;
        .title{
            font-size: 16px;
            line-height: 18px;
            color: #43dbff;
            margin-right: 20px;
            display: inline-block;
            vertical-align: top;
        }
        .commonNum {
            width: 16px;
            height: 16px;
            text-align: center;
            line-height: 16px;
            margin-right: 10px;
            display: inline-block;
            vertical-align: top;
            color: #3f8694;
            background-color: transparent;
            border: 1px solid #3f8694;
            cursor: pointer;
            &.active {
                color: #15c3cf;
                background-color: #346e7d;
                border: 1px solid #15c3cf;
            }
        }
        .selector {
            .el-select {
                width: 120px;
                margin-left: 20px;
                /deep/ .el-input__inner {
                    color: #4272c7;
                    border-radius: 0;
                    background-color: #111d56;
                    border-color: #4272c7;
                }
            }
        }
    }
    .content1 {
        padding:0 18px 18px;
        height: calc(100% - 150px);
    }
}
</style>
