<template>
  <el-dropdown class="international" @command="handleSetLanguage">
    <span class="el-dropdown-link">
      <!-- <img :src="languagPic" style="vertical-align: middle;" alt /> -->
      <i class="iconfont icon-fanyi" style="vertical-align: middle;"></i>
      {{ langName || language }}
      <i class="el-icon-arrow-down" />
    </span>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item v-for="item in langList" :key="item.value" :disabled="language === item.value"
        :command="item.value" style="font-size:12px">{{item.name}}</el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
// import store from "../../store";
// import store2 from "../../../bpa/store";
import store from '../../../store'
import { Base64 } from '@/utils/common'
import { getUserNav } from '@/bpa/api/common'
import languagPic from '@/assets/img/common/languageSwitch.png'
const APP = createNamespacedHelpers('app')
const { mapGetters, mapMutations } = createNamespacedHelpers('app')
const userInfo = createNamespacedHelpers('userInfo')
export default {
  name: 'SwitchLanguage',
  data () {
    return {
      languagPic: languagPic,
      langName: '',
      langList: [
        { name: '中文', value: 'cn' },
        { name: 'English', value: 'en' },
        { name: '繁體中文', value: 'tw' },
        { name: 'Deutsch', value: 'de' },
        { name: 'にほんご', value: 'ja' },
        { name: 'Italian', value: 'it' },
      ]
    }
  },
  computed: {
    ...APP.mapState(['language']),
    ...userInfo.mapGetters(['getUserMenu'])
  },
  watch: {
    language: {
      handler (val) {
        this.langList.forEach(item => {
          if (val === item.value) {
            this.langName = item.name
          }
        })
      },
      immediate: true
    }
  },
  methods: {
    ...APP.mapMutations(['setLanguage']),
    ...userInfo.mapMutations(['setUserMenu']),
    ...mapMutations(['setNavRecords']),
    ...userInfo.mapActions(['requireMenu']),
    ...APP.mapActions(['refreshModuleList']),
    handleSetLanguage (lang) {
      console.log(1)
      this.$i18n.locale = lang
      this.setLanguage(lang)
      this.$store.commit('app/setTabList', [])
      this.setNavRecords([])
      this.$nextTick(function () {
        this.setUserMenu([])
      })
      // getUserNav(1).then(res => {
      //   if (!res) return false
      //   this.$nextTick(function () {
      //     this.setUserMenu(res)
      //     localStorage.setItem('userMenu', Base64.encode(JSON.stringify(this.getUserMenu)))
      //   })
      // })
      // console.log(store)
      this.refreshModuleList().then(res => {
        return this.requireMenu()
      }).then(res => {
        location.reload()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.international {
  cursor: pointer;
  .icon {
    font-size: 20px;
    color: #091452;
    font-weight: bold;
    cursor: pointer;
  }
}
/deep/ .el-dropdown-selfdefine {
  font-size: 12px;
}
/deep/ .el-dropdown-link {
  font-size: 12px;
}
</style>
