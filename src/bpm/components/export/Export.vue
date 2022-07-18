<template>
  <el-dropdown size="mini" class="system margin-r10" @command="handlerCommand">
    <span class="el-dropdown-link">
      <el-button type="primary">{{ $t('export') }}
        <!--<i class="el-icon-download" />-->
      </el-button>
    </span>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item v-for="item in options" :key="item.value" :command="item.value">
        {{ item.name }}
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
import axios from 'axios'
export default {
  name: 'Export',
  props: {
    filters: {
      type: Array,
      default () {
        return []
      }
    },
    selections: {
      type: Array,
      default () {
        return []
      }
    },
    type: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      options: [
        {
          value: 'excel',
          name: 'excel'
        },
        {
          value: 'json',
          name: 'json'
        }
      ],
      downloadName: ''
    }
  },
  methods: {
    handlerCommand (val) {
      console.log('val',val);
            console.log(this.type);

      let suffix = val === 'json' ? '.json' : val === 'excel' ? '.xls' : ''
      this.downloadName = this.type === 'processroleExport' ? `流程角色${suffix}` : this.type === 'businessruleExport' ? `业务属性${suffix}` : this.type === 'datadictionaryExport' ? `数据字典${suffix}` : this.type === 'middledescExport' ? `业务角色${suffix}` : this.type === 'fieldLibraryExport' ? `字段库维护${suffix}` : this.type === 'positionsExport' ? `岗位组${suffix}` : this.type === 'roleExport' ? `角色管理${suffix}` : this.type === 'orgauthorize' ? `组织权限管理${suffix}` :''
      this.exportFile(val)
    },
    exportFile (val) {
      console.log(val);
      console.log(this.type);
      // this.pageLoading = true
      let url = val === 'json' ? `${this.type}` :  val === 'excel' ? `${this.type}2Excel` : ''
      console.log('url',url);
      // 加主机和端口本地开发会报错 ${process.env.VUE_APP_HOST_URL}
      axios({
        method: 'post',
        url: `${process.env.VUE_APP_BASE_URL}/datamanage/${url}`,
        data: {
          filters: [...this.filters, ...[{ 'key': 'id', 'value': (this.selections.map(x => x.id)).join(','), 'opt': 'IN' }]]
        },
        headers: {
          token: localStorage.getItem('token')
        },
        responseType: 'blob'
      }).then(res => {
        // this.pageLoading = false
        let blob = new Blob([res.data], { type: 'application/vnd.ms-excel' })
        if (window.navigator && window.navigator.msSaveOrOpenBlob) { // 兼容TMD IE
          console.log(this.downloadName)
          navigator.msSaveBlob(blob, this.downloadName)
        } else { // 其他浏览器
          let url = window.URL.createObjectURL(blob)
          let link = document.createElement('a')
          link.style.display = 'none'
          link.href = url
          link.setAttribute('download', this.downloadName)
          document.body.appendChild(link)
          link.click()
          window.URL.revokeObjectURL(link.href); //释放掉blob对象
        }
      }).catch(() => {
        // this.pageLoading = false
      })
    }
  }
}
</script>

<style type="text/scss" lang="scss" scoped>
</style>
