<template>
  <div class="dashboard-container">
    <!--生日祝福-->
    <el-row>
      <birthday-blessing :birth-list="birthList"/>
    </el-row>
    <!--日程-->
    <el-row>
      <fullcalendar />
    </el-row>
    <el-row>
      <upload-attachment />
    </el-row>
    <el-row>
      <ranking :list="rankingList" :mine-data="mineData"/>
    </el-row>
    <el-row>
      <el-date-picker clearable
        v-model="startDate"
        type="datetime"
        value-format="yyyy-MM-dd HH:mm"
        format="yyyy-MM-dd HH:mm"
        placeholder="请选择开始时间"
      />
      <h4>选择的时间是：{{ startDate }}</h4>
    </el-row>
    <el-row>
      <tinymce v-model="content" :height="300" />
      <div>
        <h4>渲染效果</h4>
        <div v-html="content" />
      </div>
      <div>
        <h4>源代码：</h4>
        {{ content }}
      </div>
    </el-row>
    <!--二维码-->
    <el-row>
      <h4>二维码</h4>
      <qrcode :qr-url="`www.baidu.com`"/>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import UploadAttachment from '@/bpa/components/protal/UploadAttachment'
import Ranking from '@/bpa/components/protal/Ranking'
import Tinymce from '@/bpa/components/protal/Tinymce'
import qrcode from '@/bpa/components/protal/QrCode'
import BirthdayBlessing from '@/bpa/components/protal/BirthdayBlessing'
import Fullcalendar from '@/bpa/components/protal/Fullcalendar'
export default {
  name: 'Dashboard',
  components: {
    UploadAttachment,
    Ranking,
    Tinymce,
    qrcode,
    BirthdayBlessing,
    Fullcalendar
  },
  data() {
    return {
      rankingList: [{ name: '张三', avatar: '', credits: 33 },
        { name: '李四', avatar: '', credits: 20 },
        { name: '王五', avatar: '', credits: 10 },
        { name: '赵六', avatar: '', credits: 5 },
        { name: '朱温', avatar: '', credits: 2 },
        { name: '李存勖', avatar: '', credits: 0 }],
      mineData: {
        no: '0',
        credits: '99'
      },
      startDate: '',
      content: '',
      birthList: [
        { name: '张三', avatar: '', dep: '生产组' },
        { name: '李四', avatar: '', dep: '生产组' },
        { name: '王五', avatar: '', dep: '生产组' },
        { name: '赵六', avatar: '', dep: '生产组' },
        { name: '朱七', avatar: '', dep: '生产组' }
      ]
    }
  },
  computed: {
    ...mapGetters(['name', 'roles'])
  },
  created() {
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
  .el-row{
    margin: 10px 10px;
    border-bottom: 1px dashed #eee;
  }
</style>
