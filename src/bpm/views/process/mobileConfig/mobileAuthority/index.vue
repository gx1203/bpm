<template>
  <el-card shadow="never">
    <div class="item-left">
      <tree-organization  @confirm="handleNodeClick"/>
    </div>
    <div class="item-right" id="classifyHandle" v-if="isShow" v-loading="loading">
      <div class="tool-common-wrap">
      <div class="btn-wrap">
        <el-button type="primary" @click="getData">
         {{ $t('refresh') }}
            <!--<i class="el-icon-refresh"/>-->
        </el-button>
      </div>
    </div>
    <el-form :model="ruleForm"  ref="ruleForm">
        <div class="card1" ref="card1">
           <div class="header">
            <span class="title">权限配置</span>
          </div>
          <div class="card-info">
             <el-button type="primary" @click="handleCheckAllChange">
                 全选/反选
            </el-button>
            <el-form :model="ruleForm"  ref="ruleForm" label-width="120px">
                <el-row>
                    <el-checkbox-group v-model="checkedCities">
                        <el-col :span="8" v-for="(city, index) in cities" :key="index" style="margin-top: 10px;">
                            <el-checkbox :label="city.menuid" :key="city.menuid">{{city.menuname}}</el-checkbox>
                        </el-col>
                    </el-checkbox-group>
                </el-row>
                <div class="text-r">
                    <el-button type="primary" @click="submit">
                    提交
                    </el-button>
                </div>
            </el-form>
          </div>
        </div>
    </el-form>
    </div>
  </el-card>
</template>

<script>
import treeOrganization from "@/bpm/components/treeOrganization";
import {
  saveMobilepope, getMobilepope
} from "@/bpm/api/process/mobileConfig/mobile_authority";
export default {
  components: {
    treeOrganization
  },
  data() {
    return {
      isShow: false,
      ruleForm: {},
      cities:  [],
      checkedCities: [],
      checkAll: false,
      treeData:{},
      loading: false
    }
  },
  computed: {
    userInfo() {
      return this.$store.state.basuser.user
    },
    key() {
      return this.$route.fullPath
    }
  },
  methods:{
    handleNodeClick(data) {
      if(data.TYPE !== '0'){
        this.treeData = data
        this.getData()
        this.isShow = true;
      }
    },
    getData(){
      this.loading = true;
      getMobilepope(this.treeData.ID)
        .then(rt => {
          this.loading = false;
          this.cities = rt.data.mobileMenuModelDtos
          this.checkedCities = rt.data.mobilePopeDtos.map(item => item.menuid)
        })
        .catch(err => {
          this.$message.error(err.message);
          this.loading = false;
        });
    },
    submit() {

      this.loading = true;
      saveMobilepope(
        {
          postid: this.treeData.ID,
          menuids:this.checkedCities.join(',')
        }
      )
        .then(rt => {
          if (rt.status === "200") {
            this.$message.success(this.$t('hintText.addedSuccess'));
            this.dialogVisible = false;
            this.$emit("confirm", this.item);
          }
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    handleCheckAllChange() {
      if (this.checkedCities.length === this.cities.length ) {
        this.checkedCities = []
      } else {
        this.checkedCities = this.cities.map(item=>item.menuid)
      }
    }
  }
}
</script>
<style lang="scss">
    #classifyHandle{
      .el-input__inner {
        border: none;
        border-bottom: 1px solid $dc1
      }
      .text-r {
        button {
          margin: 15px 10px;
        }
      }
    }
</style>
<style lang="scss" scoped>
   .w100{
          width: 100%;
      }
      .card1 {
        padding: 0 5px 15px 15px;
        background: white;
        overflow: hidden;
        transition-duration: 0.5s;
        box-sizing: border-box;
        height: auto;
        .header {
            margin-right: 10px;
            border-bottom: 1px solid $dc1;
            margin-bottom: 10px;
            display: flex;
            .title {
            height: 35px;
            line-height: 35px;
            color: $tc1;
            font-weight: bold;
            }
            .space {
            flex-grow: 1;
            }
        }
      }
  .item-left {
    float: left;
    width: 20%;
  }
  .item-right {
    float: right;
    width: 78%;
    .table-header {
      position: relative;
      background: $bc2;
      display: flex;
      align-items: center;
      .all-check {
        position: absolute;
        left: 20px;
      }
    }
  }
</style>
