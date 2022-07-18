<template>
  <div>
    <el-dialog
      :visible.sync="options.disabled"
      :show-close="options.showClose"
      :title="options.title"
      :top="options.top"
    >
      <!-- 页眉按钮 -->
      <div class="btn-li">
        <el-button :size="options.size" plain @click="changpassword()">
          <i class="el-icon-edit" />修改密码
        </el-button>
        <el-button :size="options.size" plain @click="customizingpage()">
          <i class="el-icon-magic-stick" />定制页面
        </el-button>
        <el-button :size="options.size" type="primary" plain @click="saveinfo('ruleForm')">
          <i class="el-icon-bank-card" />保存
        </el-button>
        <el-button :size="options.size" plain @click="cancal()">
          <i class="el-icon-close" />取消
        </el-button>
      </div>
      <div>
        <el-form
          :label-width="formLabelWidth"
          :model="personaldata"
          :size="options.size"
          label-position="right"
        >
          <div class="headerimg">
            <el-upload
              :show-file-list="false"
              :before-upload="beforeAvatarUpload"
              :on-success="handleAvatarSuccess"
              class="avatar-uploader"
              action="https://jsonplaceholder.typicode.com/posts/"
            >
              <img v-if="personaldata.imgurl" :src="personaldata.imgurl" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon" />
            </el-upload>
          </div>
          <div v-for="(item,index) in personaldata.list" :key="index">
            <div :style="item.style" class="infolist">
              <el-form-item
                :label-width="formLabelWidth"
                :label="item.name"
                :required="item.isrequired"
              >
                <div v-if="item.type === 'text'">
                  <el-input clearable v-model="item.value" :disabled="item.isedit" />
                </div>
                <div v-if="item.type === 'date'">
                  <el-date-picker clearable
                    v-model="item.value"
                    :value-format="options.dateformet"
                    :disabled="item.isedit"
                    type="date"
                    placeholder="选择日期"
                    @change="choosestate()"
                  />
                </div>
                <div v-if="item.type === 'select'">
                  <el-select clearable
                    v-model="item.value"
                    :disabled="item.isedit"
                    :change="choosestate()"
                    :placeholder="$t('pleaseSelect')"
                  >
                    <el-option
                      v-for="(op,ind) in item.option"
                      :key="ind"
                      :label="op.label"
                      :value="op.value"
                    />
                  </el-select>
                </div>
                <div v-if="item.type === 'textarea'">
                  <el-input clearable :rows="item.rows" v-model="item.value" type="textarea" />
                </div>
                <div v-if="item.type === 'password'">
                  <el-input clearable v-model="item.value" type="password" />
                </div>
              </el-form-item>
            </div>
          </div>
        </el-form>
      </div>

      <div style="clear:both" />
    </el-dialog>
    <!-- 修改密码 -->
    <el-dialog :visible.sync="isshowpassword" :top="options.top" title="修改密码">
      <el-form
        ref="ruleForm2"
        :model="passwords"
        :size="options.size"
        :rules="rules"
        status-icon
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="旧密码" prop="oldpass">
          <el-input clearable v-model="passwords.oldpass" type="password" />
        </el-form-item>
        <el-form-item label="新密码" prop="newpass">
          <el-input clearable v-model="passwords.newpass" type="password" />
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input clearable v-model="passwords.checkPass" type="password" />
        </el-form-item>
        <el-form-item label="提示信息：">
          <el-alert :closable="false" type="info" show-icon title="密码长度必须至少6个字符" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="savepasschange('ruleForm2')">保存</el-button>
          <el-button @click="isshowpassword=false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'PortalPersonalset',
  props: {
    options: {
      type: Object,
      default: () => {
        return {
          disabled: true, // true 启用，false禁用
          size: 'mini', // medium / small / mini 说的是整体的放大缩小比例
          dateformet: 'yyyy-MM-dd', // 日期格式
          showClose: false, // 是否显示关闭按钮,false 不显示，true 显示
          title: '个人设置', // 标题名称
          top: '3vh'
        }
      }
    },
    personaldata: {
      type: Object,
      default: () => {
        return {
          list: [
            {
              type: 'text', // input类型 文本
              name: '姓名', // input label
              value: '黄金龙', // input value
              isrequired: true, // true 必填 ，false 非必填
              isedit: true // true 不可编辑，false 可编辑
            },
            {
              type: 'date', // input类型 日期
              name: '生日', // input label
              value: '2019-02-02', // input value
              isrequired: true, // true 必填 ，false 非必填
              isedit: true // true 不可编辑，false 可编辑
            },
            {
              type: 'select', // input类型 下拉框
              name: '状态',
              value: '在岗',
              isrequired: true,
              isedit: true,
              option: [
                // 下拉数据内容
                { label: '出差', value: '出差' },
                { label: '在岗', value: '在岗' },
                { label: '会议', value: '会议' },
                { label: '休假', value: '休假' },
                { label: '回家', value: '回家' }
              ]
            },
            {
              type: 'textarea', // input类型 文本域
              name: '状态描述',
              value: '呼啦啦啦啦啊呀呀呀呀',
              style: 'width:100%', // 表单样式
              rows: '5', // 文本域行数
              isrequired: true,
              isedit: false
            },
            {
              type: 'password', // input类型 密码
              name: '邮箱密码',
              value: '123456',
              isrequired: true,
              isedit: false
            }
          ],
          imgurl: ''
        }
      }
    }
  },
  data() {
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.passwords.newpass) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      formLabelWidth: '90px',
      isshowpassword: false,
      rules: {
        phonenum: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          {
            min: 11,
            max: 13,
            message: '长度在 11 到 13个字符',
            trigger: 'blur'
          }
        ],
        emailname: [{ required: true, message: '请输入邮箱', trigger: 'blur' }],
        password: [
          { required: true, message: '请输入邮箱密码', trigger: 'blur' }
        ],
        oldpass: [
          { required: true, message: '请输入旧密码', trigger: 'blur' },
          { min: 6, message: '长度不小于6位字符', trigger: 'blur' }
        ],
        newpass: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { min: 6, message: '长度不小于6位字符', trigger: 'blur' }
        ],
        checkPass: [{ validator: validatePass2, trigger: 'blur' }]
      },
      passwords: {
        oldpass: '', // 旧密码
        newpass: '', // 新密码
        checkPass: '' // 确认密码
      }
    }
  },
  created() {
    this.options.disabled = false
  },
  methods: {
    // 图片上传方法
    handleAvatarSuccess(res, file) {
      this.personaldata.imgUrl = URL.createObjectURL(file.raw)
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    // 修改input值
    choosestate() {
      console.log(this.personaldata)
    },
    // 修改风格
    choosetheme() {
      // console.log(this.personaldata.themestyle)
    },
    // 修改密码
    changpassword() {
      this.isshowpassword = true
    },
    // 保存修改
    saveinfo(ruleForm) {
      let cansave = true
      this.personaldata.list.forEach(el => {
        if (el.isrequired === true && !el.value) {
          this.$message.warning('请填写' + el.name)
          cansave = false
        }
      })
      console.log(cansave)
      if (cansave === true) {
        this.$message.success('提交保存')
      }
      this.$emit('changepersonalinfo', this.personaldata)
    },
    // 定制页面
    customizingpage() {
      this.$emit('customizingpage', this.personaldata)
    },
    // 取消
    cancal() {
      this.options.disabled = false
    },
    // 保存密码修改
    savepasschange() {
      this.$emit('savepasschange', this.passwords)
      console.log(this.passwords)
    }
  }
}
</script>

<style scoped>
.hamburger {
  display: inline-block;
  vertical-align: middle;
  width: 20px;
  height: 20px;
}

.hamburger.is-active {
  transform: rotate(180deg);
}
/*清浮动*/
.clear-fix:after {
  content: '.';
  clear: both;
  display: block;
  height: 0;
  overflow: hidden;
  visibility: hidden;
}
.per-img {
  border: dashed 2px #ddd;
  width: 100%;
  height: 170px;
  margin-bottom: 18px;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
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
  width: 186px;
  height: 166px;
  line-height: 170px;
  text-align: center;
}
.avatar {
  width: 100%;
  height: 142px;
  display: block;
}
.el-select,
.el-date-picker {
  width: 100%;
}
.btn-li {
  position: absolute;
  top: 23px;
  right: 20px;
}
.el-alert {
  padding: 0;
}
/* 排版2 */
.headerimg {
  float: left;
  width: 28%;
  height: 142px;
  margin: 0 38px 0 93px;
  border: dashed 2px #ddd;
}
.headerimg img {
  width: 100%;
  /* height: 100%; */
}
.infolist {
  float: left;
  width: 50%;
  box-sizing: border-box;
}
</style>
