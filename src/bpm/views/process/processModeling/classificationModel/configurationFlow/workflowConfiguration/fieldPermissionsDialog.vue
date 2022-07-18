<template>
  <el-dialog id="fieldPermissionsDialog" v-loading="load" :title="title" width="80%" top="5vh"
    :visible.sync="dialogVisible" append-to-body>
    <el-row style="text-align:right">
      <!-- <el-button type="primary">导出</el-button> -->
      <el-dropdown @command="handleAll" v-if="activeName == 'first'">
        <el-button class="el-dropdown-link margin-l10" type="primary">
          {{ $t("initialization") }}
          <i class="el-icon-arrow-down el-icon--right" />
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-for="(item, index) in typeList" :key="index" :command="item.key">{{ item.value }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-dropdown @command="handleAll" v-if="activeName == 'second'">
        <el-button class="el-dropdown-link margin-l10" type="primary">
          {{ $t("initialization") }}
          <i class="el-icon-arrow-down el-icon--right" />
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-for="(item, index) in filetypeList" :key="index" :command="item.key">{{ item.value }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-dropdown @command="handleAll" v-if="activeName == 'third'">
        <el-button class="el-dropdown-link margin-l10" type="primary">
          {{ $t("initialization") }}
          <i class="el-icon-arrow-down el-icon--right" />
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-for="(item, index) in areatypeList" :key="index" :command="item.key">{{ item.value }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </el-row>
    <!-- <el-row class="margin-t10">
        <el-col :span="6">
           <el-upload
          class="upload-demo"
          ref="upload"
          action="https://jsonplaceholder.typicode.com/posts/"
          :on-change="handleChange"
          :file-list="fileList"
          :auto-upload="false">
          <el-button slot="trigger" type="primary">选择文件</el-button>
        </el-upload>
        </el-col>
    </el-row>-->
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick" style="margin-bottom: 0">
      <el-tab-pane :label="$t('areapermissions')" name="third">
        <el-form class="content">
          <div style="position: relative; height: 380px">
            <div id="hDiv" style="height: 42px; overflow: hidden">
              <table id="tb0" border="1" cellspacing="0" style="
                  border: 1px solid #e1eafd;
                  position: absolute;
                  z-index: 10;
                ">
                <thead style="
                    background: #e1eafd;
                    font-weight: bold;
                    font-size: 12px;
                  ">
                  <tr class="th">
                    <td>{{ activeName | filter() }}</td>
                    <td v-for="(data, index) in areacontent.nodes" :key="index + 1">
                      <el-dropdown>
                        <span class="el-dropdown-link">
                          {{ data.activityname }}
                          <i class="el-icon-arrow-down el-icon--right" />
                        </span>
                        <!-- 这是最上方全部的下拉 -->
                        <el-dropdown-menu slot="dropdown">
                          <el-dropdown-item v-for="(item, s) in areatypeList" :key="s" :command="item.key"
                            @click.native="handleTr(item.key, index)">{{ item.value }}</el-dropdown-item>
                        </el-dropdown-menu>
                      </el-dropdown>
                    </td>
                  </tr>
                </thead>
              </table>
            </div>
            <div id="dDiv" style="
                position: absolute;
                height: 338px;
                top: 42px;
                overflow: auto;
              ">
              <table id="tb1" border="1" cellspacing="0" style="border: 1px solid #e1eafd">
                <tbody>
                  <tr v-for="(data, num) in areacontent.tabs" :key="num + 6"
                    style="line-height: 16px; height: 30px; font-size: 13px">
                    <td>
                      <el-dropdown>
                        <span class="el-dropdown-link">
                          {{ data.tabname }}
                          <i class="el-icon-arrow-down el-icon--right" />
                        </span>
                        <el-dropdown-menu slot="dropdown">
                          <el-dropdown-item v-for="(item, i) in areatypeList" :key="i + 3" :command="item.key"
                            @click.native="handleTd(item.key, num)">{{ item.value }}</el-dropdown-item>
                        </el-dropdown-menu>
                      </el-dropdown>
                    </td>
                    <td v-for="(val, n) in data.ids" :key="n + 1">
                      <el-select v-model="val.val" clearable @change="changeSelect">
                        <el-option v-for="item in areatypeList" :key="item.key + 7" :label="item.value"
                          :value="item.key" />
                      </el-select>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </el-form>
      </el-tab-pane>
      <el-tab-pane :label="$t('fieldPermissions')" name="first">
        <el-form class="content">
          <div style="position: relative; height: 380px">
            <div id="hDiv" style="height: 42px; overflow: hidden">
              <table id="tb0" border="1" cellspacing="0" style="
                  border: 1px solid #e1eafd;
                  position: absolute;
                  z-index: 10;
                ">
                <thead style="
                    background: #e1eafd;
                    font-weight: bold;
                    font-size: 12px;
                  ">
                  <tr class="th">
                    <td>{{ activeName | filter() }}</td>
                    <td v-for="(data, index) in content.nodes" :key="index">
                      <el-dropdown>
                        <span class="el-dropdown-link">
                          {{ data.activityname }}
                          <i class="el-icon-arrow-down el-icon--right" />
                        </span>
                        <!-- 这是最上方全部的下拉 -->
                        <el-dropdown-menu slot="dropdown">
                          <el-dropdown-item v-for="(item, s) in typeList" :key="s" :command="item.key"
                            @click.native="handleTr(item.key, index)">{{ item.value }}</el-dropdown-item>
                        </el-dropdown-menu>
                      </el-dropdown>
                    </td>
                  </tr>
                </thead>
              </table>
            </div>
            <div id="dDiv" style="
                position: absolute;
                height: 338px;
                top: 42px;
                overflow: auto;
              ">
              <table id="tb1" border="1" cellspacing="0" style="border: 1px solid #e1eafd">
                <tbody>
                  <tr v-for="(data, num) in content.fields" :key="num"
                    style="line-height: 16px; height: 30px; font-size: 13px">
                    <td>
                      <el-dropdown>
                        <span class="el-dropdown-link">
                          {{ data.fieldShowName }}
                          <i class="el-icon-arrow-down el-icon--right" />
                        </span>
                        <el-dropdown-menu slot="dropdown">
                          <el-dropdown-item v-for="(item, i) in typeList" :key="i" :command="item.key"
                            @click.native="handleTd(item.key, num)">{{ item.value }}</el-dropdown-item>
                        </el-dropdown-menu>
                      </el-dropdown>
                    </td>
                    <td v-for="(val, n) in data.ids" :key="n">
                      <el-select v-model="val.val" clearable @change="changeSelect">
                        <el-option v-for="item in typeList" :key="item.key" :label="item.value" :value="item.key" />
                      </el-select>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </el-form>
      </el-tab-pane>
      <!-- <el-tab-pane :label="$t('downloadpermissions')" name="second">
        <el-form class="content">
          <div style="position: relative; height: 380px">
            <div id="hDiv" style="height: 42px; overflow: hidden">
              <table id="tb0" border="1" cellspacing="0" style="
                  border: 1px solid #e1eafd;
                  position: absolute;
                  z-index: 10;
                ">
                <thead style="
                    background: #e1eafd;
                    font-weight: bold;
                    font-size: 12px;
                  ">
                  <tr class="th">
                    <td>{{ activeName | filter() }}</td>
                    <td v-for="(data, index) in filecontent.nodes" :key="index + 1">
                      <el-dropdown>
                        <span class="el-dropdown-link">
                          {{ data.activityname }}
                          <i class="el-icon-arrow-down el-icon--right" />
                        </span>
                        <el-dropdown-menu slot="dropdown">
                          <el-dropdown-item v-for="(item, s) in filetypeList" :key="s" :command="item.key"
                            @click.native="handleTr(item.key, index)">{{ item.value }}</el-dropdown-item>
                        </el-dropdown-menu>
                      </el-dropdown>
                    </td>
                  </tr>
                </thead>
              </table>
            </div>
            <div id="dDiv" style="
                position: absolute;
                height: 338px;
                top: 42px;
                overflow: auto;
              ">
              <table id="tb1" border="1" cellspacing="0" style="border: 1px solid #e1eafd">
                <tbody>
                  <tr v-for="(data, num) in filecontent.fields" :key="num + 5"
                    style="line-height: 16px; height: 30px; font-size: 13px">
                    <td>
                      <el-dropdown>
                        <span class="el-dropdown-link">
                          {{ data.fieldShowName }}
                          <i class="el-icon-arrow-down el-icon--right" />
                        </span>
                        <el-dropdown-menu slot="dropdown">
                          <el-dropdown-item v-for="(item, i) in filetypeList" :key="i + 1" :command="item.key"
                            @click.native="handleTd(item.key, num)">{{ item.value }}</el-dropdown-item>
                        </el-dropdown-menu>
                      </el-dropdown>
                    </td>
                    <td v-for="(val, n) in data.ids" :key="n + 1">
                      <el-select v-model="val.val" clearable @change="changeSelect">
                        <el-option v-for="item in filetypeList" :key="item.key + 6" :label="item.value"
                          :value="item.key" />
                      </el-select>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </el-form>
      </el-tab-pane> -->
    </el-tabs>

    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel">{{ $t("cancelAction") }}</el-button>
      <el-button type="primary" @click="submit()">{{ $t("save") }}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import {
  getProcessFieldConfig,
  saveProcessTab,
  getProcessTabConfig,
  saveProcessField,
  getProcessFileFieldConfig,
  saveProcessFileField,
} from "@/bpm/api/process/processModeling/classificationModel";
import { getJurisdiction } from "@/bpm/api/flow";
import main from "@/main";
export default {
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
    },
    id: {
      type: String,
    },
    treeData: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {
      activeName: "first", //这是我们的当前是字段权限 还是附件下载权限
      load: false,
      dialogVisible: this.value,
      fileList: [],
      areatypeList: [
        {
          value: this.$t("hidden"),
          key: "H",
        },
        {
          value: this.$t("show"),
          key: "",
        },
      ],
      typeList: [
        {
          value: this.$t("readOnly"),
          key: "R",
        },
        {
          value: this.$t("edit"),
          key: "W",
        },
        {
          value: this.$t("hidden"),
          key: "H",
        },
      ],
      filetypeList: [
        {
          value: this.$t("readOnly"), //只读
          key: "D",
        },
        {
          value: this.$t("download"),  //默认下载
          key: "",
        },
      ],
      content: {},
      filecontent: {},
      areacontent: {},
    };
  },
  filters: {
    filter (val) {
      if (val === "first") {
        return main.$t("field") + "/ " + main.$t("node");
      }
      if (val === "second") {
        return main.$t("downloadpermissions");
      }
      if (val === "third") {
        return main.$t("areapermissions");
      }
    },
  },
  watch: {
    value (val) {
      this.dialogVisible = val;
      if (val) {
        this.getList();
      }
    },
    dialogVisible (val) {
      this.$emit("input", val);
    },
  },
  mounted () {
    getJurisdiction('BXCXZH').then(rt => {
      // 开启电子签章
      if (rt.data.isStart === 'Y') {
        this.filetypeList = [
          {
            value: this.$t("readOnly"),
            key: "D",
          },
          {
            value: this.$t("download"),
            key: "",
          }, {
            value: this.$t("signature"),
            key: "QZ",
          }
        ]
      }
    })
  },
  methods: {
    handleClick () {
      console.log(this.activeName);
      if (this.activeName === "second") {
      }
    },
    submit () {
      const field = {};
      const filefield = {};
      const areafield = {};
      if (this.content.fields) {
        this.content.fields.forEach((item) => {
          item.ids.forEach((element) => {
            if (element.val !== "R") {
              field[element.name] = element.val;
            }
          });
        });
      }

      if (this.filecontent.fields) {
        this.filecontent.fields.forEach((item) => {
          item.ids.forEach((element) => {
            if (element.val == "D" || element.val == 'QZ') {
              filefield[element.name] = element.val;
            }
          });
        });
      }
      if (this.areacontent.tabs) {
        this.areacontent.tabs.forEach((item) => {
          item.ids.forEach((element) => {
            if (element.val == "H") {
              areafield[element.name] = element.val;
            }
          });
        });
      }

      this.load = true;
      saveProcessFileField({
        field: filefield,
        processId: this.id,
        version: this.treeData.version
      })
        .then((rt) => {
          this.load = false;
          if (rt.status === "200") {
            this.dialogVisible = false;
          }
        })
        .catch((er) => {
          this.load = false;
        });
      saveProcessField({
        field: field,
        processId: this.id,
        version: this.treeData.version
      })
        .then((rt) => {
          this.load = false;
          if (rt.status === "200") {
            this.dialogVisible = false;
          }
        })
        .catch((er) => {
          this.load = false;
        });
      saveProcessTab({
        field: areafield,
        processId: this.id,
        version: this.treeData.version
      })
        .then((rt) => {
          this.load = false;
          if (rt.status === "200") {
            this.dialogVisible = false;
            this.$message.success(this.$t("hintText.saveSuccessfully"));
          }
        })
        .catch((er) => {
          this.load = false;
        });
    },
    cancel () {
      this.dialogVisible = false;
    },
    handleChange (file, fileList) {
      this.fileList = fileList.slice(-1);
    },
    getList () {
      this.load = true;
      // getProcessFileFieldConfig(this.id, {
      //   version: this.treeData.version
      // })
      //   .then((rt) => {
      //     if (rt.status === "200") {
      //       if (
      //         rt.data.fields &&
      //         rt.data.fields.length > 0 &&
      //         rt.data.nodes &&
      //         rt.data.nodes.length > 0
      //       ) {
      //         this.filecontent = rt.data;
      //         this.filecontent.fields.forEach((item) => {
      //           item.ids = [];
      //           this.filecontent.nodes.forEach((element) => {
      //             item.ids.push({
      //               name: `${element.id}_${item.id}`,
      //               val: this.filecontent.map[`${element.id}_${item.id}`]
      //                 ? this.filecontent.map[`${element.id}_${item.id}`]
      //                 : "",
      //             });
      //           });
      //         });
      //       }
      //     }
      //     this.load = false;
      //   })
      //   .catch((er) => {
      //     this.load = false;
      //   });
      getProcessFieldConfig(this.id, {
        version: this.treeData.version
      })
        .then((rt) => {
          if (rt.status === "200") {
            if (
              rt.data.fields &&
              rt.data.fields.length > 0 &&
              rt.data.nodes &&
              rt.data.nodes.length > 0
            ) {
              this.content = rt.data;
              this.content.fields.forEach((item) => {
                item.ids = [];
                this.content.nodes.forEach((element) => {
                  item.ids.push({
                    name: `${element.id}_${item.id}`,
                    val: this.content.map[`${element.id}_${item.id}`]
                      ? this.content.map[`${element.id}_${item.id}`]
                      : "R",
                  });
                });
              });
            }
          }
          this.load = false;
        })
        .catch((er) => {
          this.load = false;
        });
      getProcessTabConfig(this.id, {
        version: this.treeData.version
      })
        .then((rt) => {
          if (rt.status === "200") {
            if (
              rt.data.tabs &&
              rt.data.tabs.length > 0 &&
              rt.data.nodes &&
              rt.data.nodes.length > 0
            ) {
              this.areacontent = rt.data;
              this.areacontent.tabs.forEach((item) => {
                item.ids = [];
                this.areacontent.nodes.forEach((element) => {
                  item.ids.push({
                    name: `${element.id}_${item.id}`,
                    val: this.areacontent.map[`${element.id}_${item.id}`]
                      ? this.areacontent.map[`${element.id}_${item.id}`]
                      : "",
                  });
                });
              });
            }
            console.log();
          }
          this.load = false;
        })
        .catch((er) => {
          this.load = false;
        });
    },
    changeSelect () {
      this.$forceUpdate();
    },
    handleAll (command) {
      if (this.activeName === "first") {
        this.content.fields.forEach((item) => {
          item.ids.forEach((element) => {
            this.$set(element, "val", command);
          });
        });
      }
      if (this.activeName === "second") {
        this.filecontent.fields.forEach((item) => {
          item.ids.forEach((element) => {
            this.$set(element, "val", command);
          });
        });
      }
      if (this.activeName === "third") {
        this.areacontent.tabs.forEach((item) => {
          item.ids.forEach((element) => {
            this.$set(element, "val", command);
          });
        });
      }
      this.$forceUpdate();
    },
    handleTr (value, i) {
      if (this.activeName === "first") {
        this.content.fields.forEach((item) => {
          item.ids.forEach((element, index) => {
            if (i === index) {
              this.$set(element, "val", value);
            }
          });
        });
      }
      if (this.activeName === "second") {
        this.filecontent.fields.forEach((item) => {
          item.ids.forEach((element, index) => {
            if (i === index) {
              this.$set(element, "val", value);
            }
          });
        });
      }
      if (this.activeName === "third") {
        this.areacontent.tabs.forEach((item) => {
          item.ids.forEach((element, index) => {
            if (i === index) {
              this.$set(element, "val", value);
            }
          });
        });
      }
      this.$forceUpdate();
    },
    handleTd (value, i) {
      if (this.activeName === "first") {
        this.content.fields[i].ids.forEach((item) => {
          this.$set(item, "val", value);
        });
      }
      if (this.activeName === "second") {
        this.filecontent.fields[i].ids.forEach((item) => {
          this.$set(item, "val", value);
        });
      }
      if (this.activeName === "third") {
        this.areacontent.tabs[i].ids.forEach((item) => {
          this.$set(item, "val", value);
        });
      }
      this.$forceUpdate();
    },
  },
};
</script>

<style scoped>
.content {
  /* height: 50vh; */
  overflow: auto;
  margin: 10px 0;
  border: 1px solid #dcdfe6;
}
.el-dropdown-link {
  cursor: pointer;
}
</style>
<style lang="scss" scoped>
#fieldPermissionsDialog {
  table {
    max-width: 800px;
    margin: 15px 0;
    text-align: center;
    border-collapse: collapse;
    border: 1px solid #dedede;
    .th {
      font-size: 12px;
      color: $tc1;
      span {
        font-size: 12px;
      }
    }
    td {
      min-width: 113px;
      max-width: 113px;
      padding: 10px;
      span {
        max-width: 105px;
        font-size: 12px;
        display: inline-block;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
  }
}
</style>
