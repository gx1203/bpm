<template>
  <el-dialog :title="$t('selectDataSource')" :visible.sync="dialogVisible" v-loading="load" top="5vh" append-to-body>
    <el-row type="flex" justify="end">
      <el-button @click="getList" type="primary">{{$t('refresh')}}</el-button>
      <el-button @click="goDictionaryPage" type="primary">{{$t('newAdd')}}</el-button>
    </el-row>
    <el-table
      :data="content.list"
      style="width: 100%; margin: 10px 0"
      stripe
      :header-cell-style="{background: '#E1EAFD !important'}"
      highlight-current-row
      @current-change="handleCurrentChange"
    >
      <el-table-column :label="$t('placeholderText.select')" width="50" align="center">
        <template slot-scope="scope">
          <el-radio v-model="selectIndex" :label="scope.$index">{{''}}</el-radio>
        </template>
      </el-table-column>
      <el-table-column>
        <template slot="header" slot-scope="scope">
          <el-input clearable v-model="dictionaryen" @keyup.enter.native="seach" :placeholder="$t('placeholderText.numberSearch')" />
        </template>
        <el-table-column prop="dictionaryen" :label="$t('numbering')" align="center" />
      </el-table-column>
      <el-table-column>
        <template slot="header" slot-scope="scope">
          <el-input clearable v-model="dictionarycn" @keyup.enter.native="seach" :placeholder="$t('placeholderText.nameSearch')" />
        </template>
        <el-table-column prop="dictionarycn" :label="$t('name2')" align="center" />
      </el-table-column>
      <el-table-column>
        <template slot="header" slot-scope="scope">
          <el-input clearable v-model="customsql" @keyup.enter.native="seach" :placeholder="$t('placeholderText.SQLStatementSearch')" />
        </template>
        <el-table-column prop="customsql" :label="$t('sqlStatement2')" align="center" />
      </el-table-column>
    </el-table>
    <div>
      <el-pagination
        :page-size="pageSize"
        :current-page.sync="pageNum"
        :total="content.total"
        background
        @current-change="handlePageChanged"
      />
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel">{{ $t('cancelAction') }}</el-button>
      <el-button type="primary" @click="submit">{{ $t('confirm') }}</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { getDictoraryList } from "@/bpm/api/configManage/dataDictorary";
export default {
  data() {
    return {
      content: {},
      dialogVisible: this.value,
      load: false,
      selectIndex: -1,
      pageNum: 1,
      pageSize: 10,
      dictionaryen: "",
      dictionarycn: "",
      customsql: ""
    };
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    item: {
      type: String,
      default: () => {
        return "";
      }
    }
  },
  watch: {
    value(val) {
      this.dialogVisible = val;
      this.selectIndex = -1;
      if (val && this.item) {
        this.selectIndex = this.content.list.findIndex(
          item => item.dictionaryen === this.item
        );
      }
    },
    dialogVisible(val) {
      this.$emit("input", val);
    }
  },
  methods: {
    // 跳转到数据字典
    goDictionaryPage(){
      let route = this.$router.resolve({
        path: "/config/configPersonalDataDictorary/dataDictorary",
        query: { showDictionaryDialog: true }
      });
      window.open(route.href, '_blank');
    },
    seach() {
      this.pageNum = 1;
      this.getList();
    },
    getList() {
      this.load = true;
      let than = this;
      getDictoraryList({
        logic: "and",
        pageNum: than.pageNum,
        pageSize: than.pageSize,
        filters: [
          {
            key: "dictionaryen",
            opt: "LIKE",
            type: "S",
            value: than.dictionaryen
          },
          {
            key: "dictionarycn",
            opt: "LIKE",
            type: "S",
            value: than.dictionarycn
          },
          { key: "customsql", opt: "LIKE", type: "S", value: than.customsql }
        ]
      })
        .then(rt => {
          if (rt.status === "200") {
            than.content = rt.data;
            than.selectIndex = -1;
            if (than.item) {
              than.selectIndex = than.content.list.findIndex(
                item => item.dictionaryen === than.item
              );
            }
          }
          than.load = false;
        })
        .catch(() => {
          than.load = false;
        });
    },
    handlePageChanged() {
      this.getList();
    },
    handleCurrentChange(val) {
      if (val) {
        this.selectIndex = this.content.list.findIndex(
          item => item.id === val.id
        );
      }
    },
    submit() {
      if (this.selectIndex >= 0) {
        const data = JSON.parse(
          JSON.stringify(this.content.list[this.selectIndex])
        );
        this.$emit("confirm", data);
      }
      this.dialogVisible = false;
    },
    cancel() {
      this.dialogVisible = false;
    }
  },
  mounted() {
    this.getList();
  }
};
</script>

<style scoped>
</style>
