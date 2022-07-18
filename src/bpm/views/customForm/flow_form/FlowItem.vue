<template>
  <div class="flow-item">
    <!-- <editor :item='item'></editor> -->
    <el-input
      v-if="item.inputType === 'text'"
      v-show="item.editstate !== 'H'"
      :ref="item.id"
      v-model="item.applyvalue"
      clearable
      :title="item.applyvalue"
      autocomplete="off"
      show-word-limit
      :type="item.inputType"
      readonly
      @input="changeValue"
    />
    <el-input
      v-if="item.inputType === 'textarea'"
      v-show="item.editstate !== 'H'"
      :ref="item.id"
      v-model="item.applyvalue"
      clearable
      :title="item.applyvalue"
      autocomplete="off"
      :autosize="{ minRows: 2 }"
      show-word-limit
      :type="item.inputType"
      readonly
      @input="changeValue"
    />
    <el-input
      v-if="item.inputType === 'contact'"
      v-show="item.editstate !== 'H'"
      :ref="item.id"
      v-model="item.applyvalue"
      clearable
      :title="item.applyvalue"
      autocomplete="off"
      show-word-limit
      type="text"
      readonly
      @input="changeValue"
    />
    <el-input
      v-if="item.inputType === 'hidden'"
      v-show="item.editstate !== 'H'"
      :ref="item.id"
      v-model="item.applyvalue"
      clearable
      :type="item.inputType"
      :title="item.applyvalue"
      readonly
    />
    <el-input
      v-else-if="item.inputType === 'number'"
      v-show="item.editstate !== 'H'"
      :ref="item.id"
      v-model="item.applyvalue"
      clearable
      :title="item.applyvalue"
      type="number"
      onkeypress="return(/[\d-]/.test(String.fromCharCode(event.keyCode)))"
      readonly
      @input="changeValue"
    />
    <el-input
      v-else-if="item.inputType === 'rate'"
      v-show="item.editstate !== 'H'"
      :ref="item.id"
      v-model="item.applyvalue"
      clearable
      type="number"
      onkeypress="return(/[\d.+-]/.test(String.fromCharCode(event.keyCode)))"
      autocomplete="off"
      readonly
      @input="changeValue"
    />
    <el-input
      v-else-if="item.inputType === 'double'"
      v-show="item.editstate !== 'H'"
      :ref="item.id"
      v-model="item.applyvalue"
      clearable
      autocomplete="off"
      type="text"
      :title="item.applyvalue"
      :name="item.id"
      readonly
      @blur="textBlur(item.event)"
      @input="doubleValue"
    />
    <el-input
      v-else-if="item.inputType === 'decimal'"
      v-show="item.editstate !== 'H'"
      :ref="item.id"
      v-model="item.applyvalue"
      clearable
      type="number"
      onkeypress="return(/[\d.+-]/.test(String.fromCharCode(event.keyCode)))"
      :title="item.applyvalue"
      autocomplete="off"
      readonly
      @input="changeValue"
    />
    <el-input
      v-if="item.inputType === 'email'"
      v-show="item.editstate !== 'H'"
      :ref="item.id"
      v-model="item.applyvalue"
      clearable
      :title="item.applyvalue"
      :placeholder="item.placeholder"
      autocomplete="off"
      show-word-limit
      :type="item.inputType"
      @input="changeValue"
    />

    <!--<el-input clearable-number-->
    <!--v-else-if="item.inputType === 'number' || item.inputType === 'double' || item.inputType === 'rate'"-->
    <!--v-model="item.applyvalue"-->
    <!--:precision="item.applyvalue && item.inputType === 'number' ? 0 : item.applyvalue && item.inputType !== 'number' ? 2 : 0"-->
    <!--:ref="item.id"-->
    <!--:controls="false"-->
    <!--:disabled="item.editstate === 'R'"-->
    <!--v-show="item.editstate !== 'H'"-->
    <!--@input="changeValue"-->
    <!--style="width: 100%" />-->
    <el-select
      v-else-if="item.inputType === 'select'"
      v-show="item.editstate !== 'H'"
      :ref="item.id"
      v-model="item.applyvalue"
      clearable
      filterable
      :title="item.showValue"
      readonly
      auto-complete="off"
      class="closePlaceholder"
      autocomplete="new-password"
      style="width: 100%"
      @visible-change="selectFocus"
      @change="changeSelect"
    >
      <el-option
        v-for="(option, index1) in item.nodeoptions"
        :key="index1"
        :label="option.text"
        :value="option.value"
      >
        <span style="float: left">{{ option.text }}</span>
      </el-option>
    </el-select>
    <el-select
      v-else-if="item.inputType === 'selectMultiple'"
      v-show="item.editstate !== 'H'"
      :ref="item.id"
      v-model="item.selectMoreData"
      clearable
      multiple
      filterable
      :title="item.showValue"
      auto-complete="off"
      readonly
      class="closePlaceholder"
      autocomplete="new-password"
      style="width: 100%"
      :placeholder="item.placeholder"
    >
      <el-option
        v-for="(option, index1) in item.nodeoptions"
        :key="index1"
        :label="option.text"
        :value="option.value"
      >
        <span style="float: left">{{ option.text }}</span>
      </el-option>
    </el-select>
    <el-radio-group
      v-else-if="item.inputType === 'radio'"
      v-show="item.editstate !== 'H'"
      :ref="item.id"
      v-model="item.applyvalue"
      autocomplete="off"
      readonly
    >
      <el-radio
        v-for="option in item.nodeoptions"
        :key="option.value"
        :label="option.value"
        @change="changeRadio(item, option)"
      >
        {{ option.text }}
      </el-radio>
    </el-radio-group>
    <el-checkbox-group
      v-else-if="item.inputType === 'checkbox'"
      v-show="item.editstate !== 'H'"
      :ref="item.id"
      v-model="item.applyArray"
      autocomplete="off"
      readonly
      @change="changeCheckbox(item)"
    >
      <el-checkbox
        v-for="option in item.nodeoptions"
        :key="option.value"
        :label="option.value"
      >
        {{ option.text }}
      </el-checkbox>
    </el-checkbox-group>
    <el-date-picker
      v-else-if="item.inputType === 'date'"
      v-show="item.editstate !== 'H'"
      :ref="item.id"
      v-model="item.applyvalue"
      clearable
      :default-value="timeDefaultShow"
      placeholder="选择日期"
      readonly
      format="yyyy-MM-dd"
      style="width: 100%"
      @change="changeValue"
    />
    <el-date-picker
      v-else-if="item.inputType === 'date_limit'"
      v-show="item.editstate !== 'H'"
      type="datetimerange"
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      :ref="item.id"
      v-model="item.applyvalue"
      clearable
      :default-value="timeDefaultShow"
      placeholder="选择日期"
      readonly
      value-format="yyyy-MM-dd"
      :default-time="['00:00:00', '23:59:59']"
      style="width: 100%"
      @change="changeValue"
    />
    <el-date-picker
      v-else-if="item.inputType === 'date-edit'"
      v-show="item.editstate !== 'H'"
      :ref="item.id"
      v-model="item.applyvalue"
      autocomplete="off"
      clearable
      :editable="item.inputType === 'date-edit'"
      placeholder="选择日期"
      readonly
      style="width: 100%"
      format="yyyy-MM-dd"
      @change="changeValue"
    />
    <el-date-picker
      v-else-if="item.inputType === 'time' || item.inputType === 'time-edits'"
      v-show="item.editstate !== 'H'"
      :ref="item.id"
      v-model="item.applyvalue"
      autocomplete="off"
      readonly
      placeholder="选择日期时间"
      clearable
      style="width: 100%"
      format="yyyy-MM-dd HH:mm:ss"
      type="datetime"
      @change="changeValue"
    />
    <el-date-picker
      v-else-if="item.inputType === 'month'"
      v-show="item.editstate !== 'H'"
      :ref="item.id"
      v-model="item.applyvalue"
      autocomplete="off"
      :placeholder="item.placeholder || '选择月份'"
      clearable
      style="width: 100%"
      value-format="yyyy-MM"
      format="yyyy-MM"
      type="month"
      @change="changeValue"
    />
    <el-date-picker
      v-else-if="item.inputType === 'year'"
      v-show="item.editstate !== 'H'"
      :ref="item.id"
      v-model="item.applyvalue"
      autocomplete="off"
      :title="item.applyvalue"
      :placeholder="item.placeholder || '选择年份'"
      clearable
      style="width: 100%"
      value-format="yyyy"
      format="yyyy"
      type="year"
      @change="changeValue"
    />
    <!--<el-time-picker-->
    <!--v-else-if="item.inputType === 'time' || item.inputType === 'time-edits'"-->
    <!--:ref="item.id"-->
    <!--v-model="item.applyvalue"-->
    <!--:editable="item.inputType === 'time-edits'"-->
    <!--:disabled="item.editstate === 'R'"-->
    <!--v-show="item.editstate !== 'H'"-->
    <!--placeholder="选择时间"-->
    <!--style="width: 100%"-->
    <!--@change="changeValue" />-->
    <el-rate
      v-else-if="item.inputType === 'rating-1' || item.inputType === 'rating-2'"
      v-show="item.editstate !== 'H'"
      :ref="item.id"
      v-model="item.applyvalue"
      autocomplete="off"
      :allow-half="item.inputType === 'rating-2'"
      readonly
      @change="changeValue"
    />
    <el-tree
      v-else-if="item.inputType === 'treetable'"
      v-show="item.editstate !== 'H'"
      class="elTree"
      :data="item.tableDataLists"
      readonly
      autocomplete="off"
    />
    <el-cascader
      v-else-if="item.inputType === 'province'"
      v-show="item.editstate !== 'H'"
      class="province"
      v-model="item.applyvalue"
      :options="areaoptions"
    ></el-cascader>
    <!-- <ckeditor
      v-else-if="item.inputType === 'ckeditor'"
      v-model="item.applyvalue"
      :editor="editor"
      :config="editorConfig"
      readonly
      v-show="item.editstate !== 'H'"
    ></ckeditor>-->
    <quill-editor
      v-else-if="item.inputType === 'ckeditor'"
      v-show="item.editstate !== 'H'"
      ref="myQuillEditor"
      v-model="item.applyvalue"
      v-loading="quillUpdateImg"
      style="width: 100%"
      :class="[item.editstate === 'R' ? 'bag' : '']"
      :options="editorOption"
      readonly
      @blur="onEditorBlur($event)"
      @focus="onEditorFocus($event)"
      @change="onEditorChange($event)"
    />
    <city-picker
      v-else-if="item.inputType === 'city'"
      v-show="item.editstate !== 'H'"
      v-model="item.applyvalue"
      field="city"
      placeholder="选择城市"
      :no-hot="true"
      :title="item.showValue"
      readonly
      style="width: 100%"
    />
    <el-upload
      v-else-if="item.inputType === 'file'"
      v-show="item.editstate !== 'H'"
      autocomplete="off"
      :file-list="item.applyvalue"
      action="/api/file/certification/file"
      list-type="text"
      readonly
    >
      <el-button type="primary"> 上传附件 </el-button>
    </el-upload>
    <el-row
      v-else-if="item.inputType === 'nokt'"
      type="flex"
      :gutter="10"
      justify="space-between"
      style="display: flex; align-items: center"
    >
      <el-col :span="18" style="border-bottom: 1px solid #dedede; height: 28px">
        <el-button
          v-if="item.showValue"
          type="text"
          style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap"
          @click="open(false)"
        >
          {{ item.showValue }}
        </el-button>
      </el-col>
      <el-col :span="6">
        <el-row type="flex">
          <!-- <el-col :span="18" v-if="item.editstate !== 'R'">
          <el-upload
            autocomplete="off"
            :action="action"
            ref="upload"
            readonly
            v-show="item.editstate !== 'H'"
            :on-success="onSuccess"
            class="upload-demo"
            :headers="myHeaders"
            :accept="accept"
            :before-upload="beforeAvatarUpload"
            :auto-upload="true"
            :show-file-list="false"
          >
            <el-button type="primary">上传附件</el-button>
          </el-upload>
          </el-col>-->
          <el-col :span="12">
            <el-col :span="12">
              <el-button type="text" icon="el-icon-edit"> 编辑 </el-button>
            </el-col>
            <el-col :span="12">
              <el-upload
                v-show="item.editstate !== 'H'"
                ref="upload"
                autocomplete="off"
                :action="action"
                :on-success="onSuccess"
                class="upload-demo"
                :headers="myHeaders"
                :accept="accept"
                :before-upload="beforeAvatarUpload"
                :auto-upload="true"
                :show-file-list="false"
              >
                <el-button icon="el-icon-upload2" type="text"> 上传 </el-button>
              </el-upload>
            </el-col>
          </el-col>
          <el-col :span="12">
            <el-button
              type="text"
              icon="el-icon-download"
              @click="downloadFile(item)"
            >
              下载
            </el-button>
            <el-button
              type="text"
              icon="el-icon-delete"
              @click="deleteFile(item)"
            >
              删除
            </el-button>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <div
      v-else-if="
        item.inputType === 'selectOrgPowerMore' ||
        item.inputType === 'selectOrgPower' ||
        item.inputType === 'selectPeopleSingle' ||
        item.inputType === 'selectOrganization' ||
        item.inputType === 'selectPeopleMore' ||
        item.inputType === 'selectOrganizationMore' ||
        item.inputType === 'multipleDialog' ||
        item.inputType === 'radioDialog'
      "
    >
      <el-input
        v-show="item.editstate !== 'H'"
        :ref="item.id"
        clearable
        :value="item.showValue"
        :title="item.showValue"
        autocomplete="off"
        readonly
        suffix-icon="el-icon-arrow-down"
        placeholder="请单击选择"
        @clear="clearSelect(item)"
        @focus="showSelect(item)"
      />
      <!-- <el-button v-show="item.editstate === 'W'" @click="clearSelect(item)" type="text">清空</el-button> -->
      <select-org
        v-model="organizeDialog"
        :is-more="item.inputType.endsWith('More')"
        :check-data="checkData"
        is-strictly
        :power="item.power"
        @confirm="getOrg"
      />
      <select-people
        v-model="peopleDialog"
        :is-more="item.inputType.endsWith('More')"
        :user-all="userAll"
        :is-form="isForm"
        :radio-checked="item.applyvalue"
        @confirm="getUser"
      />
    </div>
    <el-input
      v-if="item.inputType === 'process'"
      v-show="item.editstate !== 'H'"
      :ref="item.id"
      clearable
      :value="item.showValue"
      :title="item.showValue"
      autocomplete="off"
      readonly
      suffix-icon="el-icon-arrow-down"
      placeholder="请单击选择"
    />
  </div>
</template>

<script>
import { quillEditor } from "vue-quill-editor"; // 调用编辑器
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";

import cityList from "china-city-data";
import CityPicker from "./CityPicker";
import SelectOrg from "./SelectOrganization";
import SelectPeople from "./SelectPeople";
// import editor from "../../components/editor";
import axios from "axios";
import { createNamespacedHelpers } from "vuex";
const { mapGetters, mapMutations } = createNamespacedHelpers("app");

window.CITY_PICKER_LIST = cityList;

export default {
  name: "FlowItem",
  components: {
    // editor,
    CityPicker,
    quillEditor,
    SelectOrg,
    SelectPeople,
  },
  props: {
    item: {
      type: Object,
      default: () => ({}),
    },
    bizData2: {
      type: Object,
      default: null,
    },
    isPrint: {
      type: Boolean,
    },
  },

  data() {
    return {
      areaoptions: [],
      accept:
        "application/msword," +
        "application/vnd.ms-excel," +
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document," +
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      organizeDialog: false,
      isForm: "form",
      peopleDialog: false,
      isMore: false,
      timeDefaultShow: "",
      quillUpdateImg: false,
      myHeaders: { token: sessionStorage.getItem("token") },
      action: `${process.env.HOST_URL}${process.env.BASE_URL}/attach/upload?attachmentType=bpm`,
      selectType: "",
      editorOption: {
        placeholder: "请在此处编辑富文本",
        modules: {
          toolbar: {
            container: [
              ["bold", "italic", "underline", "strike"], // 加粗，斜体，下划线，删除线
              ["blockquote", "code-block"], // 引用，代码块
              [{ header: 1 }, { header: 2 }], // 标题，键值对的形式；1、2表示字体大小
              [{ indent: "-1" }, { indent: "+1" }], // 缩进
              [{ direction: "rtl" }], // 文本方向
              [{ size: ["small", false, "large", "huge"] }], // 字体大小
              [{ header: [1, 2, 3, 4, 5, 6, false] }], // 几级标题
              [{ color: [] }, { background: [] }], // 字体颜色，字体背景颜色
              [{ font: [] }], // 字体
              [{ align: [] }], // 对齐方式
              ["image"], // 上传图片
            ],
            // handlers: {
            // 'image': function (value) {
            //     if (value) {
            //         document.querySelector('.avatar-uploader input').click()
            //     } else {
            //         this.quill.format('image', false);
            //     }
            // }
            // }
          },
        },
      },
      titleConfig: [
        { Choice: ".ql-bold", title: "加粗" },
        { Choice: ".ql-italic", title: "斜体" },
        { Choice: ".ql-underline", title: "下划线" },
        { Choice: ".ql-header", title: "段落格式" },
        { Choice: ".ql-strike", title: "删除线" },
        { Choice: ".ql-blockquote", title: "块引用" },
        { Choice: ".ql-code", title: "插入代码" },
        { Choice: ".ql-code-block", title: "插入代码段" },
        { Choice: ".ql-font", title: "字体" },
        { Choice: ".ql-size", title: "字体大小" },
        { Choice: '.ql-list[value="ordered"]', title: "编号列表" },
        { Choice: '.ql-list[value="bullet"]', title: "项目列表" },
        { Choice: ".ql-direction", title: "文本方向" },
        { Choice: '.ql-header[value="1"]', title: "h1" },
        { Choice: '.ql-header[value="2"]', title: "h2" },
        { Choice: ".ql-align", title: "对齐方式" },
        { Choice: ".ql-color", title: "字体颜色" },
        { Choice: ".ql-background", title: "背景颜色" },
        { Choice: ".ql-image", title: "图像" },
        { Choice: ".ql-video", title: "视频" },
        { Choice: ".ql-link", title: "添加链接" },
        { Choice: ".ql-formula", title: "插入公式" },
        { Choice: ".ql-clean", title: "清除字体格式" },
        { Choice: '.ql-script[value="sub"]', title: "下标" },
        { Choice: '.ql-script[value="super"]', title: "上标" },
        { Choice: '.ql-indent[value="-1"]', title: "向左缩进" },
        { Choice: '.ql-indent[value="+1"]', title: "向右缩进" },
        { Choice: ".ql-header .ql-picker-label", title: "标题大小" },
        {
          Choice: '.ql-header .ql-picker-item[data-value="1"]',
          title: "标题一",
        },
        {
          Choice: '.ql-header .ql-picker-item[data-value="2"]',
          title: "标题二",
        },
        {
          Choice: '.ql-header .ql-picker-item[data-value="3"]',
          title: "标题三",
        },
        {
          Choice: '.ql-header .ql-picker-item[data-value="4"]',
          title: "标题四",
        },
        {
          Choice: '.ql-header .ql-picker-item[data-value="5"]',
          title: "标题五",
        },
        {
          Choice: '.ql-header .ql-picker-item[data-value="6"]',
          title: "标题六",
        },
        { Choice: ".ql-header .ql-picker-item:last-child", title: "标准" },
        {
          Choice: '.ql-size .ql-picker-item[data-value="small"]',
          title: "小号",
        },
        {
          Choice: '.ql-size .ql-picker-item[data-value="large"]',
          title: "大号",
        },
        {
          Choice: '.ql-size .ql-picker-item[data-value="huge"]',
          title: "超大号",
        },
        { Choice: ".ql-size .ql-picker-item:nth-child(2)", title: "标准" },
        { Choice: ".ql-align .ql-picker-item:first-child", title: "居左对齐" },
        {
          Choice: '.ql-align .ql-picker-item[data-value="center"]',
          title: "居中对齐",
        },
        {
          Choice: '.ql-align .ql-picker-item[data-value="right"]',
          title: "居右对齐",
        },
        {
          Choice: '.ql-align .ql-picker-item[data-value="justify"]',
          title: "两端对齐",
        },
      ],
      editor: "",
      userAll: [],
      checkData: [],
    };
  },
  computed: {
    ...mapGetters(["bizData"]),
    ...mapGetters(["nodeDataObj"]),
    showSelectLabel() {
      if (this.isMore) {
        if (this.selectType === "user") {
          return this.item.applyvalue
            .map((item) => {
              return item.displayname;
            })
            .join(",");
        } else if (this.selectType === "org") {
          return this.item.applyvalue
            .map((item) => {
              return item.name;
            })
            .join("&");
        }
      } else {
        if (this.selectType === "user") {
          return this.item.applyvalue.displayname || "";
        } else if (this.selectType === "org") {
          return this.item.applyvalue.name || "";
        }
      }
    },
    showLabel() {
      const item = this.item.nodeoptions.find((item) => {
        return item.value === this.item.applyvalue;
      });
      return item ? item.text : "";
    },
  },
  watch: {
    item: {
      handler(val) {
        if (this.bizData2) {
          this.shiftData2(val, this.bizData2);
        } else {
          this.shiftData(val, this.bizData);
        }
      },
      immediate: true,
    },
    "item.applyvalue": {
      handler(val) {
        // 处理多选的数据问题
        if (val.inputType === 'selectMultiple') {
          if (val.applyvalue !== undefined && val.applyvalue !== '') {
            this.$set(val, 'selectMoreData', val.applyvalue.split(','))
          } else {
            this.$set(val, 'selectMoreData', [])
          }
        }
        let bizData;
        if (this.bizData2) {
          bizData = this.bizData2;
        } else {
          bizData = this.bizData;
        }
        if (Object.keys(bizData).length > 0) {
          bizData[this.item.fieldName] = {};
          bizData[this.item.fieldName].value = val;
          bizData[this.item.fieldName].showValue = this.item.showValue;
          if (this.bizData2) {
            bizData.value = val;
            bizData.showValue = this.item.showValue;
          }
        }
      },
    },
  },
  mounted() {
    this.$nextTick(() => {
      for (const item of this.titleConfig) {
        const tip = document.querySelectorAll(".quill-editor " + item.Choice);
        if (!tip) continue;
        tip.forEach((v) => {
          v.setAttribute("title", item.title);
        });
      }
      if (this.$props.item.inputType === "province") {
        this.areaoptions = this.$props.item.nodeoptions;
      }
    });
  },
  methods: {
    downloadFile(item) {
      this.$loading();
      axios
        .get(
          `${process.env.HOST_URL}${process.env.BASE_URL}/bpm/attachment/download/${item.value}?attachmentType=bpm`,
          {
            responseType: "arraybuffer",
            headers: {
              ...this.myHeaders,
            },
          }
        )
        .then((rt) => {
          this.$loading().close();
          // window.location.href = rt.request.responseURL
          window.location.href = rt.config.url;
        })
        .catch(() => {
          this.$loading().close();
        });
    },
    deleteFile(item) {
      item.value = "";
      item.showValue = "";
    },
    open(type) {
      var datatochildcmd = 4;
      var v1 = Math.random();
      const _this = this;
      var ntkoed = ntkoBrowser.ExtensionInstalled();
      const _href =
        window.location.origin + window.location.pathname + "static/ntko";
      // let _href = 'http://localhost/newdemo/'
      if (!!window.ActiveXObject || "ActiveXObject" in window) {
        ntkoBrowser.openWindow(
          _href +
            "/editindex.html?cmd=" +
            datatochildcmd +
            "&item=" +
            this.item.showValue +
            "&id=" +
            this.item.value +
            "&type=" +
            type +
            "&href=" +
            process.env.HOST_URL +
            process.env.BASE_URL +
            "&v1=" +
            v1
        );
      } else {
        this.$message.error(
          "请使用IE9+浏览器，并检查浏览器选项中的安全设置！！"
        );
        // var iTop = ntkoBrowser.NtkoiTop(); //获得窗口的垂直位置;
        // var iLeft = ntkoBrowser.NtkoiLeft(); //获得窗口的水平位置;
        // window.open(
        //   _href+"exeindex.html",
        //   "",
        //   "height=200px,width=500px,top=" +
        //     iTop +
        //     "px,left=" +
        //     iLeft +
        //     "px,titlebar=no,toolbar=no,menubar=no,scrollbars=auto,resizeable=no,location=no,status=no"
        // );
      }
      window.ntkoSendDataToChildtext = function (ab) {
        ntkoBrowser.ntkoSendDataToChild(
          _href +
            "editindex.html?cmd=" +
            datatochildcmd +
            "&item=" +
            _this.item.showValue +
            "&type=" +
            type +
            "&href=" +
            process.env.HOST_URL +
            process.env.BASE_URL +
            "&v1=" +
            v1,
          _this.item.value
        );
      };
      window.ntkoCloseEvent = function () {
        // alert("跨浏览器插件应用程序窗口已关闭!");
      };
      window.OnData = function (id, name) {
        _this.item.value = id;
        _this.item.showValue = name;
      };
    },
    beforeAvatarUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 100;
      // const isDoc = file.type == "application/msword";
      // const isXls = file.type == "application/vnd.ms-excel";
      const postfix = file.name.replace(/.+\./, "");
      const isPostfix =
        ["DOC", "DOCX", "XLS", "XLSX"].indexOf(postfix.toUpperCase()) === -1;

      if (isPostfix) {
        this.$message.error("请上传.doc、.docx、.xls、.xlsx文件!");
      }
      if (!isLt2M) {
        this.$message.error(
          this.$t("hintText.uploadAttachmentSizeCannotExceed")
        );
      }
      return isLt2M && !isPostfix;
    },
    onSuccess(file) {
      if (file) {
        this.$set(this.item, "value", file.id);
        this.$set(this.item, "showValue", file.newName);
        this.$refs.upload.clearFiles();
      }
    },
    ...mapMutations(["setTemporaryBizData"]),
    onEditorReady(editor) {
      // 准备编辑器
    },
    // 上传图片前
    beforeUpload(res, file) {
      // 显示loading动画
      this.quillUpdateImg = true;
    },
    // 上传图片成功
    uploadSuccess(res, file) {
      // 获取富文本组件实例
      const quill = this.$refs.myQuillEditor.quill;
      // 如果上传成功
      // 获取光标所在位置
      const length = quill.getSelection().index;
      // 插入图片  res.info为服务器返回的图片地址
      quill.insertEmbed(length, "image", res.info);
      // 调整光标到最后
      quill.setSelection(length + 1);

      // loading动画消失
      this.quillUpdateImg = false;
    },
    // 上传图片失败
    uploadError(res, file) {
      this.quillUpdateImg = false;
      this.$message.error("图片插入失败");
    },
    onEditorBlur() {}, // 失去焦点事件
    onEditorFocus() {}, // 获得焦点事件
    onEditorChange() {}, // 内容改变事件
    shiftData(val, bizData) {
      if (val.inputType === "checkbox") {
        this.$set(val, "applyArray", []);
      }
      if (val.inputType === "search-switch") {
        if (val.switch != false && val.switch != true) {
          // if(this.$route.query.taskId){
          //   this.$set(val, "switch", false);
          // }else{
          this.$set(val, "switch", true);
          // }
        }
      }
      Object.keys(bizData).forEach((key) => {
        if (key === val.fieldName) {
          this.$set(val, "showValue", bizData[key].showValue);
          this.$set(val, "applyvalue", bizData[key].value);
          if (val.inputType === "checkbox") {
            this.$set(
              val,
              "applyArray",
              bizData[key].value ? bizData[key].value.split(",") : []
            );
          }
          if (val.inputType === "double" && bizData[key].value) {
            if (String(bizData[key].value).indexOf(",") === -1) {
              if (
                this.$refs[val.id] &&
                this.$refs[val.id].$attrs &&
                this.$refs[val.id].$attrs.name !== document.activeElement.name
              ) {
                this.$set(
                  val,
                  "showValue",
                  this.$options.filters.formatNumber(
                    bizData[key].showValue,
                    2,
                    1
                  )
                );
                this.$set(
                  val,
                  "applyvalue",
                  this.$options.filters.formatNumber(bizData[key].value, 2, 1)
                );
              }
            }
          }
          if (val.inputType === "rating-1" || val.inputType === "rating-2") {
            val.showValue = Number(val.applyvalue);
            val.applyvalue = Number(val.applyvalue);
          } else if (val.inputType === "nokt") {
            this.$set(val, "value", bizData[key].value);
            // val.value = bizData[key].value;
            val.showValue = bizData[key].showValue;
          } else if (val.inputType === "selectPeopleMore") {
            this.userAll = [];
            bizData[key].value.split(",").forEach((item, index) => {
              this.userAll.push({
                id: item,
                empuid: item,
                displayname: bizData[key].showValue.split("&")[index],
              });
            });
          } else if (
            val.inputType === "date" ||
            val.inputType === "date-edit"
          ) {
            this.$set(
              val,
              "showValue",
              this.$options.filters.formatDate(bizData[key].showValue)
            );
            this.$set(
              val,
              "applyvalue",
              this.$options.filters.formatDate(bizData[key].value)
            );
          } else if (
            val.inputType === "time" ||
            val.inputType === "time-edits"
          ) {
            this.$set(
              val,
              "showValue",
              this.$options.filters.formatDateTimess(bizData[key].showValue)
            );
            this.$set(
              val,
              "applyvalue",
              this.$options.filters.formatDateTimess(bizData[key].value)
            );
          }
        }
      });
      // if (val.editstate !== "R") {
      if (val.inputType === "date") {
        this.$set(
          val,
          "showValue",
          val.applyvalue ? val.applyvalue : new Date()
        );
        this.$set(
          val,
          "applyvalue",
          val.showValue ? val.showValue : new Date()
        );
      } else if (val.inputType === "checkbox") {
        this.$set(val, "applyArray", []);
      } else if (val.inputType === "contact" && !val.applyvalue) {
        let phone = "";
        if (this.nodeDataObj.applyUserDto) {
          if (this.nodeDataObj.applyUserDto.tel2) {
            phone = this.nodeDataObj.applyUserDto.tel2;
          } else {
            phone = this.nodeDataObj.applyUserDto.mobilephone;
          }
        }
        this.$set(val, "showValue", phone);
        this.$set(val, "applyvalue", phone);
      }
      if (val.inputType === "rating-1" || val.inputType === "rating-2") {
        this.$set(
          val,
          "applyvalue",
          val.applyvalue
            ? val.applyvalue
            : val.defaultvalue
            ? val.defaultvalue
            : 0
        );
        this.$set(
          val,
          "showValue",
          val.showValue
            ? val.showValue
            : val.defaultvalue
            ? val.defaultvalue
            : 0
        );
      } else {
        this.$set(
          val,
          "applyvalue",
          val.applyvalue
            ? val.applyvalue
            : val.defaultvalue
            ? val.defaultvalue
            : ""
        );
        this.$set(
          val,
          "showValue",
          val.showValue
            ? val.showValue
            : val.defaultvalue
            ? val.defaultvalue
            : ""
        );
        // }
      }
      if (val.editstate == "R" && val.inputType === "hidden") {
        this.$set(
          val,
          "applyvalue",
          val.applyvalue
            ? val.applyvalue
            : val.defaultvalue
            ? val.defaultvalue
            : ""
        );
        this.$set(
          val,
          "showValue",
          val.showValue
            ? val.showValue
            : val.defaultvalue
            ? val.defaultvalue
            : ""
        );
      }
    },
    shiftData2(val, bizData) {
      if (val.inputType === "checkbox") {
        this.$set(val, "applyArray", []);
      }
      if (val.inputType === "search-switch") {
        if (val.switch != false && val.switch != true) {
          this.$set(val, "switch", true);
        }
      }
      this.$set(val, "showValue", bizData.showValue);
      this.$set(val, "applyvalue", bizData.value);
      if (val.inputType === "checkbox") {
        this.$set(val, "applyArray", []);
      }
      if (val.inputType === "double" && bizData.value) {
        if (String(bizData.value).indexOf(",") === -1) {
          if (
            this.$refs[val.id] &&
            this.$refs[val.id].$attrs &&
            this.$refs[val.id].$attrs.name !== document.activeElement.name
          ) {
            this.$set(
              val,
              "showValue",
              this.$options.filters.formatNumber(bizData.showValue, 2, 1)
            );
            this.$set(
              val,
              "applyvalue",
              this.$options.filters.formatNumber(bizData.value, 2, 1)
            );
          }
        }
      }
      if (val.inputType === "rating-1" || val.inputType === "rating-2") {
        val.showValue = Number(val.applyvalue);
        val.applyvalue = Number(val.applyvalue);
      } else if (val.inputType === "nokt") {
        this.$set(val, "value", bizData.value);
        // val.value = bizData[key].value;
        val.showValue = bizData.showValue;
      } else if (val.inputType === "selectPeopleMore") {
        this.userAll = [];
        bizData.value.split(",").forEach((item, index) => {
          this.userAll.push({
            id: item,
            empuid: item,
            displayname: bizData.showValue.split("&")[index],
          });
        });
      } else if (val.inputType === "date" || val.inputType === "date-edit") {
        this.$set(
          val,
          "showValue",
          this.$options.filters.formatDate(bizData.showValue)
        );
        this.$set(
          val,
          "applyvalue",
          this.$options.filters.formatDate(bizData.value)
        );
      } else if (val.inputType === "time" || val.inputType === "time-edits") {
        this.$set(
          val,
          "showValue",
          this.$options.filters.formatDateTimess(bizData.showValue)
        );
        this.$set(
          val,
          "applyvalue",
          this.$options.filters.formatDateTimess(bizData.value)
        );
      }

      // if (val.editstate !== "R") {
      if (val.inputType === "date") {
        this.$set(
          val,
          "showValue",
          val.applyvalue ? val.applyvalue : new Date()
        );
        this.$set(
          val,
          "applyvalue",
          val.showValue ? val.showValue : new Date()
        );
      } else if (val.inputType === "checkbox") {
        this.$set(val, "applyArray", []);
      } else if (val.inputType === "contact" && !val.applyvalue) {
        let phone = "";
        if (this.nodeDataObj.applyUserDto) {
          if (this.nodeDataObj.applyUserDto.tel2) {
            phone = this.nodeDataObj.applyUserDto.tel2;
          } else {
            phone = this.nodeDataObj.applyUserDto.mobilephone;
          }
        }
        this.$set(val, "showValue", phone);
        this.$set(val, "applyvalue", phone);
      } else if (val.inputType === "rating-1" || val.inputType === "rating-2") {
        this.$set(
          val,
          "applyvalue",
          val.applyvalue
            ? val.applyvalue
            : val.defaultvalue
            ? val.defaultvalue
            : 0
        );
        this.$set(
          val,
          "showValue",
          val.showValue
            ? val.showValue
            : val.defaultvalue
            ? val.defaultvalue
            : 0
        );
      } else {
        this.$set(
          val,
          "applyvalue",
          val.applyvalue
            ? val.applyvalue
            : val.defaultvalue
            ? val.defaultvalue
            : ""
        );
        this.$set(
          val,
          "showValue",
          val.showValue
            ? val.showValue
            : val.defaultvalue
            ? val.defaultvalue
            : ""
        );
        // }
      }
      if (val.editstate == "R" && val.inputType === "hidden") {
        this.$set(
          val,
          "applyvalue",
          val.applyvalue
            ? val.applyvalue
            : val.defaultvalue
            ? val.defaultvalue
            : ""
        );
        this.$set(
          val,
          "showValue",
          val.showValue
            ? val.showValue
            : val.defaultvalue
            ? val.defaultvalue
            : ""
        );
      }
    },
    textFocus(type) {
      if (/^\d+(.\d+)?$/.test(this.item.applyvalue.replace(/,/g, ""))) {
        this.item.applyvalue = this.item.applyvalue.replace(/,/g, "");
      }
    },
    textBlur(type) {
      if (this.item.applyvalue && this.item.applyvalue.indexOf(",") === -1) {
        this.item.applyvalue = this.$options.filters.formatNumber(
          this.item.applyvalue,
          2,
          1
        );
        // this.item.applyvalue = this.item.applyvalue.replace(/,/g, '')
      }
    },
    changeValue() {
      this.item.showValue = this.item.applyvalue;
    },
    doubleValue() {
      this.item.applyvalue = this.item.applyvalue.replace(/[^0-9.-]/g, "");
    },
    changeCheckbox(data) {
      data.showValue = this.item.nodeoptions
        .filter((el) => this.item.applyArray.includes(el.value))
        .map((el) => el.text)
        .join(" ");
      data.applyvalue = this.item.applyArray.join();
    },
    changeRadio(data, item) {
      data.showValue = item.text;
    },
    changeSelect(item) {
      this.item.nodeoptions.forEach((el) => {
        if (item === el.value) {
          this.item.showValue = el.text;
        }
      });
    },
    selectFocus(bold) {
      if (bold) {
        document
          .querySelectorAll(".closePlaceholder .el-input__inner")
          .forEach((item) => {
            this.$nextTick(() => {
              item.setAttribute("placeholder", "请选择");
            });
          });
      }
    },
    showSelect(item) {
      this.clickVal = item;
      if (
        (item.inputType === "selectOrganization" ||
          item.inputType === "selectOrganizationMore") &&
        item.editstate !== "R"
      ) {
        this.isMore = item.inputType === "selectOrganizationMore";
        // console.log(item)
        this.$set(item, "power", "");
        this.checkData = [];
        if (item.applyvalue) {
          if (item.inputType.endsWith("More")) {
            const list = item.applyvalue.split(",");
            const name = item.showValue.split("&");
            list.forEach((item, i) => {
              this.checkData.push({
                id: item,
                name: name[i],
              });
            });
          } else {
            this.checkData.push({
              id: item.applyvalue,
              name: item.showValue,
            });
          }
        }
        this.organizeDialog = true;
      }
      if (
        (item.inputType === "selectOrgPower" ||
          item.inputType === "selectOrgPowerMore") &&
        item.editstate !== "R"
      ) {
        this.$set(this.item, "power", this.nodeDataObj.applyUserDto.companyIds);
        this.isMore = item.inputType === "selectOrgPowerMore";
        // console.log(item)
        this.checkData = [];
        if (item.applyvalue) {
          if (item.inputType.endsWith("More")) {
            const list = item.applyvalue.split(",");
            const name = item.showValue.split("&");
            list.forEach((item, i) => {
              this.checkData.push({
                id: item,
                name: name[i],
              });
            });
          } else {
            this.checkData.push({
              id: item.applyvalue,
              name: item.showValue,
            });
          }
        }
        this.organizeDialog = true;
      }

      if (
        (item.inputType === "selectPeopleMore" ||
          item.inputType === "selectPeopleSingle") &&
        item.editstate !== "R"
      ) {
        this.isMore = item.inputType === "selectPeopleMore";
        this.peopleDialog = true;
      }
    },
    getOrg(data) {
      // console.log(this.item)
      this.selectType = "org";
      this.$set(
        this.item,
        "showValue",
        data.map((item) => item.name).join("&")
      );
      this.$set(this.item, "applyvalue", data.map((item) => item.id).join(","));
    },
    getUser(data) {
      this.userAll = data;
      this.peopleDialog = false;
      if (this.item.inputType === "selectPeopleMore") {
        let names = data.map((item) => item.displayname);
        let ids = data.map((item) => item.empuid);
        if (this.item.showValue) {
          names = Array.from(new Set([...names]));
          ids = Array.from(new Set([...ids]));
        }
        this.item.showValue = names.join("&");
        this.item.applyvalue = ids.join(",");
      } else {
        this.$set(
          this.item,
          "showValue",
          data.map((item) => item.cnname).join("&")
        );
        this.$set(
          this.item,
          "applyvalue",
          data.map((item) => item.empuid).join(",")
        );
      }
      this.selectType = "user";
    },
    clearSelect() {
      this.userAll = [];
      this.$set(this.item, "showValue", "");
      this.$set(this.item, "applyvalue", "");
    },
  },
};
</script>

<style type="text/scss" lang="scss">
.flow-item input.el-input__inner {
  // border: 0;
  // border-bottom: 1px solid $dc1;

  &:focus {
    border-bottom: 1px solid $bc3;
  }
}
.search-switch {
  display: inline;
  .el-switch__core {
    width: 54px !important;
  }
  .el-switch__label--left {
    position: relative;
    left: 57px;
    color: #fff;
    z-index: -1111;
  }
  .el-switch__label--right {
    position: relative;
    right: 57px;
    color: #fff;
    z-index: -1111;
  }
  .el-switch__label--right.is-active {
    z-index: 1111;
    color: #fff !important;
  }
  .el-switch__label--left.is-active {
    z-index: 1111;
    color: #fff !important;
  }
}
</style>

<style type="text/scss" lang="scss" scoped>
.print-text {
  border: 1px solid $dc1;
  min-height: 28px;
  line-height: 28px;
  padding: 0 15px;
  box-sizing: border-box;
}
.bag {
  background: #f5f7fa;
  & /deep/ .ql-formats {
    display: none;
  }
}
</style>
