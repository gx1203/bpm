<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" append-to-body>
    <el-row :gutter="20">
      <el-col :span="6">
        <div class="equation">
          <div class="equation-tag">
            <div class="tag-item" :key="index" v-for="(tag, index) in typeList">
              <el-tag
                :class="tag.active ? 'active' : ''"
                :disable-transitions="true"
                @click="changeActive(tag, index)"
              >{{tag.title}}</el-tag>
            </div>
          </div>
          <div class="equation-type">
            <el-collapse v-model="activeName" v-if="isEquation" accordion>
              <el-collapse-item
                v-for="(item, index) in equationData"
                :key="index"
                :title="item.name"
                :name="item.key"
              >
                <div
                  class="equation-list"
                  v-for="(val, index1) in item.list"
                  @click="equationHandle(val)"
                  :key="index1"
                >
                  <el-popover placement="right" width="300" trigger="hover">
                    <div>
                      <div class="equation-api">{{val.api}}</div>
                      <el-divider></el-divider>
                      <div class="equation-intro">{{ $t('introductionToFormula') }}</div>
                      <div class="equation-info">{{val.info}}</div>
                    </div>
                    <div slot="reference">
                      <div class="equation-name">{{val.name}}</div>
                      <div class="equation-intro">{{val.intro}}</div>
                    </div>
                  </el-popover>
                </div>
              </el-collapse-item>
            </el-collapse>
            <div v-else>
              <p
                v-for="(item,index) in fieldList"
                class="equation-field"
                :key="index"
                 @click="fieldHandle(item)"
              >{{item.fieldShowName}}</p>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="18">
        <quill-editor
          v-model="equation"
          ref="myQuillEditor"
          style="width:100%"
          :options="editorOption"
          @blur="onEditorBlur($event)"
          @focus="onEditorFocus($event)"
        ></quill-editor>
      </el-col>
    </el-row>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel">{{ $t('cancelAction') }}</el-button>
      <el-button type="primary" @click="submit">{{ $t('confirm') }}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { saveReport } from "@/bpm/api/process/processModeling/chart_config";
import { quillEditor } from "vue-quill-editor"; // 调用编辑器
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
export default {
  data() {
    return {
      dialogVisible: this.value,
      activeName: "",
      length: 0,
      isEquation: true,
      equation:'',
      typeList: [
        {
          title: this.$t('formula'),
          type: "1",
          active: true
        },
        {
          title: this.$t('field'),
          type: "2"
        }
      ],
      editorOption: {
        placeholder: this.$t('placeholderText.pleaseEditTheFormulaHere'),
        modules: {
          toolbar: {
            container: []
          }
        }
      },
      equationData: [
        {
          key: "1",
          name: "常用函数",
          list: [
            {
              key: "SUM()",
              name: "SUM",
              intro: "返回所有参与字段中数值的总和",
              info: "返回所有参与字段中数值的总和",
              api: "SUM ( 数字字段,数字字段,... )"
            },
            {
              key: "CONCAT()",
              name: "CONCAT",
              intro: "字符串连接函数，连接函数中的所有字段",
              info:
                "将多个文本字符串合并成一个文本字符串。如CONCAT(A,B,C)，即返回值为ABC。字段或者函数之间，用逗号隔开。如果是字符串，需要用引号包裹起来。",
              api: "CONCAT ( 字段1,字段2,... )"
            },
            {
              key: "IF()",
              name: "IF",
              intro: "根据判断条件，返回正确或错误的值。",
              info:
                "判断一个条件能否{{ $t('satisfy') }}；如果满足返回一个值，如果不满足则返回另外一个值。IF(A,B,C)，表示如果满足条件A，那么返回B，否则返回C。",
              api: "IF ( 判断条件,真值,假值 )"
            },
            {
              key: "ROUND()",
              name: "ROUND",
              intro: "将数字四舍五入到指定的位数",
              info: "将数字四舍五入到指定的位数",
              api: "ROUND ( 数字字段,保留位数 )"
            },
            {
              key: "CURDATE()",
              name: "CURDATE",
              intro: "返回当前日期",
              info: "返回当前日期",
              api: "CURDATE()"
            },
            {
              key: "TEXT()",
              name: "TEXT",
              intro: "将数字四舍五入到指定的位数",
              info:
                "将字段转化为特定格式。1.将日期字段转化为指定展示格式年月日时分秒对应： YYYY, MM, DD, HH, mm, ss例如：格式是“YYYYMMDD HH: mm: ss”转化结果为： 20180101 12: 12: 12。2.将日期字段转化为星期格式E, EE, EEE表示星期的不同格式，分别对应0~6，周日~周六，星期日~星期六",
              api: "TEXT ( 字段,日期格式 )"
            }
          ]
        },
        {
          key: "2",
          name: "逻辑函数",
          list: [
            {
              key: "IF()",
              name: "IF",
              intro: "根据判断条件，返回正确或错误的值。",
              info:
                "判断一个条件能否满足；如果满足返回一个值，如果不满足则返回另外一个值。IF(A,B,C)，表示如果满足条件A，那么返回B，否则返回C。",
              api: "IF ( 判断条件,真值,假值 )"
            },
            {
              key: "IFS()",
              name: "IFS",
              intro:
                "检查是否满足一个或多个条件，且返回符合第一个 TRUE 条件的值",
              info:
                "1、判断条件1，真值1，为必填项，否则函数无法运算。2、只有判断条件1不符合时，才会进入判断条件2。3、IFS函数不需要输入假值，如果不满足所有判断条件，则显示空值",
              api: "IFS ( 判断条件1,真值1,判断条件2,真值2,... )"
            },
            {
              key: "AND()",
              name: "AND",
              intro:
                "任何一个参数的逻辑值为false，即返回false；只有当所有参数的逻辑值为true，才返回true。",
              info:
                "任何一个参数的逻辑值为false，即返回false；只有当所有参数的逻辑值为true，才返回true。logical:逻辑值，例如，2>1的逻辑值为true",
              api: "AND ( logical1,logical2,... )"
            },
            {
              key: "OR()",
              name: "OR",
              intro:
                "任何一个参数逻辑值为true，即返回true；只有当所有逻辑参数值为false，才返回false。",
              info:
                "任何一个参数逻辑值为true，即返回true；只有当所有逻辑参数值为false，才返回false。logical:逻辑值，例如，2>1的逻辑值为true",
              api: "OR ( logical1,logical2,... )"
            },
            {
              key: "XOR()",
              name: "XOR",
              intro: "返回所有参数的异或值。",
              info:
                "返回所有参数的异或值。异或是指，两个值相同，返回false，两个值不同，返回true。logical:逻辑值，例如，2>1的逻辑值为true",
              api: "XOR ( logical1,logical2,... )"
            },
            {
              key: "NOT()",
              name: "NOT",
              intro: "对参数逻辑值求反。",
              info:
                "返回参数逻辑值的反值。NOT(2>1)结果就是false。logical:逻辑值，例如，2>1的逻辑值为true",
              api: "NOT ( logical1 )"
            },
            {
              key: "ISEMPTY ( 字段 )",
              name: "ISEMPTY",
              intro: "对参数逻辑值求反。",
              info:
                "判断字段值是否为空例如：字段没有内容、单选，多选，下拉选择，图片选择，成员字段没有选中任何值、表格内容为空、附件没有上传等",
              api: "ISEMPTY ( 字段 )"
            }
          ]
        },
        {
          key: "3",
          name: "文本函数",
          list: [
            {
              key: "CONCAT()",
              name: "CONCAT",
              intro: "字符串连接函数，连接函数中的所有字段",
              info:
                "将多个文本字符串合并成一个文本字符串。如CONCAT(A,B,C)，即返回值为ABC。字段或者函数之间，用逗号隔开。如果是字符串，需要用引号包裹起来。",
              api: "CONCAT ( 字段1,字段2,... )"
            },
            {
              key: "MID()",
              name: "IFS",
              intro:
                "返回字符串中从指定位置开始的特定数目的字符，该数目由用户指定",
              info:
                "返回文本字符串中从指定位置开始的特定数目的字符，该数目由用户指定。例如: 可用于身份证中提取生日信息",
              api: "MID ( 字段,初始位置,字符数量 )"
            },
            {
              key: "LEFT()",
              name: "LEFT",
              intro: "从字段左数第一个字符开始返回指定个数的字符",
              info:
                "从字段左数第一个字符开始返回指定个数的字符。字符数量: 指定的字符数量",
              api: "LEFT ( 字段,字符数量 )"
            },
            {
              key: "RIGHT()",
              name: "RIGHT",
              intro: "从一个字段的右数第一个字符开始返回指定个数的字符",
              info:
                "从一个字段的右数第一个字符开始返回指定个数的字符。字符数量: 指定的字符数量",
              api: "OR ( logical1,logical2,... )"
            },
            {
              key: "LEN()",
              name: "LEN",
              intro: "返回字段内容或字符串的长度",
              info: "返回字段内容或字符串的长度",
              api: "LEN ( 字段 )"
            },
            {
              key: "UPPER()",
              name: "UPPER",
              intro: "把文本中小写的英文字符转换为大写字符",
              info: "把文本中小写的英文字符转换为大写字符",
              api: "UPPER ( 字段 )"
            },
            {
              key: "LOWER()",
              name: "LOWER",
              intro: "把文本中大写的英文字符转换为小写字符",
              info: "把文本中大写的英文字符转换为小写字符",
              api: "LOWER()"
            },
            {
              key: "REPLACE()",
              name: "REPLACE",
              intro: "根据指定的字符数，将字符串中部分内容替换为不同的字符串",
              info:
                "根据指定的字符数，将字符串中部分内容替换为不同的字符串。A代表想要替换的文本的开始字符串位置。B代表想要替换的字符串数量",
              api: "REPLACE ( 字段,A,B,替换文本 )"
            },
            {
              key: "SEARCH()",
              name: "SEARCH",
              intro:
                "在字段2中查找字段1，并返回字段1字符串的起始位置的编号，该编号从字段2字符串的第一个字符算起(设置了数字参数，则从数字的位置开始)。返回0则表示没有查到。",
              info:
                "在字段2中查找字段1，并返回字段1字符串的起始位置的编号，该编号从字段2字符串的第一个字符算起(设置了数字参数，则从数字的位置开始)。返回0则表示没有查到。字段1:要查找的字段或者字符串，必填项。字段2:被查询的字段或者字符串，必填项。数字：查询的起始位置，不填默认为1。填写小于1的整数都算作是1。",
              api: "SEARCH ( 字段1,字段2,数字 )"
            },
            {
              key: "TEXT()",
              name: "TEXT ",
              intro: "将日期字段格式化为目标格式或把其他字段转换为文本类型",
              info:
                "将字段转化为特定格式。1.将日期字段转化为指定展示格式年月日时分秒对应： YYYY, MM, DD, HH, mm, ss例如：格式是“YYYYMMDD HH: mm: ss”转化结果为： 20180101 12: 12: 12。2.将日期字段转化为星期格式E, EE, EEE表示星期的不同格式，分别对应0~6，周日~周六，星期日~星期六",
              api: "TEXT ( 字段,日期格式 )"
            }
          ]
        },
        {
          key: "4",
          name: "数字函数",
          list: [
            {
              key: "AVERAGE()",
              name: "AVERAGE ",
              intro: "计算所有参与运算字段的平均值",
              info: "计算所有参与运算字段的平均值",
              api: "AVERAGE( 数字字段,数字字段,... )"
            },
            {
              key: "COUNT()",
              name: "COUNT ",
              intro: "返回所有参与运算字段中值（字符串）的数量",
              info: "返回所有参与运算字段中值（字符串）的数量",
              api: "COUNT ( 字段1,字段2,... )"
            },
            {
              key: "COUNTIF()",
              name: "COUNTIF ",
              intro:
                "COUNTIF(表格问题.年龄, '18')，可得到表格中年龄填的是'18'的数据条数",
              info: "获取数组中满足条件的参数个数",
              api: "COUNTIF ( 表格子问题 / 选择类型字段,文本字段 / 具体值 )"
            },
            {
              key: "MAX()",
              name: "MAX ",
              intro: "返回所有参与字段中的最大值",
              info: "返回所有参与字段中的最大值",
              api: "MAX ( 数字字段,数字字段,... )"
            },
            {
              key: "MIN()",
              name: "MIN ",
              intro: "返回所有参与字段中的最小值",
              info: "返回所有参与字段中的最小值",
              api: "MIN ( 数字字段,数字字段,... )"
            },
            {
              key: "ROUND()",
              name: "ROUND ",
              intro: "将数字四舍五入到指定的位数",
              info: "将数字四舍五入到指定的位数",
              api: "ROUND ( 数字字段,保留位数 )"
            },
            {
              key: "INT()",
              name: "INT ",
              intro: "将数字向下取整",
              info: "将数字向下取整",
              api: "INT ( 数字字段 )"
            },
            {
              key: "MOD()",
              name: "MOD ",
              intro: "返回两数相除的余数",
              info: "返回两数相除的余数",
              api: "MOD ( 数字字段,数字字段 / 数字 )"
            },
            {
              key: "PRODUCT()",
              name: "PRODUCT ",
              intro: "返回所有参与字段中数值的乘积",
              info: "返回所有参与字段中数值的乘积",
              api: "PRODUCT ( 数字字段,数字字段,... )"
            },
            {
              key: "SUM()",
              name: "SUM ",
              intro: "返回所有参与字段中数值的总和",
              info: "返回所有参与字段中数值的总和",
              api: "SUM ( 数字字段,数字字段,... )"
            },
            {
              key: "SUMPRODUCT()",
              name: "SUMPRODUCT ",
              intro: "在给定的数组中，将数组间对应的元素相乘，并返回乘积之和",
              info: "在给定的数组中，将数组间对应的元素相乘，并返回乘积之和",
              api: "SUMPRODUCT ( 数组,数组 )"
            },
            {
              key: "SUMIF()",
              name: "SUMIF ",
              intro: "统计表格中符合条件的数值，并求和",
              info: "统计表格中符合条件的数值，并求和",
              api: "SUMIF ( 表格子字段,文本字段/文本,表格子字段（数字字段） )"
            },
            {
              key: "NUM()",
              name: "NUM ",
              intro: "返回文本中的数字",
              info: "返回文本中的数字",
              api: "NUM ( 字段 )"
            },
            {
              key: "NUM()",
              name: "NUM ",
              intro: "返回文本中的数字",
              info: "返回文本中的数字",
              api: "NUM ( 字段 )"
            },
            {
              key: "RMBUPPER()",
              name: "RMBUPPER ",
              intro: "把数字转换为大写的中文金额",
              info: "把数字转换为大写的中文金额",
              api: "RMBUPPER ( 数字字段 )"
            },
            {
              key: "ROUNDUP()",
              name: "ROUNDUP ",
              intro: "将数字保留指定的位数，最后一位向上取",
              info: "将数字保留指定的位数，最后一位向上取",
              api: "ROUNDUP ( 数字字段,保留位数 )"
            },
            {
              key: "ROUNDDOWN()",
              name: "ROUNDDOWN ",
              intro: "将数字保留指定的位数，最后一位向下取",
              info: "将数字保留指定的位数，最后一位向下取",
              api: "ROUNDDOWN ( 数字字段,保留位数 )"
            },
            {
              key: "POWER()",
              name: "POWER ",
              intro: "计算数字的n次方",
              info: "计算数字的n次方",
              api: "POWER ( 数字字段/数字,数字字段/数字 )"
            },
            {
              key: "LN()",
              name: "LN ",
              intro: "计算指定数字的自然对数",
              info: "计算指定数字的自然对数",
              api: "LN ( 数字字段/数字 )"
            },
            {
              key: "SQRT()",
              name: "SQRT ",
              intro: "计算指定数字的平方根",
              info: "计算指定数字的平方根",
              api: "SQRT ( 数字字段/数字 )"
            }
          ]
        },
        {
          key: "5",
          name: "时间函数",
          list: [
            {
              key: "YEAR()",
              name: "YEAR ",
              intro: "返回日期中的年份",
              info: "返回日期中的年份",
              api: "YEAR ( 日期字段 )"
            },
            {
              key: "MONTH()",
              name: "MONTH ",
              intro: "返回日期中的月份",
              info: "返回日期中的月份",
              api: "MONTH ( 日期字段 )"
            },
            {
              key: "DAY()",
              name: "DAY ",
              intro: "返回日期中的日期",
              info: "返回日期中的日期",
              api: "DAY ( 日期字段 )"
            },
            {
              key: "HOUR()",
              name: "HOUR ",
              intro: "返回日期中的时间",
              info: "返回日期中的时间",
              api: "HOUR ( 日期字段 )"
            },
            {
              key: "MINUTE()",
              name: "MINUTE ",
              intro: "返回日期中的分钟",
              info: "返回日期中的分钟",
              api: "MINUTE ( 日期字段 )"
            },
            {
              key: "SECOND()",
              name: "SECOND ",
              intro: "返回日期中的秒",
              info: "返回日期中的秒",
              api: "SECOND ( 日期字段 )"
            },
            {
              key: "DATE()",
              name: "DATE ",
              intro: "将数字拼接成为年份",
              info: "数字字段顺序为：年／月／日／时／分／秒",
              api: "DATE ( 数字字段,数字字段,... )"
            },
            {
              key: "CURDATE()",
              name: "CURDATE ",
              intro: "返回当前日期",
              info: "返回当前日期",
              api: "DATE ( 数字字段,数字字段,... )"
            },
            {
              key: "NOW()",
              name: "NOW ",
              intro: "返回当前日期",
              info: "返回当前时间，精确到时/分/秒",
              api: "NOW ()"
            },
            {
              key: "DAYS()",
              name: "DAYS ",
              intro: "返回日期字段1与日期字段2的差值，单位为天",
              info: "返回日期字段1与日期字段2的差值，单位为天",
              api: "DAYS ( 日期字段1,日期字段2 )"
            },
            {
              key: "DATEDELTA()",
              name: "DATEDELTA ",
              intro: "将指定日期加/减指定天数，并返回目标日期",
              info:
                "将指定日期加/减指定天数，并返回目标日期。日期字段：需要改变的字段。天数：需要增加/减少的天数，正数为增加，负数为减少",
              api: "DATEDELTA ( 日期字段,天数 )"
            }
          ]
        },
        {
          key: "6",
          name: "高级函数",
          list: [
            {
              key: "RDID()",
              name: "RDID ",
              intro: "返回一个随机码（随机码的位数固定）",
              info: "返回一个随机码（随机码的位数固定）",
              api: "RDID ( )"
            },
            {
              key: "RECNO()",
              name: "RECNO ",
              intro:
                "累计器，依据当前表单被新打开的次数进行不断累加计算，起始值为1。",
              info:
                "累计器，依据当前表单被新打开的次数进行不断累加计算，起始值为1。可用于流水号的自动生成。",
              api: "RECNO ( )"
            },
            {
              key: "GETUSERNAME()",
              name: "GETUSERNAME ",
              intro: "获取当前登录用户的用户名",
              info: "获取当前登录用户的用户名",
              api: "GETUSERNAME ( )"
            },
            {
              key: "GETUSEREMAIL()",
              name: "GETUSEREMAIL ",
              intro: "获取当前登录用户的邮箱",
              info: "获取当前登录用户的邮箱",
              api: "GETUSERNAME ( )"
            },
            {
              key: "REGTEST()",
              name: "REGTEST ",
              intro: "验证文本是否满足规则",
              info:
                "根据用户指定正则表达式，验证文本是否满足规则。正则表达式内容: 例如[0-9]*。正则表达式修饰符: 例如 'g'",
              api: "REGTEST ( 字段/文本,正则表达式内容,正则表达式修饰符 )"
            },
            {
              key: "BASE64()",
              name: "BASE64 ",
              intro: "将文本内容进行base64编码",
              info: "将文本内容进行base64编码",
              api: "BASE64 ( 字段/文本 )"
            }
          ]
        }
      ]
    };
  },
  components: {
    quillEditor
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    fieldList: {
      type: Array,
      default: () => {
        return [];
      }
    },
    equationItem: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    }
  },
  watch: {
    value(val) {
      this.dialogVisible = val;
      if(val){
        this.equation = this.equationItem
      }
    },
    dialogVisible(val) {
      this.$emit("input", val);
    }
  },
  methods: {
    changeActive(tag, index) {
      this.typeList.forEach(el => {
        el.active = false;
      });
      this.typeList[index].active = true;
      this.isEquation = this.typeList[index].type === "1";
    },
    onEditorBlur() {
      let quill = this.$refs.myQuillEditor.quill;
      this.length = quill.selection.savedRange.index;
    }, // 失去焦点事件
    onEditorFocus() {}, // 获得焦点事件
    insertText(length,test, sty) {
      // 获取富文本组件实例
      let quill = this.$refs.myQuillEditor.quill;
      // 插入文字
      quill.insertText(this.length, test, sty);
      // 调整光标到最后
      quill.setSelection(this.length+length);
    },
    fieldHandle(item){
      this.insertText(item.fieldName.length,item.fieldName, { color: "#90dcd4" });
    },
    equationHandle(item) {
      this.insertText(item.key.length-1, item.key, { color: "#aa04bf" });
    },
    submit() {
     let equation = {
       equationBackup: this.equation,
       equation: this.equation.replace(/<[^>]+>/g, ""),
     }
     this.$emit('confirm',equation)
    },
    cancel() {
      this.dialogVisible = false;
    }
  },
  mounted() {
    // this.$nextTick(function() {
    //   this.$refs.myQuillEditor.quill.enable(true);
    //   this.$refs.myQuillEditor.quill.blur();
    // });
  }
};
</script>
<style lang="scss">
.equation {
  .el-divider--horizontal {
    margin: 7px 0;
  }
  .ql-toolbar.ql-snow{
    display: none;
  }
  .ql-toolbar.ql-snow + .ql-container.ql-snow{
    border-top:1px;
  }
}
</style>

<style  lang="scss" scoped>
.equation {
  overflow: auto;
  .equation-tag{
    display: flex;
  }
  .tag-item {
    flex: 1;
    .el-tag {
      position: relative;
      vertical-align: bottom;
      height: 40px;
      line-height: 40px;
      margin: 0;
      width: 100%;
      text-align: center;
      padding: 0 24px;
      border: 1px solid #e0e0e0;
      border-left: none;
      border-radius: 0;
      font-size: 14px;
      font-weight: 600;
      color: $tc1;
      background-color: #f0f0f0;
      cursor: pointer;
      /deep/ .el-icon-close {
        width: 20px;
        height: 20px;
        line-height: 21px;
        text-align: center;
        font-size: 20px;
        color: #717171;
        &:hover {
          background-color: transparent;
        }
      }
    }
    .el-tag.active {
      position: relative;
      background-color: #ffffff;
      border-bottom-color: transparent;
      &:before {
        content: "";
        position: absolute;
        top: -1px;
        left: 0;
        right: 0;
        height: 2px;
        background-color: $active-color;
      }
    }
    &:first-child .el-tag {
      border-left: 1px solid #e0e0e0;
    }
    &:first-child .el-tag.active {
      border-left-color: transparent;
    }
  }
  .equation-type {
    height: 50vh;
    overflow: auto;
    .equation-name {
      font-size: 14px;
    }
    .equation-intro {
      font-size: 12px;
      color: #b0b0b9;
    }
    .equation-api {
      font-size: 15px;
    }
    .equation-field{
      padding: 0 20px;
      line-height: 40px;
      font-size: 14px;
      cursor: pointer;
      &:hover{
        background-color: #fafafb;
      }
    }
    .equation-intro {
      color: #6b737b;
      font-size: 12px;
      margin-top: 5px;
    }
    .equation-list {
      cursor: pointer;
      &:hover {
        background-color: #fafafb;
      }
    }
  }
}
</style>
