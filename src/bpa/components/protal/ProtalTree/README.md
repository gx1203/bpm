<!--公用组件：维度树
/**
* 维度树组件
* @desc 显示维度树组件
* @author yilongjiang
* @date 2019.06.12
* ----不可增删改，不可勾选维度树 index2
    {
      filterText: '',// 过滤参数
      protaltree: [],// 维度树数据
      defaultProps: {// 维度树结构
        children: 'children',//维度层级数组名称
        label: 'name'//名称
      }
    }
* ----可增删改，不可勾选维度树 index
    {
      isShow: '',
      filterText: '',// 过滤参数
      isActive: '',//根据维度树层级判断添加样式
      childform: {// 新增节点对象
        name: '',
        type: '',
        id: ''
      },
      dialogVisible: false,//新增节点对话框 显示隐藏
      dialogVisible1: false,//修改节点对话框 显示隐藏
      protaltree: [],// 维度树数据
      ruleForm: {//节点输入框数据
        name1: '',
        name2: ''
      },
      ruleForm1: {//节点输入框数据
        name1: ''
      },
      rules: { //控制节点输入内容
        name1: [{ required: false, message: '', trigger: 'blur' }],
        name2: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ]
      },
      rules1: { //控制节点输入内容
        name1: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ]
      },
    }
* ----可增删改，可勾选维度树 index1
    {
      datalist:[] //勾选数据
      其他参数与上 index 一致
    }
* @example 调用示例
import ProtalTree2 from '@/bpa/components/ProtalTree/index'
import ProtalTree2 from '@/bpa/components/ProtalTree/index1'
import ProtalTree2 from '@/bpa/components/ProtalTree/index2'
components: {
    ProtalTree,
    ProtalTree1,
    ProtalTree2
  },
展示组件：
    <ProtalTree2 />
    <ProtalTree />
    <ProtalTree1 />
-->