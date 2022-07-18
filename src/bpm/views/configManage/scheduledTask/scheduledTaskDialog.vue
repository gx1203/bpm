<template>
  <el-dialog id="scheduledTaskDialog" :title="title" :visible.sync="dialogVisible" append-to-body>
    <el-form :model="item" ref="item" label-width="auto" class="content">
      <div class="card1" ref="card1">
        <div class="header">
          <span class="title">
            {{ $t('basicTaskInformation') }}
          </span>
        </div>
        <div class="card-info">
          <el-row>
            <el-col :span="14" :offset="5">
              <el-form-item :label="$t('taskName') + '：'" required>
                <el-input clearable v-model="item.name" />
                <p class="input-describe">
                  {{ $t('theNameTaskPerformed') }}
                </p>
              </el-form-item>
              <el-form-item :label="$t('missionDetails') + '：'">
                <el-input clearable type="textarea" v-model="item.description" />
                <p class="input-describe">
                  {{ $t('descriptionTaskPerformedUsedSpecifyTask') }}
                </p>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </div>
      <div class="card1" ref="card1">
        <div class="header">
          <span class="title">
            {{ $t('taskParameterConfiguration') }}
          </span>
        </div>
        <div class="card-info">
          <el-row>
            <el-col :span="14" :offset="5">
              <el-form-item :label="$t('executor') + '：'" required>
                <el-select clearable v-model="item.jobClass" class="w100" :placeholder="$t('placeholderText.pleaseSelect')">
                  <el-option
                    v-for="item in executantList"
                    :key="item.classPath"
                    :label="item.name"
                    :value="item.classPath"
                  ></el-option>
                </el-select>
                <p class="input-describe">
                  {{ $t('placeholderText.scheduledTasks1') }}
                </p>
              </el-form-item>
              <el-form-item :label="$t('requestPath') + '：'" v-if="item.jobClass ==='com.ekingwin.bas.cloud.scheduler.job.PostQueueSrvQuartzJobBean' || item.jobClass==='com.ekingwin.bas.cloud.scheduler.job.PostSrvQuartzJobBean'">
                <el-input clearable v-model="item.paramsValue.uri" />
                <p class="input-describe">
                  {{ $t('placeholderText.scheduledTasks2') }}
                </p>
              </el-form-item>
              <el-form-item :label="$t('requestText') + '：'" v-if="item.jobClass ==='com.ekingwin.bas.cloud.scheduler.job.PostQueueSrvQuartzJobBean' || item.jobClass==='com.ekingwin.bas.cloud.scheduler.job.PostSrvQuartzJobBean'">
                <el-input clearable type="textarea" v-model="item.paramsValue.postContent" />
                <p class="input-describe">
                  {{ $t('placeholderText.scheduledTasks3') }}
                </p>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </div>
      <div class="card1" ref="card1">
        <div class="header">
          <span class="title">
            {{ $t('placeholderText.taskTriggerConfiguration') }}
          </span>
        </div>
        <div class="card-info">
          <el-row>
            <el-col :span="14" :offset="5">
              <el-form-item :label="$t('triggerType') + '：'" required>
                <el-select clearable v-model="item.triggerType" class="w100" :placeholder="$t('placeholderText.pleaseSelect')">
                  <el-option
                    v-for="item in typeList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
                <p
                  class="input-describe"
                >
                  {{ $t('placeholderText.scheduledTasks4') }}
                </p>
              </el-form-item>
              <template v-if="item.triggerType === 'CRON'">
                <el-form-item :label="$t('CRONExpression') + '：'" required>
                  <el-input clearable v-model="item.cronExpression" />
                  <p class="input-describe">
                    {{ $t('placeholderText.scheduledTasks5') }}
                    <span class="required" @click="cronInfo">
                      {{ $t('here') }}
                    </span>
                  </p>
                </el-form-item>
              </template>
              <template v-else>
                <el-form-item :label="$t('startTime') + '：'" required>
                  <el-date-picker
                    v-model="item.startTime"
                    type="datetime"
                    :picker-options="pickerOptions0"
                    value-format="yyyy-MM-dd HH:mm"
                  ></el-date-picker>
                </el-form-item>
                <el-form-item :label="$t('endTime') + '：'">
                  <el-date-picker
                    v-model="item.endTime"
                    type="datetime"
                    :picker-options="pickerOptions1"
                    value-format="yyyy-MM-dd HH:mm"
                  ></el-date-picker>
                </el-form-item>
                <el-form-item :label="$t('repeatTimes') + '：'">
                  <el-input clearable type="number" min='0' v-model="item.repeatCount" onKeypress="return(/[\d]/.test(String.fromCharCode(event.keyCode)))"/>
                  <p class="input-describe">
                    {{ $t('placeholderText.scheduledTasks6') }}
                  </p>
                </el-form-item>

                <el-form-item :label="$t('executionIntervalSeconds') + '：'">
                  <el-input clearable type="number" min='0' v-model="item.repeatInterval" onKeypress="return(/[\d]/.test(String.fromCharCode(event.keyCode)))"/>
                  <p class="input-describe">
                    {{ $t('placeholderText.scheduledTasks7') }}
                  </p>
                </el-form-item>
              </template>
            </el-col>
          </el-row>
        </div>
      </div>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel">{{ $t('cancelAction') }}</el-button>
      <el-button type="primary" @click="submit('item')">{{ $t('confirm') }}</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { saveSchedule, getAvailableJob, getJobParams } from "@/bpm/api/configManage/scheduledTask";
export default {
  data() {
    return {
      dialogVisible: this.value,
      executantList: [],
      typeList: [
        {
          value: "CRON",
          label: "CRON"
        },
        {
          value: "SIMPLE",
          label: "Simple"
        }
      ],
      pickerOptions0: {
        disabledDate: time => {
          if (this.item.endTime) {
            return (time.getTime() > new Date(this.item.endTime).getTime() - 86400000||
              time.getTime() < Date.now() - 86400000)
          } else {
            return time.getTime() < Date.now() - 86400000;
          }
        }
      },
      pickerOptions1: {
        disabledDate: time => {
          if (this.item.startTime) {
            return time.getTime() < new Date(this.item.startTime).getTime();
          } else{
            return time.getTime() < Date.now() - 86400000;
          }
        }
      }
    };
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    item: {
      type: Object,
      default: () => {
        return {};
      }
    },
    title: {
      type: String,
      default: false
    }
  },
  watch: {
    value(val) {
      this.dialogVisible = val;
      if (val) {
        this.getAvailableJob()
        if (this.item.id) {
          this.item.paramsValue = JSON.parse(this.item.paramsValue)==='{}'?  {}:JSON.parse(this.item.paramsValue);
          if(!this.item.paramsValue.uri){
            this.$set(this.item.paramsValue,'uri','')
          }
          if(!this.item.paramsValue.postContent){
            this.$set(this.item.paramsValue,'postContent','')
          }
        }
      }
    },
    dialogVisible(val) {
      this.$emit("input", val);
    }
  },
  methods: {
    getAvailableJob(){
        this.loading = true;
        getAvailableJob()
        .then(rt => {
          this.executantList = rt.data
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    getData() {
      getScheduleHistoryList({
        logic: "and"
      })
        .then(rt => {
          this.content = rt;
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    isVerify() {
      if (!this.item.name) {
        this.$message.error(this.$t('pleaseWrite') + this.$t('taskName'))
        return false;
      } else if(this.item.name.length>100){
        this.$message.error(this.$t('taskName') + this.$t('superLong'))
        return false;
      } else if (!this.item.jobClass) {
        this.$message.error(this.$t('placeholderText.pleaseSelect') + this.$t('executor'))
        return false;
      } else if (this.item.description && this.item.description.length>1000) {
        this.$message.error(this.$t('missionDetails') + this.$t('superLong'))
        return false;
      } else if ((this.item.jobClass ==='com.ekingwin.bas.cloud.scheduler.job.PostQueueSrvQuartzJobBean' || this.item.jobClass==='com.ekingwin.bas.cloud.scheduler.job.PostSrvQuartzJobBean') && this.item.uri && this.item.uri.length>500) {
        this.$message.error(this.$t('requestPath') + this.$t('superLong'))
        return false;
      } else if ((this.item.jobClass ==='com.ekingwin.bas.cloud.scheduler.job.PostQueueSrvQuartzJobBean' || this.item.jobClass==='com.ekingwin.bas.cloud.scheduler.job.PostSrvQuartzJobBean') && this.item.postContent && this.item.postContent.length>2000) {
        this.$message.error(this.$t('requestText') + this.$t('superLong'))
        return false;
      } else if (!this.item.triggerType) {
        this.$message.error(this.$t('placeholderText.pleaseSelect') + this.$t('triggerType'))
        return false;
      } else if (this.item.triggerType === "CRON") {
        if (!this.item.cronExpression) {
          this.$message.error(this.$t('placeholderText.pleaseEnter') + this.$t('CRONExpression'))
          return false;
        } else if(this.item.cronExpression.length>100){
          this.$message.error(this.$t('CRONExpression') + this.$t('superLong'))
          return false;
        }
      }else if (this.item.triggerType === "SIMPLE") {
        if (!this.item.startTime) {
          this.$message.error(this.$t('placeholderText.pleaseEnter') + this.$t('triggerType'))
          return false;
        } else if(this.item.repeatCount && this.item.repeatCount.length>100){
          this.$message.error(this.$t('repeatTimes') + this.$t('superLong'))
          return false;
        } else if(this.item.repeatCount && this.item.repeatCount.length>100){
          this.$message.error(this.$t('executionIntervalSeconds') + this.$t('superLong'))
          return false;
        }
      }
      return true;
    },
    submit(formName) {
      if(!this.isVerify()) return
      this.item.paramsValue = JSON.stringify( this.item.paramsValue)
      saveSchedule(this.item)
        .then(rt => {
          if (rt.status === "200") {
            this.$message({
              message: this.$t('hintText.saveSuccessfully'),
              type: "success"
            });
            this.dialogVisible = false;
            this.$emit("confirm", true);
          } else {
            this.$message({
              message: this.$t('hintText.failToSave'),
              type: "error"
            });
          }
        })
        .catch(() => {
          this.$message({
            message: this.$t('hintText.failToSave'),
            type: "error"
          });
        });
    },
    cancel() {
      this.dialogVisible = false;
    },
    cronInfo() {
      let routeData = this.$router.resolve({
        name: "cron"
      });
      // window.open(routeData.href, "_blank");
      let a = document.createElement('a');
      //给创建好的a标签赋值
      a.setAttribute('href', routeData.href);
      //设置css 隐藏属性
      a.setAttribute('style', 'display:none');
      //设置 a标签为新窗口打开
      a.setAttribute('target', '_blank');
      //将设置好的a标签，添加到 body 内
      document.body.appendChild(a);
      //模拟点击
      a.click();
      //移除a标签
      a.parentNode.removeChild(a);
    }
  },
  mounted() {
  }
};
</script>

<style scoped>
.content {
  height: 50vh;
  overflow: auto;
}
</style>
<style lang="scss" scoped>
#scheduledTaskDialog {
  .input-describe {
    font-size: 12px;
    color: $tc3;
  }
  .required {
    cursor: pointer;
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
    }
  }
  .w100 {
    width: 100%;
  }
}
</style>


