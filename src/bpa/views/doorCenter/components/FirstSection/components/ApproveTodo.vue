<template>
  <div class="approve-todo">
    <div class="card-header">
      <div class="title">
        <b>{{ $t('TheExaminationAndApprovalToAo') }}({{ content.total }})</b>
      </div>
      <div class="more" @click="toMore">
        {{ $t("toViewMore") }}<i class="el-icon-arrow-right" />
      </div>
    </div>
    <ul class="card-list">
      <li v-for="(item, index) in content.list" :key="index">
        <div class="surname">
          <span v-if="item.drafter">{{ item.drafter.substring(0 ,1) }}</span>
        </div>
        <div class="card-content">
          <div class="card-detail">
            <h4 @click="toFlow(item)">
              <span v-if="item.priority === 1" class="margin-r5 red">{{ `[ ${$t('urgent')} ]` }}</span>
              <p>{{ item.subject }}</p>
              <span v-if="item.remainingDate && item.remainingDate.includes('已超时')" class="tagRed">已超时</span>
            </h4>
            <p>{{ $t('approvalNode') }}：{{ item.activityName }}</p>
          </div>
          <div class="card-tool">
            <span>{{ $t('applicant') }}：{{ item.drafter }}</span>
            <span>{{ item.reqDate | formatDateTime }}</span>
            <el-button type="primary" @click="getInstanceImage(item.instanceId)">{{ $t('flowChart') }}</el-button>
          </div>
        </div>
      </li>
    </ul>
    <InstanceImageDialog v-model="dialogVisible" :instance-id="instanceId" />
  </div>
</template>

<script>
import InstanceImageDialog from '@/bpm/components/instanceimage/InstanceImageDialog'
import { quickQueryApproveList } from '@/bpm/api/staging/personal/approve_list'
import { taskExists } from '@/bpm/api/staging/personal/approve_list'
import { checkProcessDefaultPage } from '@/bpm/api/flow/index'

export default {
  name: 'ApproveTodo',
  components: {
    InstanceImageDialog
  },
  mounted() {
    window.getData = this.getData
    this.getData()
  },
  props: {},
  data() {
    return {
      dialogVisible: false,
      instanceId: '',
      content: {
        list: [],
        total: 0
      }
    }
  },
  methods: {
    toMore() {
      this.$router.push("/staging/personal/approveList");
    },
    // 待办列表数据
    getData() {
      quickQueryApproveList({
        logic: 'and',
        attr: {
          platform: 'PC'
        },
        pageNum: 1,
        pageSize: 5
      }).then(rt => {
        if (rt.status === '200') {
          this.content = rt.data
          this.pages.total = rt.data.total
        }
      }).catch(() => {
      })
    },
    toFlow(item) {
      let routeData = {}
      taskExists(item.taskId, item.index).then(rt => {
        if (!rt.data) {
          this.$message.error(this.$t('hintText.taskDoesNotExist'))
          return
        }
        checkProcessDefaultPage({
          processName: item.processId,
          instanceId: item.instanceId
        }).then(rt => {
          if (rt.status === '200') {
            if (rt.data.isDefaultPage === 'Y') {
              routeData = this.$router.resolve({
                name: item.processId + 'Approve',
                query: {
                  name: item.processCnname,
                  taskId: item.taskId,
                  category: item.category,
                  processName: item.taskdefinitionId,
                  index: item.index
                }
              })
            } else {
              if (item.linkUrl.startsWith('http')) {
                routeData.href = `${item.linkUrl}?name=${item.processCnname}&category=${item.category}&processName=${item.taskdefinitionId}&taskId=${item.taskId}&index=${item.index}`
              } else {
                routeData.href = `${window.location.origin +
                  window.location.pathname +
                  item.linkUrl}?name=${item.processCnname}&category=${
                  item.category
                }&processName=${item.taskdefinitionId}&taskId=${
                  item.taskId
                }&index=${item.index}`
              }
            }
            // window.open(routeData.href, "_blank");
            const a = document.createElement('a')
            // 给创建好的a标签赋值
            a.setAttribute('href', routeData.href)
            // 设置css 隐藏属性
            a.setAttribute('style', 'display:none')
            // 设置 a标签为新窗口打开
            a.setAttribute('target', '_blank')
            // 将设置好的a标签，添加到 body 内
            document.body.appendChild(a)
            // 模拟点击
            a.click()
            // 移除a标签
            a.parentNode.removeChild(a)
          }
        })
      })
    },
    getInstanceImage(id) {
      this.instanceId = id
      this.dialogVisible = true
    }
  }
}
</script>

<style lang="scss" scoped>
$km: 16px;
.card-list {
  li {
    padding: 0 $km;
    display: flex;
    align-items: center;
    .surname {
      width: 44px;
      height: 44px;
      margin-right: 12px;
      line-height: 44px;
      text-align: center;
      color: #ffffff;
      font-weight: bold;
      font-size: 20px;
      border-radius: 50%;
      background-color: #547FFF;
    }
    .card-content {
      flex: 1;
      padding: 20px 0;
      min-height: 40px;
      overflow: hidden;
      border-bottom: 1px solid #EBEBF4;
      display: flex;
      align-items: center;
      .card-detail {
        flex: 1;
        width: 55%;
      }
      .card-tool {
        flex: 1;
        text-align: right;
        span {
          margin-left: 20px;
          color: #9898A4;
        }
        .el-button {
          margin-left: 20px;
          padding-left: 20px;
          padding-right: 20px;
        }
      }
      h4 {
        margin-bottom: 5px;
        font-size: 13px;
        cursor: pointer;
        p {
          display: inline-block;
          max-width: calc(100% - 200px);
          margin-right: 5px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          vertical-align: middle;
        }
        &:hover p {
          color: #2d42af;
          text-decoration: underline;
        }
      }
    }
    &:last-child {
      .card-content {
        border-bottom: none;
      }
    }
  }
}
.tagRed {
  display: inline-block;
  line-height: 16px;
  color: #ffffff;
  padding: 0 12px;
  border-radius: 8px;
  font-size: 12px;
  background: #F33F3F;
  font-weight: normal;
}
</style>
