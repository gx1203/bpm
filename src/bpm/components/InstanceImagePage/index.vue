
<template>
  <div class="dialog_Image" v-show="dialogVisible">
    <div class="instanceImage" v-loading="dialogLoading">
      <iframe :src="processUrl" v-if="processUrl!=''" id="ifra" frameborder="0" />
      <el-image :src="imgUrl" fit="fill" v-if="imgUrl!=''" :preview-src-list="[imgUrl]"></el-image>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import { getActId, getBpaImg } from "@/bpm/api/process/processModeling/process_manage";
import { getProcessImgType } from "@/bpm/api/app";
export default {
  name: "InstanceImageDialog",
  data() {
    return {
      imgUrl: "",
      dialogVisible: this.value,
      processUrl: "",
      alreadyNameData: "",
      dialogLoading: false,
      myHeaders: { token: sessionStorage.getItem("token") }
    };
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    instanceId: {
      type: String,
      default: ""
    },
    bpaVersion: {
      type: String,
      default: ""
    }
  },
  watch: {
    value(val) {
      this.dialogVisible = val;
      if (val) {
        this.fnIsBpa();
      } else {
        this.imgUrl = "";
      }
    },
    dialogVisible(val) {
      this.$emit("input", val);
    }
  },
  methods: {
    fnIsBpa() {
      let that = this;
      that.dialogLoading = true;
      getProcessImgType().then(rt => {
        if (rt.data === "bpa") {
          getBpaImg(this.instanceId)
            .then(rt => {
              this.dialogLoading = false;
              that.processUrl = `${process.env.VUE_APP_BPA_URL}/leftMenu/processChart/BaseNewPage.html?id=${rt.data}&testNameData=${this.alreadyNameData}&version=${this.bpaVersion}`;
            })
            .catch(() => {
              this.dialogLoading = false;
            });
        } else {
          this.getActId();
        }
      });
    },
    getActId() {
      getActId(this.instanceId)
        .then(rt => {
          this.getInstanceImage(rt.data);
        })
        .catch(() => {
          this.dialogLoading = false;
        });
    },
    getInstanceImage(actId) {
      this.dialogLoading = true;
      axios
        .get(
          `${process.env.VUE_APP_HOST_URL}${process.env.VUE_APP_BASE_URL}/processdef/getProcessImage/${actId}`,
          {
            responseType: "arraybuffer",
            headers: {
              ...this.myHeaders
            }
          }
        )
        .then(rt => {
          this.dialogLoading = false;
          this.imgUrl =
            "data:image/png;base64," +
            btoa(
              new Uint8Array(rt.data).reduce(
                (data, byte) => data + String.fromCharCode(byte),
                ""
              )
            );
        })
        .catch(() => {
          this.dialogLoading = false;
        });
    }
  }
};
</script>

<style type="text/scss" lang="scss" scoped>
.dialog_Image {
  width:70vw;
  min-width:500px;
  .instanceImage {
    height: 70vh;
    overflow: auto;
    text-align: center;
    padding: 20px 0 40px;
    iframe {
      width: calc(100% - 1px);
      border-left: 1px solid #dedede;
      height: 69vh;
    }
    img {
      max-width: 100%;
      max-height: 100%;
    }
  }
}
</style>
