const screenStart = {
  namespaced: true,
  state: {
    Department: {
      approvalValue: '', // 节点类型
      yearValue: '', // 年份数据
      monthValue: '', // 月份数据
      timeValue: [], // 时间组件初始化值
      processValue: [], // 业务域初始化值
      modelid: '', // 业务域ID
      startChoice: '1',
      companyId: '', // 公司id
      deptid: '', // 部门id
      companyName: '', // 筛选回显名字
      setTime: '' // 开始结束时间
    }, // 任务效率分析按部门筛选条件
    Process: {
      approvalValue: '',
      yearValue: '',
      monthValue: '',
      timeValue: [], // 时间组件初始化值
      processValue: [], // 业务域初始化值
      modelid: '', // 业务域ID
      setTime: '' // 开始结束时间
    }// 任务效率分析按流程筛选条件
  },
  getters: {
    getDepartment(state) {
      return state.Department
    },
    getProcess(state) {
      return state.Process
    }
  },
  mutations: {
    setDepartment(state, Department) {
      state.Department = Department
    },
    setProcess(state, Process) {
      state.Process = Process
    }
  },
  actions: {
    async getCurrentDepartment({ commit }, val) {
      const result = val
      commit('setDepartment', result)
    },
    async getCurrentProcess({ commit }, val) {
      const result = val
      commit('setProcess', result)
    }
  }
}
export default screenStart
