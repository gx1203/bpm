<template>
  <el-row
    class="form-item-row"
    :class="isSubTable && !item.tips ? 'padding-none' : ''"
  >
    <div class="form-item-content">
      <div v-if="isPrint">
        <div
          v-if="item.inputType === 'ckeditor'"
          class="print-text"
          v-html="item.applyvalue"
        >
          {{ item.applyvalue }}
        </div>
        <div
          v-else-if="
            item.inputType === 'radio' ||
              item.inputType === 'checkbox' ||
              item.inputType === 'city'
          "
          class="print-text"
        >
          {{ item.showValue }}
        </div>
        <div v-else-if="item.inputType === 'select'" class="print-text">
          {{ item.showValue }}
        </div>
        <div v-else-if="item.inputType.startsWith('select')" class="print-text">
          {{ item.showValue }}
        </div>
        <div
          v-else-if="
            item.inputType === 'time' ||
              item.inputType === 'time-edit' ||
              item.inputType === 'time-edits'
          "
          class="print-text"
        >
          {{ item.applyvalue | formatDateTimess }}
        </div>
        <div
          v-else-if="
            item.inputType === 'date-edit' || item.inputType === 'date'
          "
          class="print-text"
        >
          {{ item.applyvalue | formatDate }}
        </div>
        <div
          v-else-if="
            item.inputType === 'rating-1' || item.inputType === 'rating-2'
          "
          class="print-text"
        >
          {{ item.applyvalue ? item.applyvalue + '星' : '' }}
        </div>
        <div v-else class="print-text">
          {{ item.applyvalue }}
        </div>
      </div>

      <div v-else class="flow-item">
        <p v-if="isSubTable" style="position: fixed; left: -10000px">
          <span
            v-if="
              item.inputType === 'time' ||
                item.inputType === 'time-edits' ||
                item.inputType === 'time-edit'
            "
            :id="
              item.relationType + '_' + item.fieldName + (index || '') + '_span'
            "
            >{{ item.applyvalue | formatDateTimess }}</span
          >
          <span
            v-else-if="
              item.inputType === 'date' || item.inputType === 'date-edit'
            "
            :id="
              item.relationType + '_' + item.fieldName + (index || '') + '_span'
            "
            >{{ item.applyvalue | formatDate }}</span
          >
          <span
            v-else
            :id="
              item.relationType + '_' + item.fieldName + (index || '') + '_span'
            "
            >{{ item.showValue || item.applyvalue }}</span
          >
        </p>
        <!-- <editor :item='item'></editor> -->
        <!-- input 输入框增加[申请人]选择 Huang Xiaoxiao 2022.09.21 -->
        <el-input
          v-if="item.inputType === 'text' || item.inputType === 'textarea' || item.inputType === 'applicant'"
          v-show="item.editstate !== 'H'"
          :id="item.relationType + '_' + item.fieldName + (index || '')"
          :ref="item.id"
          v-model="item.applyvalue"
          clearable
          :title="item.applyvalue"
          :placeholder="item.placeholder"
          autocomplete="off"
          show-word-limit
          :type="item.inputType"
          :autosize="{minRows:4,maxRows:8}"
          :maxlength="item.inputType === 'textarea' ? item.length : ''"
          :disabled="item.editstate === 'R' ||  item.inputType === 'applicant'"
          @click.native="
            item.eventtype &&
              item.eventtype.split(',').indexOf('click') !== -1 &&
              externalFun(
                item.event.split(',')[
                  item.eventtype.split(',').indexOf('click')
                ]
              )
          "
          @focus="
            item.eventtype &&
              item.eventtype.split(',').indexOf('focus') !== -1 &&
              externalFun(
                item.event.split(',')[
                  item.eventtype.split(',').indexOf('focus')
                ]
              )
          "
          @blur="
            item.eventtype &&
              item.eventtype.split(',').indexOf('blur') !== -1 &&
              externalFun(
                item.event.split(',')[item.eventtype.split(',').indexOf('blur')]
              )
          "
          @input="changeValue"
        />
        <el-input
          v-if="item.inputType === 'hidden'"
          v-show="item.editstate !== 'H'"
          :id="item.relationType + '_' + item.fieldName + (index || '')"
          :ref="item.id"
          v-model="item.applyvalue"
          clearable
          :type="item.inputType"
          :disabled="item.editstate === 'R'"
          :placeholder="item.placeholder"
        />
        <el-input
          v-else-if="item.inputType === 'number'"
          v-show="item.editstate !== 'H'"
          :id="item.relationType + '_' + item.fieldName + (index || '')"
          :ref="item.id"
          v-model="item.applyvalue"
          clearable
          :placeholder="item.placeholder"
          :title="item.applyvalue"
          maxlength="19"
          type="number"
          on-keypress="return(/[\d-]/.test(String.fromCharCode(event.keyCode)))"
          :disabled="item.editstate === 'R'"
          @click.native="
            item.eventtype &&
              item.eventtype.split(',').indexOf('click') !== -1 &&
              externalFun(
                item.event.split(',')[
                  item.eventtype.split(',').indexOf('click')
                ]
              )
          "
          @focus="
            item.eventtype &&
              item.eventtype.split(',').indexOf('focus') !== -1 &&
              externalFun(
                item.event.split(',')[
                  item.eventtype.split(',').indexOf('focus')
                ]
              )
          "
          @blur="
            item.eventtype &&
              item.eventtype.split(',').indexOf('blur') !== -1 &&
              externalFun(
                item.event.split(',')[item.eventtype.split(',').indexOf('blur')]
              )
          "
          @input="numberChangeValue"
        />
        <el-input
          v-else-if="item.inputType === 'rate'"
          v-show="item.editstate !== 'H'"
          :id="item.relationType + '_' + item.fieldName + (index || '')"
          :ref="item.id"
          v-model="item.applyvalue"
          clearable
          :placeholder="item.placeholder"
          type="number"
          maxlength="19"
          on-keypress="return(/[\d.+-]/.test(String.fromCharCode(event.keyCode)))"
          :title="item.applyvalue"
          autocomplete="off"
          :disabled="item.editstate === 'R'"
          @click.native="
            item.eventtype &&
              item.eventtype.split(',').indexOf('click') !== -1 &&
              externalFun(
                item.event.split(',')[
                  item.eventtype.split(',').indexOf('click')
                ]
              )
          "
          @focus="
            item.eventtype &&
              item.eventtype.split(',').indexOf('focus') !== -1 &&
              externalFun(
                item.event.split(',')[
                  item.eventtype.split(',').indexOf('focus')
                ]
              )
          "
          @blur="
            item.eventtype &&
              item.eventtype.split(',').indexOf('blur') !== -1 &&
              externalFun(
                item.event.split(',')[item.eventtype.split(',').indexOf('blur')]
              )
          "
          @input="numberChangeValue"
        />
        <el-input
          v-else-if="item.inputType === 'double'"
          v-show="item.editstate !== 'H'"
          :id="item.relationType + '_' + item.fieldName + (index || '')"
          :ref="item.id"
          v-model="item.applyvalue"
          clearable
          :placeholder="item.placeholder"
          autocomplete="off"
          type="text"
          maxlength="19"
          :title="item.applyvalue"
          :name="item.id"
          :disabled="item.editstate === 'R'"
          @click.native="
            item.eventtype &&
              item.eventtype.split(',').indexOf('click') !== -1 &&
              externalFun(
                item.event.split(',')[
                  item.eventtype.split(',').indexOf('click')
                ]
              )
          "
          @change="item.eventtype === 'change' && externalFun(item.event)"
          @focus="textFocus(item.event)"
          @blur="textBlur(item.event)"
          @input="numberChangeValue"
        />
        <el-input
          v-else-if="item.inputType === 'decimal'"
          v-show="item.editstate !== 'H'"
          :id="item.relationType + '_' + item.fieldName + (index || '')"
          :ref="item.id"
          v-model="item.applyvalue"
          :placeholder="item.placeholder"
          type="number"
          maxlength="19"
          on-keypress="return(/[\d.+-]/.test(String.fromCharCode(event.keyCode)))"
          :title="item.applyvalue"
          autocomplete="off"
          :disabled="item.editstate === 'R'"
          @click.native="
            item.eventtype &&
              item.eventtype.split(',').indexOf('click') !== -1 &&
              externalFun(
                item.event.split(',')[
                  item.eventtype.split(',').indexOf('click')
                ]
              )
          "
          @focus="
            item.eventtype &&
              item.eventtype.split(',').indexOf('focus') !== -1 &&
              externalFun(
                item.event.split(',')[
                  item.eventtype.split(',').indexOf('focus')
                ]
              )
          "
          @blur="
            item.eventtype &&
              item.eventtype.split(',').indexOf('blur') !== -1 &&
              externalFun(
                item.event.split(',')[item.eventtype.split(',').indexOf('blur')]
              )
          "
          @input="numberChangeValue"
        />
        <el-input
          v-if="item.inputType === 'email'"
          v-show="item.editstate !== 'H'"
          :id="item.relationType + '_' + item.fieldName + (index || '')"
          :ref="item.id"
          v-model="item.applyvalue"
          clearable
          :title="item.applyvalue"
          :placeholder="item.placeholder"
          autocomplete="off"
          show-word-limit
          :type="item.inputType"
          :disabled="item.editstate === 'R'"
          @click.native="
            item.eventtype &&
              item.eventtype.split(',').indexOf('click') !== -1 &&
              externalFun(
                item.event.split(',')[
                  item.eventtype.split(',').indexOf('click')
                ]
              )
          "
          @focus="
            item.eventtype &&
              item.eventtype.split(',').indexOf('focus') !== -1 &&
              externalFun(
                item.event.split(',')[
                  item.eventtype.split(',').indexOf('focus')
                ]
              )
          "
          @blur="emailBlur(item)"
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
        <el-cascader
          v-else-if="item.inputType === 'province'"
          v-show="item.editstate !== 'H'"
          :id="item.relationType + '_' + item.fieldName + (index || '')"
          :disabled="item.editstate === 'R'"
          auto-complete="off"
          :ref="item.id"
          class="province"
          v-model="item.applyArray"
          :options="areaoptions"
          @change="changeProvince(item)"
        ></el-cascader>
        <el-select
          v-else-if="item.inputType === 'select'"
          v-show="item.editstate !== 'H'"
          :id="item.relationType + '_' + item.fieldName + (index || '')"
          :ref="item.id"
          v-model="item.applyvalue"
          clearable
          filterable
          :title="item.showValue"
          :disabled="item.editstate === 'R'"
          auto-complete="off"
          readonly
          class="closePlaceholder"
          autocomplete="new-password"
          style="width: 100%"
          :placeholder="item.placeholder"
          @click.native="
            item.eventtype &&
              item.eventtype.split(',').indexOf('click') !== -1 &&
              externalFun(
                item.event.split(',')[
                  item.eventtype.split(',').indexOf('click')
                ]
              )
          "
          @focus="
            item.eventtype &&
              item.eventtype.split(',').indexOf('focus') !== -1 &&
              externalFun(
                item.event.split(',')[
                  item.eventtype.split(',').indexOf('focus')
                ]
              )
          "
          @visible-change="selectFocus"
          @blur="
            item.eventtype &&
              item.eventtype.split(',').indexOf('blur') !== -1 &&
              externalFun(
                item.event.split(',')[item.eventtype.split(',').indexOf('blur')]
              )
          "
          @input.native="item.eventtype === 'input' && externalFun(item.event)"
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
          :id="item.relationType + '_' + item.fieldName + (index || '')"
          :ref="item.id"
          v-model="item.selectMoreData"
          clearable
          multiple
          filterable
          :title="item.showValue"
          :disabled="item.editstate === 'R'"
          auto-complete="off"
          readonly
          class="closePlaceholder"
          autocomplete="new-password"
          style="width: 100%"
          :placeholder="item.placeholder"
          @click.native="item.eventtype === 'click' && externalFun(item.event)"
          @focus="item.eventtype === 'focus' && externalFun(item.event)"
          @visible-change="selectFocus"
          @blur="item.eventtype === 'blur' && externalFun(item.event)"
          @input.native="item.eventtype === 'input' && externalFun(item.event)"
          @change="changeSelectMore"
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
        <!-- 修改通用link组件 HuangXiaoxiao 2022.08.31-->
        <div v-else-if="item.inputType === 'link'">
          <div v-if="item.remark === 'link'">
            <el-link
            v-for="(imgItem, imgIndex) in item.applyvalue"
            :underline="false"
            :key="'imgLink_' + imgIndex"
            :href="imgItem.DOWNURL"
            type="primary"
            target="_blank"
            >{{ imgItem.FILENAME }}</el-link>
          </div>
          <div v-else>
            <!-- 九彩云link组件-->
          <el-link
            v-show="item.applyvalue"
            :id="item.relationType + '_' + item.fieldName + (index || '')"
            type="primary"
            :href="item.applyvalue ? item.applyvalue : 'javascript:;'"
            :target="item.applyvalue ? '_blank' : ''"
          >
            查看
          </el-link>
          </div>
        </div>
        <el-button
          v-else-if="item.inputType === 'customDialog'"
          :id="item.relationType + '_' + item.fieldName + (index || '')"
          type="text"
          @click="customBtnClick()"
        >
          详情
        </el-button>
        <el-radio-group
          v-else-if="item.inputType === 'radio'"
          v-show="item.editstate !== 'H'"
          :id="item.relationType + '_' + item.fieldName + (index || '')"
          :ref="item.id"
          v-model="item.applyvalue"
          autocomplete="off"
          :disabled="item.editstate === 'R'"
          @change="item.eventtype !== '' && externalFun(item.event)"
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
          :id="item.relationType + '_' + item.fieldName + (index || '')"
          :ref="item.id"
          v-model="item.applyArray"
          autocomplete="off"
          :disabled="item.editstate === 'R'"
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
          :id="item.relationType + '_' + item.fieldName + (index || '')"
          v-model="item.applyvalue"
          :title="item.applyvalue | formatDate"
          clearable
          :picker-options="pickerOptions"
          :default-value="timeDefaultShow"
          :placeholder="item.placeholder"
          :disabled="item.editstate === 'R'"
          format="yyyy-MM-dd"
          style="width: 100%"
          @change="changeValue"
        />
        <el-date-picker
          v-else-if="item.inputType === 'date-edit'"
          v-show="item.editstate !== 'H'"
          :id="item.relationType + '_' + item.fieldName + (index || '')"
          :ref="item.id"
          v-model="item.applyvalue"
          autocomplete="off"
          :title="item.applyvalue | formatDate"
          clearable
          :editable="item.inputType === 'date-edit'"
          :placeholder="item.placeholder"
          :disabled="item.editstate === 'R'"
          style="width: 100%"
          format="yyyy-MM-dd"
          @change="changeValue"
        />
        <el-date-picker
          v-else-if="
            item.inputType === 'time' ||
              item.inputType === 'time-edit' ||
              item.inputType === 'time-edits'
          "
          v-show="item.editstate !== 'H'"
          :id="item.relationType + '_' + item.fieldName + (index || '')"
          :ref="item.id"
          v-model="item.applyvalue"
          autocomplete="off"
          :title="item.applyvalue | formatDateTimess"
          :disabled="item.editstate === 'R'"
          :placeholder="item.placeholder"
          clearable
          style="width: 100%"
          format="yyyy-MM-dd HH:mm:ss"
          type="datetime"
          @change="changeValue"
        />
        <el-date-picker
          v-else-if="item.inputType === 'month'"
          v-show="item.editstate !== 'H'"
          :id="item.relationType + '_' + item.fieldName + (index || '')"
          :ref="item.id"
          v-model="item.applyvalue"
          autocomplete="off"
          :title="item.applyvalue"
          :disabled="item.editstate === 'R'"
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
          :id="item.relationType + '_' + item.fieldName + (index || '')"
          :ref="item.id"
          v-model="item.applyvalue"
          autocomplete="off"
          :title="item.applyvalue"
          :disabled="item.editstate === 'R'"
          :placeholder="item.placeholder || '选择年份'"
          clearable
          style="width: 100%"
          value-format="yyyy"
          format="yyyy"
          type="year"
          @change="changeValue"
        />
        <el-date-picker
          v-else-if="item.inputType === 'date_limit'"
          v-show="item.editstate !== 'H'"
          :id="item.relationType + '_' + item.fieldName + (index || '')"
          :ref="item.id"
          v-model="item.applyvalue"
          :title="item.applyvalue"
          :disabled="item.editstate === 'R'"
          clearable
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd HH:mm:ss"
          :picker-options="pickerOptions"
          :default-time="['00:00:00', '23:59:59']"
          @change="changeValue"
        />
        <!--<el-time-picker-->
        <!--v-else-if="item.inputType === 'time' || item.inputType === 'time-edit'"-->
        <!--:ref="item.id"-->
        <!--v-model="item.applyvalue"-->
        <!--:editable="item.inputType === 'time-edit'"-->
        <!--:disabled="item.editstate === 'R'"-->
        <!--v-show="item.editstate !== 'H'"-->
        <!--placeholder="选择时间"-->
        <!--style="width: 100%"-->
        <!--@change="changeValue" />-->
        <el-rate
          v-else-if="
            item.inputType === 'rating-1' || item.inputType === 'rating-2'
          "
          v-show="item.editstate !== 'H'"
          :id="item.relationType + '_' + item.fieldName + (index || '')"
          :ref="item.id"
          v-model="item.applyvalue"
          autocomplete="off"
          :allow-half="item.inputType === 'rating-2'"
          :title="item.applyvalue"
          :disabled="item.editstate === 'R'"
          @change="changeValue"
        />
        <el-tree
          v-else-if="item.inputType === 'treetable'"
          v-show="item.editstate !== 'H'"
          :id="item.relationType + '_' + item.fieldName + (index || '')"
          class="elTree"
          :data="item.tableDataLists"
          :disabled="item.editstate === 'R'"
          autocomplete="off"
        />
        <!-- <ckeditor
      v-else-if="item.inputType === 'ckeditor'"
      v-model="item.applyvalue"
      :editor="editor"
      :config="editorConfig"
      :disabled="item.editstate === 'R'"
      v-show="item.editstate !== 'H'"
    ></ckeditor>-->
        <quill-editor
          v-else-if="item.inputType === 'ckeditor'"
          v-show="item.editstate !== 'H'"
          :id="item.relationType + '_' + item.fieldName + (index || '')"
          ref="myQuillEditor"
          v-model="item.applyvalue"
          v-loading="quillUpdateImg"
          style="width: 886px"
          :class="[item.editstate === 'R' ? 'bag' : '']"
          :options="editorOption"
          :disabled="item.editstate === 'R'"
          @blur="onEditorBlur($event)"
          @focus="onEditorFocus($event)"
          @change="onEditorChange($event)"
        />
        <city-picker
          v-else-if="item.inputType === 'city'"
          v-show="item.editstate !== 'H'"
          :id="item.relationType + '_' + item.fieldName + (index || '')"
          v-model="item.applyvalue"
          field="city"
          :placeholder="item.placeholder"
          :no-hot="true"
          :title="item.showValue"
          :disabled="item.editstate === 'R'"
          style="width: 100%"
        />
        <el-upload
          v-else-if="item.inputType === 'file'"
          v-show="item.editstate !== 'H'"
          :id="item.relationType + '_' + item.fieldName + (index || '')"
          autocomplete="off"
          :file-list="item.applyvalue"
          :action="action"
          :on-preview="onPreviewAction"
          list-type="text"
          :disabled="item.editstate === 'R'"
        >
          <el-button type="primary">
            {{ $t('uploadAttachment') }}
          </el-button>
        </el-upload>
        <div v-else-if="item.inputType === 'office'">
          <el-button
            v-if="item.applyvalue"
            type="primary"
            @click="officeClick('edit')"
          >
            编辑
          </el-button>
          <el-button v-else type="primary" @click="officeClick('new')">
            新建
          </el-button>
          <!--          <el-button type="primary" @click="queryContent">刷新</el-button>-->
          <div class="iframeWord">
            <iframe :src="wordIframe" frameborder="0" />
            <div class="viewDoc">
              <h1 class="docTitle">
                {{ editContent.content }}
              </h1>
              <manage-father :data="editContent.childrens" />
            </div>
          </div>
        </div>
        <el-row
          v-else-if="item.inputType === 'nokt'"
          type="flex"
          :gutter="20"
          style="display: flex; align-items: center"
        >
          <el-col
            :span="20"
            style="border-bottom: 1px solid #dedede; height: 28px"
          >
            <el-button
              v-if="item.showValue"
              :title="item.showValue"
              type="text"
              style="
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              "
              @click="open(false)"
            >
              {{ item.showValue }}
            </el-button>
          </el-col>
          <el-col :span="4">
            <el-row type="flex">
              <!-- <el-col :span="18" v-if="item.editstate !== 'R'">
          <el-upload
            autocomplete="off"
            :action="action"
            ref="upload"
            :disabled="item.editstate === 'R'"
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
              <el-col v-if="item.editstate !== 'R'" :span="24">
                <el-button type="text" @click="open(true)">
                  {{ $t('editText') }}
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
              item.inputType === 'selectOrganizationMore'
          "
        >
          <el-input
            v-show="item.editstate !== 'H'"
            :id="item.relationType + '_' + item.fieldName + (index || '')"
            :ref="item.id"
            clearable
            :value="item.showValue"
            :title="item.showValue"
            autocomplete="off"
            :disabled="item.editstate === 'R'"
            :placeholder="item.placeholder"
            @clear="clearSelect(item)"
            @focus.stop="showSelect($event, item)"
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
            :radio-checked="item.applyvalue"
            @confirm="getUser"
          />
        </div>
        <!--        suffix-icon="el-icon-arrow-down"-->
        <div
          v-else-if="
            item.inputType === 'multipleDialog' ||
              item.inputType === 'radioDialog'
          "
        >
          <el-input
            v-show="item.editstate !== 'H'"
            :id="item.relationType + '_' + item.fieldName + (index || '')"
            :ref="item.id"
            clearable
            :value="item.showValue"
            :title="item.showValue"
            autocomplete="off"
            :disabled="item.editstate === 'R'"
            :placeholder="item.placeholder"
            @clear="clearDialog(item)"
            @focus="showTabDialog(item)"
          />
          <multipleDialog
            v-model="multipleDialogVisible"
            :check-tab-data="checkTabData"
            :p-item="pItem"
            @confirm="getMultipleDialog"
          />
          <radioDialog
            v-model="radioDialogVisible"
            :check-tab-data="checkTabData"
            :p-item="pItem"
            @confirm="getRadioDialog"
          />
        </div>
        <div v-else-if="item.inputType === 'process'">
          <div
            v-if="item.editstate === 'R' && item.applyvalue"
            v-show="item.editstate !== 'H'"
            :id="item.relationType + '_' + item.fieldName + (index || '')"
          >
            <el-link
              v-for="(val, i) in item.applyvalue.split(',')"
              :key="i"
              type="primary"
              style="margin-right: 10px"
              @click="toFlow(val)"
            >
              {{ val }}
            </el-link>
          </div>
          <el-input
            v-else
            v-show="item.editstate !== 'H'"
            :id="item.relationType + '_' + item.fieldName + (index || '')"
            :ref="item.id"
            v-model="item.applyvalue"
            clearable
            :title="item.applyvalue"
            autocomplete="off"
            :disabled="item.editstate === 'R'"
            :placeholder="item.placeholder"
            @focus="showProcessDocuments(item)"
          />
          <choose-process-documents
            v-model="processDocumentsVisible"
            :applyvalue="item.applyvalue"
            :table-id="item.id"
            @confirm="getProcessDocuments"
          />
        </div>
        <bas-organieation
          v-model="organieationShow"
          :selected-element="selectedElement"
          :is-specified-group-but="false"
          :organizes="organizes"
          :is-show-bustom-groups-but="false"
          :select-element="selectElement"
          :show-element="showElement"
          :title="orgtitle"
          :multiple="basOrganieationMultiple"
          @fnCallBack="fnBasOrganieationCallBack"
        />
      </div>
    </div>
    <div class="form-item-tip">
      <el-popover v-if="item.tips" placement="top-start" trigger="hover">
        <div v-html="item.tips" />
        <el-button
          slot="reference"
          icon="el-icon-question"
          style="color: #3141a9"
          type="text"
        />
      </el-popover>
    </div>
  </el-row>
</template>

<script>
import $ from 'jquery'
import Vue from 'vue'
import { quillEditor } from 'vue-quill-editor' // 调用编辑器
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import cityList from 'china-city-data'
import CityPicker from './CityPicker'
import SelectOrg from './SelectOrganization'
import SelectPeople from './SelectPeople'
// import editor from "../../components/editor";
import multipleDialog from '@/bpm/components/tableDialog/multipleDialog'
import radioDialog from '@/bpm/components/tableDialog/radioDialog'
import manageFather from '@/bpa/views/processDesignCenter/child1/components/manage_father.vue'
import chooseProcessDocuments from '@/bpm/components/processDocumentsConfig/chooseProcessDocuments.vue'
import {
  getFormNodeOrgs,
  queryProcessName
} from '@/bpm/api/process/processModeling/classificationModel'
import {
  getInfosByLinkSimple,
  getTableRelationField,
  getDocId,
  checkProcessDefaultPage
} from '@/bpm/api/flow'
import { queryContent, getDistrictList } from '@/bpa/api/processDesignCenter'

import { createNamespacedHelpers } from 'vuex'

import BasComponent from 'bas-component'
Vue.use(BasComponent)
import 'bas-component/lib/BasComponent.css'
import { getOrgTree } from '@/bpm/api/app'
import { verifyEmail } from '@/bpm/utils/common'
import formFieldCalculation from '@/bpm/mixins/form_field_calculation'
import {getSignatureAttachmentId } from "@/bpm/api/flow";
const { mapGetters, mapMutations } = createNamespacedHelpers('app')

window.CITY_PICKER_LIST = cityList

export default {
  name: 'FlowItem',
  mixins: [formFieldCalculation],
  components: {
    // editor,
    CityPicker,
    quillEditor,
    SelectOrg,
    SelectPeople,
    multipleDialog,
    radioDialog,
    manageFather,
    chooseProcessDocuments
  },
  props: {
    item: {
      type: Object,
      default: () => ({})
    },
    pItem: {
      type: Array,
      default: () => []
    },
    bizData2: {
      type: Object,
      default: null
    },
    isPrint: {
      type: Boolean
    },
    index: {
      type: Number
    },
    isSubTable: {
      type: Boolean
    },
    isPopUp: {
      type: String,
      default: ''
    }
  },

  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          var todayYear=(new Date()).getFullYear();
          var todayMonth=(new Date()).getMonth();
          var todayDay=(new Date()).getDate();
          var todayTime=(new Date(todayYear,todayMonth,todayDay,'23','59','59')).getTime()
          return time.getTime() > todayTime
        }
      },
      pickerOptions: {},
      areaoptions: [], //这是我们的省市区的option
      selectMoreData: [],
      accept:
        'application/msword,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      organizeDialog: false,
      peopleDialog: false,
      isMore: false,
      timeDefaultShow: '',
      quillUpdateImg: false,
      multipleDialogVisible: false,
      radioDialogVisible: false,
      processDocumentsVisible: false,
      myHeaders: { token: localStorage.getItem('token') },
      action: `${process.env.VUE_APP_HOST_URL}${process.env.VUE_APP_BASE_URL}/attach/upload?attachmentType=bpm`,
      selectType: '',
      editorOption: {
        placeholder: this.$t('placeholderText.pleaseEditRichTextHere'),
        modules: {
          toolbar: {
            container: [
              ['bold', 'italic', 'underline', 'strike'], // 加粗，斜体，下划线，删除线
              ['blockquote', 'code-block'], // 引用，代码块
              [{ header: 1 }, { header: 2 }], // 标题，键值对的形式；1、2表示字体大小
              [{ indent: '-1' }, { indent: '+1' }], // 缩进
              [{ direction: 'rtl' }], // 文本方向
              [{ size: ['small', false, 'large', 'huge'] }], // 字体大小
              [{ header: [1, 2, 3, 4, 5, 6, false] }], // 几级标题
              [{ color: [] }, { background: [] }], // 字体颜色，字体背景颜色
              [{ font: [] }], // 字体
              [{ align: [] }], // 对齐方式
              ['image'] // 上传图片
            ]
            // handlers: {
            // 'image': function (value) {
            //     if (value) {
            //         document.querySelector('.avatar-uploader input').click()
            //     } else {
            //         this.quill.format('image', false);
            //     }
            // }
            // }
          }
        }
      },
      titleConfig: [
        { Choice: '.ql-bold', title: '加粗' },
        { Choice: '.ql-italic', title: '斜体' },
        { Choice: '.ql-underline', title: '下划线' },
        { Choice: '.ql-header', title: '段落格式' },
        { Choice: '.ql-strike', title: '删除线' },
        { Choice: '.ql-blockquote', title: '块引用' },
        { Choice: '.ql-code', title: '插入代码' },
        { Choice: '.ql-code-block', title: '插入代码段' },
        { Choice: '.ql-font', title: '字体' },
        { Choice: '.ql-size', title: '字体大小' },
        { Choice: '.ql-list[value="ordered"]', title: '编号列表' },
        { Choice: '.ql-list[value="bullet"]', title: '项目列表' },
        { Choice: '.ql-direction', title: '文本方向' },
        { Choice: '.ql-header[value="1"]', title: 'h1' },
        { Choice: '.ql-header[value="2"]', title: 'h2' },
        { Choice: '.ql-align', title: '对齐方式' },
        { Choice: '.ql-color', title: '字体颜色' },
        { Choice: '.ql-background', title: '背景颜色' },
        { Choice: '.ql-image', title: '图像' },
        { Choice: '.ql-video', title: '视频' },
        { Choice: '.ql-link', title: '添加链接' },
        { Choice: '.ql-formula', title: '插入公式' },
        { Choice: '.ql-clean', title: '清除字体格式' },
        { Choice: '.ql-script[value="sub"]', title: '下标' },
        { Choice: '.ql-script[value="super"]', title: '上标' },
        { Choice: '.ql-indent[value="-1"]', title: '向左缩进' },
        { Choice: '.ql-indent[value="+1"]', title: '向右缩进' },
        { Choice: '.ql-header .ql-picker-label', title: '标题大小' },
        {
          Choice: '.ql-header .ql-picker-item[data-value="1"]',
          title: '标题一'
        },
        {
          Choice: '.ql-header .ql-picker-item[data-value="2"]',
          title: '标题二'
        },
        {
          Choice: '.ql-header .ql-picker-item[data-value="3"]',
          title: '标题三'
        },
        {
          Choice: '.ql-header .ql-picker-item[data-value="4"]',
          title: '标题四'
        },
        {
          Choice: '.ql-header .ql-picker-item[data-value="5"]',
          title: '标题五'
        },
        {
          Choice: '.ql-header .ql-picker-item[data-value="6"]',
          title: '标题六'
        },
        { Choice: '.ql-header .ql-picker-item:last-child', title: '标准' },
        {
          Choice: '.ql-size .ql-picker-item[data-value="small"]',
          title: '小号'
        },
        {
          Choice: '.ql-size .ql-picker-item[data-value="large"]',
          title: '大号'
        },
        {
          Choice: '.ql-size .ql-picker-item[data-value="huge"]',
          title: '超大号'
        },
        { Choice: '.ql-size .ql-picker-item:nth-child(2)', title: '标准' },
        { Choice: '.ql-align .ql-picker-item:first-child', title: '居左对齐' },
        {
          Choice: '.ql-align .ql-picker-item[data-value="center"]',
          title: '居中对齐'
        },
        {
          Choice: '.ql-align .ql-picker-item[data-value="right"]',
          title: '居右对齐'
        },
        {
          Choice: '.ql-align .ql-picker-item[data-value="justify"]',
          title: '两端对齐'
        }
      ],
      editor: '',
      organieationShow: false,
      selectedElement: {},
      showElement: [],
      selectElement: ['9'],
      orgtitle: '',
      basOrganieationMultiple: true,
      userAll: [],
      checkData: [],
      checkTabData: {},
      organizes: [],
      clickVal: {},
      wordIframe: '',
      editContent: {},
      calculationTable: null,
      calculationResult: '',
      moreCalculationResultList: [],
      forIndex: null
    }
  },
  computed: {
    ...mapGetters(['bizData', 'customError']),
    ...mapGetters(['nodeData']),
    showSelectLabel() {
      if (this.isMore) {
        if (this.selectType === 'user') {
          return this.item.applyvalue
            .map(item => {
              return item.displayname
            })
            .join(',')
        } else if (this.selectType === 'org') {
          return this.item.applyvalue
            .map(item => {
              return item.NAME
            })
            .join('&')
        }
      } else {
        if (this.selectType === 'user') {
          return this.item.applyvalue.displayname || ''
        } else if (this.selectType === 'org') {
          return this.item.applyvalue.NAME || ''
        }
      }
      return null
    },
    showLabel() {
      const item = this.item.nodeoptions.find(item => {
        return item.value === this.item.applyvalue
      })
      return item ? item.text : ''
    }
  },
  watch: {
    item: {
      handler(val) {
        if (val.defaultUserMap) {
          this.$set(
            val,
            'showValue',
            val.defaultUserMap.userName ? val.defaultUserMap.userName : null
          )
          this.$set(
            val,
            'applyvalue',
            val.defaultUserMap.userId ? val.defaultUserMap.userId : null
          )
        }
        // 处理多选的数据问题
        if (val.inputType === 'selectMultiple') {
          if (val.applyvalue !== undefined && val.applyvalue !== '') {
            this.$set(val, 'selectMoreData', val.applyvalue.split(','))
          } else {
            this.$set(val, 'selectMoreData', [])
          }
        }
        //处理申请人自动填入表单申请人id HuangXiaoxiao  2022.09.21
        if(val.inputType === 'applicant'){
          var userId = this.$store.state.app.nodeData.applyUserDto.id;
          this.$set(val, 'applyvalue', userId)
          this.$set(val, 'showValue', userId)
        }
        
        if (this.bizData2) {
          this.shiftData(val, this.bizData2)
        } else {
          this.shiftData(val, this.bizData)
        }
        this.customWidth()
      },
      immediate: true
    },
    bizData: {
      handler(val) {
        if (this.bizData2) {
          this.shiftData(this.item, this.bizData2)
        } else {
          this.shiftData(this.item, this.bizData)
        }
      }
    },
    'item.applyvalue': {
      handler(val) {
        let bizData
        if (this.bizData2) {
          bizData = this.bizData2
        } else {
          bizData = this.bizData
        }
        if (Object.keys(bizData).length > 0) {
          bizData[this.item.fieldName] = {}
          bizData[this.item.fieldName].value = val
          bizData[this.item.fieldName].showValue = this.item.showValue
        }
        if (val === '' || val === undefined || val === null) {
          this.item.showValue = val
        }
        this.setTemporaryBizData(bizData)
        // if(this.item.eventtype === 'click') {
        //   this.$emit("externalFun", this.item.event);
        // } else if (this.item.eventtype === 'focus') {
        //   this.$emit("externalFun", this.item.event);
        // }else if (this.item.eventtype === 'blur') {
        //   this.$emit("externalFun", this.item.event);
        // }else if (this.item.eventtype === 'input') {
        //   this.$emit("externalFun", this.item.event);
        // }else if (this.item.eventtype === 'change') {
        //   this.$emit("externalFun", this.item.event);
        // }
        // console.log(bizData)
        this.getTableWidth()
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      for (const item of this.titleConfig) {
        const tip = document.querySelectorAll('.quill-editor ' + item.Choice)
        if (!tip) continue
        tip.forEach(v => {
          v.setAttribute('title', item.title)
        })
      }
      this.getTableWidth()
      if (this.$route.query.processName == 'WDQXSP') {
        this.pickerOptions = {
          disabledDate(time) {
            return time.getTime() < Date.now() - 8.64e7 //禁用以前的日期，今天不禁用
            // return date.getTime() <= Date.now();    //禁用今天以及以前的日期
          }
        }
      }
    })
    if (this.$props.item.inputType === 'province') {
      this.areaoptions = this.$props.item.nodeoptions
    }
  },
  methods: {
    customBtnClick(){
      this.$emit("customBtnClick");
    },
    // 文件预览
    onPreviewAction(fileInfo) {
      console.log(item)
      return
      let item = fileInfo.response
      getSignatureAttachmentId(item.id).then(rt => {
        let filename = item.newName
        if (item.id !== rt.data) {
          filename = filename.split('.')
          filename[filename.length - 1] = 'pdf'
          filename = filename.join('.')
        }
        window.open(`${this.nodeData.idocViewServerUrl}${item.id}&name=${filename}`, "_blank")
      })
    },
    getTableWidth() {
      this.$nextTick(() => {
        if (this.isSubTable) {
          let length
          if (this.isPopUp === '1') {
            length = this.pItem.filter(
              item => item.inputType !== 'hidden' && item.isShowColumn === '1'
            ).length
          } else {
            length = this.pItem.filter(item => item.inputType !== 'hidden')
              .length
          }
          if (length < 6) {
            return
          }
          if (!this.item.width) {
            let width =
              $(
                `td #${this.item.relationType}_${this.item.fieldName}${this
                  .index || ''}_span`
              ).width() + 40
            if (this.item.maxWidth && Number(this.item.maxWidth) < width) {
              width = Number(this.item.maxWidth) + 40
            }
            if (
              this.item.inputType === 'time' ||
              this.item.inputType === 'time-edit' ||
              this.item.inputType === 'time-edits' ||
              this.item.inputType === 'date-edit' ||
              this.item.inputType === 'date' ||
              this.item.inputType === 'month' ||
              this.item.inputType === 'year'
            ) {
              width += 10
            }
            if (this.item.inputType === 'number') {
              width += 20
            }
            $(
              `td .el-input #${this.item.relationType}_${
                this.item.fieldName
              }${this.index || ''}`
            ).css({ width: `${width}px` })
            $(
              `td .el-input #${this.item.relationType}_${
                this.item.fieldName
              }${this.index || ''}`
            )
              .parents('td')
              .css({ width: `${width + 10}px` })
          }
        }
        this.$forceUpdate()
      })
    },
    getBytesLength(str) {
      let totalWidth = 0
      for (let i = 0, len = str.length; i < len; i++) {
        totalWidth += str.charCodeAt(i) > 255 ? 12 : 6.69
        // if (charCode < 0x007f)  {
        //   totalLength++;
        // } else if ((0x0080 <= charCode) && (charCode <= 0x07ff))  {
        //   totalLength += 2;
        // } else if ((0x0800 <= charCode) && (charCode <= 0xffff))  {
        //   totalLength += 3;
        // } else{
        //   totalLength += 4;
        // }
      }
      return totalWidth
    },
    customWidth() {
      this.$nextTick(() => {
        if (this.item.width) {
          const width = Number(this.item.width) + 40
          $(
            `td #${this.item.relationType}_${this.item.fieldName}${this.index ||
              ''}`
          ).css({ width: `${width}px` })
          $(
            `td #${this.item.relationType}_${this.item.fieldName}${this.index ||
              ''}`
          )
            .parents('.el-input')
            .css({ minWidth: `${width}px` })
          $(
            `td #${this.item.relationType}_${this.item.fieldName}${this.index ||
              ''}`
          )
            .parents('.el-select')
            .css({ width: `${width}px` })
          $(
            `td #${this.item.relationType}_${this.item.fieldName}${this.index ||
              ''}`
          )
            .parents('td')
            .css({ width: `${Number(width) + 10}px` })
          $(
            `td #${this.item.relationType}_${this.item.fieldName}${this.index ||
              ''}`
          )
            .parents('.form-item-row')
            .css({ minWidth: `${Number(width)}px` })
        }
      })
    },
    open(type) {
      var datatochildcmd = 4
      var v1 = Math.random()
      const _this = this
      var ntkoed = ntkoBrowser.ExtensionInstalled()
      const _href = window.location.origin + window.location.pathname + 'nokt/'
      // let _href = 'http://localhost/newdemo/'
      if (!!window.ActiveXObject || 'ActiveXObject' in window) {
        ntkoBrowser.openWindow(
          _href +
            '/editindex.html?cmd=' +
            datatochildcmd +
            '&item=' +
            this.item.showValue +
            '&id=' +
            this.item.value +
            '&type=' +
            type +
            '&href=' +
            process.env.VUE_APP_HOST_URL +
            process.env.VUE_APP_BASE_URL +
            '&v1=' +
            v1
        )
      } else {
        this.$message.error(
          '请使用IE9+浏览器，并检查浏览器选项中的安全设置！！'
        )
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
      window.ntkoSendDataToChildtext = function(ab) {
        ntkoBrowser.ntkoSendDataToChild(
          _href +
            'editindex.html?cmd=' +
            datatochildcmd +
            '&item=' +
            _this.item.showValue +
            '&type=' +
            type +
            '&href=' +
            process.env.VUE_APP_HOST_URL +
            process.env.VUE_APP_BASE_URL +
            '&v1=' +
            v1,
          _this.item.value
        )
      }
      window.ntkoCloseEvent = function() {
        // alert("跨浏览器插件应用程序窗口已关闭!");
      }
      window.OnData = function(id, name) {
        _this.item.value = id
        _this.item.showValue = name
      }
    },
    officeClick(type) {
      this.wordIframe = ''
      this.$nextTick(() => {
        switch (true) {
          case type === 'new':
            getDocId()
              .then(rt => {
                if (rt.status === '200') {
                  this.$set(this.item, 'showValue', rt.data)
                  this.$set(this.item, 'applyvalue', rt.data)
                  this.wordIframe = `${process.env.VUE_APP_HOST_URL}${process.env.VUE_APP_BASE_URL}/bpmpo/index?type=new&ids=${this.item.applyvalue}&username=${this.$store.state.basuser.user.id}&serverContextPath=${process.env.VUE_APP_BASE_URL}`
                  console.log(this.wordIframe)
                }
              })
              .catch(() => {})
            break
          case type === 'edit':
            this.wordIframe = `${process.env.VUE_APP_HOST_URL}${process.env.VUE_APP_BASE_URL}/bpmpo/index?type=edit&ids=${this.item.applyvalue}&username=${this.$store.state.basuser.user.id}&serverContextPath=${process.env.VUE_APP_BASE_URL}`
            console.log(this.wordIframe)
            break
        }
      })
    },
    // 获取在线编辑的数据
    queryContent() {
      queryContent(this.item.applyvalue).then(res => {
        console.log(res)
        if (!res) return false
        this.editContent = res
      })
    },
    beforeAvatarUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 100
      const isDoc = file.type == 'application/msword'
      const isXls = file.type == 'application/vnd.ms-excel'
      const isDocx =
        file.type ==
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      const isXlsx =
        file.type ==
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      if (!isDoc && !isXls && !isDocx && !isXlsx) {
        this.$message.error('请上传.doc或.xls文件!')
      }
      if (!isLt2M) {
        this.$message.error(
          this.$t('hintText.uploadAttachmentSizeCannotExceed')
        )
      }
      return isLt2M && (isDoc || isXls || isDocx || isXlsx)
    },
    onSuccess(file) {
      if (file) {
        this.$set(this.item, 'value', file.id)
        this.$set(this.item, 'showValue', file.newName)
        this.$set(this.item, 'applyvalue', file.id)
        this.$refs.upload.clearFiles()
      }
    },
    ...mapMutations(['setTemporaryBizData', 'setCustomError']),
    onEditorReady(editor) {
      // 准备编辑器
    },
    // 上传图片前
    beforeUpload(res, file) {
      // 显示loading动画
      this.quillUpdateImg = true
    },
    // 上传图片成功
    uploadSuccess(res, file) {
      // 获取富文本组件实例
      const quill = this.$refs.myQuillEditor.quill
      // 如果上传成功
      // 获取光标所在位置
      const length = quill.getSelection().index
      // 插入图片  res.info为服务器返回的图片地址
      quill.insertEmbed(length, 'image', res.info)
      // 调整光标到最后
      quill.setSelection(length + 1)

      // loading动画消失
      this.quillUpdateImg = false
    },
    // 上传图片失败
    uploadError(res, file) {
      this.quillUpdateImg = false
      this.$message.error(this.$t('hintText.imageInsertionFailed'))
    },
    onEditorBlur() {}, // 失去焦点事件
    onEditorFocus() {}, // 获得焦点事件
    onEditorChange(event) {
      event.quill.deleteText(800, 4)
    }, // 内容改变事件
    shiftData(val, bizData) {
      if (!bizData) return false
      if (val.inputType === 'checkbox' && Object.keys(bizData).length === 0) {
        this.$set(val, 'applyArray', [])
      }
      // this.bizData2 = bizData.get(val.fieldName)
      const bizDataKey = Object.keys(bizData)

      // let key = val.fieldName
      // if(bizData[key]) {
      //   console.log(bizData[key])
      //   //if (key === val.fieldName) {
      //     this.$set(val, "showValue", bizData[key].showValue ? bizData[key].showValue : val.showValue ? val.showValue : null);
      //     this.$set(val, "applyvalue", bizData[key].value ? bizData[key].value : val.applyvalue ? val.applyvalue : null);
      //     if (val.inputType === "checkbox") {
      //       this.$set(
      //         val,
      //         "applyArray",
      //         bizData[key].value ? bizData[key].value.split(",") : []
      //       );
      //     }
      //     if (val.inputType === "double" && bizData[key].value) {
      //       if (bizData[key].value && bizData[key].value.toString().indexOf(",") === -1) {
      //         if (
      //           this.$refs[val.id].$attrs.name !== document.activeElement.name
      //         ) {
      //           this.$set(
      //             val,
      //             "showValue",
      //             this.$options.filters.formatNumber(
      //               bizData[key].showValue,
      //               2,
      //               1
      //             )
      //           );
      //           this.$set(
      //             val,
      //             "applyvalue",
      //             this.$options.filters.formatNumber(bizData[key].value, 2, 1)
      //           );
      //         }
      //       }
      //       if (val.inputType === "rating-1" || val.inputType === "rating-2") {
      //         val.showValue = Number(val.applyvalue);
      //         val.applyvalue = Number(val.applyvalue);
      //       } else if (val.inputType === "nokt") {
      //         this.$set(val, "value", bizData[key].value);
      //         // val.value = bizData[key].value;
      //         val.showValue = bizData[key].showValue;
      //       } else if (val.inputType === "selectPeopleMore") {
      //         this.userAll = [];
      //         let bizDatavalue = bizData[key].value.split(",")
      //         for (let index = 0, lengh = bizDatavalue.length; index < lengh; index++ ) {
      //           let item = bizDatavalue[index]
      //           this.userAll.push({
      //             id: item,
      //             empuid: item,
      //             cnname: bizData[key].showValue.split("&")[index],
      //             displayname: bizData[key].showValue.split("&")[index]
      //           });
      //         }
      //       } else if (
      //         val.inputType === "date" ||
      //         val.inputType === "date-edit"
      //       ) {
      //         this.$set(
      //           val,
      //           "showValue",
      //           this.$options.filters.formatDate(bizData[key].showValue)
      //         );
      //         this.$set(
      //           val,
      //           "applyvalue",
      //           this.$options.filters.formatDate(bizData[key].value)
      //         );
      //       } else if (
      //         val.inputType === "time" ||
      //         val.inputType === "time-edit" ||
      //         val.inputType === "time-edits"
      //       ) {
      //         this.$set(
      //           val,
      //           "showValue",
      //           this.$options.filters.formatDateTimess(bizData[key].showValue)
      //         );
      //         this.$set(
      //           val,
      //           "applyvalue",
      //           this.$options.filters.formatDateTimess(bizData[key].value)
      //         );
      //       }
      //     }
      //   }

      // this.$forceUpdate()
      Object.keys(bizData).forEach(key => {
        if (key === val.fieldName) {
          this.$set(
            val,
            'showValue',
            bizData[key].showValue
              ? bizData[key].showValue
              : val.showValue
              ? val.showValue
              : null
          )
          this.$set(
            val,
            'applyvalue',
            bizData[key].value
              ? bizData[key].value
              : val.applyvalue
              ? val.applyvalue
              : null
          )
          // ["110000", "110000", "110115"]
          if (val.inputType === 'province') {
            if (bizData[key].value instanceof Array == true) {
              this.$set(
                val,
                'applyvalue',
                bizData[key].value ? bizData[key].value[2] : ''
              )
            } else {
              this.$set(
                val,
                'applyvalue',
                bizData[key].value ? bizData[key].value : ''
              )
            }
            this.$set(
              val,
              'applyArray',
              bizData[key].value ? bizData[key].value.map(String) : []
            )
          }
          if (val.inputType === 'checkbox') {
            this.$set(
              val,
              'applyArray',
              bizData[key].value ? bizData[key].value.split(',') : []
            )
          }
          if (val.inputType === 'double' && bizData[key].value) {
            if (
              bizData[key].value &&
              bizData[key].value.toString().indexOf(',') === -1
            ) {
              if (
                this.$refs[val.id] &&
                this.$refs[val.id].$attrs &&
                this.$refs[val.id].$attrs.name !== document.activeElement.name
              ) {
                this.$set(
                  val,
                  'showValue',
                  this.$options.filters.formatNumber(
                    bizData[key].showValue,
                    2,
                    1
                  )
                )
                this.$set(
                  val,
                  'applyvalue',
                  this.$options.filters.formatNumber(bizData[key].value, 2, 1)
                )
              }
            }
            if (val.inputType === 'rating-1' || val.inputType === 'rating-2') {
              val.showValue = Number(val.applyvalue)
              val.applyvalue = Number(val.applyvalue)
            } else if (val.inputType === 'nokt') {
              this.$set(val, 'value', bizData[key].value)
              // val.value = bizData[key].value;
              val.showValue = bizData[key].showValue
            } else if (val.inputType === 'selectPeopleMore') {
              this.userAll = []
              bizData[key].value.split(',').forEach((item, index) => {
                this.userAll.push({
                  id: item,
                  empuid: item,
                  cnname: bizData[key].showValue.split('&')[index],
                  displayname: bizData[key].showValue.split('&')[index]
                })
              })
            } else if (
              val.inputType === 'date' ||
              val.inputType === 'date-edit'
            ) {
              this.$set(
                val,
                'showValue',
                this.$options.filters.formatDate(bizData[key].showValue)
              )
              this.$set(
                val,
                'applyvalue',
                this.$options.filters.formatDate(bizData[key].value)
              )
            } else if (
              val.inputType === 'time' ||
              val.inputType === 'time-edit' ||
              val.inputType === 'time-edits'
            ) {
              this.$set(
                val,
                'showValue',
                this.$options.filters.formatDateTimess(bizData[key].showValue)
              )
              this.$set(
                val,
                'applyvalue',
                this.$options.filters.formatDateTimess(bizData[key].value)
              )
            }
          }
        }
      })
      if (val.editstate !== 'R') {
        if (val.inputType === 'date') {
          this.$set(
            val,
            'showValue',
            val.applyvalue ? val.applyvalue : new Date()
          )
          this.$set(
            val,
            'applyvalue',
            val.showValue ? val.showValue : new Date()
          )
        } else if (val.inputType === 'checkbox') {
          this.$set(
            val,
            'applyArray',
            val.applyArray
              ? val.applyArray
              : val.defaultvalue
              ? val.defaultvalue.split(',')
              : []
          )
        } else {
          this.$set(
            val,
            'applyvalue',
            val.applyvalue
              ? val.applyvalue
              : val.defaultvalue
              ? val.defaultvalue
              : ''
          )
          this.$set(
            val,
            'showValue',
            val.showValue
              ? val.showValue
              : val.defaultvalue
              ? val.defaultvalue
              : ''
          )
        }
      }
      if (val.editstate == 'R' && val.inputType === 'hidden') {
        this.$set(
          val,
          'applyvalue',
          val.applyvalue
            ? val.applyvalue
            : val.defaultvalue
            ? val.defaultvalue
            : ''
        )
        this.$set(
          val,
          'showValue',
          val.showValue
            ? val.showValue
            : val.defaultvalue
            ? val.defaultvalue
            : ''
        )
      }
    },
    emailBlur(item) {
      const iSchema = verifyEmail(item.applyvalue)
      const customError = JSON.parse(JSON.stringify(this.customError))
      const i = customError.map(val => val.id).indexOf(item.id)
      if (!iSchema) {
        if (i < 0) {
          customError.push({
            id: item.id,
            fieldName: item.fieldName,
            fieldShowName: item.fieldShowName,
            errorHint: '邮箱格式不正确'
          })
        }
      } else {
        customError.splice(i, 1)
      }
      this.setCustomError(customError)
      if (
        this.item.eventtype &&
        this.item.eventtype.split(',').indexOf('blur') !== -1
      ) {
        this.externalFun(
          this.item.event.split(',')[
            this.item.eventtype.split(',').indexOf('blur')
          ]
        )
      }
    },
    textFocus(type) {
      if (/^\d+(.\d+)?$/.test(this.item.applyvalue.replace(/,/g, ''))) {
        this.item.applyvalue = this.item.applyvalue.replace(/,/g, '')
      }
      if (
        this.item.eventtype &&
        this.item.eventtype.split(',').indexOf('focus') !== -1
      ) {
        this.externalFun(
          this.item.event.split(',')[
            this.item.eventtype.split(',').indexOf('focus')
          ]
        )
      }
    },
    textBlur(type) {
      if (this.item.applyvalue && this.item.applyvalue.indexOf(',') === -1) {
        this.item.applyvalue = this.$options.filters.formatNumber(
          this.item.applyvalue,
          2,
          1
        )
      }
      if (this.item.eventtype && this.item.eventtype.indexOf('blur') !== -1) {
        this.externalFun(
          this.item.event.split(',')[
            this.item.eventtype.split(',').indexOf('blur')
          ]
        )
      }
    },
    externalFun(type) {
      this.$nextTick(() => {
        this.$emit('externalFun', type)
      })
    },
    externalFunSwitch(type) {
      this.$emit('externalFun', type)
    },
    changeValue() {
      this.item.showValue = this.item.applyvalue
      if (this.item.eventtype && this.item.eventtype.indexOf('change') !== -1) {
        this.externalFun(
          this.item.event.split(',')[
            this.item.eventtype.split(',').indexOf('change')
          ]
        )
      }
    },
    // 配置计算公式 所有计算种类：
    // 主表字段 * 主表字段 = 主表字段
    // 主表字段 * 子表字段（平均数/最大值/最小值） = 主表字段
    // 主表字段 * 子表字段 = 子表字段 （单子表操作，不跨子表）
    // 子表字段 * 子表字段 = 子表字段 （单子表操作，不跨子表）

    // 公式结果在  其他公式内

    // 删除子表行，子表内的所有计算字段全部重新计算

    // 跨子表计算

    numberChangeValue() {
      this.isCalculation(this.item)
      this.item.showValue = this.item.applyvalue = this.item.applyvalue.slice(
        0,
        19
      )
      if (this.item.eventtype && this.item.eventtype.indexOf('change') !== -1) {
        this.externalFun(
          this.item.event.split(',')[
            this.item.eventtype.split(',').indexOf('change')
          ]
        )
      }
    },

    doubleValue() {
      this.item.applyvalue = this.item.applyvalue.replace(/[^0-9.-]/g, '')
      if (this.item.eventtype && this.item.eventtype.indexOf('input') !== -1) {
        this.externalFun(
          this.item.event.split(',')[
            this.item.eventtype.split(',').indexOf('input')
          ]
        )
      }
    },
    changeProvince(data) {
      console.log(data)
      data.applyvalue = data.applyArray[2]
    },
    changeCheckbox(data) {
      data.showValue = this.item.nodeoptions
        .filter(el => this.item.applyArray.includes(el.value))
        .map(el => el.text)
        .join(' ')
      data.applyvalue = this.item.applyArray.join()
      this.lowerField(this.item.lowerField)
      // if (data.eventtype && data.eventtype !== "") {
      //   this.externalFun(data.event);
      // }
      if (this.item.eventtype && this.item.eventtype.indexOf('change') !== -1) {
        this.externalFun(
          this.item.event.split(',')[
            this.item.eventtype.split(',').indexOf('change')
          ]
        )
      }
    },
    changeRadio(data, item) {
      this.lowerField(this.item.lowerField)
      data.showValue = item.text
    },
    changeSelect(item) {
      this.item.nodeoptions.forEach(el => {
        if (item === el.value) {
          this.item.showValue = el.text
        }
      })
      this.lowerField(this.item.lowerField)
      if (this.item.eventtype && this.item.eventtype.indexOf('change') !== -1) {
        this.externalFun(
          this.item.event.split(',')[
            this.item.eventtype.split(',').indexOf('change')
          ]
        )
      }
    },
    changeSelectMore(item) {
      this.item.applyvalue = this.item.selectMoreData.join(',')
      this.item.nodeoptions.forEach(el => {
        item.map(item1 => {
          if (item1 === el.value) {
            this.item.showValue = el.text
          }
        })
      })
      this.lowerField(this.item.lowerField)
      if (this.item.eventtype && this.item.eventtype.indexOf('change') !== -1) {
        this.externalFun(
          this.item.event.split(',')[
            this.item.eventtype.split(',').indexOf('change')
          ]
        )
      }
    },
    // 所有下级字段 及其 数据源获取
    lowerField(lowerField) {
      if (lowerField) {
        this.pItem.forEach(element => {
          if (lowerField.split(',').includes(element.fieldName)) {
            if (
              element.inputType === 'select' ||
              element.inputType === 'selectMultiple' ||
              element.inputType === 'radio' ||
              element.inputType === 'checkbox'
            ) {
              this.getInfosByLinkSimple(element)
            }
          }
        })
      }
    },
    // 清空下级
    clearLower(val) {
      if (val.inputType === 'selectMultiple') {
        this.$set(val, 'selectMoreData', [])
      } else if (val.inputType === 'checkbox') {
        this.$set(val, 'applyArray', [])
      }
      this.$set(val, 'applyvalue', '')
      this.$set(val, 'showValue', '')
      this.$set(val, 'nodeoptions', [])
      if (val.lowerField) {
        this.pItem.forEach(element => {
          if (val.lowerField.split(',').includes(element.fieldName)) {
            this.clearLower(element)
          }
        })
      }
    },
    getInfosByLinkSimple(val) {
      this.clearLower(val)
      const pinfo = []
      // 当前字段的所有上级字段
      if (val.highLinkField) {
        this.pItem.forEach(element => {
          if (val.highLinkField.split(',').includes(element.fieldName)) {
            // 上级字段 已选的值
            if (element.applyvalue) {
              element.applyvalue.split(',').forEach(el => {
                pinfo.push({
                  pvalue: el
                })
              })
            }
          }
        })
      }
      if (pinfo.length > 0) {
        getInfosByLinkSimple({
          attr: {
            tableId: val.id,
            search: '',
            pinfo: JSON.stringify(pinfo)
          },
          pageNum: 1,
          pageSize: 100000
        })
          .then(rt => {
            if (rt.status === '200') {
              if (rt.data && rt.data.tableDto && rt.data.tableDto.nodeoptions) {
                this.$set(val, 'nodeoptions', rt.data.tableDto.nodeoptions)
              }
            }
          })
          .catch(er => {})
      }
    },
    selectFocus(bold) {
      if (bold) {
        document
          .querySelectorAll('.closePlaceholder .el-input__inner')
          .forEach(item => {
            this.$nextTick(() => {
              // item.setAttribute("placeholder", this.$t('pleaseSelect'));
            })
          })
      }
    },
    getOrgTree(ids) {
      getOrgTree({
        logic: 'and',
        filters: [{ key: 'id', opt: 'IN', type: 'S', value: ids }],
        pageNum: 1,
        pageSize: 10000
      })
        .then(rt => {
          if (rt.status === '200') {
            this.selectedElement = {
              id: rt.data.list.map(item => item.id).join(','),
              name: rt.data.list.map(item => item.name).join('&'),
              idType: rt.data.list
                .map(item => {
                  return `${item.id}-${item.type}`
                })
                .join(';')
            }
            this.organieationShow = true
          }
        })
        .catch(er => {})
    },
    async getFormNodeOrgs() {
      this.organizes = []
      const rt = await getFormNodeOrgs({
        id: this.clickVal.id,
        postId: this.nodeData.applyUserDto.positionId
      })
      if (rt.status === '200') {
        let orgs = []
        if (rt.data && rt.data.orgs) {
          orgs = rt.data.orgs.split(',')
        }
        const applyOrg =
          rt.data &&
          rt.data.selectType &&
          rt.data.selectType.split(',').includes('1')
            ? [rt.data.applyOrg]
            : []
        const organizes = [...orgs, ...applyOrg]
        this.organizes = Array.from(new Set(organizes))
        console.log(this.organizes)
        return Promise.resolve(this.organizes)
      }
    },
    showSelect(event, item) {
      event.target.blur()
      this.clickVal = item
      if (
        (item.inputType === 'selectOrganization' ||
          item.inputType === 'selectOrganizationMore') &&
        item.editstate !== 'R'
      ) {
        ;(this.selectElement = ['0', '1', '2', '3', '4', '5']),
          (this.orgtitle = item.fieldShowName)
        this.basOrganieationMultiple =
          item.inputType === 'selectOrganizationMore'
        this.$set(item, 'power', '')
        this.selectedElement = {}
        if (item.applyvalue) {
          this.getFormNodeOrgs().then(rt => {
            this.getOrgTree(item.applyvalue)
          })
        } else {
          this.getFormNodeOrgs().then(rt => {
            this.organieationShow = true
          })
        }
      } else if (
        (item.inputType === 'selectOrgPower' ||
          item.inputType === 'selectOrgPowerMore') &&
        item.editstate !== 'R'
      ) {
        this.$set(this.item, 'power', this.nodeData.applyUserDto.companyIds)
        this.isMore = item.inputType === 'selectOrgPowerMore'
        this.checkData = []
        if (item.applyvalue) {
          if (item.inputType.endsWith('More')) {
            const list = item.applyvalue.split('&')
            const name = item.showValue.split(',')
            list.forEach((item, i) => {
              this.checkData.push({
                id: id,
                name: name[i]
              })
            })
          } else {
            this.checkData.push({
              id: item.applyvalue,
              name: item.showValue
            })
          }
        }
        this.organizeDialog = true
      }

      if (
        (item.inputType === 'selectPeopleMore' ||
          item.inputType === 'selectPeopleSingle') &&
        item.editstate !== 'R'
      ) {
        ;(this.selectElement = ['9']), (this.orgtitle = item.fieldShowName)
        this.basOrganieationMultiple = item.inputType === 'selectPeopleMore'
        this.$set(item, 'power', '')
        this.selectedElement = {}
        if (this.basOrganieationMultiple && item.applyvalue) {
          const list = item.showValue
          const idType = []
          item.applyvalue.split(',').forEach((item2, i) => {
            idType.push(`${item2}-9`)
          })
          this.selectedElement = {
            id: item.applyvalue.split(','),
            name: list,
            idType: idType.join(';')
          }
        } else if (item.applyvalue) {
          this.selectedElement = {
            id: item.applyvalue,
            name: item.showValue,
            idType: `${item.applyvalue}-9`
          }
        }
        this.getFormNodeOrgs().then(rt => {
          this.organieationShow = true
        })

        // if (this.isMore && item.applyvalue) {
        //   item.applyvalue.split(",").forEach((data, index) => {
        //     this.userAll.push({
        //       id: data,
        //       empuid: data,
        //       cnname:item.showValue.split("&")[index],
        //       displayname: item.showValue.split("&")[index]
        //     });
        //   });
        // }
        // this.peopleDialog = true;
      }
    },
    showTabDialog(item) {
      this.checkTabData = item
      if (item.inputType === 'multipleDialog') {
        this.multipleDialogVisible = true
      }
      if (item.inputType === 'radioDialog') {
        this.radioDialogVisible = true
      }
    },
    getMultipleDialog(data) {
      this.$set(this.item, 'showValue', data.map(item => item.na_me).join('&'))
      this.$set(this.item, 'applyvalue', data.map(item => item.i_d).join(','))
    },
    getRadioDialog(data, takeOutData) {
      this.$set(this.item, 'showValue', data.na_me)
      this.$set(this.item, 'applyvalue', data.i_d)
      if (this.isSubTable) {
        this.forEachNodeData(
          {
            nodeTableLists: this.pItem
          },
          data,
          takeOutData
        )
      } else {
        this.forEachNodeData(this.nodeData, data, takeOutData)
      }
      this.$forceUpdate()
    },
    // 单选弹出框 带出页面其他值
    forEachNodeData(node, data, takeOutData) {
      if (node.nodeTabLists) {
        node.nodeTabLists.forEach(tab => {
          this.forEachNodeData(tab, data, takeOutData)
        })
      }
      if (node.nodeTableLists) {
        node.nodeTableLists.forEach(table => {
          if (data) {
            // 带出其他值
            takeOutData.forEach(item => {
              if (item.relationFieldId) {
                if (item.relationFieldId.split(',').includes(table.id)) {
                  this.$set(table, 'showValue', data[item.columnName])
                  this.$set(table, 'applyvalue', data[item.columnName])
                }
              }
            })
          } else {
            // 清除其他值
            if (takeOutData.includes(table.id)) {
              this.$set(table, 'showValue', '')
              this.$set(table, 'applyvalue', '')
            }
          }
          this.forEachNodeData(table, data, takeOutData)
        })
      }
      if (node.rows) {
        node.rows.forEach(row => {
          this.forEachNodeData(row, data, takeOutData)
        })
      }
    },
    // 清除 单选弹出框 清除 其他关联字段值
    clearDialog() {
      this.$set(this.item, 'showValue', '')
      this.$set(this.item, 'applyvalue', '')
      getTableRelationField(this.item.id)
        .then(rt => {
          if (rt.status === '200' && rt.data && rt.data.fieldIds) {
            const takeOutData = rt.data.fieldIds.split(',')
            this.forEachNodeData(this.nodeData, null, takeOutData)
          }
        })
        .catch(er => {})
      // if (this.item.eventtype && this.item.eventtype !== "") {
      //   this.externalFun(this.item.event);
      // }
      if (this.item.eventtype && this.item.eventtype.indexOf('change') !== -1) {
        this.externalFun(
          this.item.event.split(',')[
            this.item.eventtype.split(',').indexOf('change')
          ]
        )
      }
    },
    getOrg(data) {
      // console.log(this.item)
      this.selectType = 'org'
      this.$set(this.item, 'showValue', data.map(item => item.name).join('&'))
      this.$set(this.item, 'applyvalue', data.map(item => item.id).join(','))
    },
    getUser(data) {
      this.userAll = data
      this.peopleDialog = false
      if (this.item.inputType === 'selectPeopleMore') {
        let names = data.map(item => item.displayname)
        let ids = data.map(item => item.empuid)
        if (this.item.showValue) {
          names = Array.from(new Set([...names]))
          ids = Array.from(new Set([...ids]))
        }
        this.item.showValue = names.join('&')
        this.item.applyvalue = ids.join(',')
      } else {
        this.$set(
          this.item,
          'showValue',
          data.map(item => item.cnname).join('&')
        )
        this.$set(
          this.item,
          'applyvalue',
          data.map(item => item.empuid).join(',')
        )
      }
      this.selectType = 'user'
    },
    clearSelect() {
      this.userAll = []
      this.$set(this.item, 'showValue', '')
      this.$set(this.item, 'applyvalue', '')
      // if (this.item.eventtype && this.item.eventtype !== "") {
      //   this.externalFun(this.item.event);
      // }
      if (this.item.eventtype && this.item.eventtype.indexOf('change') !== -1) {
        this.externalFun(
          this.item.event.split(',')[
            this.item.eventtype.split(',').indexOf('change')
          ]
        )
      }
    },
    fnBasOrganieationCallBack(data) {
      this.$set(this.item, 'showValue', data.name)
      this.$set(this.item, 'applyvalue', data.id)
      // if (this.item.eventtype && this.item.eventtype !== "") {
      //   this.externalFun(this.item.event);
      // }
      if (this.item.eventtype && this.item.eventtype.indexOf('change') !== -1) {
        this.externalFun(
          this.item.event.split(',')[
            this.item.eventtype.split(',').indexOf('change')
          ]
        )
      }
      this.organieationShow = false
    },
    showProcessDocuments() {
      this.processDocumentsVisible = true
    },
    getProcessDocuments(data) {
      this.$set(
        this.item,
        'showValue',
        data.map(item => item.instanceid).join(',')
      )
      this.$set(
        this.item,
        'applyvalue',
        data.map(item => item.instanceid).join(',')
      )
    },
    toFlow(instanceId) {
      let routeData = {}
      queryProcessName(instanceId).then(res => {
        const data = res.data
        routeData = this.$router.resolve({
          name: 'processFormView',
          query: {
            name: data.processnamecn,
            instanceId: data.instanceid
          }
        })
        const a = document.createElement('a')
        // 给创建好的a标签赋值
        a.setAttribute('href', routeData.href)
        // 设置css 隐藏属性
        a.setAttribute('style', 'display:none')
        // 设置 a标签为新窗口打开
        a.setAttribute('target', '_blank')
        // 将设置好的a标签，添加到 body 内
        document.body.appendChild(a)
        // 模拟点击
        a.click()
        // 移除a标签
        a.parentNode.removeChild(a)

        // checkProcessDefaultPage({
        //   processName: data.processName,
        //   instanceId: instanceId
        // }).then(rt => {
        //   if (rt.status === '200') {
        //     if (rt.data.isDefaultPage === 'Y') {
        //       routeData = this.$router.resolve({
        //         name: rt.data.spacename + 'View',
        //         query: {
        //           name: data.processCnname,
        //           instanceId: instanceId
        //         }
        //       })
        //     } else {
        //       if (data.processTrackingUrl.startsWith('http')) {
        //         routeData.href = `${data.linkUrl}?name=${data.processCnname}&instanceId=${data.instanceId}`
        //       } else {
        //         routeData.href = `${window.location.origin +
        //         window.location.pathname +
        //         data.processTrackingUrl}?name=${
        //           data.processCnname
        //         }&instanceId=${data.instanceId}`
        //       }
        //       routeData = this.$router.resolve({
        //         name: 'processFormView',
        //         query: {
        //           name: data.processCnname,
        //           instanceId: data.instanceId
        //         }
        //       })
        //     }
        //     // window.open(routeData.href, "_blank");
        //     const a = document.createElement('a')
        //     // 给创建好的a标签赋值
        //     a.setAttribute('href', routeData.href)
        //     // 设置css 隐藏属性
        //     a.setAttribute('style', 'display:none')
        //     // 设置 a标签为新窗口打开
        //     a.setAttribute('target', '_blank')
        //     // 将设置好的a标签，添加到 body 内
        //     document.body.appendChild(a)
        //     // 模拟点击
        //     a.click()
        //     // 移除a标签
        //     a.parentNode.removeChild(a)
        //   }
        // })
      })
    }
  }
}
</script>

<style type="text/scss" lang="scss">
.flow-item input.el-input__inner {
  // border: 0;
  border-bottom: 1px solid $dc1;

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
.iframeWord {
  iframe {
    width: 100%;
    height: inherit;
    display: none;
  }
  .docTitle {
    font-size: 20px;
    text-align: center;
    line-height: 32px;
  }
}
</style>

<style type="text/scss" lang="scss" scoped>
.el-link {
  margin-right: 15px;

  .el-link--inner {
    font-size: 16px !important;
  }
}

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
.form-item-row.padding-none {
  padding: 0;
}
.form-item-row {
  /*min-width: 150px;*/
  padding-right: 20px;
  position: relative;
  box-sizing: content-box;
  .form-item-content {
    width: 100%;
  }
  .form-item-tip {
    position: absolute;
    right: 0;
    top: 0;
  }
  /deep/ .el-input--suffix {
    padding: 0;
    .el-input__inner {
      padding-right: 20px;
      padding-left: 10px;
    }
    .el-input__suffix {
      width: 20px;
      right: 0;
      .el-input__icon {
        width: 20px;
      }
    }
  }
  /deep/ .el-input--prefix {
    padding: 0;
    .el-input__inner {
      padding-left: 20px;
    }
    .el-input__prefix {
      width: 20px;
      left: 0;
      .el-input__icon {
        width: 20px;
      }
    }
  }
}
.el-radio {
  height: 28px;
  line-height: 28px;
  /deep/ .el-radio__label {
    padding-left: 4px;
  }
}
.el-checkbox {
  /deep/ .el-checkbox__label {
    padding-left: 4px;
  }
}
.el-checkbox,
.el-radio {
  margin-right: 14px;
}
</style>
