<template>
  <el-dialog id="staffManageDialog" :title="title" :visible.sync="dialogVisible">
    <el-form :model="item" ref="item" label-width="120px" class="main">
      <div class="content">
        <el-form-item label="组名:" required>
          <el-input clearable v-model="item.grantor" />
        </el-form-item>
        <el-form-item :label="$t('remarks') + '：'">
          <el-input clearable type="textarea" v-model="item.grantor" />
        </el-form-item>
        <el-form-item :label="$t('isDefaultRole') + '：'">
          <el-switch active-value="1" inactive-value="-1" v-model="item.isDefault"></el-switch>
        </el-form-item>
        <el-form-item :label="$t('whetherToDisable') + '：'">
          <el-switch active-value="1" inactive-value="-1" v-model="item.isDisable"></el-switch>
        </el-form-item>
        <el-form-item :label="$t('includeMembers') + '：'">
          <el-button @click="addDialogVisible = true">{{ $t('add') }}</el-button>
          <el-table
            :data="item.dataList"
            border
            tooltip-effect="dark"
            style="width:100%;margin:15px 0;"
          >
            <el-table-column :label="$t('name2')" prop="name" show-overflow-tooltip align="center"></el-table-column>
            <el-table-column label="类型" prop="name" show-overflow-tooltip align="center"></el-table-column>
            <el-table-column :label="$t('operation')" show-overflow-tooltip align="center" width="120">
              <template slot-scope="scope">
                <el-button type="text" icon="el-icon-delete" @click="deleData(scope.$index)"></el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
      </div>
      <el-form-item :label="$t('judgmentLogic') + '：'" class="tab-input">
        <el-radio-group v-model="item.radio">
          <el-radio :label="1">
            {{ $t('satisfy') }}
            <span class="required">{{ $t('allHave') }}</span> {{ $t('conditionsAndSubCombinations') }}
          </el-radio>
          <el-radio :label="2">
            {{ $t('satisfy') }}
            <span class="required">{{ $t('either') }}</span> {{ $t('conditionOrSubCombination') }}
          </el-radio>
        </el-radio-group>
        <el-button @click="addList">添加条件</el-button>
      </el-form-item>
      <el-table
        :data="item.conditionList"
        border
        tooltip-effect="dark"
        style="width:100%;margin:15px 0;"
      >
        <el-table-column :label="$t('controlType')" show-overflow-tooltip align="center">
          <template slot-scope="scope">
            <el-select clearable v-model="scope.row.type" class="w100" :placeholder="$t('placeholderText.pleaseSelect')">
              <el-option
                v-for="item in typeList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column :label="$t('conditionType')" show-overflow-tooltip align="center">
          <template slot-scope="scope">
            <el-select clearable v-model="scope.row.type" class="w100" :placeholder="$t('placeholderText.pleaseSelect')">
              <el-option
                v-for="item in judgingList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip align="center">
          <template slot="header">
            <span class="required">*</span>
            {{ $t('conditionalResult') }}
          </template>
          <template slot-scope="scope">
            <el-input clearable v-model="scope.row.name"></el-input>
          </template>
        </el-table-column>
        <el-table-column :label="$t('operation')" show-overflow-tooltip align="center" width="120">
          <template slot-scope="scope">
            <el-button type="text" icon="el-icon-delete" @click="conditionDeleData(scope.$index)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="content">
        <el-form-item label="权限设置:"></el-form-item>
      </div>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel">{{ $t('cancelAction') }}</el-button>
      <el-button type="primary" @click="submit('item')">{{ $t('confirm') }}</el-button>
    </span>
    <organization-dialog v-model="addDialogVisible" @confirm="getFlow"></organization-dialog>
  </el-dialog>
</template>
<script>
import organizationDialog from "@/bpm/components/organization/organizationDialog";
export default {
  data() {
    return {
      dialogVisible: this.value,
      addDialogVisible: false,
      typeList: [],
      judgingList: [
        {
          value: "1",
          label: "="
        },
        {
          value: "2",
          label: "!="
        },
        {
          value: "3",
          label: "包含"
        },
        {
          value: "4",
          label: "被包含"
        }
      ]
    };
  },
  components: {
    organizationDialog
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    item: {
      type: Object,
      default: () => {
        return {};
      }
    },
    title: {
      type: String,
      default: false
    }
  },
  watch: {
    value(val) {
      this.dialogVisible = val;
    },
    dialogVisible(val) {
      this.$emit("input", val);
    }
  },
  methods: {
    addList() {
      this.item.conditionList.push({
        name: ""
      });
    },
    deleData(index) {
      this.item.dataList.splice(index, 1);
    },
    conditionDeleData(index) {
      this.item.conditionList.splice(index, 1);
    },
    getFlow(data) {
      this.item.dataList = data;
    },
    submit(formName) {},
    cancel() {
      this.dialogVisible = false;
    }
  },
  mounted() {
  }
};
</script>

<style scoped>
.content {
  width: 60%;
  margin: 0 auto;
  overflow: auto;
  padding: 0 10px;
}
.w100 {
  width: 100%;
}
</style>
<style lang="scss">
#staffManageDialog {
  .tab-input {
    margin-bottom: 0;
    button {
      float: right;
    }
  }
  .main {
    height: 50vh;
    overflow: auto;
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

