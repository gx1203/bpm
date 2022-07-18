<template>
  <el-dialog id="staffManageDialog" :title="title" :visible.sync="dialogVisible">
    <el-form ref="item" :model="item" :rules="rules" label-width="auto" class="content">
      <el-form-item :label="$t('name2') + '：'" prop="name">
        <el-input v-model="item.name" clearable />
      </el-form-item>
      <el-form-item :label="$t('sort') + '：'" prop="sort">
        <el-input v-model="item.sort" min="0" type="number" on-keypress="return(/[\d]/.test(String.fromCharCode(event.keyCode)))" />
      </el-form-item>
      <el-form-item :label="$t('icon') + '：'">
        <!--<el-select v-model="item.ico" clearable filterable :placeholder="$t('placeholderText.pleaseSelect')">-->
          <!--<el-option-->
            <!--v-for="(item, index) in iconList"-->
            <!--:key="index"-->
            <!--:label="item.label"-->
            <!--:value="item.className"-->
          <!--&gt;-->
            <!--<span slot>-->
              <!--<i class="iconfont" :class="item.className" @click="selectIcon(item.className)" />-->
            <!--</span>-->
          <!--</el-option>-->
        <!--</el-select>-->
        <!--<el-popover v-model="isIconShow" width="400" trigger="focus">-->
        <!--<el-row class="icon">-->
        <!--<el-col :span="24">-->
        <!--<ul>-->
        <!--<li v-for="(item, index) in iconList" :key="index">-->
        <!--<i class="iconfont" :class="item.className" @click="selectIcon(item.className)" />-->
        <!--</li>-->
        <!--</ul>-->
        <!--</el-col>-->
        <!--</el-row>-->
        <!--<span slot="reference">-->
        <!--<el-input v-model="item.ico" clearable />-->
        <!--</span>-->
        <!--</el-popover>-->
        <el-popover
                width="400"
                v-model="isIconShow"
                trigger="focus">
          <ul>
          <li v-for="(item, index) in iconList" :key="index">
          <i class="iconfont" :class="item.className" @click="selectIcon(item.className)" />
          </li>
          </ul>
          <span slot="reference">
          <el-input v-model="item.ico" clearable />
          </span>
        </el-popover>
      </el-form-item>
      <el-form-item :label="$t('type') + '：'">
        <el-select v-model="item.type" clearable class="w100" :placeholder="$t('placeholderText.pleaseSelect')">
          <el-option
            v-for="item in typeList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <!-- <el-form-item label="下级展现方式:">
        <el-radio-group v-model="item.showtype">
          <el-radio label="default">导航分类</el-radio>
          <el-radio label="select">下拉</el-radio>
        </el-radio-group>
      </el-form-item> -->

      <!-- <el-form-item label="来源模块:">
        <el-select clearable v-model="item.service" class="w100" :placeholder="$t('placeholderText.pleaseSelect')">
          <el-option
            v-for="item in sourceList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="模块实例:">
        <el-select clearable v-model="item.moduleInstance" class="w100" :placeholder="$t('placeholderText.pleaseSelect')">
          <el-option
            v-for="item in moduleInstanceList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item> -->
      <el-form-item :label="$t('link') + '：'" prop="url" v-if="item.type === 'item'">
        <el-input v-model="item.url" clearable />
      </el-form-item>
      <!-- <el-form-item :label="$t('authority') + '：'">
        <el-button @click="addList">添加</el-button>
        <el-table
          :data="item.navigationMainDtoList"
          border
          tooltip-effect="dark"
          style="width:100%;margin:15px 0;"
        >
          <el-table-column :label="$t('name2')" prop="name" show-overflow-tooltip align="center">
            <template slot-scope="scope">
              <el-input clearable v-model="scope.row.name"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="链接" prop="name" show-overflow-tooltip align="center">
            <template slot-scope="scope">
              <el-input clearable v-model="scope.row.name"></el-input>
            </template>
          </el-table-column>
          <el-table-column :label="$t('operation')" show-overflow-tooltip align="center" width="120">
            <template slot-scope="scope">
              <el-button type="text" icon="el-icon-delete" @click="deleData(scope.$index)"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item> -->
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel">{{ $t('cancelAction') }}</el-button>
      <el-button type="primary" @click="submit('item')">{{ $t('confirm') }}</el-button>
    </span>
  </el-dialog>
</template>
<script>
import '@/assets/font1/iconfont.css'
import { getNavigationIdShow, saveNavigation } from '@/bpm/api/configManage/navConfig'
export default {
  name: 'ManageDialog',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    item: {
      type: Object,
      default: () => {
        return {}
      }
    },
    title: {
      type: String,
      default: ''
    }
  },
  data() {
    const sortPudge = (rule, value, callback) => {
      if (this.item.sort && this.item.sort.length > 10) {
        callback(new Error(this.$t('sortingIsTooLong')))
      } else {
        callback()
      }
    }
    return {
      gridData: [{
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }],
      rules: {
        name: [
          { required: true, message: this.$t('placeholderText.pleaseEnterName'), trigger: 'blur' },
          { max: 100, message: '名字超长', trigger: 'blur' }
        ],
        sort: [{ validator: sortPudge, trigger: 'blur' }]
      },
      dialogVisible: this.value,
      iconList: [],
      isIconShow: false,
      typeList: [
        {
          value: 'category',
          label: this.$t('navigationClassification')
        },
        {
          value: 'item',
          label: this.$t('navigationItem')
        }
      ],
      sourceList: [
        {
          value: '',
          label: this.$t('customLink')
        },
        {
          value: '1',
          label: this.$t('pageModule')
        },
        {
          value: '0',
          label: this.$t('menuModule')
        }
      ],
      moduleInstanceList: []
      // item: {
      //   navigationMainDtoList: []
      // }
    }
  },
  watch: {
    value(val) {
      this.dialogVisible = val
      console.log(this.$store.state)
      this.$nextTick(function() {
        this.iconList = this.$store.state.icon.iconList
      })
      // if (val) {
      //   this.getData()
      // }
    },
    dialogVisible(val) {
      this.$emit('input', val)
    }
  },
  methods: {
    selectIcon(className) {
      this.isIconShow = false
      this.$set(this.item, 'ico', className)
    },
    // getData () {
    //   getNavigationIdShow(this.id)
    //     .then(rt => {
    //       if (rt.status === '200') {
    //         this.item = rt.data
    //       }
    //       this.loading = false
    //     })
    //     .catch(() => {
    //       this.loading = false
    //     })
    // },
    submit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          saveNavigation(this.item)
            .then(rt => {
              if (rt.status === '200') {
                this.$message.success(`${this.title}成功`)
                this.dialogVisible = false
                this.$emit('confirm', this.item)
              }
              this.loading = false
            })
            .catch(() => {
              this.loading = false
            })
        }
      })
    },
    cancel() {
      this.dialogVisible = false
    },
    addList() {
      this.item.navigationMainDtoList.push({})
    },
    deleData(index) {
      this.item.navigationMainDtoList.splice(index, 1)
    }
  }
}
</script>

<style scoped>
.content {
  height: 50vh;
  width: 60%;
  margin: 0 auto;
  overflow: auto;
  padding: 0 10px;
}
.w100 {
  width: 100%;
}
.el-popover li {
  display: inline-block;
  vertical-align: top;
}
.el-popover li i {
  width: 30px;
  height: 30px;
  line-height: 30px;
  list-style: none;
  display: block;
  text-align: center;
  margin-top: 10px;
  cursor: pointer;
  -webkit-transition: font-size 0.25s linear, width 0.25s linear;
  -moz-transition: font-size 0.25s linear, width 0.25s linear;
  transition: font-size 0.25s linear, width 0.25s linear;
}

.el-popover li:hover i {
  font-size: 30px;
}
</style>
<style lang="scss">
#staffManageDialog {
  .avatar-uploader .el-upload {
    border: 1px dashed $dc1;
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
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
}
</style>
