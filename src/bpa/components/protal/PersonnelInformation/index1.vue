<template>
  <div class="dashboard-container">
    <div class="msg-center">
      <div class="msg-information">
        <img src="../../../assets/img/app_logo01.png" alt >
      </div>
      <div class="msg-information">
        <div class="msg-center1">{{ options.name }}</div>
        <div class="msg-center2">{{ options.state }}</div>
        <el-button v-if="options.common==='常用'" type="primary" plain icon="el-icon-star-on" class="msg-buts" size="mini">取消常用</el-button>
        <el-button
          v-if="options.common!=='常用'"
          type="primary"
          plain
          icon="el-icon-star-off"
          class="msg-buts"
          size="mini"
        >添加常用</el-button>
      </div>
      <div class="msg-information1">
        <el-row :gutter="20">
          <el-col :span="10">
            <div class="grid-content">部门</div>
          </el-col>
          <el-col :span="14">
            <div :title="options.department" class="grid-content bg-purple">{{ options.department }}</div>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="10">
            <div class="grid-content">职位</div>
          </el-col>
          <el-col :span="14">
            <div :title="options.position" class="grid-content bg-purple">{{ options.position }}</div>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="10">
            <div class="grid-content">手机号</div>
          </el-col>
          <el-col :span="14">
            <div class="grid-content bg-purple">{{ options.phone }}</div>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="10">
            <div class="grid-content">办公电话</div>
          </el-col>
          <el-col :span="14">
            <div class="grid-content bg-purple">{{ options.landline }}</div>
          </el-col>
        </el-row>
        <el-container style="margin: 10px 0;">
          <el-button type="primary" plain icon="el-icon-phone" class="msg-but" size="mini">
            <!-- <a :href="'tel:' + 13107027088">即时</a> -->即时
          </el-button>
          <el-button
            type="primary"
            plain
            icon="el-icon-s-comment"
            class="msg-but"
            size="mini"
            @click="sendmessage(options.phone)"
          >消息</el-button>
          <el-button
            type="primary"
            plain
            icon="el-icon-message"
            class="msg-but"
            size="mini"
            @click="sendemail"
          >邮件</el-button>
        </el-container>
      </div>
    </div>
    <!-- 消息弹窗 -->
    <el-dialog :visible.sync="dialogVisible" title="发送消息" width="50%">
      <span>
        <el-form
          ref="ruleForm"
          :model="ruleForm"
          :rules="rules"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="标题" prop="title">
            <el-input clearable v-model="ruleForm.title" size="small" class="el-inputs" placeholder="输入标题" />
          </el-form-item>
          <el-form-item label="紧急程度" prop="degree">
            <el-input clearable
              v-model="ruleForm.degree"
              size="small"
              class="el-inputs"
              placeholder="输入紧急程度"
            />
          </el-form-item>
          <el-form-item label="接收人" prop="recipient">
            <el-input v-model="ruleForm.recipient" size="small" disabled class="el-inputs" />
          </el-form-item>
          <el-form-item label="正文" prop="textarea">
            <el-input clearable
              v-model="ruleForm.textarea"
              type="textarea"
              rows="3"
              size="small"
              class="el-inputs"
              placeholder="输入正文"
            />
          </el-form-item>
        </el-form>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="resetForm('ruleForm')">取消</el-button>
        <el-button size="small" type="primary" @click="submitForm('ruleForm')">发送</el-button>
      </span>
    </el-dialog>
    <!-- 邮件弹窗 -->
    <el-dialog :visible.sync="dialogVisible1" title="发送邮件" width="60%" style="margin-top: -50px">
      <span>
        <el-form
          ref="ruleForm1"
          :model="ruleForm1"
          :rules="rules1"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="收件人" prop="recipient">
            <el-input clearable
              v-model="ruleForm1.recipient"
              size="small"
              class="el-inputs"
              placeholder="收件人"
            />
            <i class="icos el-icon-circle-plus-outline" @click="addrecipient"/>
          </el-form-item>
          <el-form-item label="抄送" prop="copyto">
            <el-input clearable v-model="ruleForm1.copyto" size="small" class="el-inputs" placeholder="抄送" />
            <i class="icos el-icon-circle-plus-outline" @click="addrecipient"/>
          </el-form-item>
          <el-form-item label="密送" prop="secretsend">
            <el-input clearable
              v-model="ruleForm1.secretsend"
              size="small"
              class="el-inputs"
              placeholder="密送"
            />
            <i class="icos el-icon-circle-plus-outline" @click="addrecipient"/>
          </el-form-item>
          <el-form-item :label="$t('subject')" prop="theme">
            <el-input clearable v-model="ruleForm1.theme" size="small" class="el-inputs" placeholder="主题" />
          </el-form-item>
          <el-form-item label="正文" prop="textarea">
            <el-input clearable
              v-model="ruleForm1.textarea"
              type="textarea"
              rows="3"
              size="small"
              class="el-inputs"
              placeholder="输入正文"
            />
          </el-form-item>
          <el-form-item label="文档" prop="uploadfile">
            <el-upload
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :before-remove="beforeRemove"
              :limit="3"
              :on-exceed="handleExceed"
              :file-list="fileList"
              multiple
              action="https://jsonplaceholder.typicode.com/posts/"
              class="upload-demo"
            >
              <el-button size="small" type="primary">{{$t("bpa_clickUpload")}}</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-form-item>
        </el-form>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="resetForm1('ruleForm1')">取消</el-button>
        <el-button size="small" type="primary" @click="submitForm1('ruleForm1')">发送</el-button>
      </span>
    </el-dialog>
    <!-- 选择人员弹窗 -->
    <el-dialog :visible.sync="dialogVisible2" title="选择收件人" width="50%">
      <span>这是一段信息</span>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogVisible2 = false">{{$t("cancel")}}</el-button>
        <el-button size="small" type="primary" @click="dialogVisible2 = false">{{$t("confirm")}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'PersonnelInformation',
  props: {
    options: {
      type: Object,
      default: () => {
        return {
          name: '旺旺旺', // 姓名
          state: '在岗', // 状态
          common: '常用', // 是否常用
          department: '运维服务部', // 部门
          position: '高级计算机软件工程师', // 职位
          phone: '13107027099', // 电话
          landline: '400-888-888' // 办公电话
        }
      }
    }
  },
  data() {
    return {
      dialogVisible: false,
      dialogVisible1: false,
      dialogVisible2: false,
      fileList: [],
      ruleForm: {
        title: '',
        degree: '',
        recipient: '小强',
        textarea: ''
      },
      rules: {
        title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
        degree: [
          { required: true, message: '请输入紧急程度', trigger: 'blur' }
        ],
        recipient: [{ required: false, message: '', trigger: 'blur' }],
        textarea: [{ required: true, message: '请输入正文', trigger: 'blur' }]
      },
      ruleForm1: {
        recipient: '',
        copyto: '',
        secretsend: '',
        theme: '',
        textarea: '',
        uploadfile: ''
      },
      rules1: {
        recipient: [
          { required: true, message: '请添加收件人', trigger: 'blur' }
        ],
        copyto: [{ required: false, message: '', trigger: 'blur' }],
        secretsend: [{ required: false, message: '', trigger: 'blur' }],
        theme: [{ required: true, message: '请输入主题', trigger: 'blur' }],
        textarea: [{ required: true, message: '请输入正文', trigger: 'blur' }],
        uploadfile: [{ required: false, message: '', trigger: 'blur' }]
      }
    }
  },
  methods: {
    // 消息
    sendmessage(data) {
      console.log(data)
      this.dialogVisible = true
    },
    // 邮件
    sendemail() {
      this.dialogVisible1 = true
    },
    // 消息发送
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
    //  消息取消
    resetForm(formName) {
      this.dialogVisible = false
      this.$refs[formName].resetFields()
    },
    // 邮件发送
    submitForm1(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          console.log('submit!')
          //   this.append(this.ruleForm)
          this.dialogVisible1 = false
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    //  邮件取消
    resetForm1(formName) {
      this.dialogVisible1 = false
      this.$refs[formName].resetFields()
    },
    // 上传文件
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePreview(file) {
      console.log(file)
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 3 个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      )
    },
    // 移除上传文件
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    // 添加收件，抄送，密件人
    addrecipient() {
      this.dialogVisible2 = true
    }
  }
}
</script>
<style scoped>
.msg-center{
  background-color: #D3DCE6;
  padding: 10px;
  width: 220px;
  box-sizing: border-box;
}
.msg-information {
  width: 50%;
  padding: 0px;
  float: left;
  height: 100px;
  text-align: center;
}
.msg-information img {
  width: 90%;
  height: 90%;
}
.msg-information1 {
  width: 100%;
  clear: both;
  height: 160px;
  padding: 7px;
  border-radius: 5px;
  background-color: #fff;
  box-sizing: border-box;
}
.msg-center1 {
  width: 100%;
  font-weight: 600;
}
.msg-center2 {
  width: 100%;
  font-size: 12px;
  color: #888;
  margin: 8px 0;
}
.msg-but {
  width: 55px;
  text-indent: -5px;
}
.msg-buts {
  width: 90px;
  text-indent: -2px;
}
.bg-purple {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.grid-content {
  line-height: 26px;
  text-indent: 5px;
  font-size: 14px;
  color: #666;
}
.el-inputs {
  width: 85%;
}
.el-form-item {
  margin-bottom: 15px;
}
.el-dialog__body {
  padding: 10px 20px;
}
.el-upload__tip {
  margin-top: 0;
  height: 20px;
  line-height: 20px;
}
.icos {
  font-size: 20px;
  color: #199edb;
  cursor: pointer;
}
.icos:hover {
  font-weight: 600;
}
</style>
