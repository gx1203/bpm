<!--公用组件：人员信息卡片
/**
* 按钮组件
* @desc 人员信息卡片展示
* @author yilongjiang
* @date 2019.08.26
* @param {String} [options]
    {
      dialogVisible: false,//发送消息弹窗显示隐藏
      dialogVisible1: false,//发送邮件弹窗显示隐藏
      dialogVisible2: false,//选择收件人弹窗显示隐藏
      fileList: [],//上传文件内容
      ruleForm: {//发送消息字段
        title: '',
        degree: '',
        recipient: '小强',
        textarea: ''
      },
      rules: {//发送消息输入框控制
        title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
        degree: [
          { required: true, message: '请输入紧急程度', trigger: 'blur' }
        ],
        recipient: [{ required: false, message: '', trigger: 'blur' }],
        textarea: [{ required: true, message: '请输入正文', trigger: 'blur' }]
      },
      ruleForm1: {//发送邮件字段
        recipient: '',
        copyto: '',
        secretsend: '',
        theme: '',
        textarea: '',
        uploadfile: ''
      },
      rules1: {//发送邮件输入框控制
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
* @example 调用示例
    <PersonnelInformation1 :options="Personnelinformation" />
*/
-->