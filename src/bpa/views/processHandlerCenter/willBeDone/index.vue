<template>
  <div class="dashboard-container">
    <el-container>
      <el-aside width="400px">
        <ScoreComponent :options="personalinfo" />
        <ProtalComments />
      </el-aside>
      <el-aside width="350px">
        <Convenient />
        <ProtalTree />
        <ProtalTree1 />
        <ProtalTree2 />
        <ProtalTree3 />
      </el-aside>
      <el-aside width="350px">
        <PersonnelInformation1 :options="Personnelinformation" />
      </el-aside>
    </el-container>
  </div>
</template>

<script>
import ScoreComponent from '@/bpa/components/protal/PortalScore'
import ProtalComments from '@/bpa/components/protal/ProtalComments'
import ProtalTree from '@/bpa/components/protal/ProtalTree'
import ProtalTree1 from '@/bpa/components/protal/ProtalTree/index1'
import ProtalTree2 from '@/bpa/components/protal/ProtalTree/index2'
import ProtalTree3 from '@/bpa/components/protal/ProtalTree/index3'
import Convenient from '@/bpa/components/protal/Convenient'
import PersonnelInformation1 from '@/bpa/components/protal/PersonnelInformation/index1'

export default {
  name: 'Dashboard',
  components: {
    ScoreComponent,
    ProtalComments,
    ProtalTree,
    ProtalTree1,
    ProtalTree2,
    ProtalTree3,
    Convenient,
    PersonnelInformation1
  },
  data() {
    return {
      personalinfo: {
        value2: 0,
        isShow: '1'
      },
      Personnelinformation: {
        name: '旺旺旺',
        state: '在岗',
        common: '常用',
        department: '运维服务部',
        position: '高级计算机软件工程师',
        phone: '13107027099',
        landline: '400-888-888'
      }
    }
  }
}
</script>

<style scoped>

</style>
