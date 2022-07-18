<template>
  <div id="processDetails">
    <el-row :gutter="10">
      <el-col :span="16">
        <div class="left_top">
          <el-row class="margin-b15">
            <el-col :span="20">
              <p class="title">{{!docInfo.docTitle ? '' : docInfo.docTitle}}</p>
            </el-col>
            <el-col :span="4">
              <el-button type="primary" @click="goBack">{{$t("return")}}</el-button>
            </el-col>
          </el-row>
          <div class="jpg_wrapper">
            <!-- 隐藏底部审批表格赋值了一个h170的类名，显示记得删除 -->
            <div class="w100 h100 imgContainer h170" v-if="!!docInfo.docId">
              <iframe border="0" class="w100 h100" :src="host+'/document/printnew/'+docInfo.docId + '/' + docInfo.originalName"></iframe>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="right_top">
          <el-row class="border_btm">
            <el-col :span="24" class="title">
              <i class="el-icon-tickets margin-r5"></i>{{$t("basicAttributes")}}
            </el-col>
          </el-row>
          <p>
            <span class="tt">{{$t("title")}}:</span>
            <span>{{docInfo.docTitle}}</span>
          </p>
          <p>
            <span class="tt">{{$t("uploadTime")}}:</span>
            <span>{{docInfo.createDate}}</span>
          </p>
          <p>
            <span class="tt">{{$t("releaseTime")}}:</span>
            <span>{{docInfo.effectiveDate | forDate}}</span>
          </p>
          <p>
            <span class="tt">{{$t("version")}}:</span>
            <span>{{docInfo.version}}</span>
          </p>
          <p>
            <span class="tt">{{$t("department")}}:</span>
            <span>{{!docInfo.orglist ? '':docInfo.orglist.map(item => item.value).join(",")}}</span>
          </p>
          <p>
            <span class="tt">{{$t("artificialPerson")}}:</span>
            <span>{{!docInfo.signerlist ? '':docInfo.signerlist.map(item => item.cnname).join(",")}}</span>
          </p>
          <p>
            <span class="tt">{{$t("releasePeople")}}:</span>
            <span>{{docInfo.provideruser}}</span>
          </p>
          <p>
            <span class="tt">{{$t("classificationSystem")}}:</span>
            <span>{{docInfo.system}}</span>
          </p>
          <el-row class="border_btm">
            <el-col :span="24" class="title">
              <i class="el-icon-tickets margin-r5"></i>{{$t("classify")}}
            </el-col>
            <el-col
              :span="24"
            >{{!docInfo.folderDocumentList ? '':(docInfo.folderDocumentList[0].folderid === '5002' ? '规章管理中心/部门职责、其他':'规章管理中心/手册体系文件')}}</el-col>
          </el-row>
          <el-row class="border_btm">
            <el-col :span="24" class="title">
              <i class="el-icon-tickets margin-r5"></i>{{$t("otherVersions")}}
            </el-col>
            <el-col :span="24">
              <p v-for="item in docInfo.revisionHistory" :key="item.docId">
                <router-link :to="'/rulesAbolishDetail/'+item.docId+'/'+item.revId">
                  <a :class="{'active':(docInfo.revlabel === item.revlabel)}">{{item.revlabel}}</a>
                </router-link>
              </p>
            </el-col>
          </el-row>
          <el-row class="border_btm">
            <el-col :span="24" class="title">
              <i class="el-icon-tickets margin-r5"></i>{{$t("attachment")}}
            </el-col>
            <el-col :span="24" class="font-blue">
              <a :href="viewFile(docInfo.docId,docInfo.originalName)" target="_blank">{{docInfo.originalName}}</a>
              <i class="el-icon-download margin-l5" @click="downloadDoc"></i>
            </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>
    <!-- <el-row :gutter="10" class="margin-t15">
      <el-col :span="24">
        <div class="padding10px bg-white">
          <el-table
            :data="tableList"
            border
            class="main_tab">
            <el-table-column
              :label="$t('number')"
              type="index">
            </el-table-column>
            <el-table-column
              :label="$t('subject')">
            </el-table-column>
            <el-table-column
              prop="enname"
              :label="$t('approvalNodeName')">
            </el-table-column>
            <el-table-column
              prop="version"
              :label="$t('approver')">
            </el-table-column>
            <el-table-column
              prop="createon"
              :label="$t('approvalTime1')">
            </el-table-column>
            <el-table-column :label="$t('approvalOperation')">
            </el-table-column>
            <el-table-column
              :label="$t('remarks')">
            </el-table-column>
          </el-table>
        </div>
      </el-col>
    </el-row>-->
  </div>
</template>

<script>
import {
  getDocInfo,
  getTableInfo
} from '@/bpa/api/processModelCenter/rulesAndRegulations/detail'
import fileOperation from '@/bpa/mixins/fileDownView'
import { viewFile, downloadFile,viewFile2,downloadFile2 } from '@/bpa/utils/common'
export default {
  data() {
    return {
      docInfo: {
        revisionHistory: []
      },
      tableList: []
    }
  },
  computed: {
    host() {
      return process.env.VUE_APP_HOST_URL + process.env.VUE_APP_BASE_URL
    },
    docId() {
      return this.$route.params.docid
    },
    revId() {
      return this.$route.params.revId
    }
  },
  mounted() {
    this.getDocData()
    // this.getTablelist()
  },
  mixins: [fileOperation],
  methods: {
    getDocData() {
      getDocInfo(this.docId, this.revId).then(res => {
        console.log(res)
        if (!res) return false
        this.docInfo = res
      })
    },
    downloadDoc() {
      window.open(this.downloadFile(this.docInfo.docId))
    },
    getTablelist() {
      getTableInfo(this.docId).then(res => {
        console.log(res)
        if (!res) return false
        this.tableList = res
      })
    },
    goBack() {
      this.$router.push({name:'institution'})
    },
    // 预览文件
    viewFile(fileId,fileName) {
      return viewFile2(fileId,fileName)
    },
  }
}
</script>

<style lang="scss" scoped>
#processDetails {
  flex: 1;
  padding: 10px;
  background: #f9fafd;
  overflow: hidden;
  color: #5a5a5a;
  .jpg_wrapper {
    height: 360px;
    background-color: #fff;
    .h170 {
      height: 170%;
    }
  }
  .text_right {
    text-align: right;
  }
  .left_top {
    // 隐藏底部重新赋样式
    //  height: 400px;
    height: 600px;
    padding: 15px;
    background: #fff;
    .title {
      font-size: 20px;
      font-weight: 500;
    }
  }
  .font-blue {
    color: #52a2ef;
    a {
      color: #52a2ef;
    }
  }
  .right_top {
    // 隐藏底部重新赋样式
    // height: 400px;
    height: 600px;
    background: #fff;
    padding: 15px;
    .border_btm {
      .active {
        color: #52a2ef;
      }
    }
    .title {
      color: #4c4c4c;
      font-size: 14px;
      height: 30px;
      line-height: 30px;
      font-weight: bold;
    }
    .download {
      text-align: right;
      height: 30px;
      span,
      .icon {
        display: inline-block;
        vertical-align: middle;
        font-size: 20px;
        color: #f9a700;
      }
      span {
        font-weight: bold;
        font-size: 16px;
        // color: #000;
      }
      .icon-xiazai {
        color: #000;
        cursor: pointer;
      }
      &:after {
        content: '';
        display: inline-block;
        vertical-align: middle;
        height: 100%;
      }
    }
    p {
      line-height: 24px;
      span {
        font-size: 14px;
      }
    }
  }
}
</style>
