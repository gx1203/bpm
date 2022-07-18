<template>
  <div id="approvalRecords">
    <el-form ref="ruleForm" v-loading="pageLoading">
      <el-row class="hint">
        <span>{{ $t("dragAndDropSort") }}</span>
        <el-button type="text" style="font-size: 18px">
          <i @click="add" class="el-icon-circle-plus-outline" />
        </el-button>
      </el-row>
      <el-row type="flex" class="header" align="middle">
        <el-col :span="19">
          {{ $t("approvalNotes") }}
        </el-col>
        <el-col :span="5" style="min-width: 50px">{{ $t("operation") }}</el-col>
      </el-row>
      <div style="max-height: 60vh">
        <draggable
          chosenClass="bg"
          @change="submit"
          v-model="approvalRemarkList"
          dragable="true"
        >
          <el-row
            type="flex"
            align="middle"
            v-for="(item, index) in approvalRemarkList"
            :key="item.key"
            style="border-bottom: 1px solid #e5e5e5"
          >
            <el-col :span="19">
              <el-form-item @dblclick.native="showInput(index, item.id)">
                <span v-if="!item.isShow">{{ item.remark }}</span>
                <el-input
                  clearable
                  v-else
                  type="textarea"
                  @blur="submit"
                  :ref="item.id"
                  v-model="item.remark"
                />
              </el-form-item>
            </el-col>
            <el-col
              :span="5"
              style="min-width: 50px; text-align: center"
              class="center"
            >
              <el-form-item>
                <el-button
                  type="text"
                  :title="$t('delete')"
                  icon="el-icon-delete"
                  @click="handleDeleteOne(item, index)"
                ></el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </draggable>
        <!-- <div class="text-r">
          <el-button type="primary" @click="submit">提交</el-button>
        </div> -->
      </div>
    </el-form>
  </div>
</template>
<script>
import {
  getApprovalRemark,
  saveApprovalRemark,
  batchSaveapprovalRemark,
  deleteApprovalRemark,
} from "../../api/flow";
import draggable from "vuedraggable";
export default {
  name: "approvalRecords",
  components: {
    draggable,
  },
  data() {
    return {
      pageLoading: false,
      approvalRemarkList: [],
    };
  },
  mounted() {
    this.requserlist();
  },
  methods: {
    showInput(i, ref) {
      this.$set(this.approvalRemarkList[i], "isShow", true);
      this.$forceUpdate();
      setTimeout(() => {
        this.$nextTick(() => {
          this.$refs[ref][0].focus();
        });
      }, 100);
    },
    // 删除字段
    handleDeleteOne(item, index) {
      if (item.id) {
        this.$confirm(
          this.$t("hintText.areYouSureDelete"),
          this.$t("hintText.hint"),
          {
            type: "warning",
          }
        )
          .then(() => {
            deleteApprovalRemark(item.id).then((rt) => {
              if (rt.status === "200") {
                this.$message({
                  message: this.$t("hintText.successfullyDelete"),
                  type: "success",
                });
                this.requserlist();
              } else {
                this.$message({
                  message: this.$t("hintText.failToDelete"),
                  type: "error",
                });
              }
            });
          })
          .catch((_) => {});
      } else {
        this.approvalRemarkList.splice(index, 1);
      }
    },
    // 添加字段
    add() {
      this.approvalRemarkList.push({
        isShow: true,
      });
    },
    requserlist() {
      this.pageLoading = true;
      getApprovalRemark({
        attr: {
          userid: this.$store.state.basuser.user.id,
        },
        orderby: "sort",
        sort: "asc",
        pageNum: 1,
        pageSize: 999,
      })
        .then((rt) => {
          if (rt.status === "200") {
            if (rt.data.list) {
              this.approvalRemarkList = rt.data.list.filter(
                (item) => item.type === "2"
              );
              this.approvalRemarkList.forEach((element) => {
                element.isShow = false;
              });
            }
          }
          this.pageLoading = false;
        })
        .catch((_) => {
          this.pageLoading = false;
        });
    },
    submit() {
      this.approvalRemarkList.forEach((item, index) => {
        item.sort = index + 1;
        item.userid = this.$store.state.basuser.user.id;
        item.type = "2";
      });
      this.pageLoading = true;
      batchSaveapprovalRemark(this.approvalRemarkList).then((rt) => {
        this.pageLoading = false;
        if (rt.status === "200") {
          this.$message.success(this.$t("hintText.submittedSuccessfully"));
          this.requserlist();
        } else {
          this.$message.warning(rt.message);
        }
      });
    },
  },
};
</script>
<style lang="scss">
#approvalRecords {
  height: 100%;
  overflow: auto;
  .el-form-item--mini.el-form-item {
    margin-bottom: 0px;
  }
  .hint {
    color: $active-color;
  }
  .w100 {
    width: 100%;
  }
  .el-form-item__content {
    padding: 7px;
  }
  .el-input__inner {
    border: none;
    border-bottom: 1px solid $dc1;
  }
  .text-r {
    button {
      margin: 15px 10px;
    }
  }
}
</style>
<style lang="scss" scoped>
#approvalRecords {
  .bg {
    background-color: $bc2;
  }
  .header {
    font-size: 12px;
    color: $tc1;
    background: $bc2;
    margin-top: 20px;
    .el-col {
      padding: 10px;
    }
  }
  .col-red {
    color: $tc4;
  }
}
</style>
