<template>
  <div class="w100">
    <el-dialog
      class="processCard"
      width="84%"
      :visible.sync="isDialogsVisible"
      :before-close="closeModal"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :modal-append-to-body="false"
    >
      <!--      <template slot="title">-->
      <!--        <p class="slotTitle">-->
      <!--          <el-button v-show="editableTabsValue == 0" class="no-border" size="large" type="text" @click="paintChart">-->
      <!--            {{existTab('18')}}</el-button>-->
      <!--          <el-button v-show="editableTabsValue == 0" class="no-border" size="large" type="text"-->
      <!--            @click="saveProcessCard('save')">{{existTab('19')}}</el-button>-->
      <!--          <el-button v-show="editableTabsValue == 0" class="no-border" size="large" type="text" @click="resetCard">-->
      <!--            {{existTab('20')}}</el-button>-->
      <!--        </p>-->
      <!--      </template>-->

      <el-tabs
        v-model="editableTabsValue"
        type="border-card"
        @tab-click="tabsClick"
      >
        <!-- 流程基本属性 -->
        <el-tab-pane
          v-if="existTab('0', 'refer')"
          name="0"
          :label="existTab('0')"
        >
          <div>
            <!-- <el-form
              label-width="110px"
              label-position="right"
              ref="attrsFormRef"
              :model="attrsForm"
              :rules="attrsRules"
            >-->
            <el-form
              ref="attrsFormRef"
              label-width="125px"
              label-position="right"
              :model="attrsForm"
            >
              <!---------------------------------------------- 流程相关信息---------------------->
              <h5 v-if="existTabField('processInfo', 'refer')" class="subTitle">
                {{ existTabField('processInfo') }}
              </h5>
              <el-row :gutter="10">
                <!-- 流程名称 -->
                <el-col
                  v-if="existTabField('c_processName', 'refer')"
                  :span="8"
                >
                  <el-form-item
                    :label="existTabField('c_processName')"
                    prop="processname"
                    :rules="[
                      {
                        required: existTabField('c_processName', 'necessary'),
                        message: ' ',
                        trigger: 'blur'
                      }
                    ]"
                  >
                    <el-input v-model="attrsForm.processname" disabled />
                  </el-form-item>
                </el-col>
                <!-- 流程编码 -->
                <el-col
                  v-if="existTabField('code_processCoding', 'refer')"
                  :span="8"
                >
                  <el-form-item
                    :label="existTabField('code_processCoding')"
                    :rules="[
                      {
                        required: existTabField(
                          'code_processCoding',
                          'necessary'
                        ),
                        message: ' ',
                        trigger: 'blur'
                      }
                    ]"
                  >
                    <el-input v-model="attrsForm.processcode" disabled />
                  </el-form-item>
                </el-col>
                <!-- 版本 -->
                <el-col v-if="existTabField('c_versions', 'refer')" :span="8">
                  <el-form-item
                    :label="existTabField('c_versions')"
                    prop="versions"
                    :rules="[
                      {
                        required: existTabField('c_versions', 'necessary'),
                        message: ' ',
                        trigger: 'blur'
                      }
                    ]"
                  >
                    <el-input v-model="attrsForm.versions" disabled />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="10">
                <!-- 层级 -->
                <el-col
                  v-if="existTabField('c_processLevel', 'refer')"
                  :span="8"
                >
                  <el-form-item
                    :label="existTabField('c_processLevel')"
                    prop="level"
                    :rules="[
                      {
                        required: existTabField('c_processLevel', 'necessary'),
                        message: ' ',
                        trigger: 'blur'
                      }
                    ]"
                  >
                    <el-input v-model="attrsForm.level" disabled />
                  </el-form-item>
                </el-col>

                <!-- 拟制人 -->
                <el-col
                  v-if="existTabField('c_fictitiousPerson', 'refer')"
                  :span="8"
                >
                  <el-form-item
                    :label="existTabField('c_fictitiousPerson')"
                    prop="singer"
                    :rules="[
                      {
                        required: existTabField(
                          'c_fictitiousPerson',
                          'necessary'
                        ),
                        message: ' ',
                        trigger: 'blur'
                      }
                    ]"
                  >
                    <el-input v-model="attrsForm.singer" disabled />
                  </el-form-item>
                </el-col>
                <!-- 流程框架编码 -->
                <el-col
                  v-if="existTabField('c_processCoding', 'refer')"
                  :span="8"
                >
                  <el-form-item
                    :label="existTabField('c_processCoding')"
                    prop="code"
                    :rules="[
                      {
                        required: existTabField('c_processCoding', 'necessary'),
                        message: ' ',
                        trigger: 'blur'
                      }
                    ]"
                  >
                    <el-input v-model="attrsForm.code" disabled />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="10">
                <!--                预留选择组织1-->
                <el-col v-if="existTabField('orgscope1', 'refer')" :span="8">
                  <el-form-item
                    :label="existTabField('orgscope1')"
                    prop="scopeFormat1"
                    :rules="[
                      {
                        required: existTabField('orgscope1', 'necessary'),
                        message: ' ',
                        trigger: 'blur'
                      }
                    ]"
                  >
                    <el-input
                      v-model="attrsForm.scopeFormat1"
                      :title="attrsForm.scopeFormat1"
                      clearable
                      @focus="distributeClick('orgscope1')"
                      @clear="distributeClear('orgscope1')"
                      :disabled="!noEditing"
                    >
                    </el-input>
                  </el-form-item>
                </el-col>

                <!--                预留选择组织2-->
                <el-col v-if="existTabField('orgscope2', 'refer')" :span="8">
                  <el-form-item
                    :label="existTabField('orgscope2')"
                    prop="scopeFormat2"
                    :rules="[
                      {
                        required: existTabField('orgscope2', 'necessary'),
                        message: ' ',
                        trigger: 'blur'
                      }
                    ]"
                  >
                    <el-input
                      v-model="attrsForm.scopeFormat2"
                      :title="attrsForm.scopeFormat2"
                      clearable
                      @focus="distributeClick('orgscope2')"
                      @clear="distributeClear('orgscope2')"
                      :disabled="!noEditing"
                    >
                    </el-input>
                  </el-form-item>
                </el-col>

                <!--                预留选择组织3-->
                <el-col v-if="existTabField('orgscope3', 'refer')" :span="8">
                  <el-form-item
                    :label="existTabField('orgscope3')"
                    prop="scopeFormat3"
                    :rules="[
                      {
                        required: existTabField('orgscope3', 'necessary'),
                        message: ' ',
                        trigger: 'blur'
                      }
                    ]"
                  >
                    <el-input
                      v-model="attrsForm.scopeFormat3"
                      :title="attrsForm.scopeFormat3"
                      clearable
                      @focus="distributeClick('orgscope3')"
                      @clear="distributeClear('orgscope3')"
                      :disabled="!noEditing"
                    >
                    </el-input>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row :gutter="10">
                <!-- 负责部门 -->
                <el-col
                  v-if="existTabField('c_organization', 'refer')"
                  :span="8"
                >
                  <el-form-item
                    :label="existTabField('c_organization')"
                    prop="disScopeformat"
                    :rules="[
                      {
                        required: existTabField('c_organization', 'necessary'),
                        message: ' ',
                        trigger: 'blur'
                      }
                    ]"
                  >
                    <el-input
                      v-model="attrsForm.disScopeformat"
                      :title="attrsForm.disScopeformat"
                      clearable
                      @focus="distributeClick('distribution')"
                      @clear="distributeClear('distribution')"
                      :disabled="!noEditing"
                    >
                      <!-- <el-button id="btn" slot="append" @click="distributeClick">
                        {{ existTabField('select', '', true) }}
                      </el-button> -->
                    </el-input>
                  </el-form-item>
                </el-col>
                <!-- 流程负责人 -->
                <el-col
                  v-if="existTabField('c_processResponsible', 'refer')"
                  :span="8"
                >
                  <el-form-item
                    :label="existTabField('c_processResponsible')"
                    prop="processowner"
                    :rules="[
                      {
                        required: existTabField(
                          'c_processResponsible',
                          'necessary'
                        ),
                        message: ' ',
                        trigger: 'blur'
                      }
                    ]"
                  >
                    <el-input
                      v-model="attrsForm.processowner"
                      :title="attrsForm.processowner"
                      disabled
                    />
                  </el-form-item>
                </el-col>

                <!-- 咨询人 -->
                <el-col v-if="existTabField('consultant', 'refer')" :span="8">
                  <el-form-item
                    :label="existTabField('consultant')"
                    prop="processowner"
                    :rules="[
                      {
                        required: existTabField('consultant', 'necessary'),
                        message: ' ',
                        trigger: 'blur'
                      }
                    ]"
                  >
                    <el-input
                      :disabled="true"
                      :value="
                        !attrsForm.consultList
                          ? ''
                          : attrsForm.consultList
                              .map(item => item.value)
                              .join(',')
                      "
                      :title="
                        !attrsForm.consultList
                          ? ''
                          : attrsForm.consultList
                              .map(item => item.value)
                              .join(',')
                      "
                      clearable
                      :placeholder="placeholderTitle3"
                      @focus="showChoose('consultmanager')"
                    />
                  </el-form-item>
                </el-col>
              </el-row>

              <!---------------------------------------------- 基本信息---------------------->
              <h5 v-if="existTabField('baseInfo', 'refer')" class="subTitle">
                {{ existTabField('baseInfo') }}
              </h5>
              <el-row :gutter="10">
                <!-- 上级流程责任人 -->
                <el-col v-if="existTabField('c_issuer', 'refer')" :span="8">
                  <el-form-item
                    :label="existTabField('c_issuer')"
                    prop="upowner"
                    :rules="[
                      {
                        required: existTabField('c_issuer', 'necessary'),
                        message: ' ',
                        trigger: 'blur'
                      }
                    ]"
                  >
                    <el-input v-model="attrsForm.upowner" disabled />
                  </el-form-item>
                </el-col>
                <!-- 生效日期 -->
                <el-col
                  v-if="existTabField('c_effectiveDate', 'refer')"
                  :span="8"
                >
                  <el-form-item
                    :label="existTabField('c_effectiveDate')"
                    prop="effectTime"
                    :rules="[
                      {
                        required: existTabField('c_effectiveDate', 'necessary'),
                        message: ' ',
                        trigger: 'blur'
                      }
                    ]"
                  >
                    <el-date-picker
                      v-model="attrsForm.effectTime"
                      type="date"
                      style="width: 100%;"
                      :picker-options="pickerOptions"
                      value-format="yyyy-MM-dd"
                      format="yyyy-MM-dd"
                      :placeholder="$t('placeholderText.chooseDate')"
                      @change="changeEffectTime"
                      :disabled="!noEditing"
                    />
                  </el-form-item>
                </el-col>
                <!-- 起点==================================================================== -->
                <el-col v-if="existTabField('c_origin', 'refer')" :span="8">
                  <el-form-item
                    :label="existTabField('c_origin')"
                    prop="startpoint"
                    :rules="[
                      {
                        required: existTabField('c_origin', 'necessary'),
                        message: ' ',
                        trigger: 'blur'
                      }
                    ]"
                  >
                    <el-input
                      v-model="attrsForm.startpoint"
                      :title="attrsForm.startpoint"
                      disabled
                    />
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row :gutter="10">
                <!-- 下次修改时间 -->
                <!-- 终点================================================================================= -->
                <el-col v-if="existTabField('c_endpoint', 'refer')" :span="8">
                  <el-form-item
                    :label="existTabField('c_endpoint')"
                    prop="endpoint"
                    :rules="[
                      {
                        required: existTabField('c_endpoint', 'necessary'),
                        message: ' ',
                        trigger: 'blur'
                      }
                    ]"
                  >
                    <el-input
                      v-model="attrsForm.endpoint"
                      :title="attrsForm.endpoint"
                      disabled
                    />
                  </el-form-item>
                </el-col>
                <el-col
                  v-if="existTabField('nextRevisionTime', 'refer')"
                  :span="8"
                >
                  <el-form-item
                    :label="existTabField('nextRevisionTime')"
                    prop="nextTime"
                    :rules="[
                      {
                        required: existTabField(
                          'nextRevisionTime',
                          'necessary'
                        ),
                        message: ' ',
                        trigger: 'blur'
                      }
                    ]"
                  >
                    <el-date-picker
                      v-model="attrsForm.nextTime"
                      type="date"
                      :picker-options="pickerOptions"
                      value-format="yyyy-MM-dd"
                      format="yyyy-MM-dd"
                      :placeholder="$t('placeholderText.chooseDate')"
                      :disabled="!noEditing"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="10">
                <!-- 企业标准 -->
                <el-col
                  v-if="existTabField('c_enterpriseStandard', 'refer')"
                  :span="8"
                >
                  <el-form-item
                    :label="existTabField('c_enterpriseStandard')"
                    prop="enterpriseStandardName"
                    :rules="[
                      {
                        required: existTabField(
                          'c_enterpriseStandard',
                          'necessary'
                        ),
                        message: ' ',
                        trigger: 'change'
                      }
                    ]"
                  >
                    <el-input
                      v-model="attrsForm.enterpriseStandardName"
                      :title="attrsForm.enterpriseStandardName"
                      clearable
                      @focus="selectEnterpriseStandard"
                      :disabled="!noEditing"
                    >
                      <!-- <el-button slot="append" @click="selectEnterpriseStandard">{{existTabField('select', '', true)}}</el-button> -->
                    </el-input>
                  </el-form-item>
                </el-col>
                <!-- 流程管理员 -->
                <el-col
                  v-if="existTabField('c_processManager', 'refer')"
                  :span="8"
                >
                  <el-form-item
                    :label="existTabField('c_processManager')"
                    prop="processmanagerName"
                    :rules="[
                      {
                        required: existTabField(
                          'c_processManager',
                          'necessary'
                        ),
                        message: ' ',
                        trigger: 'change'
                      }
                    ]"
                  >
                    <el-input
                      v-model="attrsForm.processmanagerName"
                      :title="attrsForm.processmanagerName"
                      clearable
                      @focus="selectProcessManager('processmanagerName')"
                      :disabled="!noEditing"
                    >
                    </el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="10">
                <!-- 预留人员1 -->
                <el-col
                  v-if="existTabField('reservedPersonField1', 'refer')"
                  :span="8"
                >
                  <el-form-item
                    :label="existTabField('reservedPersonField1')"
                    prop="standby8"
                    :rules="[
                      {
                        required: existTabField(
                          'reservedPersonField1',
                          'necessary'
                        ),
                        message: ' ',
                        trigger: 'change'
                      }
                    ]"
                  >
                    <el-input
                      v-model="attrsForm.standby8"
                      :title="attrsForm.standby8"
                      clearable
                      @focus="selectProcessManager('standby8')"
                      :disabled="!noEditing"
                    >
                    </el-input>
                  </el-form-item>
                </el-col>
                <!-- 预留人员2 -->
                <el-col
                  v-if="existTabField('reservedPersonField2', 'refer')"
                  :span="8"
                >
                  <el-form-item
                    :label="existTabField('reservedPersonField2')"
                    prop="standby10"
                    :rules="[
                      {
                        required: existTabField(
                          'reservedPersonField2',
                          'necessary'
                        ),
                        message: ' ',
                        trigger: 'change'
                      }
                    ]"
                  >
                    <el-input
                      v-model="attrsForm.standby10"
                      :title="attrsForm.standby10"
                      clearable
                      @focus="selectProcessManager('standby10')"
                      :disabled="!noEditing"
                    >
                    </el-input>
                  </el-form-item>
                </el-col>
                <!-- 预留人员3 -->
                <el-col
                  v-if="existTabField('reservedPersonField3', 'refer')"
                  :span="8"
                >
                  <el-form-item
                    :label="existTabField('reservedPersonField3')"
                    prop="standby12"
                    :rules="[
                      {
                        required: existTabField(
                          'reservedPersonField3',
                          'necessary'
                        ),
                        message: ' ',
                        trigger: 'change'
                      }
                    ]"
                  >
                    <el-input
                      v-model="attrsForm.standby12"
                      :title="attrsForm.standby12"
                      clearable
                      @focus="selectProcessManager('standby12')"
                      :disabled="!noEditing"
                    >
                    </el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="10">
                <!-- 适用范围 -->
                <el-col v-if="existTabField('c_scope', 'refer')" :span="8">
                  <el-form-item
                    :label="existTabField('c_scope')"
                    prop="fitscope"
                    :rules="[
                      {
                        required: existTabField('c_scope', 'necessary'),
                        message: ' ',
                        trigger: 'blur'
                      }
                    ]"
                  >
                    <el-input
                      v-model="attrsForm.fitscope"
                      :disabled="!noEditing"
                    />
                  </el-form-item>
                </el-col>
              </el-row>

              <!-- 预留文本框 -->
              <el-row :gutter="10">
                <!-- 预留文本框1 -->
                <el-col v-if="existTabField('standby1', 'refer')" :span="8">
                  <el-form-item
                    :label="existTabField('standby1')"
                    prop="standby1"
                    :rules="[
                      {
                        required: existTabField('standby1', 'necessary'),
                        message: ' ',
                        trigger: 'blur'
                      }
                    ]"
                  >
                    <el-input
                      v-model="attrsForm.standby1"
                      :disabled="!noEditing"
                    />
                  </el-form-item>
                </el-col>
                <!-- 预留文本框2 -->
                <el-col v-if="existTabField('standby2', 'refer')" :span="8">
                  <el-form-item
                    :label="existTabField('standby2')"
                    prop="standby2"
                    :rules="[
                      {
                        required: existTabField('standby2', 'necessary'),
                        message: ' ',
                        trigger: 'blur'
                      }
                    ]"
                  >
                    <el-input
                      v-model="attrsForm.standby2"
                      :disabled="!noEditing"
                    />
                  </el-form-item>
                </el-col>
                <!-- 预留文本框3 -->
                <el-col v-if="existTabField('standby3', 'refer')" :span="8">
                  <el-form-item
                    :label="existTabField('standby3')"
                    prop="standby3"
                    :rules="[
                      {
                        required: existTabField('standby3', 'necessary'),
                        message: ' ',
                        trigger: 'blur'
                      }
                    ]"
                  >
                    <el-input
                      v-model="attrsForm.standby3"
                      :disabled="!noEditing"
                    />
                  </el-form-item>
                </el-col>
              </el-row>

              <!-- 预留文本域 -->
              <el-row :gutter="10">
                <!-- 预留文本域1 -->
                <el-col v-if="existTabField('standby4', 'refer')" :span="8">
                  <el-form-item
                    :label="existTabField('standby4')"
                    prop="standby4"
                    :rules="[
                      {
                        required: existTabField('standby4', 'necessary'),
                        message: ' ',
                        trigger: 'blur'
                      }
                    ]"
                  >
                    <el-input
                      type="textarea"
                      v-model="attrsForm.standby4"
                      :disabled="!noEditing"
                    />
                  </el-form-item>
                </el-col>
                <!-- 预留文本域2 -->
                <el-col v-if="existTabField('standby5', 'refer')" :span="8">
                  <el-form-item
                    :label="existTabField('standby5')"
                    prop="standby5"
                    :rules="[
                      {
                        required: existTabField('standby5', 'necessary'),
                        message: ' ',
                        trigger: 'blur'
                      }
                    ]"
                  >
                    <el-input
                      type="textarea"
                      v-model="attrsForm.standby5"
                      :disabled="!noEditing"
                    />
                  </el-form-item>
                </el-col>
                <!-- 预留文本域3 -->
                <el-col v-if="existTabField('standby6', 'refer')" :span="8">
                  <el-form-item
                    :label="existTabField('standby6')"
                    prop="standby6"
                    :rules="[
                      {
                        required: existTabField('standby6', 'necessary'),
                        message: ' ',
                        trigger: 'blur'
                      }
                    ]"
                  >
                    <el-input
                      type="textarea"
                      v-model="attrsForm.standby6"
                      :disabled="!noEditing"
                    />
                  </el-form-item>
                </el-col>
              </el-row>

              <!-- 制度文档/章节 -->
              <el-row
                v-if="existTabField('systemDocumentChapter', 'refer')"
                :gutter="10"
              >
                <el-col :span="24">
                  <el-form-item
                    :label="existTabField('systemDocumentChapter')"
                    :required="
                      existTabField('systemDocumentChapter', 'necessary')
                    "
                  >
                    <el-row
                      v-for="(item, index) in attrsForm.zhiduList"
                      :key="index"
                      class="margin-b10"
                    >
                      <el-col :span="6">
                        <el-input
                          v-model="item.zhiduName"
                          :title="item.zhiduName"
                          clearable
                          style="width: 208px"
                          @focus="selectRule(index)"
                          :disabled="!noEditing"
                        />
                      </el-col>
                      <el-col
                        v-for="(val, index1) in item.zhangjieList"
                        :key="index1"
                        :span="15"
                      >
                        <el-input
                          v-model="val.zhangjieName"
                          :title="val.zhangjieName"
                          clearable
                          :disabled="!!item.zhiduName"
                          @focus="selectChapte(index)"
                        />
                      </el-col>
                      <el-col :span="3" class="padding-l10px">
                        <el-button
                          v-if="attrsForm.zhiduList.length > 1"
                          class="margin-l10 float-r"
                          size="mini"
                          icon="el-icon-minus"
                          :disabled="!noEditing"
                          @click="delSystemChapter(index)"
                        />
                        <el-button
                          v-if="index === 0"
                          class="float-r"
                          size="mini"
                          icon="el-icon-plus"
                          :disabled="!noEditing"
                          @click="addSystemChapter()"
                        />
                      </el-col>
                    </el-row>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="10">
                <!-- 流程目的 -->
                <el-col v-if="existTabField('c_target', 'refer')" :span="12">
                  <el-form-item
                    :label="existTabField('c_target')"
                    prop="target"
                    :rules="[
                      {
                        required: existTabField('c_target', 'necessary'),
                        message: ' ',
                        trigger: 'blur'
                      }
                    ]"
                  >
                    <el-input
                      v-model="attrsForm.target"
                      type="textarea"
                      :disabled="!noEditing"
                    />
                  </el-form-item>
                </el-col>
                <!-- 流程描述 -->
                <el-col
                  v-if="existTabField('c_processDescription', 'refer')"
                  :span="12"
                >
                  <el-form-item
                    :label="existTabField('c_processDescription')"
                    prop="desc"
                    :rules="[
                      {
                        required: existTabField(
                          'c_processDescription',
                          'necessary'
                        ),
                        message: ' ',
                        trigger: 'blur'
                      }
                    ]"
                  >
                    <el-input
                      v-model="attrsForm.desc"
                      type="textarea"
                      :disabled="!noEditing"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="10">
                <!-- 管理标准类型 -->
                <el-col v-if="existTabField('manageTypes', 'refer')" :span="12">
                  <el-form-item
                    :label="existTabField('manageTypes')"
                    prop="manageTypes"
                    :rules="[
                      {
                        required: existTabField('manageTypes', 'necessary'),
                        message: ' ',
                        trigger: 'blur'
                      }
                    ]"
                  >
                    <el-select
                      v-model="attrsForm.manageTypes"
                      filterable
                      clearable
                      :placeholder="$t('pleaseSelect')"
                      :disabled="!noEditing"
                    >
                      <el-option
                        v-for="item in manageTypeOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <!-- 管理标准归类 -->
                <el-col
                  v-if="existTabField('manageClassification', 'refer')"
                  :span="12"
                >
                  <el-form-item
                    :label="existTabField('manageClassification')"
                    prop="manageClassification"
                    :rules="[
                      {
                        required: existTabField(
                          'manageClassification',
                          'necessary'
                        ),
                        message: ' ',
                        trigger: 'blur'
                      }
                    ]"
                  >
                    <el-select
                      v-model="attrsForm.manageClassification"
                      filterable
                      clearable
                      :placeholder="$t('pleaseSelect')"
                      :disabled="!noEditing"
                    >
                      <el-option
                        v-for="item in manageClassificationOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <!-- 流程框架名称 -->
                <el-col
                  v-if="existTabField('processframeworkname', 'refer')"
                  :span="12"
                >
                  <el-form-item
                    :label="existTabField('processframeworkname')"
                    prop="processframeworkname"
                    :rules="[
                      {
                        required: existTabField(
                          'processframeworkname',
                          'necessary'
                        ),
                        message: ' ',
                        trigger: 'blur'
                      }
                    ]"
                  >
                    <el-input
                      v-model="attrsForm.processframeworkname"
                      :disabled="!noEditing"
                    />
                  </el-form-item>
                </el-col>
                <!-- 关键活动补充说明 -->
                <el-col
                  v-if="existTabField('supactivities', 'refer')"
                  :span="12"
                >
                  <el-form-item
                    :label="existTabField('supactivities')"
                    prop="supactivities"
                    :rules="[
                      {
                        required: existTabField('supactivities', 'necessary'),
                        message: ' ',
                        trigger: 'blur'
                      }
                    ]"
                  >
                    <el-input
                      v-model="attrsForm.supactivities"
                      :disabled="!noEditing"
                    />
                  </el-form-item>
                </el-col>
                <!-- 术语 -->
                <el-col
                  v-if="existTabField('c_terminology', 'refer')"
                  :span="24"
                >
                  <el-form-item
                    :label="existTabField('c_terminology')"
                    class="label-height-auto"
                    prop="termlist"
                    :rules="[
                      {
                        required: existTabField('c_terminology', 'necessary'),
                        message: ' ',
                        trigger: 'change'
                      }
                    ]"
                  >
                    <el-row
                      v-for="(obj, index) in attrsForm.termlist"
                      :key="index"
                      :class="{ 'margin-t5': index > 0 }"
                    >
                      <el-col :span="6">
                        <el-input
                          v-model="obj.term"
                          :title="obj.term"
                          clearable
                          style="width: 174px; float: left"
                          :disabled="!noEditing"
                        >
                        </el-input>
                        <el-button
                          class="float-r"
                          size="mini"
                          icon="el-icon-arrow-down"
                          @click="selectTerminology(index)"
                          style="float: left; height: 28px"
                          :disabled="!noEditing"
                        />
                        <!-- <el-dropdown
                          class="w100"
                          trigger="click"
                          placement="bottom-start"
                          split-button
                          :hide-on-click="true"
                          @command="handleCommand"
                          @visible-change="reuqireDownData"
                        >
                          <span class="el-dropdown-link">
                            <el-input v-model.lazy="obj.term" />
                          </span>
                          <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item
                              v-for="item in termlists"
                              :key="item.id"
                              :command="{value: item, pindex: index}"
                            >
                              {{ item.term }}
                            </el-dropdown-item>
                          </el-dropdown-menu>
                        </el-dropdown> -->
                      </el-col>
                      <el-col :span="11" class="padding-l10px">
                        <el-input
                          v-model="obj.termdetail"
                          :disabled="!noEditing"
                        />
                      </el-col>
                      <el-col :span="4" class="padding-l10px">
                        <el-input
                          v-model="obj.foldername"
                          :title="obj.foldername"
                          clearable
                          disabled
                        >
                        </el-input>
                      </el-col>
                      <el-col :span="3" class="padding-l10px">
                        <el-button
                          v-if="attrsForm.termlist.length > 1"
                          class="margin-l10 float-r"
                          size="mini"
                          icon="el-icon-minus"
                          @click="minusTerm(index)"
                          :disabled="!noEditing"
                        />
                        <el-button
                          v-if="index === 0"
                          class="float-r"
                          size="mini"
                          icon="el-icon-plus"
                          @click="plusTerm()"
                          :disabled="!noEditing"
                        />
                      </el-col>
                    </el-row>
                  </el-form-item>
                </el-col>

                <!-- 配合部门 -->
                <el-col v-if="existTabField('c_codept', 'refer')" :span="12">
                  <el-form-item
                    :label="existTabField('c_codept')"
                    prop="codisScopeformat"
                    :rules="[
                      {
                        required: existTabField('c_codept', 'necessary'),
                        message: ' ',
                        trigger: 'blur'
                      }
                    ]"
                  >
                    <el-input
                      v-model="attrsForm.codisScopeformat"
                      class="search_component remove-margin-b"
                      :title="attrsForm.codisScopeformat"
                      disabled
                    >
                      <el-button
                        :disabled="!noEditing"
                        slot="append"
                        @click="codistributeClick"
                      >
                        {{ existTabField('select', '', true) }}
                      </el-button>
                    </el-input>
                  </el-form-item>
                </el-col>
              </el-row>

              <!---------------------------------------------- 制度相关信息---------------------->
              <h5 v-if="existTabField('ruleInfo', 'refer')" class="subTitle">
                {{ existTabField('ruleInfo') }}
              </h5>
              <el-row :gutter="10">
                <!-- 制度名称 -->
                <el-col v-if="existTabField('c_ruleName', 'refer')" :span="12">
                  <el-form-item
                    :label="existTabField('c_ruleName')"
                    prop="rulename"
                    :rules="[
                      {
                        required: existTabField('c_ruleName', 'necessary'),
                        message: ' ',
                        trigger: 'blur'
                      }
                    ]"
                  >
                    <el-input v-model="attrsForm.rulename" disabled />
                  </el-form-item>
                </el-col>
                <!-- 制度编码 -->
                <el-col v-if="existTabField('c_ruleCode', 'refer')" :span="12">
                  <el-form-item
                    :label="existTabField('c_ruleCode')"
                    prop="rulecode"
                    :rules="[
                      {
                        required: existTabField('c_ruleCode', 'necessary'),
                        message: ' ',
                        trigger: 'blur'
                      }
                    ]"
                  >
                    <el-input v-model="attrsForm.rulecode" disabled />
                  </el-form-item>
                </el-col>
                <!-- 制度编写人 -->
                <el-col
                  v-if="existTabField('c_ruleperson', 'refer')"
                  :span="12"
                >
                  <el-form-item
                    :label="existTabField('c_ruleperson')"
                    prop="ruleperson"
                    :rules="[
                      {
                        required: existTabField('c_ruleperson', 'necessary'),
                        message: ' ',
                        trigger: 'blur'
                      }
                    ]"
                  >
                    <el-input
                      :value="
                        !attrsForm.ruleperson
                          ? ''
                          : attrsForm.ruleperson
                              .map(item => item.value)
                              .join(',')
                      "
                      :title="
                        !attrsForm.ruleperson
                          ? ''
                          : attrsForm.ruleperson
                              .map(item => item.value)
                              .join(',')
                      "
                      disabled
                    />
                  </el-form-item>
                </el-col>
                <!-- 制度联络人 -->
                <!-- 负责部门 -->
                <!-- <el-col v-if="existTabField('c_organization', 'refer')" :span="8">
                  <el-form-item :label="existTabField('c_organization')" prop="disScopeformat" :rules="[
                      { required: existTabField('c_organization', 'necessary'), message: ' ', trigger: 'blur' }
                    ]">
                    <el-input v-model="attrsForm.disScopeformat"
                      :title="attrsForm.disScopeformat" disabled>
                      <el-button  slot="append"  @click="distributeClick">{{existTabField('select', '', true)}}
                      </el-button>
                    </el-input>
                  </el-form-item>
                </el-col> -->

                <el-col v-if="existTabField('c_ruler', 'refer')" :span="12">
                  <el-form-item
                    :label="existTabField('c_ruler')"
                    prop="ruler"
                    :rules="[
                      {
                        required: existTabField('c_ruler', 'necessary'),
                        message: ' ',
                        trigger: 'blur'
                      }
                    ]"
                  >
                    <el-input
                      :value="
                        !attrsForm.ruler
                          ? ''
                          : attrsForm.ruler.map(item => item.value).join(',')
                      "
                      :title="
                        !attrsForm.ruler
                          ? ''
                          : attrsForm.ruler.map(item => item.value).join(',')
                      "
                      disabled
                    >
                      <el-button id="btn" slot="append" @click="chooseRuler">
                        {{ existTabField('select', '', true) }}
                      </el-button>
                    </el-input>
                  </el-form-item>
                </el-col>
                <!-- 制度简介 -->
                <el-col v-if="existTabField('c_ruledes', 'refer')" :span="12">
                  <el-form-item
                    :label="existTabField('c_ruledes')"
                    prop="ruledesc"
                    :rules="[
                      {
                        required: existTabField('c_ruledes', 'necessary'),
                        message: ' ',
                        trigger: 'blur'
                      }
                    ]"
                  >
                    <el-input
                      v-model="attrsForm.ruledesc"
                      type="textarea"
                      :disabled="!noEditing"
                    />
                  </el-form-item>
                </el-col>
                <!-- 制度原因 -->
                <el-col
                  v-if="existTabField('c_rulereason', 'refer')"
                  :span="12"
                >
                  <el-form-item
                    :label="existTabField('c_rulereason')"
                    prop="rulereason"
                    :rules="[
                      {
                        required: existTabField('c_rulereason', 'necessary'),
                        message: ' ',
                        trigger: 'blur'
                      }
                    ]"
                  >
                    <el-input
                      v-model="attrsForm.rulereason"
                      type="textarea"
                      :disabled="!noEditing"
                    />
                  </el-form-item>
                </el-col>
              </el-row>

              <!---------------------------------------------- 流程相关信息---------------------->
              <!--              <h5 v-if="existTabField('processInfo', 'refer')" class="subTitle">{{ existTabField('processInfo') }}</h5>-->
              <el-row :gutter="10" />
              <!-- 上游流程名称和下游流程名称 -->
              <el-row>
                <!-- 体系分类 -->
                <el-col
                  v-if="existTabField('systemProcessRelations', 'refer')"
                  :span="24"
                >
                  <el-form-item
                    :label="existTabField('systemProcessRelations')"
                    :rules="[
                      {
                        required: existTabField(
                          'systemProcessRelations',
                          'necessary'
                        ),
                        message: ' ',
                        trigger: 'blur'
                      }
                    ]"
                    prop="systemProcessRelations"
                  >
                    <el-checkbox-group
                      v-model="sysProcessRelations"
                      @change="handleCheckedSysProChange"
                    >
                      <el-checkbox
                        v-for="item in sysProRelationsOptions"
                        :label="item.id"
                        :key="item.id"
                        :title="
                          item.name + item.versions + '(' + item.num + ')'
                        "
                        >{{ item.name }}
                      </el-checkbox>
                    </el-checkbox-group>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row
                v-if="existTabField('systemProcessRelations', 'refer')"
                :gutter="10"
                class="sysChapterWrap"
              >
                <el-col
                  :span="8"
                  class="systemCard margin-b10"
                  v-for="(system, index) in attrsForm.systemProcessRelations"
                  :key="system.id"
                >
                  <el-card class="box-card" :body-style="{ padding: '0px' }">
                    <div slot="header" class="clearfix header">
                      <span>{{ system.name }}</span>
                      <el-button
                        class="float-r"
                        @click="deleteSystemProcess(system, index)"
                        type="text"
                        icon="el-icon-close"
                        :disabled="!noEditing"
                      ></el-button>
                      <el-button
                        class="float-r"
                        type="text"
                        @click="selectSystemProcess(system)"
                        :disabled="!noEditing"
                        >选择章节
                      </el-button>
                    </div>
                    <div class="pad-10px h220px">
                      <p
                        v-for="(chapter,
                        chapterIndex) in system.selectChapterData"
                        :key="chapter.id"
                      >
                        <i class="blockCircle"></i>
                        {{ chapter.content }}
                      </p>
                    </div>
                  </el-card>
                </el-col>
              </el-row>

              <el-row :gutter="10">
                <el-col
                  v-if="existTabField('c_superiorProcess', 'refer')"
                  :span="12"
                >
                  <el-form-item
                    class="label-height-auto"
                    :label="existTabField('c_superiorProcess')"
                    prop="upStream"
                    :rules="[
                      {
                        required: existTabField(
                          'c_superiorProcess',
                          'necessary'
                        ),
                        message: ' ',
                        trigger: 'blur'
                      }
                    ]"
                  >
                    <el-row>
                      <el-col :span="20">
                        <p class="showFiles minHeight28">
                          <span
                            v-for="item in attrsForm.upStream"
                            :key="item.id"
                            class="margin-r5 margin-b5"
                          >
                            {{
                              item.name.indexOf(item.code) == -1
                                ? item.code + item.name
                                : item.name
                            }}
                            <i
                              class="el-icon-close cursor-pointer"
                              @click="delProcess('upStream', item)"
                            />
                          </span>
                        </p>
                      </el-col>
                      <el-col :span="4">
                        <el-button
                          class="float-r"
                          @click="
                            refertype = 'upstream'
                            processlists = attrsForm.upStream
                            isSelectVisible = true
                          "
                          :disabled="!noEditing"
                        >
                          {{ existTabField('select', '', true) }}
                        </el-button>
                      </el-col>
                    </el-row>
                  </el-form-item>
                </el-col>
                <el-col
                  v-if="existTabField('c_subordinateProcess', 'refer')"
                  :span="12"
                >
                  <el-form-item
                    class="label-height-auto"
                    :label="existTabField('c_subordinateProcess')"
                    prop="downStream"
                    :rules="[
                      {
                        required: existTabField(
                          'c_subordinateProcess',
                          'necessary'
                        ),
                        message: ' ',
                        trigger: 'blur'
                      }
                    ]"
                  >
                    <el-row>
                      <el-col :span="20">
                        <p class="showFiles minHeight28">
                          <span
                            v-for="item in attrsForm.downStream"
                            :key="item.id"
                            class="margin-r5 margin-b5"
                          >
                            {{
                              item.name.indexOf(item.code) == -1
                                ? item.code + item.name
                                : item.name
                            }}
                            <i
                              class="el-icon-close cursor-pointer"
                              @click="delProcess('downStream', item)"
                            />
                          </span>
                        </p>
                      </el-col>
                      <el-col :span="4">
                        <el-button
                          class="float-r"
                          @click="
                            refertype = 'downstream'
                            processlists = attrsForm.downStream
                            isSelectVisible = true
                          "
                          :disabled="!noEditing"
                        >
                          {{ existTabField('select', '', true) }}
                        </el-button>
                      </el-col>
                    </el-row>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="10">
                <el-col
                  v-if="existTabField('c_processInput', 'refer')"
                  :span="12"
                >
                  <el-form-item
                    class="label-height-auto"
                    :label="existTabField('c_processInput')"
                    prop="processInput"
                    :rules="[
                      {
                        required: existTabField('c_processInput', 'necessary'),
                        message: ' ',
                        trigger: 'blur'
                      }
                    ]"
                  >
                    <el-row>
                      <el-col :span="20">
                        <h6>{{ existTabField('description', '', true) }} :</h6>
                        <p class="showFiles processCommon">
                          {{ attrsForm.processInputDesc }}
                        </p>
                        <h6 class="margin-t5">
                          {{ existTabField('localUploadAttachment', '', true) }}
                          :
                        </h6>
                        <p class="showFiles processCommon alink">
                          <span
                            v-for="item in attrsForm.processFileInput"
                            :key="item.id"
                            class="margin-r5 margin-b5"
                          >
                            <a
                              class="font-link"
                              :href="viewFile(item.docid)"
                              target="_blank"
                              >{{ item.name || item.newName }}</a
                            >
                            <a
                              class="margin-l5 font-link"
                              :href="downloadFile(item.docid)"
                              target="_blank"
                            >
                              <b class="el-icon-download" />
                            </a>
                            <!-- <i class="el-icon-close" @click="delProcess('processFileInput', item)"></i> -->
                          </span>
                        </p>
                        <h6 class="margin-t5">
                          {{
                            existTabField(
                              'theUpstreamProcessBringsOutTheInputFile',
                              '',
                              true
                            )
                          }}
                          :
                        </h6>
                        <p class="showFiles processCommon alink">
                          <span
                            v-for="item in attrsForm.processUpInput"
                            :key="item.id"
                            class="margin-r5 margin-b5"
                          >
                            <a
                              class="font-link"
                              :href="viewFile(item.docid)"
                              target="_blank"
                              >{{ item.name || item.newName }}</a
                            >
                            <a
                              class="margin-l5 font-link"
                              :href="downloadFile(item.docid)"
                              target="_blank"
                            >
                              <b class="el-icon-download" />
                            </a>
                          </span>
                        </p>
                      </el-col>
                      <el-col :span="4">
                        <el-button
                          :disabled="!noEditing"
                          class="float-r"
                          @click="selectprocessfile('processInput')"
                        >
                          {{ existTabField('edit', '', true) }}
                        </el-button>
                      </el-col>
                    </el-row>
                  </el-form-item>
                </el-col>
                <el-col
                  v-if="existTabField('c_processOutput', 'refer')"
                  :span="12"
                >
                  <el-form-item
                    class="label-height-auto"
                    :label="existTabField('c_processOutput')"
                    prop="processOutput"
                    :rules="[
                      {
                        required: existTabField('c_processOutput', 'necessary'),
                        message: ' ',
                        trigger: 'blur'
                      }
                    ]"
                  >
                    <el-row>
                      <el-col :span="20">
                        <h6>{{ existTabField('description', '', true) }} :</h6>
                        <p class="showFiles processCommon">
                          {{ attrsForm.processOutputDesc }}
                        </p>
                        <h6 class="margin-t5">
                          {{ existTabField('localUploadAttachment', '', true) }}
                          :
                        </h6>
                        <p class="showFiles processCommon alink">
                          <span
                            v-for="item in attrsForm.processFileOutput"
                            :key="item.id"
                            class="margin-r5 margin-b5"
                          >
                            <a
                              class="font-link"
                              :href="viewFile(item.docid)"
                              target="_blank"
                              >{{ item.name || item.newName }}</a
                            >
                            <a
                              class="margin-l5 font-link"
                              :href="downloadFile(item.docid)"
                              target="_blank"
                            >
                              <b class="el-icon-download" />
                            </a>
                            <!-- <i class="el-icon-close" @click="delProcess('processFileOutput', item)"></i> -->
                          </span>
                        </p>
                        <h6 class="margin-t5">
                          {{
                            existTabField(
                              'theFlowchartBringsOutTheOutputFile',
                              '',
                              true
                            )
                          }}
                          :
                        </h6>
                        <p class="showFiles processCommon alink">
                          <span
                            v-for="item in attrsForm.processchartOutput"
                            :key="item.id"
                            class="margin-r5 margin-b5"
                          >
                            <a
                              class="font-link"
                              :href="viewFile(item.docid)"
                              target="_blank"
                              >{{ item.name || item.newName }}</a
                            >
                            <a
                              class="margin-l5 font-link"
                              :href="downloadFile(item.docid)"
                              target="_blank"
                            >
                              <b class="el-icon-download" />
                            </a>
                          </span>
                        </p>
                      </el-col>
                      <el-col :span="4">
                        <el-button
                          :disabled="!noEditing"
                          class="float-r"
                          @click="selectprocessfile('processOutput')"
                        >
                          {{ existTabField('edit', '', true) }}
                        </el-button>
                      </el-col>
                    </el-row>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="10" :disabled="!noEditing">
                <!-- 相关体系分类及标准条款 -->
                <el-col
                  v-if="existTabField('c_systemClassification', 'refer')"
                  :span="24"
                >
                  <el-form-item
                    :label="existTabField('c_systemClassification')"
                    prop="systemlist"
                    :rules="[
                      {
                        required: existTabField(
                          'c_systemClassification',
                          'necessary'
                        ),
                        message: ' ',
                        trigger: 'blur'
                      }
                    ]"
                  >
                    <!--                    <span v-for="item in syslistsRepeat" :key="item" class="syslist"-->
                    <!--                          :class="{'active': attrsForm.systemlist.indexOf(item) > -1}" @click="selectSysItem(item)">-->
                    <!--                      <span :title="syslistsname[item].cnname + ' ' + syslistsname[item].enname">{{ item }}</span>-->
                    <!--                      <el-tooltip v-show="attrsForm.systemlist.indexOf(item) > -1" class="item" effect="dark"-->
                    <!--                                  :content="existTabField('clear')" placement="top">-->
                    <!--                        <i class="margin-l5 el-icon-close" @click.prevent="delSyslist(item)" />-->
                    <!--                      </el-tooltip>-->
                    <!--                    </span>-->
                    <el-button-group>
                      <el-button
                        :disabled="!noEditing"
                        v-for="item in syslistsRepeat"
                        :key="item"
                        @click="selectSysItem(item)"
                        :class="
                          attrsForm.systemlist.indexOf(item) > -1
                            ? 'sys-btn-choose'
                            : 'sys-btn'
                        "
                      >
                        <span
                          :title="
                            syslistsname[item].cnname +
                              ' ' +
                              syslistsname[item].enname
                          "
                          >{{ item }}</span
                        >
                        <el-tooltip
                          v-show="attrsForm.systemlist.indexOf(item) > -1"
                          class="item"
                          effect="dark"
                          :content="existTabField('clear')"
                          placement="top"
                        >
                          <i
                            class="margin-l5 el-icon-close"
                            @click.prevent="delSyslist(item)"
                          />
                        </el-tooltip>
                      </el-button>
                    </el-button-group>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row
                v-if="existTabField('c_systemClassification', 'refer')"
                :gutter="10"
              >
                <el-col
                  v-for="system in syslistsRepeat"
                  v-show="syspart[system].show"
                  :key="system"
                  :span="12"
                  class="systemCard margin-b10"
                >
                  <el-card class="box-card" :body-style="{ padding: '0px' }">
                    <div slot="header" class="clearfix header">
                      <span>{{ system }}</span>
                      <el-button
                        class="float-r margin-l5"
                        icon="el-icon-close"
                        @click="syspart[system].show = false"
                      />
                      <el-button
                        class="float-r margin-l10"
                        @click.prevent="delSyslist(system)"
                      >
                        {{ existTabField('clear', '', true) }}
                      </el-button>
                      <el-button
                        class="float-r"
                        @click="confirmSyslist(system)"
                      >
                        {{ existTabField('confirm', '', true) }}
                      </el-button>
                      <el-button class="float-r" @click="selectSysFile(system)">
                        {{ existTabField('selectAttachment', '', true) }}
                      </el-button>
                    </div>
                    <div class="pad-10px h220px">
                      <h6 class="margin-b5">
                        {{
                          existTabField('standardTermDescription', '', true)
                        }}:
                      </h6>
                      <el-input
                        v-model="syspart[system].desc"
                        type="textarea"
                        class="system_card system"
                        @blur.native.stop="referSyslist(system)"
                      />
                      <h6 class="margin-b5 margin-t15">
                        {{ existTabField('selectedAttachment', '', true) }}:
                      </h6>
                      <p class="showFiles alink">
                        <span
                          v-for="(item, index) in syspart[system].selected"
                          :key="item.id"
                          class="margin-r5 margin-b5"
                        >
                          <a
                            class="font-link"
                            :href="viewFile(item.docid)"
                            target="_blank"
                            >{{ item.name }}</a
                          >
                          <a
                            class="margin-l5 font-link"
                            :href="downloadFile(item.docid)"
                            target="_blank"
                          >
                            <b class="el-icon-download" />
                          </a>
                          <i
                            class="el-icon-close"
                            @click="delsys(system, 'selected', index)"
                          />
                        </span>
                      </p>
                      <h6 class="margin-b5 margin-t15">
                        {{ existTabField('uploadedAttachments', '', true) }}:
                      </h6>
                      <p class="showFiles alink">
                        <span
                          v-for="(item, index) in syspart[system].uploaded"
                          :key="item.id"
                          class="margin-r5 margin-b5"
                        >
                          <a
                            class="font-link"
                            :href="viewFile(item.docid)"
                            target="_blank"
                            >{{ item.name }}</a
                          >
                          <a
                            class="margin-l5 font-link"
                            :href="downloadFile(item.docid)"
                            target="_blank"
                          >
                            <b class="el-icon-download" />
                          </a>
                          <i
                            class="el-icon-close"
                            @click="delsys(system, 'uploaded', index)"
                          />
                        </span>
                      </p>
                    </div>
                  </el-card>
                </el-col>
              </el-row>
            </el-form>
          </div>
          <el-row class="text-right">
            <!-- <el-button :disabled="!noEditing" -->
            <el-button
              v-show="
                editableTabsValue == 0 &&
                  existTab('18') &&
                  existTab('18') !== ''
              "
              type="primary"
              @click="paintChart"
            >
              {{ existTab('18') }}
            </el-button>
            <el-button
              :disabled="!noEditing"
              v-show="
                editableTabsValue == 0 &&
                  existTab('19') &&
                  existTab('19') !== ''
              "
              type="primary"
              @click="saveProcessCard('save')"
            >
              {{ existTab('19') }}
            </el-button>
            <el-button
              :disabled="!noEditing"
              v-show="
                editableTabsValue == 0 &&
                  existTab('20') &&
                  existTab('20') !== ''
              "
              @click="resetCard"
            >
              {{ existTab('20') }}
            </el-button>
          </el-row>
        </el-tab-pane>
        <!-- 规章制度管理 -->
        <el-tab-pane
          v-if="existTab('13', 'refer')"
          name="13"
          :label="existTab('13')"
        >
          <ruleSystem
            v-if="editableTabsValue == 13"
            :showtabfiled="showtabfiled"
            :tree-id="treeId"
            :listid="modelid"
            :noEditing="noEditing"
          />
        </el-tab-pane>
        <!-- 制度管理办法内容 -->
        <el-tab-pane
          v-if="existTab('8', 'refer')"
          name="8"
          :label="existTab('8')"
        >
          <manage
            v-if="editableTabsValue == 8"
            :tree-id="treeId"
            :listid="modelid"
          />
        </el-tab-pane>
        <!-- 流程支持文件 -->
        <el-tab-pane
          v-if="existTab('1', 'refer')"
          name="1"
          :label="existTab('1')"
        >
          <processInsit
            :noEditing="noEditing"
            :showtabfiled="showtabfiled"
            :modelid="modelid"
          />
        </el-tab-pane>
        <!-- 流程绩效 -->
        <el-tab-pane
          v-if="existTab('2', 'refer')"
          name="2"
          :label="existTab('2')"
        >
          <processPerformance :showtabfiled="showtabfiled" :modelid="modelid" />
        </el-tab-pane>
        <!-- 关键风险控制点 -->
        <el-tab-pane
          v-if="existTab('3', 'refer')"
          name="3"
          :label="existTab('3')"
        >
          <riskNecessary :showtabfiled="showtabfiled" :modelid="modelid" />
        </el-tab-pane>
        <!-- 关键成功要素 -->
        <el-tab-pane
          v-if="existTab('4', 'refer')"
          name="4"
          :label="existTab('4')"
        >
          <keyElement :showtabfiled="showtabfiled" :modelid="modelid" />
        </el-tab-pane>
        <!-- 业务对象 -->
        <el-tab-pane
          v-if="existTab('15', 'refer')"
          name="15"
          :label="existTab('15')"
        >
          <businessObject
            v-if="editableTabsValue == 15"
            :showtabfiled="showtabfiled"
            :modelid="modelid"
          />
        </el-tab-pane>
        <!-- 工具库 -->
        <el-tab-pane
          v-if="existTab('16', 'refer')"
          name="16"
          :label="existTab('16')"
        >
          <toolMagazine
            v-if="editableTabsValue == 16"
            :showtabfiled="showtabfiled"
            :modelid="modelid"
          />
        </el-tab-pane>
        <!-- 权限执行表 -->
        <el-tab-pane
          v-if="existTab('9', 'refer')"
          name="9"
          :label="existTab('9')"
        >
          <author
            v-if="editableTabsValue == 9"
            :showtabfiled="showtabfiled"
            :tree-id="treeId"
            :modelid="modelid"
          />
        </el-tab-pane>
        <!-- 相关性支撑内容 -->
        <el-tab-pane
          v-if="existTab('11', 'refer')"
          name="11"
          :label="existTab('11')"
        >
          <correlation-support
            :showtabfiled="showtabfiled"
            v-if="editableTabsValue == 11"
            :modelid="modelid"
            :bpmid="bpmid"
            :tree-id="treeId"
            :version="version"
            :noEditing="noEditing"
          />
        </el-tab-pane>
        <!-- 业务规则 -->
        <el-tab-pane
          v-if="existTab('5', 'refer')"
          name="5"
          :label="existTab('5')"
        >
          <busRule
            v-if="editableTabsValue == 5"
            :showtabfiled="showtabfiled"
            :modelid="modelid"
            :noEditing="noEditing"
          />
        </el-tab-pane>
        <!-- 修订内容 -->
        <el-tab-pane
          v-if="existTab('10', 'refer')"
          name="10"
          :label="existTab('10')"
        >
          <modify-record
            :noEditing="noEditing"
            :showtabfiled="showtabfiled"
            v-if="editableTabsValue == 10"
            :modelid="modelid"
            :version="version"
          />
        </el-tab-pane>
        <!-- 流程活动说明 -->
        <el-tab-pane
          v-if="existTab('6', 'refer')"
          name="6"
          :label="existTab('6')"
        >
          <processInfo :showtabfiled="showtabfiled" :bpmid="bpmid" />
        </el-tab-pane>
        <!-- 审批记录 -->
        <!--<el-tab-pane name="7" :label="existTab('7')" v-if="existTab('7','refer')">-->
        <!--<appovalRecord :showtabfiled="showtabfiled" :modelid="modelid" />-->
        <!--</el-tab-pane>-->
        <!-- 风险控制 -->
        <el-tab-pane
          v-if="existTab('12', 'refer')"
          name="12"
          :label="existTab('12')"
        >
          <risk-control :showtabfiled="showtabfiled" :modelid="modelid" />
        </el-tab-pane>
      </el-tabs>
    </el-dialog>

    <!-- 添加附件 -->
    <select-file
      v-model="isGroupVisible"
      :page-id="forlderId"
      @confirm="handlerSelect"
    />

    <!-- 分发范围 -->
    <!--    <distribution-->
    <!--      v-model="isdisVisible"-->
    <!--      :dis-data="distribution"-->
    <!--      @confirm="confirmDistribution"-->
    <!--    />-->
    <distribution
      v-model="isdisVisible"
      :orgType="orgType"
      :dis-data="currentOrg"
      @confirm="confirmDistribution"
    />

    <!-- 配合部门 -->
    <codistribution
      v-model="iscodisVisible"
      :dis-data="codistribution"
      @confirm="confirmCoDistribution"
    />
    <!-- 新的分发范围 -->
    <!-- <distribution-new :disData="distribution" v-model="isdisVisible" @confirm="confirmDistribution"></distribution-new> -->

    <!-- 选择流程 -->
    <select-process
      v-model="isSelectVisible"
      :processlists="processlists"
      :model-id="treeId"
      @confirm="confirmprocess"
    />

    <!-- 流程输入输出的dialog -->
    <el-dialog
      class="supportDialog"
      :visible.sync="isinoutVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <template slot="title">
        <div class="clear-fix">
          <span class="font14">{{
            existTabField('selectAttachment', '', true)
          }}</span>
          <!-- <el-button class="float-r"   @click="saveInoutFiles">
            {{existTabField('save', '', true)}}</el-button> -->
        </div>
      </template>
      <el-form
        ref="selectProcessRef"
        label-width="110px"
        label-position="right"
        :model="selectInoutform"
      >
        <el-form-item
          class="label-height-auto"
          :label="existTabField('description')"
          prop="desc"
        >
          <el-input
            v-model="selectInoutform.desc"
            type="textarea"
            rows="4"
            resize="none"
          />
        </el-form-item>
        <el-form-item
          class="label-height-auto"
          :label="
            selectReferType === 'processInput'
              ? existTabField('theUpstreamProcessTakesOutTheOutputFile')
              : existTabField('theFlowchartBringsOutTheOutputFile')
          "
          prop="disabledfiles"
        >
          <p class="showFiles processCommon minHeight35">
            <span
              v-for="item in selectInoutform.disabledfiles"
              :key="item.id"
              class="margin-r5 margin-b5"
              >{{ item.name || item.newName }}</span
            >
          </p>
        </el-form-item>
        <el-form-item
          class="label-height-auto"
          :label="existTabField('localUploadAttachment')"
          prop="files"
        >
          <el-row>
            <el-col :span="20" class="minHeight28">
              <p class="showFiles processCommon">
                <span
                  v-for="item in selectInoutform.files"
                  :key="item.id"
                  class="margin-r10 margin-b10"
                >
                  {{ item.name || item.newName }}
                  <i
                    class="el-icon-close cursor-pointer"
                    @click="delSelectFiles(item)"
                  />
                </span>
              </p>
            </el-col>
            <el-col :span="4">
              <el-button class="float-r" @click="isGroupVisible = true">
                {{ existTabField('select', '', true) }}
              </el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isinoutVisible = false">
          {{ $t('cancel') }}
        </el-button>
        <el-button type="primary" @click="saveInoutFiles">
          {{ existTabField('confirm', '', true) }}
        </el-button>
      </div>
    </el-dialog>
    <!-- 选择制度 -->
    <!-- <systemDialog v-model="systemVisible" @confirm="confirmSystem" :processlists="defaultList"></systemDialog> -->

    <!-- 选择规章制度文档弹窗 -->
    <el-dialog
      :visible.sync="systemVisible"
      :destroy-on-close="true"
      title="选择规章制度文档"
      width="52%"
    >
      <div class="left_tree_wrapper margin-t20">
        <el-tree
          ref="asyncTree"
          :props="chapterprops"
          :load="getFilterRuleTreeList"
          :default-expanded-keys="expandedRuleList"
          :expand-on-click-node="false"
          node-key="id"
          show-checkbox
          check-strictly
          lazy
          @check-change="handlerNodeChecked"
        >
          <div slot-scope="{ node, data }" class="custom-tree-node">
            <p :title="node.label" class="grow">
              {{ node.label }}
            </p>
          </div>
        </el-tree>
      </div>
      <div style="margin-top: 10px">
        <span
          v-for="item in defaultList"
          :key="item.id"
          :title="item.foldername"
          class="listItem"
        >
          {{ item.foldername
          }}<i
            class="el-icon-close cursor-pointer"
            @click="delCheckedData(item)"
          />
        </span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="systemVisible = false">取 消</el-button>
        <el-button type="primary" @click="selectRuleConfirm">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 选择章节弹窗 -->
    <el-dialog
      :visible.sync="chapterDialogVisible"
      :destroy-on-close="true"
      title="选择章节"
      width="52%"
    >
      <div class="left_tree_wrapper margin-t20">
        <el-tree
          ref="chapterTree"
          :props="chapterprops"
          :load="getFilterRuleTreeList"
          :default-expanded-keys="expandedRuleList"
          :expand-on-click-node="false"
          node-key="id"
          show-checkbox
          check-strictly
          lazy
          @check-change="handlerNodeCheckeds"
        >
          <div slot-scope="{ node, data }" class="custom-tree-node">
            <p :title="node.label" class="grow">
              {{ node.label }}
            </p>
          </div>
        </el-tree>
      </div>
      <div style="margin-top: 10px">
        <span
          v-for="item in defaultLists"
          :key="item.id"
          :title="item.foldername"
          class="listItem"
        >
          {{ item.foldername
          }}<i
            class="el-icon-close cursor-pointer"
            @click="delCheckedDatas(item)"
          />
        </span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="chapterDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="selectChapterConfirm"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <!-- 制度联络人 -->
    <select-group
      v-model="isGroupDialogVisible"
      :select-tree="['3']"
      :show-tree="'1,2,3,4'"
      :selected="selectedID"
      @confirm="handlerGroupSelect"
    />

    <selectRules
      v-model="rulesVisible"
      :is-more="false"
      @confirm="selectRuleConfirm"
    />
    <selectChapter v-model="chapterVisible" @confirm="selectChapterConfirm" />
    <selectEnterpriseStandard
      v-model="enterpriseStandardVisible"
      :enterpriseStandardSelected="enterpriseStandardSelected"
      @confirm="selectEnterpriseStandardConfirm"
    />
    <selectTerminology
      v-model="terminologyVisible"
      :isMore="false"
      @confirm="selectTerminologyConfirm"
    />

    <!--体系分类选择章节 -->
    <select-chapter-dialogs
      ref="ceshi"
      v-model="selectChapterDialogVisible"
      :selectSys="selectSys"
      @confirm="handlerChapterSelect"
    ></select-chapter-dialogs>

    <!-- 流程管理员 -->
    <bas-organieation
      v-model="organieationShow"
      :selectedElement="selectedElement"
      :isSpecifiedGroupBut="false"
      :isShowBustomGroupsBut="false"
      :selectElement="selectElement"
      :showElement="showElement"
      :title="orgtitle"
      @fnCallBack="fnBasOrganieationCallBack"
    />
  </div>
</template>
<script>
import distribution from './distribution.vue'
import codistribution from './codistribution.vue'
import selectProcess from './selectProcess.vue'
import distributionNew from './distributionNew.vue'
import manage from './manage.vue'
import author from './author.vue'
import correlationSupport from './correlationSupport.vue'
import modifyRecord from './modifyRecord.vue'
import riskControl from './riskControl.vue'
import systemDialog from '@/bpa/components/systemDialog'
import {
  processattrs,
  processStartOrEnd,
  processSaveAttr,
  saveFile,
  controlField,
  tabField,
  getSystemList,
  getDictionaryOption
} from '@/bpa/api/processDesignCenter'
import { deluploadFile } from '@/bpa/api/common'
import { getTerminologyList } from '@/bpa/api/processModelCenter/terminology'
import {
  getSystemFolderCopy,
  getRuleIframeTree
} from '@/bpa/api/rulesCenter/handbookFiles'
import fileOperation from '@/bpa/mixins/fileDownView'
import BasComponent from 'bas-component'

Vue.use(BasComponent)
import 'bas-component/lib/BasComponent.css'
import { getInterList } from '@/bpa/api/systemManagementCenter/fileManagement'

const syslists = ['QMS', 'EMS', 'OHSAS', 'ISMS', 'RMS', 'EnMs']
const syslistsname = {
  QMS: {
    cnname: '质量管理体系',
    enname: 'Quality Management System'
  },
  EMS: {
    cnname: '环境管理体系',
    enname: 'Environment Management System'
  },
  OHSAS: {
    cnname: '职业健康安全管理体系',
    enname: 'Occupation Health Safety Management System'
  },
  ISMS: {
    cnname: '信息安全管理体系',
    enname: 'Information Security Management System'
  },
  RMS: {
    cnname: '风险管理体系',
    enname: 'Risk Management System'
  },
  EnMs: {
    cnname: '能源管理体系',
    enname: 'Energy Management System'
  }
}

export default {
  name: 'ProcessCard',
  components: {
    distribution,
    systemDialog,
    selectProcess,
    distributionNew,
    codistribution,
    manage,
    author,
    modifyRecord,
    correlationSupport,
    riskControl,
    processInsit: () => import('./processInsit.vue'),
    processPerformance: () => import('./processPerformance.vue'),
    riskNecessary: () => import('./riskNecessary.vue'),
    keyElement: () => import('./keyElement.vue'),
    busRule: () => import('./busRule.vue'),
    processInfo: () => import('./processInfo.vue'),
    appovalRecord: () => import('./appovalRecord.vue'),
    ruleSystem: () => import('./ruleSystem.vue'),
    selectRules: () =>
      import('@/bpa/views/rulesCenter/newIndex/components/selectRules.vue'),
    selectChapter: () =>
      import('@/bpa/views/rulesCenter/newIndex/components/selectChapter.vue'),
    selectEnterpriseStandard: () =>
      import(
        '@/bpa/views/rulesCenter/newIndex/components/selectEnterpriseStandard.vue'
      ),
    businessObject: () => import('./businessObject.vue'),
    toolMagazine: () => import('./toolMagazine.vue'),
    selectChapterDialogs: () => import('./selectChapter.vue'),
    selectTerminology: () => import('./selectTerminology.vue')
  },
  mixins: [fileOperation],
  props: {
    value: {
      type: Boolean,
      default: false
    },
    modelid: {
      type: String,
      default: ''
    },
    treeId: {
      type: String,
      default: ''
    },
    bpmid: {
      type: String,
      default: ''
    },
    processcode: {
      type: String,
      default: ''
    },
    version: {
      type: String,
      default: ''
    },
    processState: {
      type: String,
      default: ''
    },
    currentCardType: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      orgType: 'distribution',
      currentPersonType: '', // 当前选择人员
      placeholderTitle3: this.$t('chooseAPosition'),
      selectSys: {},
      selectChapterDialogVisible: true,
      expandedList: [],
      selectedID: [],
      defaultLists: [],
      isGroupDialogVisible: false,
      referClose: false,
      // 暂存后台返回的流程基本属性的数据
      rebackDataOther: {},
      rebackData: {},
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 24 * 60 * 60 * 1000
        }
      },
      syslistsname: syslistsname,
      isDialogsVisible: false,
      isGroupVisible: false,
      isdisVisible: false,
      iscodisVisible: false,
      isSelectVisible: false,
      isinoutVisible: false,
      rulesVisible: false,
      chapterVisible: false,
      enterpriseStandardVisible: false,
      terminologyVisible: false,
      refertype: 'upstream',
      processlists: [],
      expandedRuleList: [],
      distribution: {},
      orgscope1: {},
      orgscope2: {},
      orgscope3: {},
      codistribution: {},
      selectedID2: [],
      attrsForm: {
        processcode: '',
        effectTime: '',
        nextTime: '',
        desc: '',
        target: '',
        fitscope: '',
        standby1: '',
        standby2: '',
        standby3: '',
        standby4: '',
        standby5: '',
        standby6: '',
        disScope: '',
        systemlist: [],
        ruleperson: [],
        ruler: [],
        manageTypes: '', // 管理标准类型:
        manageClassification: '', // 管理标准归类:
        processframeworkname: '', // 流程框架名称:
        supactivities: '', // 关键活动补充说明:
        termlist: [
          {
            term: '',
            termdetail: ''
          }
        ],
        zhiduList: [
          {
            zhiduName: '',
            zhiduId: '',
            zhangjieList: [
              {
                zhangjieId: '',
                zhangjieName: ''
              }
            ]
          }
        ]
      },
      manageTypeOptions: [
        {
          value: '一级制度',
          label: '一级制度'
        },
        {
          value: '流程规范',
          label: '流程规范'
        },
        {
          value: '操作指引',
          label: '操作指引'
        }
      ],
      manageClassificationOptions: [
        {
          value: '支撑类',
          label: '支撑类'
        },
        {
          value: '业务类',
          label: '业务类'
        },
        {
          value: '管理类',
          label: '管理类'
        }
      ],
      sysProRelationsOptions: [],
      // 术语
      termlists: [],
      attrsRules: {
        effectTime: [{ required: true, message: ' ', trigger: 'blur' }],
        desc: [{ required: true, message: ' ', trigger: 'blur' }],
        target: [{ required: true, message: ' ', trigger: 'blur' }],
        fitscope: [{ required: true, message: ' ', trigger: 'blur' }],
        standby1: [{ required: true, message: ' ', trigger: 'blur' }],
        standby2: [{ required: true, message: ' ', trigger: 'blur' }],
        standby3: [{ required: true, message: ' ', trigger: 'blur' }],
        standby4: [{ required: true, message: ' ', trigger: 'blur' }],
        standby5: [{ required: true, message: ' ', trigger: 'blur' }],
        standby6: [{ required: true, message: ' ', trigger: 'blur' }],
        disScopeformat: [{ required: true, message: ' ', trigger: 'blur' }],
        scopeFormat1: [{ required: true, message: ' ', trigger: 'blur' }],
        scopeFormat2: [{ required: true, message: ' ', trigger: 'blur' }],
        scopeFormat3: [{ required: true, message: ' ', trigger: 'blur' }]
      },
      editableTabsValue: 0,
      editableTabs: [],
      selectProcessform: {},
      // 流程输入、流程输出部分
      selectReferType: '',
      selectInoutform: {},
      syslists: JSON.parse(JSON.stringify(syslists)),
      syspart: [],
      // 流程基本属性
      storeDeletefile: {
        document: [],
        modeldoc: []
      },
      // 体系分类
      syslistsRepeat: '',
      // 组件附件的调用参数
      // 显示tablist
      showtabfiled: [],
      systemVisible: false,
      chapterDialogVisible: false,
      defaultList: [],
      chapterprops: {
        label: function(data, node) {
          if (data.code) {
            return data.code + ' ' + data.foldername
          } else {
            return data.foldername
          }
        },
        children: 'childList',
        isLeaf: function(data, node) {
          if (data.parent) {
            return false
          } else {
            return true
          }
        },
        disabled: function(data, node) {
          if (data.system == 'regulation') {
            return false
          } else {
            return true
          }
        }
      },
      forlderId: '',
      systemChapterIndex: 0,
      terminologyIndex: 0,
      enterpriseStandardSelected: [],
      organieationShow: false,
      selectedElement: {},
      sysProcessRelations: [],
      showElement: [],
      selectElement: ['9'],
      orgtitle: '选择人员',
      showtype: '',
      noEditing: true
    }
  },
  computed: {
    currentOrg() {
      return this[this.orgType]
    },
    host() {
      return process.env.HOST_URL + process.env.BASE_URL
    },
    download() {
      return this.host + '/regulation/download/'
    },
    viewfile() {
      return this.host + '/document/print/'
    },
    userid() {
      return JSON.parse(localStorage.getItem('portalCurrentUserInfo') || '{}')
        .empuid
    },
    username() {
      return JSON.parse(localStorage.getItem('portalCurrentUserInfo') || '{}')
        .cnname
    },
    host2() {
      return process.env.VUE_APP_HOST_URL
    },
    html() {
      return process.env.VUE_APP_BPA_HTML_URL
    }
  },
  watch: {
    value(val) {
      if (val) {
        console.log(this.processState)
        const exclusions = ['6', '8'] // 这些状态码不可编辑
        console.log(this.currentCardType)
        if (this.currentCardType === 'view' || exclusions.includes(this.processState)) {
          this.noEditing = false
        } else {
          this.noEditing = true
        }
        console.log('this.noEditing', this.noEditing)
        this.attrsForm.zhiduList = [
          {
            zhiduName: '',
            zhiduId: '',
            zhangjieList: [
              {
                zhangjieId: '',
                zhangjieName: ''
              }
            ]
          }
        ]
        this.referClose = false
        this.isDialogsVisible = val
        this.editableTabsValue = '0'
        this.getInterList()
        this.getShowTablist().then(() => {
          this.tabsClick()
        })
      }
    },
    isDialogsVisible(val) {
      this.$emit('input', val)
    },
    'attrsForm.distribution'(val) {
      val = !val ? [] : JSON.parse(val).orglist
      this.$set(
        this.attrsForm,
        'disScopeformat',
        val
          .map(item => {
            return item.name
          })
          .join(',')
      )
      if (!this.referClose) {
        this.rebackDataOther.disScopeformat = val
          .map(item => {
            return item.name
          })
          .join(',')
      }
    },
    'attrsForm.orgscope1'(val) {
      console.log(val)
      val = !val ? [] : JSON.parse(val).orglist
      console.log(val)
      this.$set(
        this.attrsForm,
        'scopeFormat1',
        val
          .map(item => {
            return item.name
          })
          .join(',')
      )
      if (!this.referClose) {
        this.rebackDataOther.scopeFormat1 = val
          .map(item => {
            return item.name
          })
          .join(',')
      }
    },
    'attrsForm.orgscope2'(val) {
      console.log(val)
      val = !val ? [] : JSON.parse(val).orglist
      console.log(val)
      this.$set(
        this.attrsForm,
        'scopeFormat2',
        val
          .map(item => {
            return item.name
          })
          .join(',')
      )
      if (!this.referClose) {
        this.rebackDataOther.scopeFormat2 = val
          .map(item => {
            return item.name
          })
          .join(',')
      }
    },
    'attrsForm.orgscope3'(val) {
      console.log(val)
      val = !val ? [] : JSON.parse(val).orglist
      console.log(val)
      this.$set(
        this.attrsForm,
        'scopeFormat3',
        val
          .map(item => {
            return item.name
          })
          .join(',')
      )
      if (!this.referClose) {
        this.rebackDataOther.scopeFormat3 = val
          .map(item => {
            return item.name
          })
          .join(',')
      }
    },
    'attrsForm.codistribution'(val) {
      val = !val ? [] : JSON.parse(val).orglist
      this.$set(
        this.attrsForm,
        'codisScopeformat',
        val
          .map(item => {
            return item.name
          })
          .join(',')
      )
      if (!this.referClose) {
        this.rebackDataOther.codisScopeformat = val
          .map(item => {
            return item.name
          })
          .join(',')
      }
    }
  },
  async mounted() {
    const res = await this.getSysList()
    console.log('获取体系标准文件--2-->', res)
    const { syslists, obj, syslistsname } = res
    this.syslistsRepeat = syslists
    this.syslistsname = syslistsname
    this.syspart = obj
  },
  methods: {
    showChoose(type) {
      this.showtype = type
      this.selectedID = []
      this.isGroupDialogVisible = true
      if (!this.attrsForm.consultList) return false
      this.attrsForm.consultList.forEach(item => {
        this.selectedID.push({
          ID: parseInt(item.empuid),
          name: item.value,
          TYPE: item.type,
          PID: item.pid,
          person: {
            cnname: item.cnname,
            empid: item.empuid
          }
        })
      })
    },
    handlerChapterSelect(data) {
      this.attrsForm.systemProcessRelations.forEach(item => {
        if (item.id === data.id) {
          item.selectChapterData = data.selectChapterData
        }
      })
    },
    // 体系列表选择章节
    selectSystemProcess(system) {
      this.selectSys = JSON.parse(JSON.stringify(system))
      this.selectChapterDialogVisible = true
      this.$refs.ceshi.selectSystemProcess(this.selectSys)
      this.$refs.ceshi.chapterDialogsVisible = true
      // querySectionBySystemId(system.systemid).then((res) => {
      //   // this.sysProRelationsOptions = res
      // })
    },
    deleteSystemProcess(item, index) {
      this.attrsForm.systemProcessRelations.splice(index, 1)
      this.sysProcessRelations.splice(
        this.sysProcessRelations.indexOf(item.id),
        1
      )
    },
    // 体系列表
    getInterList() {
      getInterList({
        pageSize: 9999,
        pageNum: 1,
        total: 100
      }).then(res => {
        this.sysProRelationsOptions = res.list
      })
    },
    getFilterTreeList(node, resolve) {
      const id = node.data ? node.data.id : '0'
      getRuleIframeTree(id).then(res => {
        if (!res) return false
        if (id === '0') {
          this.$emit('conClick', {
            node: node,
            data: res[0]
          })
          this.expandedList = [res[0].id]
        }
        resolve(res)
      })
    },
    delSystemChapter(index) {
      this.attrsForm.zhiduList.splice(index, 1)
      this.$message({
        type: 'success',
        message: '删除成功'
      })
    },
    addSystemChapter() {
      this.attrsForm.zhiduList.push({
        zhiduName: '',
        zhiduId: '',
        zhangjieList: [
          {
            zhangjieId: '',
            zhangjieName: ''
          }
        ]
      })
    },
    selectTerminology(index) {
      this.terminologyIndex = index
      this.terminologyVisible = true
    },
    selectTerminologyConfirm(data) {
      this.$set(
        this.attrsForm.termlist,
        this.terminologyIndex,
        Object.assign({}, this.attrsForm.termlist[this.terminologyIndex], {
          term: data.term,
          termdetail: data.termdetail,
          foldername: data.foldername,
          folderid: data.folderid
        })
      )
    },
    selectEnterpriseStandard() {
      this.enterpriseStandardSelected = []
      if (
        this.attrsForm.enterpriseStandardName &&
        this.attrsForm.enterpriseStandardId
      ) {
        let ennameArr = this.attrsForm.enterpriseStandardName.split(',')
        let docIdArr = this.attrsForm.enterpriseStandardId.split(',')
        this.enterpriseStandardSelected = ennameArr.map((item, index) => {
          return {
            enname: item,
            docId: docIdArr[index]
          }
        })
      }
      this.enterpriseStandardVisible = true
    },
    selectEnterpriseStandardConfirm(list) {
      this.$set(
        this.attrsForm,
        'enterpriseStandardName',
        list.map(item => item.enname).join()
      )
      this.$set(
        this.attrsForm,
        'enterpriseStandardId',
        list.map(item => item.docId).join()
      )
      const standardReleViews = list.map(item => {
        return {
          docid: item.docId
        }
      })
      this.$set(this.attrsForm, 'standardReleViews', standardReleViews)
    },
    selectProcessManager(type) {
      this.currentPersonType = type
      this.selectedElement = {}
      if (type === 'processmanagerName') {
        if (
          this.attrsForm.processmanager &&
          this.attrsForm.processmanagerName
        ) {
          let list = this.attrsForm.processmanagerName.split(',').join('&')
          let idType = []
          this.attrsForm.processmanager.split(',').forEach((item, i) => {
            idType.push(`${item}-9`)
          })
          this.selectedElement = {
            id: this.attrsForm.processmanager.split(','),
            name: list,
            idType: idType.join(';')
          }
        }
      } else if (type === 'standby8') {
        if (this.attrsForm.standby7 && this.attrsForm.standby8) {
          let list = this.attrsForm.standby8.split(',').join('&')
          let idType = []
          this.attrsForm.standby7.split(',').forEach((item, i) => {
            idType.push(`${item}-9`)
          })
          this.selectedElement = {
            id: this.attrsForm.standby7.split(','),
            name: list,
            idType: idType.join(';')
          }
        }
      } else if (type === 'standby10') {
        if (this.attrsForm.standby9 && this.attrsForm.standby10) {
          let list = this.attrsForm.standby10.split(',').join('&')
          let idType = []
          this.attrsForm.standby9.split(',').forEach((item, i) => {
            idType.push(`${item}-9`)
          })
          this.selectedElement = {
            id: this.attrsForm.standby9.split(','),
            name: list,
            idType: idType.join(';')
          }
        }
      } else if (type === 'standby12') {
        if (this.attrsForm.standby11 && this.attrsForm.standby12) {
          let list = this.attrsForm.standby12.split(',').join('&')
          let idType = []
          this.attrsForm.standby11.split(',').forEach((item, i) => {
            idType.push(`${item}-9`)
          })
          this.selectedElement = {
            id: this.attrsForm.standby11.split(','),
            name: list,
            idType: idType.join(';')
          }
        }
      }
      this.organieationShow = true
    },
    fnBasOrganieationCallBack(data) {
      if (this.currentPersonType === 'processmanagerName') {
        this.$set(this.attrsForm, 'processmanager', data.id)
        this.$set(
          this.attrsForm,
          'processmanagerName',
          data.name.split('&').join(',')
        )
      } else if (this.currentPersonType === 'standby8') {
        this.$set(this.attrsForm, 'standby7', data.id)
        this.$set(this.attrsForm, 'standby8', data.name.split('&').join(','))
      } else if (this.currentPersonType === 'standby10') {
        this.$set(this.attrsForm, 'standby9', data.id)
        this.$set(this.attrsForm, 'standby10', data.name.split('&').join(','))
      } else if (this.currentPersonType === 'standby12') {
        this.$set(this.attrsForm, 'standby11', data.id)
        this.$set(this.attrsForm, 'standby12', data.name.split('&').join(','))
      }

      this.organieationShow = false
    },
    selectRuleConfirm(data) {
      this.$set(
        this.attrsForm.zhiduList[this.systemChapterIndex],
        'zhiduName',
        data.title
      )
      this.$set(
        this.attrsForm.zhiduList[this.systemChapterIndex],
        'zhiduId',
        data.docId
      )
    },
    selectRule(index) {
      // this.defaultList = []
      // if (this.attrsForm.zhiduId) {
      //   this.attrsForm.zhiduId.split(',').forEach((item, index) => {
      //     this.defaultList.push({
      //       foldername: this.attrsForm.zhiduName
      //         ? this.attrsForm.zhiduName.split(',')[index]
      //         : '',
      //       id: item
      //     })
      //   })
      // }
      // this.$nextTick(() => {
      //   this.$refs.asyncTree.setCheckedNodes(this.defaultList)
      // })
      this.systemChapterIndex = index
      this.rulesVisible = true
    },
    selectChapterConfirm(data) {
      this.$set(
        this.attrsForm.zhiduList[this.systemChapterIndex].zhangjieList[0],
        'zhangjieName',
        data.content
      )
      this.$set(
        this.attrsForm.zhiduList[this.systemChapterIndex].zhangjieList[0],
        'zhangjieId',
        data.id
      )
      this.$set(
        this.attrsForm.zhiduList[this.systemChapterIndex],
        'zhiduName',
        data.dm
      )
      this.$set(
        this.attrsForm.zhiduList[this.systemChapterIndex],
        'zhiduId',
        data.dmid
      )
    },
    selectChapte(index) {
      this.systemChapterIndex = index
      this.chapterVisible = true
    },
    delCheckedData(item) {
      for (let i = 0; i < this.defaultList.length; i++) {
        if (this.defaultList[i].id === item.id) {
          this.defaultList.splice(i, 1)
          break
        }
      }
      this.$refs.asyncTree.setCheckedNodes(this.defaultList)
    },
    handlerNodeChecked(item, isChecked) {
      if (isChecked) {
        let count = 0
        for (let i = 0; i < this.defaultList.length; i++) {
          if (this.defaultList[i].id === item.id) {
            count++
          }
        }
        if (!count) {
          this.defaultList.push(item)
        }
      } else {
        for (let i = 0; i < this.defaultList.length; i++) {
          if (this.defaultList[i].id === item.id) {
            this.defaultList.splice(i, 1)
            break
          }
        }
      }
    },
    delCheckedDatas(item) {
      for (let i = 0; i < this.defaultLists.length; i++) {
        if (this.defaultLists[i].id === item.id) {
          this.defaultLists.splice(i, 1)
          break
        }
      }
      this.$refs.chapterTree.setCheckedNodes(this.defaultLists)
    },
    handlerNodeCheckeds(item, isChecked) {
      if (isChecked) {
        let count = 0
        for (let i = 0; i < this.defaultLists.length; i++) {
          if (this.defaultLists[i].id === item.id) {
            count++
          }
        }
        if (!count) {
          this.defaultLists.push(item)
        }
      } else {
        for (let i = 0; i < this.defaultLists.length; i++) {
          if (this.defaultLists[i].id === item.id) {
            this.defaultLists.splice(i, 1)
            break
          }
        }
      }
    },
    handleCheckedSysProChange(value) {
      console.log(value)
      let data = []
      console.log(
        this.attrsForm.systemProcessRelations,
        'this.attrsForm.systemProcessRelations'
      )
      value.forEach(list => {
        data.push(this.sysProRelationsOptions.find(item => list === item.id))
      })
      let systemProcessRelations = JSON.parse(
        JSON.stringify(
          this.attrsForm.systemProcessRelations
            ? this.attrsForm.systemProcessRelations
            : []
        )
      )
      this.attrsForm.systemProcessRelations = data
      this.attrsForm.systemProcessRelations.forEach(item => {
        this.$set(item, 'selectChapterData', null)
        systemProcessRelations.forEach(list => {
          if (item.id === list.id) {
            item.selectChapterData = list.selectChapterData
          }
        })
      })
    },
    // 选择制度
    getFilterRuleTreeList(node, resolve) {
      const id = node.data ? node.data.id : '0'
      getSystemFolderCopy(id).then(res => {
        if (!res) return false
        if (id === '0') {
          this.expandedRuleList = [res[0].id]
        }
        resolve(res)
      })
    },
    confirmSystem(data) {
      this.attrsForm.zhiduName = data.map(item => item.name).join(',')
      this.attrsForm.zhiduId = data.map(item => item.id).join(',')
      this.systemVisible = false
    },
    // 获取体系标准文件 从字典获取
    async getSysList() {
      let res = await getDictionaryOption({ dictionaryen: '体系分类' })
      console.log('获取体系标准文件--1-->', res)
      if (!res) return
      const obj = {}
      const objName = {}
      res = res.map(item => {
        obj[item.text] = {
          show: false,
          desc: '',
          selected: [],
          uploaded: []
        }
        objName[item.text] = {
          cnname: item.text,
          enname: item.text
        }
        return item.text
      })
      return new Promise(resolve => {
        resolve({ syslists: res, obj, syslistsname: objName })
      })
    },
    // 获取体系标准文件 （原有接口，已用 getSysList 字典接口代替）
    async getSystemList() {
      let res = await getSystemList({
        filters: [
          {
            key: 'process_design_is_visible',
            opt: 'EQ',
            type: 'S',
            value: 'Y'
          }
        ]
      })
      console.log('获取体系标准文件--1-->', res)
      if (!res) return
      const obj = {}
      const objName = {}
      res = res.map(item => {
        obj[item.system_name] = {
          show: false,
          desc: '',
          selected: [],
          uploaded: []
        }
        objName[item.system_name] = {
          cnname: item.system_cnname,
          enname: item.system_enname
        }
        return item.system_name
      })
      return new Promise(resolve => {
        resolve({ syslists: res, obj, syslistsname: objName })
      })
    },
    // tab切换
    tabsClick() {
      switch (true) {
        // 获取流程基本属性
        case this.editableTabsValue == '0':
          if (!this.referClose) {
            this.getProcessAttr()
          }
          this.editableTabs.forEach(item => {
            if (item.index == 0) {
              this.getShowTabField(item.id, 0)
              return false
            }
          })
          break
        // 获取流程支持文件
        case this.editableTabsValue == '1':
          this.referClose = true
          this.forlderId = '7A88EC3856C446EBE053BF1A13ACC390'
          this.editableTabs.forEach(item => {
            if (item.index == 1) {
              this.getShowTabField(item.id, 1)
              return false
            }
          })
          break
        // 获取流程绩效
        case this.editableTabsValue == '2':
          this.referClose = true
          this.editableTabs.forEach(item => {
            if (item.index == 2) {
              this.getShowTabField(item.id, 2)
              return false
            }
          })
          break
        // 获取关键风险控制点
        case this.editableTabsValue == '3':
          this.referClose = true
          this.editableTabs.forEach(item => {
            if (item.index == 3) {
              this.getShowTabField(item.id, 3)
              return false
            }
          })
          break
        // 关键成功要素
        case this.editableTabsValue == '4':
          this.referClose = true
          this.editableTabs.forEach(item => {
            if (item.index == 4) {
              this.getShowTabField(item.id, 4)
              return false
            }
          })
          break
        // 业务规则
        case this.editableTabsValue == '5':
          this.referClose = true
          this.forlderId = '7BC636EDF11967C0E0530701A8C06A7D'
          this.editableTabs.forEach(item => {
            if (item.index === 5) {
              this.getShowTabField(item.id, 5)
              return false
            }
          })
          break
        // 流程活动说明
        case this.editableTabsValue == '6':
          this.referClose = true
          this.editableTabs.forEach(item => {
            if (item.index == 6) {
              this.getShowTabField(item.id, 6)
              return false
            }
          })
          break
        // 修订记录
        case this.editableTabsValue == '7':
          this.referClose = true
          this.editableTabs.forEach(item => {
            if (item.index == 7) {
              this.getShowTabField(item.id, 7)
              return false
            }
          })
          break
        // 相关支撑性内容
        case this.editableTabsValue == '11':
          this.referClose = true
          this.editableTabs.forEach(item => {
            if (item.index == 11) {
              this.getShowTabField(item.id, 11)
              return false
            }
          })
          break
        // 规章制度管理
        case this.editableTabsValue == '13':
          this.referClose = true
          this.editableTabs.forEach(item => {
            if (item.index == 13) {
              this.getShowTabField(item.id, 13)
              return false
            }
          })
          break
        // 工具库
        case this.editableTabsValue == '16':
          this.referClose = true
          this.editableTabs.forEach(item => {
            if (item.index == 16) {
              this.getShowTabField(item.id, 16)
              return false
            }
          })
          break
        //业务对象
        case this.editableTabsValue == '15':
          this.referClose = true
          this.editableTabs.forEach(item => {
            if (item.index == 15) {
              this.getShowTabField(item.id, 15)
              return false
            }
          })
          break
        //权限执行表
        case this.editableTabsValue == '9':
          this.referClose = true
          this.editableTabs.forEach(item => {
            if (item.index == 9) {
              this.getShowTabField(item.id, 9)
              return false
            }
          })
          break
        //修订内容
        case this.editableTabsValue == '10':
          this.referClose = true
          this.editableTabs.forEach(item => {
            if (item.index == 10) {
              this.getShowTabField(item.id, 10)
              return false
            }
          })
          break
      }
    },
    // 获取Tab栏标题的显示字段的名称
    async getShowTablist() {
      const res = await controlField({
        attr: {},
        filters: [{ key: 'sheetType', opt: 'EQ', type: 'S', value: '0' }],
        logic: 'and',
        orderby: 'createon',
        pageNum: 1,
        pageSize: 100,
        sort: 'desc'
      })
      this.editableTabs = []
      res.list.forEach(item => {
        if (item.state == '1') {
          this.editableTabs.push({
            index: parseInt(item.sort),
            name: item.name,
            enname: item.enname,
            id: item.id
          })
        }
      })
      return new Promise((resolve, reject) => {
        resolve()
      })
    },
    // 获取显示Tab字段的名称/表格内容
    async getShowTabField(id, type) {
      const res = await tabField({
        attr: {},
        filters: [{ key: 'sheetid', opt: 'LIKE', type: 'S', value: id }],
        logic: 'and',
        orderby: 'createon',
        pageNum: 1,
        pageSize: 100,
        sort: 'desc'
      })
      this.showtabfiled = []
      res.list.forEach(item => {
        if (item.state == '1') {
          this.showtabfiled.push({
            name: item.name,
            enname: item.enname,
            pname: item.pname,
            necessary: item.necessary
          })
        }
      })
      if (type == 0) {
        this.syslists.forEach(item => {
          if (!this.showtabfiled.some((value, index) => value.pname == item)) {
            this.syslists.splice(this.syslists.indexOf(item), 1)
          }
        })
      }
    },
    existTab(index, type) {
      let obj = {}
      this.editableTabs.forEach(item => {
        if (item.index === parseInt(index)) {
          obj = JSON.parse(JSON.stringify(item))
          return false
        }
      })
      const lang = localStorage.getItem('language')
      if (type == 'refer') {
        return !obj.index ? obj.index === 0 : true
      } else {
        let showname
        if (!obj.index) {
          if (obj.index === 0) {
            if (lang === 'cn') {
              showname = obj.name
            } else {
              showname = obj.enname
            }
          }
        } else {
          if (lang === 'cn') {
            showname = obj.name
          } else {
            showname = obj.enname
          }
        }
        // return !obj.index ? (obj.index === 0 ? obj.name : '') : obj.name
        return showname
      }
    },
    existTabField(pname, type, bool) {
      let obj = {}
      this.showtabfiled.forEach(item => {
        if (item.pname === pname) {
          obj = JSON.parse(JSON.stringify(item))
          return false
        }
      })
      const lang = localStorage.getItem('language')
      if (type == 'refer') {
        return !!obj.pname
      } else if (type == 'necessary') {
        return obj.necessary == '1'
      } else {
        return obj.pname && lang === 'cn'
          ? obj.name + (!bool ? ':' : '')
          : obj.pname && lang === 'en'
          ? obj.enname + (!bool ? ':' : '')
          : obj.enname + (!bool ? ':' : '')
      }
    },
    // 点击选择事件
    distributeClick(orgType) {
      this.orgType = orgType

      this.isdisVisible = true
    },
    // 点击选择事件
    codistributeClick() {
      this.iscodisVisible = true
    },
    chooseRuler() {
      this.showtype = 'ruler'
      this.selectedID = []
      this.isGroupDialogVisible = true
      if (!this.attrsForm.ruler) return false
      this.attrsForm.ruler.forEach(item => {
        this.selectedID.push({
          ID: parseInt(item.empuid),
          NAME: item.value,
          name: item.value,
          TYPE: item.TYPE,
          type: item.TYPE,
          PID: item.PID,
          pid: item.PID,
          person: {
            cnname: item.cnname,
            empid: item.userid
          }
        })
      })
    },
    handlerGroupSelect(list) {
      if (this.showtype == 'consultmanager') {
        const arr2 = []
        for (let i = 0; i < list.length; i++) {
          const consultmanagerList = {
            cnname: '',
            loadChildren: '',
            modelid: '',
            pid: '',
            sort: 0,
            type: '',
            empuid: '',
            value: ''
          }
          consultmanagerList.cnname = list[i].person.name
          consultmanagerList.empuid = list[i].memberId
          consultmanagerList.pid = list[i].pid
          consultmanagerList.type = list[i].type
          consultmanagerList.empuid = list[i].person.groupId
          consultmanagerList.value = list[i].name
          arr2.push(consultmanagerList)
        }
        this.attrsForm.consultList = arr2
      } else {
        const arr = []
        for (let i = 0; i < list.length; i++) {
          const managerList = {
            cnname: '',
            empuid: '',
            loadChildren: '',
            modelid: '',
            pid: '',
            sort: 0,
            type: '',
            value: ''
          }
          managerList.cnname = list[i].person.name
          managerList.empuid = list[i].memberId
          managerList.pid = list[i].pid
          managerList.type = list[i].type
          managerList.empuid = list[i].person.groupId
          managerList.value = list[i].name
          arr.push(managerList)
        }
        this.attrsForm.ruler = arr
      }
    },
    // 术语部分
    reuqireDownData(bool) {
      if (bool) {
        getTerminologyList({
          filters: [{ key: 'term', opt: 'LIKE', type: 'S', value: null }],
          orderby: 'createon',
          pageNum: 1,
          pageSize: 999,
          sort: 'desc'
        }).then(res => {
          this.termlists = res.list
        })
      }
    },
    // 清除术语
    minusTerm(index) {
      this.attrsForm.termlist.splice(index, 1)
      this.$message({
        type: 'success',
        message: '删除成功'
      })
    },
    // 添加术语
    plusTerm() {
      this.attrsForm.termlist.push({
        term: '',
        termdetail: '',
        foldername: '',
        folderid: ''
      })
    },
    handleCommand(data) {
      this.$set(
        this.attrsForm.termlist,
        data.pindex,
        Object.assign({}, this.attrsForm.termlist[data.pindex], {
          term: data.value.term,
          termdetail: data.value.termdetail
        })
      )
    },
    // 修改生效时间影响下次修改时间的
    changeEffectTime() {
      if (!this.attrsForm.nextTime) {
        const effectTime = new Date(this.attrsForm.effectTime)
        const nextTime =
          effectTime.getFullYear() +
          3 +
          '-' +
          (effectTime.getMonth() + 1) +
          '-' +
          effectTime.getDate()
        this.$set(this.attrsForm, 'nextTime', nextTime)
      }
    },
    // 获取流程基本属性表格属性字段
    getProcessAttr() {
      const self = this
      Promise.all([
        processattrs(self.modelid),
        processStartOrEnd(self.bpmid)
      ]).then(res => {
        const resAttr = res[0]
        console.log('++++:' + resAttr)
        const response = res[1]
        this.distribution = resAttr
        this.orgscope1 = resAttr
        this.orgscope2 = resAttr
        this.orgscope3 = resAttr
        console.log('++++:' + this.distribution)

        this.codistribution = resAttr
        // -------------------起点&&终点------------开始
        const result = !response
          ? []
          : !response.json
          ? []
          : JSON.parse(response.json).controls
        const lines = !response
          ? []
          : !response.json
          ? []
          : JSON.parse(response.json).lines
        // 起点部分
        const startprocessId = []
        const startprocess = []
        // 终点部分
        const endprocessId = []
        const endprocess = []
        if (result) {
          result.forEach(function(obj) {
            if (obj.type == 'processStart') {
              lines.forEach(function(line) {
                if (line.from === obj.id) {
                  startprocessId.push(line.to)
                }
              })
            }
            if (obj.type == 'processEnd') {
              lines.forEach(function(line) {
                if (line.to === obj.id) {
                  endprocessId.push(line.from)
                }
              })
            }
          })
          for (var i = 0; i < startprocessId.length; i++) {
            for (var j = 0; j < result.length; j++) {
              var obj = result[j]
              if (startprocessId[i] == obj.id) {
                startprocess.push(obj.name)
              }
            }
          }
          for (var i = 0; i < endprocessId.length; i++) {
            for (var j = 0; j < result.length; j++) {
              var obj = result[j]
              if (endprocessId[i] == obj.id) {
                endprocess.push(obj.name)
              }
            }
          }
        }
        // -------------------起点&&终点------------结束

        // 清除体系分类数据
        for (const obj of Object.entries(this.syspart)) {
          this.syspart[obj[0]] = Object.assign({}, this.syspart[obj[0]], {
            show: false,
            desc: '',
            selected: [],
            uploaded: []
          })
        }
        const syslist = []
        resAttr.bpmDto.syslist.forEach(item => {
          if (this.syslistsRepeat.includes(item.typename)) {
            if (syslist.indexOf(item.typename) === -1) {
              syslist.push(item.typename)
            }
            this.syspart[item.typename].show = true
            this.syspart[item.typename].desc = item.description
            this.syspart[item.typename].selectedList = []
            if (item.docid) {
              this.syspart[item.typename].uploaded.push(item)
            }
          }
        })
        // 对象合并
        let nextTime = ''
        if (resAttr.bpmDto.effectiveon) {
          const effectTime = new Date(resAttr.bpmDto.effectiveon)
          nextTime =
            effectTime.getFullYear() +
            3 +
            '-' +
            (effectTime.getMonth() + 1) +
            '-' +
            effectTime.getDate()
        }
        // 三峡体系
        this.sysProcessRelations = []
        if (resAttr.bpmDto.selectsys && resAttr.bpmDto.selectsys.length > 0) {
          resAttr.bpmDto.selectsys.forEach(item => {
            this.sysProcessRelations.push(item.id)
          })
        }
        if (
          resAttr.bpmDto.systemProcessRelations &&
          resAttr.bpmDto.systemProcessRelations.length > 0
        ) {
          resAttr.bpmDto.systemProcessRelations.forEach(item => {
            this.sysProcessRelations.push(item.id)
            this.$set(resAttr.bpmDto, 'selectsys', item)
          })
        }
        if (!resAttr.bpmDto.systemProcessRelations) {
          this.$set(resAttr.bpmDto, 'systemProcessRelations', [])
        }
        this.attrsForm = Object.assign({}, this.attrsForm, {
          id: resAttr.bpmDto.id,
          processowner: resAttr.bpmDto.bponame,
          processid: resAttr.bpmDto.bpo,
          processname: resAttr.bpmDto.name,
          versions: resAttr.bpmDto.version,
          processcode: resAttr.bpmDto.processcode,
          level: resAttr.bpmDto.hierarchy,
          code: resAttr.bpmDto.code,
          zhiduName: resAttr.bpmDto.zhiduName,
          zhangjieName: resAttr.bpmDto.zhangjieName,
          zhangjieId: resAttr.bpmDto.zhangjieId,
          zhiduId: resAttr.bpmDto.zhiduId,
          manageTypes: resAttr.bpmDto.managetypes || '', // 管理标准类型:
          manageClassification: resAttr.bpmDto.manageclassification || '', // 管理标准归类:
          processframeworkname: resAttr.bpmDto.processframeworkname || '', // 流程框架名称:
          supactivities: resAttr.bpmDto.supactivities || '', // 关键活动补充说明:
          // systemProcessRelations: resAttr.bpmDto.selectsys.push(...resAttr.bpmDto.systemProcessRelations), // 体系选择章节
          systemProcessRelations: resAttr.bpmDto.selectsys, // 体系选择章节
          // 生效时间
          effectTime: resAttr.bpmDto.effectiveon,
          // 下次修改时间
          nextTime: !resAttr.bpmDto.effectiveon ? '' : nextTime,
          // processowner: resAttr.bpmDto.managerList
          //   .map((item) => {
          //     return item.value;
          //   })
          //   .join(","),
          // 流程责任人
          singer: resAttr.bpmDto.signername || this.username,
          // 上级流程责任人
          upowner: resAttr.bpmDto.upmanagerList
            .map(item => {
              return item.value
            })
            .join(','),
          desc: resAttr.bpmDto.description,
          target: resAttr.bpmDto.purpose,
          fitscope: resAttr.bpmDto.scope,
          standby1: resAttr.bpmDto.standby1,
          standby2: resAttr.bpmDto.standby2,
          standby3: resAttr.bpmDto.standby3,
          standby4: resAttr.bpmDto.standby4,
          standby5: resAttr.bpmDto.standby5,
          standby6: resAttr.bpmDto.standby6,
          distribution: resAttr.bpmDto.distribution,
          orgscope1: resAttr.bpmDto.orgscope1,
          orgscope2: resAttr.bpmDto.orgscope2,
          orgscope3: resAttr.bpmDto.orgscope3,
          codistribution: resAttr.bpmDto.codistribution,
          startpoint: startprocess.join(','),
          endpoint: endprocess.join(','),
          upStream: !resAttr.bpmDto.inputnamelist
            ? []
            : resAttr.bpmDto.inputnamelist,
          downStream: !resAttr.bpmDto.outputnamelist
            ? []
            : resAttr.bpmDto.outputnamelist,
          processInput: !!(
            !!resAttr.bpmDto.input || !!resAttr.bpmDto.inputlist
          ),
          processInputDesc: resAttr.bpmDto.input,
          processUpInput: resAttr.bpmDto.inlist,
          processFileInput: resAttr.bpmDto.inputlist,
          processOutput: !!(
            !!resAttr.bpmDto.output || !!resAttr.bpmDto.outputlist
          ),
          processOutputDesc: resAttr.bpmDto.output,
          processchartOutput: resAttr.bpmDto.outlist,
          processFileOutput: resAttr.bpmDto.outputlist,
          systemlist: syslist,
          standardReleViews: resAttr.bpmDto.standardReleViews,
          processmanagerName: resAttr.bpmDto.processmanagerName,
          standby8: resAttr.bpmDto.standby8,
          standby10: resAttr.bpmDto.standby10,
          standby12: resAttr.bpmDto.standby12,
          processmanager: resAttr.bpmDto.processmanager,
          standby7: resAttr.bpmDto.standby7,
          standby9: resAttr.bpmDto.standby9,
          standby11: resAttr.bpmDto.standby11,
          enterpriseStandardName:
            resAttr.bpmDto.standardReleViews &&
            resAttr.bpmDto.standardReleViews.length > 0
              ? resAttr.bpmDto.standardReleViews
                  .map(item => item.docName)
                  .join()
              : '',
          enterpriseStandardId:
            resAttr.bpmDto.standardReleViews &&
            resAttr.bpmDto.standardReleViews.length > 0
              ? resAttr.bpmDto.standardReleViews.map(item => item.docid).join()
              : '',
          termlist:
            resAttr.bpmDto.termlist.length > 0
              ? resAttr.bpmDto.termlist
              : [{ term: '', termdetail: '' }],
          rulename: !resAttr.bpmDto.modelInstitution
            ? ''
            : resAttr.bpmDto.modelInstitution.name,
          rulecode: !resAttr.bpmDto.modelInstitution
            ? ''
            : resAttr.bpmDto.modelInstitution.code,
          ruleperson: !resAttr.bpmDto.modelInstitution
            ? []
            : resAttr.bpmDto.modelInstitution.editor,
          ruler: !resAttr.bpmDto.modelInstitution
            ? []
            : resAttr.bpmDto.modelInstitution.liaisons,
          ruledesc: !resAttr.bpmDto.modelInstitution
            ? ''
            : resAttr.bpmDto.modelInstitution.description,
          rulereason: !resAttr.bpmDto.modelInstitution
            ? ''
            : resAttr.bpmDto.modelInstitution.reason,
          ruleid: !resAttr.bpmDto.modelInstitution
            ? ''
            : resAttr.bpmDto.modelInstitution.id,
          //咨询人

          // consultList
          consultmanagername: !resAttr.bpmDto.consultmanagerList
            ? ''
            : resAttr.bpmDto.consultmanagerList.name,
          consultmanagercode: !resAttr.bpmDto.consultmanagerList
            ? ''
            : resAttr.bpmDto.consultmanagerList.code,
          consultmanagerperson: !resAttr.bpmDto.consultmanagerList
            ? []
            : resAttr.bpmDto.consultmanagerList.editor,
          consultList: !resAttr.bpmDto.consultList
            ? []
            : resAttr.bpmDto.consultList,
          consultmanagerdesc: !resAttr.bpmDto.consultmanagerList
            ? ''
            : resAttr.bpmDto.consultmanagerList.description,
          consultmanagerreason: !resAttr.bpmDto.consultmanagerList
            ? ''
            : resAttr.bpmDto.consultmanagerList.reason,
          consultmanagerid: !resAttr.bpmDto.consultmanagerList
            ? ''
            : resAttr.bpmDto.consultmanagerList.id
        })
        const zhiduList =
          !resAttr.bpmDto.zhiduList || resAttr.bpmDto.zhiduList.length === 0
            ? [
                {
                  zhiduName: '',
                  zhiduId: '',
                  zhangjieList: [
                    {
                      zhangjieId: '',
                      zhangjieName: ''
                    }
                  ]
                }
              ]
            : resAttr.bpmDto.zhiduList
        if (
          !resAttr.bpmDto.zhiduList ||
          resAttr.bpmDto.zhiduList.length === 0
        ) {
          this.$set(this.attrsForm, 'zhiduList', zhiduList)
        } else {
          this.$set(this.attrsForm, 'zhiduList', [])
          zhiduList.forEach(item => {
            if (!item.zhangjieList || item.zhangjieList.length === 0) {
              this.$set(item, 'zhangjieList', [
                {
                  zhangjieId: '',
                  zhangjieName: ''
                }
              ])
            }
            item.zhangjieList.forEach((val, index) => {
              this.attrsForm.zhiduList.push({
                zhiduName: item.zhiduName,
                zhiduId: item.zhiduId,
                zhangjieList: [val]
              })
            })
          })
        }
        this.rebackDataOther = JSON.parse(
          JSON.stringify(
            Object.assign({}, this.rebackDataOther, this.attrsForm)
          )
        )
        this.rebackData = JSON.parse(
          JSON.stringify(Object.assign({}, this.rebackData, this.syspart))
        )
      })
    },
    // 重置表单
    resetCard() {
      this.$confirm(
        this.existTabField(
          'areYouSureResetSomeOfTheInformationYouFilledIn',
          '',
          true
        ),
        this.$t('hintText.hint'),
        {
          confirmButtonText: this.$t('confirm'),
          cancelButtonText: this.$t('cancel'),
          type: 'warning'
        }
      )
        .then(() => {
          this.attrsForm = Object.assign({}, this.attrsForm, {
            effectTime: '',
            nextTime: '',
            desc: '',
            target: '',
            fitscope: '',
            standby1: '',
            standby2: '',
            standby3: '',
            standby4: '',
            standby5: '',
            standby6: '',
            termlist: [
              {
                term: '',
                termdetail: ''
              }
            ],
            zhiduList: [
              {
                zhiduName: '',
                zhiduId: '',
                zhangjieList: [
                  {
                    zhangjieId: '',
                    zhangjieName: ''
                  }
                ]
              }
            ]
          })
          this.processcode = ''
          this.sysProcessRelations = []
        })
        .catch(err => {})
    },
    // 保存流程卡片
    saveProcessCard(type, fn) {
      const self = this
      const syslist = []
      this.$refs.attrsFormRef.validate(async valid => {
        if (valid) {
          if (!!this.attrsForm.nextTime && !!this.attrsForm.effectTime) {
            if (
              new Date(this.attrsForm.nextTime) <
              new Date(this.attrsForm.effectTime)
            ) {
              this.$message({
                message: this.existTabField(
                  'theNextRevisionShouldNotBeLessThanTheEffectiveDate',
                  '',
                  true
                ),
                type: 'warning'
              })
              return false
            }
          }
          // 处理体系分类的数据--------------------------------开始
          for (const obj of Object.entries(this.syspart)) {
            if (obj[1].show) {
              for (let i = 0; i < obj[1].selected.length; i++) {
                syslist.push(
                  Object.assign({}, obj[1].selected[i], {
                    description: obj[1].desc
                  })
                )
              }
              for (let i = 0; i < obj[1].uploaded.length; i++) {
                syslist.push(
                  Object.assign({}, obj[1].uploaded[i], {
                    description: obj[1].desc
                  })
                )
              }
              let count = 0
              syslist.forEach(item => {
                if (item.typename === obj[0]) {
                  count++
                }
              })
              if (!count) {
                syslist.push({
                  attatchid: null,
                  description: obj[1].desc,
                  docid: null,
                  id: null,
                  listid: self.modelid,
                  name: null,
                  typename: obj[0]
                })
              }
            }
          }
          for (let i = 0; i < syslist.length; i++) {
            if (syslist[i].type) {
              delete syslist[i].type
            }
          }

          // 制度文档/章节 必填验证
          if (this.existTabField('systemDocumentChapter', 'necessary')) {
            let ishave = false
            this.attrsForm.zhiduList.forEach(item => {
              if (item.zhiduName || item.zhiduId) {
                ishave = true
              }
              item.zhangjieList.forEach(val => {
                if (val.zhangjieId || val.zhangjieName) {
                  ishave = true
                }
              })
            })
            if (!ishave) {
              this.$message({
                message: this.existTabField(
                  'systemDocumentChapterCanNotBeEmpty',
                  '',
                  true
                ),
                type: 'warning'
              })
              return false
            }
          }
          // 术语 必填验证
          if (this.existTabField('c_terminology', 'necessary')) {
            let ishave = false
            this.attrsForm.termlist.forEach(item => {
              if (item.term || item.termdetail) {
                ishave = true
              }
            })
            if (!ishave) {
              this.$message({
                message: this.existTabField('termCanNotBeEmpty', '', true),
                type: 'warning'
              })
              return false
            }
          }
          // this.$set(this.attrsForm,'consultList',this.attrsForm.consultmanager)
          // 处理体系分类的数据--------------------------------结束

          // 处理流程卡片的文件保存到流程支持文件--------------------------------开始
          // let storeSupport = []
          // for (let i = 0; i < filetypes.length; i++) {
          //   if (!!this.syspart[filetypes[i].label] && (!!this.syspart[filetypes[i].label].selected.length || !!this.syspart[filetypes[i].label].uploaded.length)) {
          //     let selected = []
          //     this.syspart[filetypes[i].label].selected.forEach(item => {
          //       if (item.filetype === "new") {
          //         selected.push(item)
          //       }
          //     })
          //     let uploaded = []
          //     this.syspart[filetypes[i].label].uploaded.forEach(item => {
          //       if (item.filetype === "new") {
          //         uploaded.push(item)
          //       }
          //     })
          //     if (!!selected.length || !!uploaded.length) {
          //       storeSupport.push({
          //         description: '',
          //         docs: selected.concat(uploaded).map(item => { return {name: !item.newName ? item.name:item.newName, docid: item.docid}}),
          //         folderid: filetypes[i].id,
          //         modelid: this.modelid
          //       })
          //     }
          //   }
          // }
          // // 保存新增的流程输入文件
          // let newaddinputFile = []
          // this.attrsForm.processFileInput.forEach(item => {
          //   if (item.filetype === "new") {
          //     newaddinputFile.push(item)
          //   }
          // })
          // // 保存新增的流程输出文件
          // let newaddoutputFile = []
          // this.attrsForm.processFileOutput.forEach(item => {
          //   if (item.filetype === "new") {
          //     newaddoutputFile.push(item)
          //   }
          // })

          // for (let i = 0; i < filetypes.length; i ++) {
          //   if (filetypes[i].label === "流程输入文件" && !!newaddinputFile.length) {
          //     storeSupport.push({
          //       description: '',
          //       docs: newaddinputFile.map(item => { return {name: !item.newName ? item.name:item.newName, docid: item.docid}}),
          //       folderid: filetypes[i].id,
          //       modelid: this.modelid
          //     })
          //   } else if (filetypes[i].label === "流程输出文件" && !!newaddoutputFile.length) {
          //     storeSupport.push({
          //       description: '',
          //       docs: newaddoutputFile.map(item => { return {name: !item.newName ? item.name:item.newName, docid: item.docid}}),
          //       folderid: filetypes[i].id,
          //       modelid: this.modelid
          //     })
          //   }
          // }
          // if (storeSupport.length > 0) {
          //   this.savesupportsfile(storeSupport)
          // }
          // 处理流程卡片的文件保存到流程支持文件--------------------------------结束
          // 保存卡片的信息功能=========保存
          // console.log(JSON.parse(this.attrsForm.distribution))
          const res = await processSaveAttr({
            bpo: this.attrsForm.processid,
            bponame: this.attrsForm.processowner,
            code: this.attrsForm.code,
            managetypes: this.attrsForm.manageTypes, // 管理标准类型:
            manageclassification: this.attrsForm.manageClassification, // 管理标准归类:
            systemProcessRelations: this.attrsForm.systemProcessRelations, // 体系选择章节
            processframeworkname: this.attrsForm.processframeworkname, // : 流程框架名称
            supactivities: this.attrsForm.supactivities, // :关键活动补充说明
            description: this.attrsForm.desc,
            effectiveon: this.attrsForm.effectTime,
            enterpriseStandardName: this.attrsForm.enterpriseStandardName,
            processmanagerName: this.attrsForm.processmanagerName,
            standby8: this.attrsForm.standby8,
            standby10: this.attrsForm.standby10,
            standby12: this.attrsForm.standby12,
            processmanager: this.attrsForm.processmanager,
            standby7: this.attrsForm.standby7,
            standby9: this.attrsForm.standby9,
            standby11: this.attrsForm.standby11,
            id: this.attrsForm.id,
            input: this.attrsForm.processInputDesc,
            inputlist: this.attrsForm.processFileInput.concat(
              this.attrsForm.processUpInput
            ),
            inputname: this.attrsForm.upStream
              .map(item => {
                return item.id
              })
              .join(','),
            invalidon: this.attrsForm.nextTime,
            listid: self.modelid,
            modelid: self.modelid,
            name: this.attrsForm.processname,
            organization:
              this.attrsForm.distribution &&
              JSON.parse(this.attrsForm.distribution) &&
              JSON.parse(this.attrsForm.distribution).orglist.length > 0
                ? JSON.parse(this.attrsForm.distribution)
                    .orglist.map(item => {
                      return item.id
                    })
                    .join(',')
                : '',
            orgid1:
              this.attrsForm.orgscope1 &&
              JSON.parse(this.attrsForm.orgscope1) &&
              JSON.parse(this.attrsForm.orgscope1).orglist.length > 0
                ? JSON.parse(this.attrsForm.orgscope1)
                    .orglist.map(item => {
                      return item.id
                    })
                    .join(',')
                : '',
            orgid2:
              this.attrsForm.orgscope2 &&
              JSON.parse(this.attrsForm.orgscope2) &&
              JSON.parse(this.attrsForm.orgscope2).orglist.length > 0
                ? JSON.parse(this.attrsForm.orgscope2)
                    .orglist.map(item => {
                      return item.id
                    })
                    .join(',')
                : '',
            orgid3:
              this.attrsForm.orgscope3 &&
              JSON.parse(this.attrsForm.orgscope3) &&
              JSON.parse(this.attrsForm.orgscope3).orglist.length > 0
                ? JSON.parse(this.attrsForm.orgscope3)
                    .orglist.map(item => {
                      return item.id
                    })
                    .join(',')
                : '',
            orgname:
              this.attrsForm.distribution &&
              JSON.parse(this.attrsForm.distribution) &&
              JSON.parse(this.attrsForm.distribution).orglist.length > 0
                ? JSON.parse(this.attrsForm.distribution)
                    .orglist.map(item => {
                      return item.name
                    })
                    .join(',')
                : '',
            orgname1:
              this.attrsForm.orgscope1 &&
              JSON.parse(this.attrsForm.orgscope1) &&
              JSON.parse(this.attrsForm.orgscope1).orglist.length > 0
                ? JSON.parse(this.attrsForm.orgscope1)
                    .orglist.map(item => {
                      return item.name
                    })
                    .join(',')
                : '',
            distribution: this.attrsForm.distribution,
            orgscope1: this.attrsForm.orgscope1,
            orgscope2: this.attrsForm.orgscope2,
            orgscope3: this.attrsForm.orgscope3,
            orgstate: this.attrsForm.orgstate,
            orgstate1: this.attrsForm.orgstate1,
            orgstate2: this.attrsForm.orgstate2,
            orgstate3: this.attrsForm.orgstate3,
            codistribution: this.attrsForm.codistribution,
            coorgstate: this.attrsForm.coorgstate,
            output: this.attrsForm.processOutputDesc,
            outputlist: this.attrsForm.processFileOutput.concat(
              this.attrsForm.processchartOutput
            ),
            outputname: this.attrsForm.downStream
              .map(item => {
                return item.id
              })
              .join(','),
            purpose: this.attrsForm.target,
            scope: this.attrsForm.fitscope,
            standby1: this.attrsForm.standby1,
            standby2: this.attrsForm.standby2,
            standby3: this.attrsForm.standby3,
            standby4: this.attrsForm.standby4,
            standby5: this.attrsForm.standby5,
            standby6: this.attrsForm.standby6,
            signer: this.userid,
            signername: this.username,
            syslist: syslist,
            termlist: this.attrsForm.termlist,
            version: this.attrsForm.versions,
            processcode: this.attrsForm.processcode,
            // zhiduId: this.attrsForm.zhiduId,
            // zhiduName: this.attrsForm.zhiduName,
            // zhangjieName: this.attrsForm.zhangjieName,
            // zhangjieId: this.attrsForm.zhangjieId,
            zhiduList: this.attrsForm.zhiduList,
            standardReleViews: this.attrsForm.standardReleViews,
            modelInstitution: {
              id: this.attrsForm.ruleid,
              name: this.attrsForm.rulename,
              code: this.attrsForm.rulecode,
              editor: this.attrsForm.ruleperson,
              liaisons: this.attrsForm.ruler,
              description: this.attrsForm.ruledesc,
              reason: this.attrsForm.rulereason,
              listid: self.modelid
            },
            consultList: this.attrsForm.consultList
            // consultmanagerList: {
            //   id: this.attrsForm.consultmanagerid,
            //   name: this.attrsForm.consultmanagername,
            //   code: this.attrsForm.consultmanagercode,
            //   editor: this.attrsForm.consultmanagerperson,
            //   liaisons: this.attrsForm.consultmanager,
            //   description: this.attrsForm.consultmanagerdesc,
            //   reason: this.attrsForm.consultmanagerreason,
            //   listid: self.modelid,
            // },
          })
          if (!res) return false
          if (type === 'save') {
            this.$message({
              message: this.existTabField('saveSuccessfully', '', true),
              type: 'success'
            })
            this.rebackDataOther = JSON.parse(
              JSON.stringify(
                Object.assign({}, this.rebackDataOther, this.attrsForm)
              )
            )
            this.rebackData = JSON.parse(
              JSON.stringify(Object.assign({}, this.rebackData, this.syspart))
            )
          } else {
            if (fn) {
              fn({ type: true, value: res })
            }
          }
        } else {
          this.$message({
            message: this.existTabField(
              'requiredFieldsForProcessBasicPropertiesCannotBeEmpty',
              '',
              true
            ),
            type: 'warning'
          })
          if (fn) {
            fn({ type: false })
          }
          return false
        }
      })
    },
    diff(obj1, obj2) {
      var o1 = obj1 instanceof Object
      var o2 = obj2 instanceof Object
      if (!o1 || !o2) {
        /*  判断不是对象  */
        return obj1 === obj2
      }

      if (Object.keys(obj1).length !== Object.keys(obj2).length) {
        return false
        // Object.keys() 返回一个由对象的自身可枚举属性(key值)组成的数组,例如：数组返回下表：let arr = ["a", "b", "c"];console.log(Object.keys(arr))->0,1,2;
      }

      for (var attr in obj1) {
        var t1 = obj1[attr] instanceof Object
        var t2 = obj2[attr] instanceof Object
        if (t1 && t2) {
          return this.diff(obj1[attr], obj2[attr])
        } else if (obj1[attr] !== obj2[attr]) {
          return false
        }
      }
      return true
    },
    closeModal(done) {
      for (const key in this.attrsForm) {
        if (this.attrsForm.hasOwnProperty(key)) {
          const element = this.attrsForm[key]
          if (element == undefined) {
            delete this.attrsForm[key]
          }
        }
      }

      if (
        this.diff(this.rebackData, this.syspart) &&
        this.diff(this.rebackDataOther, this.attrsForm)
      ) {
        this.$emit('close', {
          type: 'close',
          data: ''
        })
        done()
      } else {
        this.$confirm(
          this.$t('hintText.informationNotSavedSureClosePopUp'),
          this.$t('hintText.hint'),
          {
            confirmButtonText: this.$t('confirm'),
            cancelButtonText: this.$t('cancel'),
            type: 'warning'
          }
        )
          .then(() => {
            this.$emit('close', {
              type: 'close',
              data: ''
            })
            done()
          })
          .catch(err => {})
      }
    },
    // 绘图
    async paintChart() {
      const self = this
      if (!self.noEditing) {
        window.open(
          self.host2 +
            self.html +
            '/leftMenu/BaseNewPage.html?id=' +
            self.bpmid +
            '&listid=' +
            self.modelid +
            '&isReadAttr=true'
        )
        return
      }
      this.$confirm(
        this.existTabField('doYouWantToSave', '', true),
        this.$t('hintText.hint'),
        {
          confirmButtonText: this.existTabField('yes', '', true),
          cancelButtonText: this.existTabField('no', '', true),
          type: 'warning'
        }
      )
        .then(() => {
          this.saveProcessCard('paint', res => {
            if (res.type) {
              self.isDialogsVisible = false
              self.$emit('close', {
                type: 'paint',
                data: res.value
              })
            }
          })
        })
        .catch(() => {
          if (!this.bpmid) {
            processSaveAttr({
              bpo: this.attrsForm.processid,
              bponame: this.attrsForm.processowner,
              code: this.attrsForm.code,
              listid: self.modelid,
              modelid: self.modelid,
              signer: this.userid,
              signername: this.username,
              version: this.attrsForm.versions,
              processcode: this.attrsForm.processcode,
              name: this.attrsForm.processname,
              modelInstitution: {}
            }).then(res => {
              if (!res) return false
              self.isDialogsVisible = false
              self.$emit('close', {
                type: 'paint',
                data: res
              })
            })
          } else {
            self.isDialogsVisible = false
            self.$emit('close', {
              type: 'paint',
              data: [this.bpmid, this.modelid].join(',')
            })
          }
        })
    },
    handleCurrentChange(value) {
      this.processlistpage = value
      this.getList()
    },
    distributeClear(type) {
      if (type === 'distribution') {
        this.distribution.bpmDto.orgstate = ''
        this.distribution.bpmDto.distribution = ''
        this.attrsForm.distribution = ''
        this.attrsForm.orgstate = ''
      } else if (type === 'orgscope1') {
        this.scopedistribution.bpmDto.orgstate1 = ''
        this.scopedistribution.bpmDto.orgscope1 = ''
        this.attrsForm.orgscope1 = ''
        this.attrsForm.orgstate1 = ''
      } else if (type === 'orgscope2') {
        this.scopedistribution.bpmDto.orgstate2 = ''
        this.scopedistribution.bpmDto.orgscope2 = ''
        this.attrsForm.orgscope2 = ''
        this.attrsForm.orgstate2 = ''
      } else if (type === 'orgscope3') {
        this.scopedistribution.bpmDto.orgstate3 = ''
        this.scopedistribution.bpmDto.orgscope3 = ''
        this.attrsForm.orgscope3 = ''
        this.attrsForm.orgstate3 = ''
      }
    },
    confirmDistribution(obj) {
      console.log('🏝sendState', JSON.parse(obj.sendState))
      console.log('🏝orginalChecktion', JSON.parse(obj.orginalChecktion))
      if (this.orgType === 'distribution') {
        this.distribution.bpmDto.orgstate = obj.sendState
        this.distribution.bpmDto.distribution = obj.orginalChecktion
        this.attrsForm.distribution = obj.orginalChecktion
        this.attrsForm.orgstate = obj.sendState
      } else if (this.orgType === 'orgscope1') {
        this.orgscope1.bpmDto.orgstate1 = obj.sendState
        this.orgscope1.bpmDto.orgscope1 = obj.orginalChecktion
        this.attrsForm.orgscope1 = obj.orginalChecktion
        this.attrsForm.orgstate1 = obj.sendState
      } else if (this.orgType === 'orgscope2') {
        this.orgscope2.bpmDto.orgstate2 = obj.sendState
        this.orgscope2.bpmDto.orgscope2 = obj.orginalChecktion
        this.attrsForm.orgscope2 = obj.orginalChecktion
        this.attrsForm.orgstate2 = obj.sendState
      } else if (this.orgType === 'orgscope3') {
        this.orgscope3.bpmDto.orgstate3 = obj.sendState
        this.orgscope3.bpmDto.orgscope3 = obj.orginalChecktion
        this.attrsForm.orgscope3 = obj.orginalChecktion
        this.attrsForm.orgstate3 = obj.sendState
      }
    },
    confirmCoDistribution(obj) {
      this.codistribution.bpmDto.coorgstate = obj.sendState
      this.codistribution.bpmDto.codistribution = obj.orginalChecktion
      this.attrsForm.codistribution = obj.orginalChecktion
      this.attrsForm.coorgstate = obj.sendState
    },
    confirmprocess(arr) {
      if (this.refertype === 'upstream') {
        this.attrsForm.upStream = JSON.parse(JSON.stringify(arr))
      } else {
        this.attrsForm.downStream = JSON.parse(JSON.stringify(arr))
      }
    },
    delProcess(str, item) {
      for (let i = 0; i < this.attrsForm[str].length; i++) {
        if (this.attrsForm[str][i].id === item.id) {
          this.attrsForm[str].splice(i, 1)
          break
        }
      }
    },
    selectprocessfile(type) {
      this.isinoutVisible = true
      this.selectReferType = type
      this.selectInoutform = {
        desc: '',
        disabledfiles: [],
        files: []
      }
      const attrsForm = JSON.parse(JSON.stringify(this.attrsForm))
      if (type === 'processInput') {
        this.selectInoutform = {
          desc: attrsForm.processInputDesc,
          disabledfiles: attrsForm.processUpInput,
          files: attrsForm.processFileInput
        }
      } else if (type === 'processOutput') {
        this.selectInoutform = {
          desc: attrsForm.processOutputDesc,
          disabledfiles: attrsForm.processchartOutput,
          files: attrsForm.processFileOutput
        }
      }
    },
    saveInoutFiles() {
      const selectInoutform = JSON.parse(JSON.stringify(this.selectInoutform))
      if (this.selectReferType === 'processInput') {
        this.attrsForm.processInputDesc = selectInoutform.desc
        this.attrsForm.processUpInput = selectInoutform.disabledfiles
        this.attrsForm.processFileInput = selectInoutform.files
      } else if (this.selectReferType === 'processOutput') {
        this.attrsForm.processOutputDesc = selectInoutform.desc
        this.attrsForm.processchartOutput = selectInoutform.disabledfiles
        this.attrsForm.processFileOutput = selectInoutform.files
      }
      this.isinoutVisible = false
    },
    delSelectFiles(item) {
      for (let i = 0; i < this.selectInoutform.files.length; i++) {
        if (this.selectInoutform.files[i].id === item.id) {
          this.selectInoutform.files.splice(i, 1)
          break
        }
      }
    },
    // 体系分类的点击事件
    selectSysItem(item, index) {
      this.syspart[item].show = true
    },
    selectSysFile(item) {
      this.isGroupVisible = true
      this.selectReferType = item
    },
    confirmSyslist(item) {
      if (
        !this.syspart[item].desc &&
        this.syspart[item].selected.length === 0 &&
        this.syspart[item].uploaded.length === 0
      ) {
        this.$message({
          type: 'warning',
          message: this.existTabField(
            'pleaseFillInTheDescriptionOrUploadAnAttachment',
            '',
            true
          )
        })
        for (let i = 0; i < this.attrsForm.systemlist.length; i++) {
          if (this.attrsForm.systemlist[i] === item) {
            this.attrsForm.systemlist.splice(i, 1)
            break
          }
        }
        return false
      }
      if (this.attrsForm.systemlist.indexOf(item) > -1) return false
      this.attrsForm.systemlist.push(item)
      this.$set(this.syspart[item], 'show', true)
    },
    // 判断体系分类是否为空
    referSyslist(item) {
      if (
        !this.syspart[item].desc &&
        !this.syspart[item].selected.length &&
        !this.syspart[item].uploaded.length
      ) {
        for (let i = 0; i < this.attrsForm.systemlist.length; i++) {
          if (this.attrsForm.systemlist[i] === item) {
            this.attrsForm.systemlist.splice(i, 1)
            break
          }
        }
      }
    },
    // 清除
    delSyslist(item) {
      this.$confirm(
        this.existTabField('areYouSureClearTheSystemClassification', '', true),
        this.$t('hintText.hint'),
        {
          confirmButtonText: this.$t('confirm'),
          cancelButtonText: this.$t('cancel'),
          type: 'warning'
        }
      )
        .then(() => {
          this.$set(
            this.syspart,
            item,
            Object.assign({}, this.syspart[item], {
              show: false,
              desc: '',
              selected: [],
              uploaded: []
            })
          )
          for (let i = 0; i < this.attrsForm.systemlist.length; i++) {
            if (this.attrsForm.systemlist[i] === item) {
              this.attrsForm.systemlist.splice(i, 1)
              break
            }
          }
          this.$message({
            type: 'success',
            message: this.existTabField('clearSuccess', '', true)
          })
        })
        .catch(() => {})
    },
    // 删除文件
    delsys(str, item, index) {
      this.syspart[str][item].splice(index, 1)
      this.referSyslist(str)
      this.requireDelFile([item], item)
    },
    // 保存到流程支持文件中
    savesupportsfile(lists) {
      saveFile({
        doclist: lists
      }).then(res => {
        console.log('保存流程支持文件成功')
      })
    },
    savesupport() {
      const self = this
      this.$refs.supportRef.validate(valid => {
        if (valid) {
          saveFile({
            doclist: [
              {
                description: this.supportform.remarks,
                docs: this.supportform.supportFile,
                folderid: this.supportform.fileType,
                modelid: this.modelid
              }
            ]
          }).then(res => {
            this.$message({
              message: this.existTabField('addedSuccessfully', '', true),
              type: 'success'
            })
            this.getSupportFile(1)
            self.isFileVisible = false
          })
        } else {
          this.$message({
            message: this.existTabField(
              'noteOrAttachmentCanNotBeEmpty',
              '',
              true
            ),
            type: 'warning'
          })
          return false
        }
      })
    },
    handlerSelect(obj) {
      const self = this
      obj.uploadfiles.map(item => {
        if (
          this.selectReferType === 'processInput' ||
          this.selectReferType === 'processOutput'
        ) {
          this.selectInoutform.files.push({
            attatchid: item.id,
            description: self.selectInoutform.desc,
            docid: item.id,
            id: item.id,
            inouttype: '卡片',
            listid: self.modelid,
            name: item.newName,
            newName: item.newName,
            typename: self.selectReferType === 'processInput' ? '输入' : '输出',
            type: 'upload',
            filetype: 'new'
          })
        } else {
          this.syspart[self.selectReferType].selected.push({
            attatchid: item.id,
            description: self.syspart[self.selectReferType].desc,
            docid: item.id,
            id: item.id,
            listid: self.modelid,
            name: item.newName,
            typename: self.selectReferType,
            type: 'upload',
            filetype: 'new'
          })
        }
      })
      obj.selectedList.map(item => {
        if (
          this.selectReferType === 'processInput' ||
          this.selectReferType === 'processOutput'
        ) {
          let count = 0
          for (let i = 0; i < this.selectInoutform.files.length; i++) {
            const temp = this.selectInoutform.files[i]
            if (temp.id === item.id) {
              count++
            }
          }
          if (!count) {
            this.selectInoutform.files.push({
              attatchid: item.docid,
              description: self.selectInoutform.desc,
              docid: item.docid,
              id: item.id,
              inouttype: '卡片',
              listid: self.modelid,
              newName: item.name,
              name: item.name,
              typename:
                self.selectReferType === 'processInput' ? '输入' : '输出',
              filetype: 'new'
            })
          }
        } else {
          let count = 0
          for (
            let i = 0;
            i < this.syspart[self.selectReferType].selected.length;
            i++
          ) {
            const temp = this.syspart[self.selectReferType].selected[i]
            if (temp.id === item.id) {
              count++
            }
          }
          if (!count) {
            this.syspart[self.selectReferType].selected.push({
              attatchid: item.docid,
              description: self.syspart[self.selectReferType].desc,
              docid: item.docid,
              id: item.id,
              listid: self.modelid,
              name: item.name,
              typename: self.selectReferType,
              filetype: 'new'
            })
          }
        }
      })
    },
    // 获取需要调用删除接口的文件
    requireDelFile(arr, type) {
      arr.forEach(item => {
        if (type === 'selected') {
          let count = 0
          for (let i = 0; i < this.storeDeletefile.document.length; i++) {
            const temp = this.storeDeletefile.document[i]
            if (temp.id == item.id) {
              count++
              break
            }
          }
          if (!count) {
            this.storeDeletefile.document.push(item)
          }
        } else {
          let count = 0
          for (let i = 0; i < this.storeDeletefile.modeldoc.length; i++) {
            const temp = this.storeDeletefile.modeldoc[i]
            if (temp.id == item.id) {
              count++
              break
            }
          }
          if (!count) {
            this.storeDeletefile.modeldoc.push(item)
          }
        }
      })
    },
    // 删除document接口的文件
    async deletefile(ids) {
      const res = await deluploadFile(ids)
      return new Promise((resolve, reject) => {
        resolve()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.listItem {
  background: #2d42af;
  color: #fff;
  padding: 10px;
  margin: 0 10px 10px 0;
  display: inline-block;
  text-align: center;

  i {
    cursor: pointer;
  }
}

.subTitle {
  width: 110px;
  text-align: right;
  margin-bottom: 10px;
  font-size: 16px;
}

/*附件部分*/
.showFiles {
  span {
    line-height: 18px;
    padding: 3px 20px 3px 8px;
    background-color: $active-color;
    color: #ffffff;
    display: inline-block;
    vertical-align: top;
    max-width: 130px;
    border-radius: 3px;
    position: relative;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    border: none;

    a,
    i {
      color: #ffffff !important;
    }
  }

  &.alink span {
    padding-right: 35px;
  }

  &.commonpadding span {
    padding: 3px 8px;
  }

  &.commonpadding.alink span {
    padding-right: 20px;
  }

  a:nth-of-type(2) {
    position: absolute;
    right: 17px;
    top: 5px;
  }

  &.commonpadding.alink a:nth-of-type(2) {
    position: absolute;
    right: 5px;
    top: 3px;
  }

  i {
    position: absolute;
    right: 3px;
    top: 5px;
    color: $ico;
  }

  &.processCommon i {
    top: 6px;
  }
}

.minHeight28 {
  min-height: 28px;
}

.minHeight35 {
  min-height: 35px;
}

/*流程卡片*/
.processCard {
  /deep/ .el-tabs__nav-wrap {
    width: calc(100% - 40px) !important;

    .el-tabs__nav-next,
    .el-tabs__nav-prev {
      width: 20px;
      line-height: 39px;
      text-align: center;
    }
  }

  /deep/ .el-input {
    height: 27px;
    // vertical-align: top;
  }

  .slotTitle {
    position: absolute;
    top: 13px;
    right: 35px;
    z-index: 999;
  }

  .el-dialog__body {
    padding: 0;
  }

  .el-tabs.el-tabs--top {
    box-shadow: none;
    border: 0;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
  }

  .systemCard {
    float: left;
    // border: 1px solid #C0C4CC;;
    // margin-right: 10px;
    .el-card__header {
      .el-button {
        /*padding: 3px 0;*/
      }
    }

    .header {
      /*height: 18px;*/
      overflow: hidden;
    }

    .h220px {
      height: 220px;
      overflow: auto;
    }

    .system_card {
      width: 400px;
      margin-left: 95px;
    }
  }

  .syslist {
    display: inline-block;
    border: 1px solid #dcdfe6;
    vertical-align: top;
    padding: 0 8px;
    margin-left: -1px;
    cursor: pointer;
  }

  .syslist:hover {
    color: #409eff;
  }

  .syslist.active {
    color: #fff;
    background-color: #409eff;
    border-color: #409eff;
    border-left: 1px solid #dcdfe6;
  }

  .syslist.active:hover {
    color: #fff;
  }

  span.syslist:nth-of-type(1) {
    border-radius: 4px 0 0 4px;
  }

  span.syslist:nth-last-of-type(1) {
    border-radius: 0 4px 4px 0;
  }
}

/*流程支持文件*/
.supportDialog {
  .el-dialog__header {
    .el-button {
      margin-right: 20px;
    }
  }
}

// 岗位查询-术语样式问题
/deep/ .el-dropdown {
  .el-button-group .el-button:nth-child(2) {
    background: #ffffff !important;
    border: 1px solid #dcdfe6 !important;
    border-color: #dcdfe6 !important;
    color: #666666 !important;
  }

  .el-button-group .el-button:nth-child(2):hover {
    background-color: #2d42af !important;
    color: #fff !important;
  }

  .el-button-group .el-button {
    float: left;
  }

  .system {
    /deep/ .el-textarea {
      margin-left: 85px;
      box-sizing: border-box;
      width: 440px;
    }
  }

  .el-button:first-child {
    padding: 0;
    border: 0;

    .el-input__inner {
      border-radius: 0;
    }
  }
}

//  .el-button:focus
/deep/ .el-button:hover {
  background-color: #2d42af !important;
  color: #fff !important;
}

/deep/ .el-dialog__headerbtn {
  top: 8px !important;
}

/deep/ .el-tree-node__content {
  font-size: 13px !important;
  align-items: stretch !important;
}

#btn:hover {
  background-color: #2d42af !important;
}

.sys-btn-choose {
  background-color: #2d42af !important;
  color: #fff !important;
}

.sys-btn:hover {
  background: none !important;
  color: #333333 !important;
  border: #0a2a5f 1px solid;
}

.sysChapterWrap {
  padding-left: 10%;
}

.systemCard {
  float: left;

  .el-card__header {
    .el-button {
      padding: 3px 0;
    }
  }

  .header {
    height: 18px;
    overflow: hidden;
  }

  .h220px {
    height: 220px;
    overflow: auto;
  }
}

.text-right {
  display: flex;
  justify-content: flex-end;
}
</style>
