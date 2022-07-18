<template>
  <div class="w100">
    <el-dialog
      class="regulationCard"
      width="80%"
      :visible.sync="isDialogsVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :modal-append-to-body="false"
    >
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
            <el-form
              ref="attrsFormRef"
              label-width="125px"
              label-position="right"
              :model="attrsForm"
            >
              <!---------------------------------------------- 流程相关信息---------------------->
              <h5 v-if="existTabField('processInfo', 'refer')" class="subTitle">
                {{ existTabField("processInfo") }}
              </h5>
              <el-row :gutter="10">
                <!-- 拟制人 -->
                <el-col
                  v-if="existTabField('c_fictitiousPerson', 'refer')"
                  :span="12"
                >
                  <el-form-item :label="existTabField('c_fictitiousPerson')">
                    <el-input v-model="username" disabled />
                  </el-form-item>
                </el-col>
                <!-- 版本 -->
                <el-col v-if="existTabField('c_versions', 'refer')" :span="12">
                  <el-form-item :label="existTabField('c_versions')">
                    <el-input v-model="attrsForm.version" disabled />
                  </el-form-item>
                </el-col>
                <!-- 框架编码 -->
                <el-col v-if="existTabField('c_frameCode', 'refer')" :span="12">
                  <el-form-item
                    :label="existTabField('c_frameCode')"
                    prop="frameCode"
                    :rules="[
                      {
                        required: existTabField('c_frameCode', 'necessary'),
                        message: ' ',
                        trigger: 'blur',
                      },
                    ]"
                  >
                    <el-input v-model="attrsForm.frameCode" disabled />
                  </el-form-item>
                </el-col>
                <!-- 框架名称 -->
                <el-col v-if="existTabField('c_frameName', 'refer')" :span="12">
                  <el-form-item
                    :label="existTabField('c_frameName')"
                    prop="frameName"
                    :rules="[
                      {
                        required: existTabField('c_frameCode', 'necessary'),
                        message: ' ',
                        trigger: 'blur',
                      },
                    ]"
                  >
                    <el-input v-model="attrsForm.frameName" @focus="selectRuleFrame" />
                  </el-form-item>
                </el-col>
                <!-- 制度名称 -->
                <el-col
                  v-if="existTabField('c_systemName', 'refer')"
                  :span="12"
                >
                  <el-form-item
                    :label="existTabField('c_systemName')"
                    prop="docTitle"
                    :rules="[
                      {
                        required: existTabField('c_systemName', 'necessary'),
                        message: ' ',
                        trigger: 'blur',
                      },
                    ]"
                  >
                    <el-input v-model="attrsForm.docTitle" :readonly="!isEdit" />
                  </el-form-item>
                </el-col>
                <!-- 制度编码 -->
                <el-col
                  v-if="existTabField('c_systemCode', 'refer')"
                  :span="12"
                >
                  <el-form-item
                    :label="existTabField('c_systemCode')"
                    prop="systemCode"
                    :rules="[
                      {
                        required: existTabField('c_systemCode', 'necessary'),
                        message: ' ',
                        trigger: 'blur',
                      },
                    ]"
                  >
                    <el-input v-model="attrsForm.systemCode" :readonly="!isEdit" />
                  </el-form-item>
                </el-col>
                <!-- 制度编写人 -->
                <el-col
                  v-if="existTabField('c_systemWriter', 'refer')"
                  :span="12"
                >
                  <el-form-item
                    :label="existTabField('c_systemWriter')"
                    prop="writtenName"
                    :rules="[
                      {
                        required: existTabField('c_systemWriter', 'necessary'),
                        message: ' ',
                        trigger: 'change',
                      },
                    ]"
                  >
                    <el-input
                      v-model="attrsForm.writtenName"
                      :disabled="!isEdit"
                      @focus="selectPeople('written')"
                    />
                  </el-form-item>
                </el-col>
                <!-- 制度联络人 -->
                <el-col
                  v-if="existTabField('c_systemContactPerson', 'refer')"
                  :span="12"
                >
                  <el-form-item
                    :label="existTabField('c_systemContactPerson')"
                    prop="contactName"
                    :rules="[
                      {
                        required: existTabField(
                          'c_systemContactPerson',
                          'necessary'
                        ),
                        message: ' ',
                        trigger: 'change',
                      },
                    ]"
                  >
                    <el-input
                      v-model="attrsForm.contactName"
                      :disabled="!isEdit"
                      @focus="selectPeople('contact')"
                    />
                  </el-form-item>
                </el-col>

                <!-- 预留选择人员1 -->
                <el-col
                  v-if="existTabField('reservedPersonField1', 'refer')"
                  :span="12"
                >
                  <el-form-item
                    :label="existTabField('reservedPersonField1')"
                    prop="standby8"
                    :rules="[
                      {
                        required: existTabField('reservedPersonField1', 'necessary'),
                        message: ' ',
                        trigger: 'change',
                      },
                    ]"
                  >
                    <el-input
                      v-model="attrsForm.standby8"
                      :disabled="!isEdit"
                      @focus="selectPeople('standby8')"
                    />
                  </el-form-item>
                </el-col>
                <!-- 预留选择人员2 -->
                <el-col
                  v-if="existTabField('reservedPersonField2', 'refer')"
                  :span="12"
                >
                  <el-form-item
                    :label="existTabField('reservedPersonField2')"
                    prop="standby10"
                    :rules="[
                      {
                        required: existTabField('reservedPersonField2', 'necessary'),
                        message: ' ',
                        trigger: 'change',
                      },
                    ]"
                  >
                    <el-input
                      v-model="attrsForm.standby10"
                      :disabled="!isEdit"
                      @focus="selectPeople('standby10')"
                    />
                  </el-form-item>
                </el-col>

                <!-- 预留选择人员3 -->
                <el-col
                  v-if="existTabField('reservedPersonField3', 'refer')"
                  :span="12"
                >
                  <el-form-item
                    :label="existTabField('reservedPersonField3')"
                    prop="standby12"
                    :rules="[
                      {
                        required: existTabField('reservedPersonField3', 'necessary'),
                        message: ' ',
                        trigger: 'change',
                      },
                    ]"
                  >
                    <el-input
                      v-model="attrsForm.standby12"
                      :disabled="!isEdit"
                      @focus="selectPeople('standby12')"
                    />
                  </el-form-item>
                </el-col>

                <!-- 上级制度 -->
                <el-col
                  v-if="existTabField('c_superiorSystem', 'refer')"
                  :span="12"
                >
                  <el-form-item
                    :label="existTabField('c_superiorSystem')"
                    prop="updmName"
                    :rules="[
                      {
                        required: existTabField(
                          'c_superiorSystem',
                          'necessary'
                        ),
                        message: ' ',
                        trigger: 'change',
                      },
                    ]"
                  >
                    <el-input
                      v-model="attrsForm.updmName"
                      :title="attrsForm.updmName"
                      clearable
                      disabled
                    >
                      <el-button slot="append" @click="selectRule('updm')">
                        {{ existTabField("select", "", true) }}
                      </el-button>
                    </el-input>
                  </el-form-item>
                </el-col>

                <!-- 下级制度 -->
                <el-col
                  v-if="existTabField('c_lowerSystem', 'refer')"
                  :span="12"
                >
                  <el-form-item
                    :label="existTabField('c_lowerSystem')"
                    prop="downdmName"
                    :rules="[
                      {
                        required: existTabField('c_lowerSystem', 'necessary'),
                        message: ' ',
                        trigger: 'change',
                      },
                    ]"
                  >
                    <el-input
                      v-model="attrsForm.downdmName"
                      :title="attrsForm.downdmName"
                      clearable
                      disabled
                    >
                      <el-button slot="append" @click="selectRule('downdm')">
                        {{ existTabField("select", "", true) }}
                      </el-button>
                    </el-input>
                  </el-form-item>
                </el-col>

                <!-- 制度简介 -->
                <el-col
                  v-if="existTabField('c_systemIntroduction', 'refer')"
                  :span="12"
                >
                  <el-form-item
                    :label="existTabField('c_systemIntroduction')"
                    prop="introduction"
                    :rules="[
                      {
                        required: existTabField(
                          'c_systemIntroduction',
                          'necessary'
                        ),
                        message: ' ',
                        trigger: 'blur',
                      },
                    ]"
                  >
                    <el-input
                      v-model="attrsForm.introduction"
                      :readonly="!isEdit"
                      type="textarea"
                    />
                  </el-form-item>
                </el-col>
                <!-- 编制原因 -->
                <el-col
                  v-if="existTabField('c_prepareTheReason', 'refer')"
                  :span="12"
                >
                  <el-form-item
                    :label="existTabField('c_prepareTheReason')"
                    prop="reason"
                    :rules="[
                      {
                        required: existTabField(
                          'c_prepareTheReason',
                          'necessary'
                        ),
                        message: ' ',
                        trigger: 'blur',
                      },
                    ]"
                  >
                    <el-input v-model="attrsForm.reason" type="textarea" :readonly="!isEdit" />
                  </el-form-item>
                </el-col>

                <!-- 主责部门 -->
                <el-col v-if="existTabField('c_orgname', 'refer')" :span="12">
                  <el-form-item
                    :label="existTabField('c_orgname')"
                    prop="orgname"
                    :rules="[
                      {
                        required: existTabField('c_orgname', 'necessary'),
                        message: ' ',
                        trigger: 'blur',
                      },
                    ]"
                  >
                    <el-input
                      v-model="attrsForm.orgname"
                      :title="attrsForm.orgname"
                      @focus="distributeClick('consultmanager')"
                      @clear="distributeClear"
                      clearable
                      :disabled="!isEdit"
                    />
                  </el-form-item>
                </el-col>

                <!-- 配合部门 -->
                <el-col
                  v-if="existTabField('c_codistribution', 'refer')"
                  :span="12"
                >
                  <el-form-item
                    :label="existTabField('c_codistribution')"
                    prop="codistribution"
                    :rules="[
                      {
                        required: existTabField(
                          'c_codistribution',
                          'necessary'
                        ),
                        message: ' ',
                        trigger: 'blur',
                      },
                    ]"
                  >
                    <el-input
                      v-model="attrsForm.codistribution"
                      :title="attrsForm.codistribution"
                      @focus="codistributeClick('codistribution')"
                      @clear="codistributeClear"
                      :disabled="!isEdit"
                      clearable
                    />
                  </el-form-item>
                </el-col>

                <!-- 适用范围 -->
                <el-col v-if="existTabField('c_scope', 'refer')" :span="12">
                  <el-form-item
                    :label="existTabField('c_scope')"
                    prop="scope"
                    :rules="[
                      {
                        required: existTabField('c_scope', 'necessary'),
                        message: ' ',
                        trigger: 'blur',
                      },
                    ]"
                  >
                    <el-input
                      v-model="attrsForm.scope"
                      :title="attrsForm.scope"
                      :readonly="!isEdit"
                      clearable
                    />
                  </el-form-item>
                </el-col>

                <!-- 体系分类 -->
                <el-col
                  v-if="existTabField('c_classificationSystem', 'refer')"
                  :span="24"
                >
                  <el-form-item
                    :label="existTabField('c_classificationSystem')"
                    prop="checkList"
                    :rules="[
                      {
                        type: 'array',
                        required: existTabField(
                          'c_classificationSystem',
                          'necessary'
                        ),
                        message: ' ',
                        trigger: 'change',
                      },
                    ]"
                  >
                    <el-checkbox-group v-model="attrsForm.checkList" :disabled="!isEdit">
                      <el-checkbox
                        v-for="item in sysLists"
                        :key="item.id"
                        :label="item.system_name"
                      >
                        {{ item.system_name }}
                      </el-checkbox>
                    </el-checkbox-group>
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
                        trigger: 'blur',
                      },
                    ]"
                  >
                    <el-input v-model="attrsForm.standby1" :readonly="!isEdit" />
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
                        trigger: 'blur',
                      },
                    ]"
                  >
                    <el-input v-model="attrsForm.standby2" :readonly="!isEdit" />
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
                        trigger: 'blur',
                      },
                    ]"
                  >
                    <el-input v-model="attrsForm.standby3" :readonly="!isEdit" />
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
                        trigger: 'blur',
                      },
                    ]"
                  >
                    <el-input type="textarea" v-model="attrsForm.standby4" :readonly="!isEdit" />
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
                        trigger: 'blur',
                      },
                    ]"
                  >
                    <el-input type="textarea" v-model="attrsForm.standby5" :readonly="!isEdit" />
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
                        trigger: 'blur',
                      },
                    ]"
                  >
                    <el-input type="textarea" v-model="attrsForm.standby6" :readonly="!isEdit" />
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row :gutter="10">
                <!-- 制度文档 -->
                <el-col
                  v-if="existTabField('c_systemDocument', 'refer')"
                  :span="24"
                >
                  <el-form-item
                    :label="existTabField('c_systemDocument')"
                    :required="existTabField('c_systemDocument', 'necessary')"
                  >
                    <el-upload
                      :action="action"
                      :on-success="handlerSuccessFile"
                      :before-upload="beforeAvatarUpload"
                      :show-file-list="false"
                      v-if="isEdit"
                    >
                      <el-button size="mini" type="primary">
                        {{ $t("bpa_clickUpload") }}
                      </el-button>
                      <!-- <span
                        style="margin-left: 12px; font-size: 13px; color: red"
                      >{{
                          existTabField("notePleasePploadDocxFile", "", true)
                        }}</span
                      > -->
                    </el-upload>
                    <!-- v-if="attrsForm.fileList && attrsForm.fileList.length > 0" -->
                    <!-- <el-button type="primary" @click="onlineEdit">
                      {{ $t("onlineCompiler") }}
                    </el-button> -->
                    <p class="fileList">
                      <span
                        v-for="item in attrsForm.fileList"
                        :key="item.id"
                        class="margin-r5 margin-b5"
                      >
                        <a class="font-link">{{ item.originalname }}</a>
                        <a
                          class="margin-l5 font-link"
                          :href="downloadUrl(item.id)"
                          target="_blank"
                        >
                          <b class="el-icon-download" />
                        </a>
                        <i
                          class="el-icon-close cursor-pointer"
                          @click="delProcess(index, 'fileList')"
                          v-if="isEdit"
                        />
                      </span>
                    </p>
                  </el-form-item>
                  <iframe
                    :src="wordIframe"
                    frameborder="0"
                    style="display: none"
                  />
                </el-col>
              </el-row>

              <el-row :gutter="10">
                <!-- 制度编写说明 -->
                <el-col
                  v-if="existTabField('c_systemCompilationNotes', 'refer')"
                  :span="24"
                >
                  <el-form-item
                    :label="existTabField('c_systemCompilationNotes')"
                    :required="
                      existTabField('c_systemCompilationNotes', 'necessary')
                    "
                  >
                    <el-upload
                      :action="action"
                      :on-success="handlerSuccessRevisionNotes"
                      :show-file-list="false"
                      v-if="isEdit"
                    >
                      <el-button size="mini" type="primary">
                        {{ $t("bpa_clickUpload") }}
                      </el-button>
                    </el-upload>
                    <p class="fileList">
                      <span
                        v-for="item in attrsForm.fileListRevisionNotes"
                        :key="item.id"
                        class="margin-r5 margin-b5"
                      >
                        <a class="font-link">{{ item.originalname }}</a>
                        <a
                          class="margin-l5 font-link"
                          :href="downloadUrl(item.id)"
                          target="_blank"
                        >
                          <b class="el-icon-download" />
                        </a>
                        <i
                          class="el-icon-close cursor-pointer"
                          v-if="isEdit"
                          @click="delProcess(index, 'fileListRevisionNotes')"
                        />
                      </span>
                    </p>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row :gutter="10">
                <!-- 征求意见情况采纳说明 -->
                <el-col
                  v-if="
                    existTabField(
                      'c_adoptionNotesForSolicitingComments',
                      'refer'
                    )
                  "
                  :span="24"
                >
                  <el-form-item
                    :label="
                      existTabField('c_adoptionNotesForSolicitingComments')
                    "
                    :required="
                      existTabField(
                        'c_adoptionNotesForSolicitingComments',
                        'necessary'
                      )
                    "
                  >
                    <el-upload
                      :action="action"
                      :on-success="handlerSuccessAdoptionNotes"
                      :show-file-list="false"
                      v-if="isEdit"
                    >
                      <el-button size="mini" type="primary">
                        {{ $t("bpa_clickUpload") }}
                      </el-button>
                    </el-upload>
                    <p class="fileList">
                      <span
                        v-for="item in attrsForm.fileListAdoptionNotes"
                        :key="item.id"
                        class="margin-r5 margin-b5"
                      >
                        <a class="font-link">{{ item.originalname }}</a>
                        <a
                          class="margin-l5 font-link"
                          :href="downloadUrl(item.id)"
                          target="_blank"
                        >
                          <b class="el-icon-download" />
                        </a>
                        <i
                          class="el-icon-close cursor-pointer"
                          v-if="isEdit"
                          @click="delProcess(index, 'fileListAdoptionNotes')"
                        />
                      </span>
                    </p>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row :gutter="10">
                <!-- 条款及依据表 -->
                <el-col
                  v-if="existTabField('c_termsAndConditions', 'refer')"
                  :span="24"
                >
                  <el-form-item
                    :label="existTabField('c_termsAndConditions')"
                    :required="
                      existTabField('c_termsAndConditions', 'necessary')
                    "
                  >
                    <el-upload
                      :action="action"
                      :on-success="handlerSuccessClause"
                      :show-file-list="false"
                      v-if="isEdit"
                    >
                      <el-button size="mini" type="primary">
                        {{ $t("bpa_clickUpload") }}
                      </el-button>
                    </el-upload>
                    <p class="fileList">
                      <span
                        v-for="item in attrsForm.fileListClause"
                        :key="item.id"
                        class="margin-r5 margin-b5"
                      >
                        <a class="font-link">{{ item.originalname }}</a>
                        <a
                          class="margin-l5 font-link"
                          :href="downloadUrl(item.id)"
                          target="_blank"
                        >
                          <b class="el-icon-download" />
                        </a>
                        <i
                          class="el-icon-close cursor-pointer"
                          v-if="isEdit"
                          @click="delProcess(index, 'fileListClause')"
                        />
                      </span>
                    </p>
                  </el-form-item>
                </el-col>
              </el-row>

              <!-- 关联流程 -->
              <el-row :gutter="10">
                <el-col
                  v-if="existTabField('c_associatedProcess', 'refer')"
                  :span="24"
                >
                  <el-form-item
                    :label="existTabField('c_associatedProcess')"
                    :required="
                      existTabField('c_associatedProcess', 'necessary')
                    "
                  >
                    <el-row>
                      <el-button
                        @click="
                          processlists = attrsForm.relationProcess;
                          isSelectVisible = true;
                        "
                        v-if="isEdit"
                      >
                        {{ existTabField("select", "", true) }}
                      </el-button>
                      <p class="fileList">
                        <span
                          v-for="(item, index) in attrsForm.relationProcess"
                          :key="item.id"
                          class="margin-r5 margin-b5"
                        >
                          {{
                            item.name.indexOf(item.code) === -1
                              ? item.code + item.name
                              : item.name
                          }}
                          <i
                            class="el-icon-close cursor-pointer"
                            v-if="isEdit"
                            @click="delProcess(index, 'relationProcess')"
                          />
                        </span>
                      </p>
                    </el-row>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>
          <el-row class="text-right" v-if="isEdit">
            <el-button v-show="editableTabsValue === '0'" @click="resetCard">
              {{ existTab("20") }}
            </el-button>
            <el-button
              v-show="editableTabsValue === '0'"
              type="primary"
              :disabled="isSaving"
              @click="saveBooks"
            >
              {{ existTab("19") }}
            </el-button>
          </el-row>
        </el-tab-pane>
        <!-- 制度管理内容办法 -->
        <el-tab-pane
          v-if="existTab('2', 'refer')"
          name="2"
          :label="existTab('2')"
        >
          <manage
            v-if="editableTabsValue == 2"
            :tree-id="treeId"
            :docid="editItem.docId"
            :attrsForm="this.attrsForm"
            :is-edit="isEdit"
          />
        </el-tab-pane>
        <!--        制度支持文件-->
        <el-tab-pane
          v-if="existTab('1', 'refer') && this.editItem.docId"
          name="1"
          :label="existTab('1')"
        >
          <processInsit
            :showtabfiled="showtabfiled"
            :modelid="editItem.docId"
            :modeltype="editableTabsValue"
            :is-edit="isEdit"
          />
        </el-tab-pane>
        <!-- 关键风险控制点 -->
        <el-tab-pane
          v-if="existTab('3', 'refer') && this.editItem.docId"
          name="3"
          :label="existTab('3')"
        >
          <riskNecessary
            :showtabfiled="showtabfiled"
            :modelid="editItem.docId"
            :modeltype="editableTabsValue"
            :is-edit="isEdit"
          />
        </el-tab-pane>
        <!-- 关键成功要素 -->
        <el-tab-pane
          v-if="existTab('4', 'refer') && this.editItem.docId"
          name="4"
          :label="existTab('4')"
        >
          <keyElement
            :showtabfiled="showtabfiled"
            :modelid="editItem.docId"
            :modeltype="editableTabsValue"
            :is-edit="isEdit"
          />
        </el-tab-pane>
        <!-- 权限执行表 -->
        <el-tab-pane
          v-if="existTab('9', 'refer') && this.editItem.docId"
          name="9"
          :label="existTab('9')"
        >
          <author
            v-if="editableTabsValue === '9'"
            :showtabfiled="showtabfiled"
            :tree-id="treeId"
            :modelid="editItem.docId"
            :modeltype="editableTabsValue"
            :is-edit="isEdit"
          />
        </el-tab-pane>
        <!-- 修订内容 -->
        <el-tab-pane
          v-if="existTab('10', 'refer') && this.editItem.docId"
          name="10"
          :label="existTab('10')"
        >
          <modify-record
            v-if="editableTabsValue === '10'"
            :showtabfiled="showtabfiled"
            :modelid="editItem.docId"
            :version="version"
            :modeltype="editableTabsValue"
            :is-edit="isEdit"
          />
        </el-tab-pane>
        <!-- 相关性支撑内容 -->
        <el-tab-pane
          v-if="existTab('11', 'refer') && this.editItem.docId"
          name="11"
          :label="existTab('11')"
        >
          <correlation-support
            v-if="editableTabsValue === '11'"
            :docid="editItem.docId"
            :showtabfiled="showtabfiled"
            :modelid="editItem.docId"
            :tree-id="treeId"
            :version="version"
            :modeltype="editableTabsValue"
            :is-edit="isEdit"
          />
        </el-tab-pane>
      </el-tabs>
    </el-dialog>

    <!-- 选择流程 -->
    <select-process
      v-model="isSelectVisible"
      :processlists="processlists"
      :model-id="treeId"
      @confirm="confirmprocess"
    /><!-- 选择流程 -->

    <!-- 配合部门 -->
    <!-- <codistribution
      v-model="iscodisVisible"
      :disData="codistribution"
      @confirm="confirmCoDistribution"
    /> -->
    <!-- 主责部门 -->
    <!-- <distribution
      v-model="isdisVisible"
      :disData="distribution"
      @confirm="confirmDistribution"
    /> -->
    <select-group
      v-model="isGroupVisible"
      :selectTree="['2']"
      :showTree="'1,2,3,4'"
      :selected="selectedID"
      @confirm="handlerGroupSelect"
    >
    </select-group>

    <bas-organieation
      v-model="organieationShow"
      :selected-element="selectedElement"
      :is-specified-group-but="false"
      :multiple="false"
      :is-show-bustom-groups-but="false"
      :select-element="selectElement"
      :show-element="showElement"
      :title="orgtitle"
      @fnCallBack="fnBasOrganieationCallBack"
    />
    <selectRules
      v-model="rulesVisible"
      :ruleSelected="ruleSelected"
      @confirm="selectRuleConfirm"
    />
    <selectRuleFrame
      v-model="ruleFrameVisible"
      :ruleFrameSelected="ruleFrameSelected"
      @confirm="selectRuleFrameConfirm"
    />
  </div>
</template>
<script>
import {
  controlField,
  tabField,
  processattrs,
  processStartOrEnd
} from "@/bpa/api/processDesignCenter";
import fileOperation from "@/bpa/mixins/fileDownView";
import selectProcess from "./selectProcess.vue";
import codistribution from "./codistribution.vue";
import distribution from "./distribution.vue";
import { getFormateDate } from "@/bpa/utils/common";
import {
  getSystem,
  saveBooks,
  getDetails,
  getSystemFolderCopy,
  saveOnlineEdit,
  getRegulationById,
  resetTempfileId
} from "@/bpa/api/rulesCenter/handbookFiles";

const syslists = ["QMS", "EMS", "OHSAS", "ISMS", "RMS", "EnMs"];
export default {
  name: "ProcessCard",
  components: {
    codistribution,
    distribution,
    processInsit: () => import("./processInsit.vue"),
    manage: () => import("./manage.vue"),
    riskNecessary: () => import("./riskNecessary.vue"),
    keyElement: () => import("./keyElement.vue"),
    author: () => import("./author.vue"),
    modifyRecord: () => import("./modifyRecord.vue"),
    correlationSupport: () => import("./correlationSupport.vue"),
    selectProcess: () => import("./selectProcess.vue"),
    selectRules: () => import("./selectRules.vue"),
    selectRuleFrame: () => import("./selectRuleFrame.vue")
  },
  mixins: [fileOperation],
  props: {
    value: {
      type: Boolean,
      default: false
    },
    modelid: {
      type: String,
      default: ""
    },
    treeId: {
      type: String,
      default: ""
    },
    bpmid: {
      type: String,
      default: ""
    },
    version: {
      type: String,
      default: ""
    },
    nodeData: {
      type: Object,
      default: () => {
        return {};
      }
    },
    editItem: {
      type: Object,
      default: () => {
        return {};
      }
    },
    isEdit: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      showtype: "",
      groupType: "",
      selectedID: [],
      isGroupVisible: false,
      rulesVisible: false,
      organieationShow: false,
      selectedElement: {},
      showElement: [],
      selectElement: ["9"],
      orgtitle: "选择人员",
      peopleType: "",
      sysLists: [],
      rebackDataOther: {},
      rebackData: {},
      distribution: {},
      codistribution: {},
      referClose: false,
      isDialogsVisible: false,
      isSelectVisible: false,
      processlists: [],
      isdisVisible: false,
      iscodisVisible: false,
      attrsForm: {
        version: "",
        frameCode: "",
        frameName: "",
        docTitle: "",
        systemCode: "",
        writtenName: "",
        contactName: "",
        introduction: "",
        reason: "",
        updm: "",
        updmName: "",
        downdm: "",
        downdmName: "",
        checkList: [],
        relationProcess: [],
        fileList: [],
        fileListRevisionNotes: [],
        fileListAdoptionNotes: [],
        fileListClause: [],
        codistribution: "",
        codistributionid: "",
        orgname: "",
        orgnameid: "",
        scope: "",
        standby1: "",
        standby2: "",
        standby3: "",
        standby4: "",
        standby5: "",
        standby6: "",
        disScope: ""
      },
      editableTabsValue: 0,
      editableTabs: [],
      // 流程输入、流程输出部分
      syslists: JSON.parse(JSON.stringify(syslists)),
      // 组件附件的调用参数
      // 显示tablist
      showtabfiled: [],
      forlderId: "",
      wordIframe: "",
      isSaving: false,
      ruleSelected: [],
      ruleFrameVisible: false,
      folderid: '',
      ruleFrameSelected: {}
    };
  },
  computed: {
    host() {
      return process.env.VUE_APP_HOST_URL + process.env.VUE_APP_BASE_URL;
    },
    action() {
      return `${this.host}/regulation/upload?username=${this.userid}`;
    },
    download() {
      return this.host + "/regulation/download/";
    },
    viewfile() {
      return this.host + "/document/print/";
    },
    userid() {
      return JSON.parse(localStorage.getItem("portalCurrentUserInfo") || "{}")
        .empuid;
    },
    username() {
      return JSON.parse(localStorage.getItem("portalCurrentUserInfo") || "{}")
        .cnname;
    }
  },
  watch: {
    value(val) {
      this.isDialogsVisible = val;
      if (val) {
        this.referClose = false;
        this.editableTabsValue = "0";
        this.attrsForm.frameCode = this.nodeData.code;
        console.log(this.nodeData);
        this.attrsForm.frameName = this.nodeData.foldername;
        this.attrsForm.docId = this.editItem.docId;
        this.getDetails(this.editItem.docId);
        this.getShowTablist().then(() => {
          this.tabsClick();
        });

        console.log(this.attrsForm);
      } else {
        this.attrsForm = Object.assign({}, this.attrsForm, {
          version: "",
          frameCode: "",
          frameName: "",
          scope: "",
          docTitle: "",
          standby1: "",
          standby2: "",
          standby3: "",
          standby4: "",
          standby5: "",
          standby6: "",
          disScope: "",
          systemCode: "",
          orgname: "",
          orgnameid: "",
          distribution: "",
          codistribution: "",
          codistributionid: "",
          writtenName: "",
          contactName: "",
          introduction: "",
          reason: "",
          updm: "",
          updmName: "",
          downdm: "",
          downdmName: "",
          checkList: [],
          relationProcess: [],
          fileList: [],
          fileListRevisionNotes: [],
          fileListAdoptionNotes: [],
          fileListClause: []
        });
      }
    },
    isDialogsVisible(val) {
      this.$emit("input", val);
    }
    // "attrsForm.orgname"(val) {
    //   val = !val ? [] : JSON.parse(val).orglist;
    //   this.$set(
    //     this.attrsForm,
    //     "orgname",
    //     val
    //       .map((item) => {
    //         return item.name;
    //       })
    //       .join(",")
    //   );
    // if (!this.referClose) {
    //   this.rebackDataOther.disScopeformat = val
    //     .map((item) => {
    //       return item.name;
    //     })
    //     .join(",");
    // }
  },
  // "attrsForm.codistribution"(val) {
  //   val = !val ? [] : JSON.parse(val).orglist;
  //   this.$set(
  //     this.attrsForm,
  //     "codistribution",
  //     val
  //       .map((item) => {
  //         return item.name;
  //       })
  //       .join(",")
  //   );
  // if (!this.referClose) {
  //   this.rebackDataOther.codisScopeformat = val
  //     .map((item) => {
  //       return item.name;
  //     })
  //     .join(",");
  // }
  // },
  // },
  async mounted() {
    this.getSystem();
  },
  methods: {
    selectRuleFrame() {
      this.ruleFrameVisible = true
      this.ruleFrameSelected = {
        id: this.folderid || this.modelid,
        code: this.attrsForm.frameCode,
        foldername: this.attrsForm.frameName
      }
    },
    selectRuleFrameConfirm(data) {
      this.attrsForm.frameName = data.foldername
      this.attrsForm.frameCode = data.code
      this.folderid = data.id
    },
    //删除制度编码
    deleteSystemCode() {
      console.log(this.attrsForm);
      this.attrsForm.frameName = this.attrsForm.frameName.replace(`/${this.attrsForm.frameCode}/`, "");
      console.log(this.attrsForm.frameName);
    },
    focusDeptHandle(type, key, index) {
      this.selectedID = [];
      this.groupType = type;
      console.log(type);
      if (this.groupType === "创建部门") {
        if (this.attrsForm.departmentid) {
          this.attrsForm.departmentid.split(",").forEach((item, index) => {
            this.selectedID.push({
              NAME: this.attrsForm.department
                ? this.attrsForm.department.split(",")[index]
                : "",
              ID: Number(item)
            });
          });
        }
      } else if (this.groupType === "主责部门") {
        this.groupKey = key;
        this.groupIndex = index;
        this.showtype = "consultmanager";
        if (this.attrsForm[key][this.groupIndex].orgname) {
          this.attrsForm[key][this.groupIndex].orgname
            .split(",")
            .forEach((item, index) => {
              this.selectedID.push({
                name: item,
                ID: Number(
                  this.attrsForm[key][this.groupIndex].orgnameid
                    ? this.attrsForm[key][this.groupIndex].orgnameid.split(",")[
                      index
                      ]
                    : ""
                )
              });
              console.log(this.attrsForm);
            });
        }
      } else if (this.groupType === "配合部门") {
        this.groupKey = key;
        this.groupIndex = index;
        if (this.attrsForm[key][this.groupIndex].cooperatedepartment) {
          this.attrsForm[key][this.groupIndex].cooperatedepartment
            .split(",")
            .forEach((item, index) => {
              this.selectedID.push({
                name: item,
                ID: Number(
                  this.attrsForm[key][this.groupIndex].cooperatedepartmentid
                    ? this.attrsForm[key][
                      this.groupIndex
                      ].cooperatedepartmentid.split(",")[index]
                    : ""
                )
              });
            });
        }
      }
      this.isGroupVisible = true;
    },

    chooseRuler() {
      this.selectedID = [];
      this.showtype = "ruler";
      this.isGroupDialogVisible = true;
      if (!this.attrsForm.ruler) return false;
      this.attrsForm.ruler.forEach((item) => {
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
        });
      });
    },

    handlerGroupSelect(list) {
      // debugger
      console.log(2222222222222222222222);
      console.log(this.showtype);

      if (this.showtype == "consultmanager") {
        console.log(this.showtype);
        const arr2 = [];
        for (let i = 0; i < list.length; i++) {
          const consultmanagerList = {
            cnname: "",
            loadChildren: "",
            modelid: "",
            pid: "",
            sort: 0,
            type: "",
            empuid: "",
            value: ""
          };
          consultmanagerList.cnname = list[i].person.name;
          consultmanagerList.empuid = list[i].memberId;
          consultmanagerList.pid = list[i].pid;
          consultmanagerList.type = list[i].type;
          consultmanagerList.empuid = list[i].person.groupId;
          consultmanagerList.value = list[i].name;
          consultmanagerList.id = list[i].id;
          arr2.push(consultmanagerList);
        }
        // this.attrsForm.orgname = arr2;
        this.$set(
          this.attrsForm,
          "orgname",
          list
            .map((item) => {
              return item.name;
            })
            .join(",")
        );
        this.$set(
          this.attrsForm,
          "orgnameid",
          list
            .map((item) => {
              return item.id;
            })
            .join(",")
        );
      } else {
        const arr = [];
        for (let i = 0; i < list.length; i++) {
          const managerList = {
            cnname: "",
            loadChildren: "",
            modelid: "",
            pid: "",
            sort: 0,
            type: "",
            empuid: "",
            value: ""
          };
          managerList.cnname = list[i].person.name;
          managerList.empuid = list[i].memberId;
          managerList.pid = list[i].pid;
          managerList.type = list[i].type;
          managerList.empuid = list[i].person.groupId;
          managerList.value = list[i].name;
          managerList.id = list[i].id;
          arr.push(managerList);
        }
        // this.attrsForm.ruler = arr;
        // this.attrsForm.orgname = arr;
        this.$set(
          this.attrsForm,
          "codistribution",
          list
            .map((item) => {
              return item.name;
            })
            .join(",")
        );
        this.$set(
          this.attrsForm,
          "codistributionid",
          list
            .map((item) => {
              return item.id;
            })
            .join(",")
        );
        // console.log(arr)
      }
      // if (this.groupType === "创建部门") {
      //   this.attrsForm.departmentid = list
      //     .map((item) => {
      //       return item.ID;
      //     })
      //     .join(",");
      //   this.attrsForm.department = list
      //     .map((item) => {
      //       return item.name;
      //     })
      //     console.log(this.attrsForm.department)
      //     console.log(1111111111111111111111111111111111)
      //     .join(",");
      // } else
      // if (this.groupType === "主责部门") {
      //   console.log(this.groupType)
      //   this.$set(
      //     this.attrsForm[this.groupKey][this.groupIndex],
      //     "orgname",
      //     list
      //       .map((item) => {
      //         return item.ID;
      //       })
      //       .join(",")
      //   );
      //   console.log(item.ID)
      //   this.$set(
      //     this.attrsForm[this.groupKey][this.groupIndex],
      //     "orgname",
      //     list
      //       .map((item) => {
      //         return item.name;
      //       })
      //       .join(",")
      //   );
      // } else if (this.groupType === "配合部门") {
      //   this.$set(
      //     this.attrsForm[this.groupKey][this.groupIndex],
      //     "cooperatedepartmentid",
      //     list
      //       .map((item) => {
      //         return item.ID;
      //       })
      //       .join(",")
      //   );
      //   this.$set(
      //     this.attrsForm[this.groupKey][this.groupIndex],
      //     "cooperatedepartment",
      //     list
      //       .map((item) => {
      //         return item.name;
      //       })
      //       .join(",")
      //   );
      // }
    },

    showChoose(type) {
      this.showtype = type;
      this.selectedID = [];
      this.isGroupDialogVisible = true;
      if (!this.attrsForm.consultList) return false;
      this.attrsForm.consultList.forEach((item) => {
        this.selectedID.push({
          ID: parseInt(item.empuid),
          name: item.value,
          TYPE: item.type,
          PID: item.pid,
          person: {
            cnname: item.cnname,
            empid: item.empuid
          }
        });
      });
    },
    onlineEdit() {
      this.wordIframe = "";
      this.$nextTick(() => {
        getRegulationById(this.editItem.docId).then((res) => {
          console.log(res);
          if (!res) return false;
          if (
            (!this.attrsForm.fileList ||
              this.attrsForm.fileList.length === 0) &&
            res.docFile &&
            res.docFile.length > 0
          ) {
            this.attrsForm.fileList.push({
              originalname: res.docFile[0].originalname,
              filesize: res.docFile[0].fileSize + "B",
              downloadUrl:
                this.host + "/regulation/download/" + res.docFile[0].id,
              status: this.$t("uploaded"),
              id: res.docFile[0].id
            });
          }
          const fileId = res.tempfileid
            ? res.tempfileid
            : this.attrsForm.fileList && this.attrsForm.fileList.length > 0
              ? this.attrsForm.fileList[0].id
              : res.fileId
                ? res.fileId
                : "";
          this.wordIframe = `${process.env.VUE_APP_HOST_URL}${process.env.VUE_APP_BASE_URL}/pageOffice/dmIndex?type=edit&dmId=${this.editItem.docId}&fileId=${fileId}&username=${this.$store.state.basuser.user.id}&serverContextPath=${process.env.VUE_APP_BASE_URL}`;
        });
      });
    },
    downloadUrl(fileid) {
      return `${this.host}/regulation/download/${fileid}?username=${this.userid}`;
    },
    getDetails(id) {
      if (id && this.editItem.type !== "add") {
        getDetails(id).then((res) => {
          console.log(res);
          if (!res) return false;
          console.log(res);
          this.attrsForm = res;
          console.log(res);
          const resAttr = res;
          console.log("++++:" + resAttr);
          this.attrsForm = Object.assign({}, this.attrsForm, {
            docTitle: res.title,
            docId: res.docId,
            scope: res.scope,
            standby1: res.standby1,
            standby2: res.standby2,
            standby3: res.standby3,
            standby4: res.standby4,
            standby5: res.standby5,
            standby6: res.standby6,
            systemCode: res.systemCode,
            orgname: res.orgname,
            orgnameid: res.orgnameid || "",
            codistribution: res.codistribution,
            codistributionid: res.codistributionid || "",
            relationProcess: res.relationProcess || [],
            checkList: !res.system ? [] : res.system.split(","),
            fileList: res.docFile || [],
            fileListRevisionNotes: res.revisionNotesFiles || [],
            fileListAdoptionNotes: res.adoptionNotesFiles || [],
            fileListClause: res.clauseFiles || []
          });
          // this.deleteSystemCode()
          this.folderid = res.folderDocumentList && res.folderDocumentList.length > 0 ? res.folderDocumentList[0].folderid : ''
        });
      }

    },
    selectPeople(type) {
      this.peopleType = type;
      this.organieationShow = true;
    },
    fnBasOrganieationCallBack(data) {
      if (this.peopleType === "written") {
        this.$set(this.attrsForm, `${this.peopleType}Name`, data.name);
        this.$set(this.attrsForm, `${this.peopleType}Id`, data.id);
      } else if (this.peopleType === "contact") {
        this.$set(this.attrsForm, `${this.peopleType}Name`, data.name);
        this.$set(this.attrsForm, `${this.peopleType}Id`, data.id);
      } else if (this.peopleType === "standby8") {
        this.$set(this.attrsForm, "standby8", data.name);
        this.$set(this.attrsForm, "standby7", data.id);
      } else if (this.peopleType === "standby10") {
        this.$set(this.attrsForm, "standby10", data.name);
        this.$set(this.attrsForm, "standby9", data.id);
      } else if (this.peopleType === "standby12") {
        this.$set(this.attrsForm, "standby12", data.name);
        this.$set(this.attrsForm, "standby11", data.id);
      }
      this.organieationShow = false;
    },
    selectRule(type) {
      this.ruleType = type;
      this.ruleSelected = [];
      if (
        this.attrsForm[`${this.ruleType}Name`] &&
        this.attrsForm[`${this.ruleType}`]
      ) {
        let titleArr = this.attrsForm[`${this.ruleType}Name`].split(",");
        let docIdArr = this.attrsForm[`${this.ruleType}`].split(",");
        this.ruleSelected = titleArr.map((item, index) => {
          return {
            title: item,
            docId: docIdArr[index]
          };
        });
      }
      this.rulesVisible = true;
    },
    selectRuleConfirm(list) {
      this.attrsForm[`${this.ruleType}Name`] = list
        .map((item) => item.title)
        .join();
      this.attrsForm[`${this.ruleType}`] = list
        .map((item) => item.docId)
        .join();
    },
    beforeAvatarUpload(file) {
      // const extension = file.name.substring(file.name.lastIndexOf(".") + 1);
      // if (extension !== "docx") {
      //   this.$message({
      //     type: "warning",
      //     message: this.existTabField("notePleasePploadDocxFile", "", true)
      //   });
      //   return false;
      // }
      if (this.attrsForm.fileList.length === 1) {
        this.$message({
          type: "warning",
          message: this.existTabField(
            "onlyOneCopyOfTheSystemDocumentCanBeUploaded",
            "",
            true
          )
        });
        return false;
      }
    },
    handlerSuccessFile(res) {
      console.log(res);
      if (res.code === 200) {
        this.attrsForm.fileList.push({
          originalname: res.data.newName,
          filesize: res.data.size + "B",
          downloadUrl: this.host + "/regulation/download/" + res.data.id,
          status: this.$t("uploaded"),
          id: res.data.id
        });
        resetTempfileId(this.editItem.docId);
      } else {
        this.$message({
          type: "warning",
          message: this.$t("hintText.attachmentUploadedfailed")
        });
      }
    },
    handlerSuccessRevisionNotes(res) {
      console.log(res);
      if (res.code === 200) {
        this.attrsForm.fileListRevisionNotes.push({
          originalname: res.data.newName,
          filesize: res.data.size + "B",
          downloadUrl: this.host + "/regulation/download/" + res.data.id,
          status: this.$t("uploaded"),
          id: res.data.id
        });
      } else {
        this.$message({
          type: "warning",
          message: this.$t("hintText.attachmentUploadedfailed")
        });
      }
    },
    handlerSuccessAdoptionNotes(res) {
      console.log(res);
      if (res.code === 200) {
        this.attrsForm.fileListAdoptionNotes.push({
          originalname: res.data.newName,
          filesize: res.data.size + "B",
          downloadUrl: this.host + "/regulation/download/" + res.data.id,
          status: this.$t("uploaded"),
          id: res.data.id
        });
      } else {
        this.$message({
          type: "warning",
          message: this.$t("hintText.attachmentUploadedfailed")
        });
      }
    },
    handlerSuccessClause(res) {
      console.log(res);
      if (res.code === 200) {
        this.attrsForm.fileListClause.push({
          originalname: res.data.newName,
          filesize: res.data.size + "B",
          downloadUrl: this.host + "/regulation/download/" + res.data.id,
          status: this.$t("uploaded"),
          id: res.data.id
        });
      } else {
        this.$message({
          type: "warning",
          message: this.$t("hintText.attachmentUploadedfailed")
        });
      }
    },
    // 获取体系分类
    getSystem() {
      getSystem({
        attr: {},
        filters: [
          {
            key: "RULE_IS_VISIBLE",
            opt: "EQ",
            type: "S",
            value: "Y"
          }
        ],
        logic: "",
        orderby: "",
        pageNum: 1,
        pageSize: 10000,
        sort: ""
      }).then((res) => {
        this.sysLists = res;
      });
    },
    // tab切换
    tabsClick() {
      console.log(this.editableTabsValue, this.editableTabs);
      switch (true) {
        // 获取流程基本属性
        case this.editableTabsValue === "0":
          if (!this.referClose) {
            // this.getProcessAttr();
          }
          this.editableTabs.forEach((item) => {
            if (item.index === 0) {
              this.getShowTabField(item.id, 0);
              return false;
            }
          });
          break;
        // 获取流程支持文件
        case this.editableTabsValue === "1":
          this.referClose = true;
          this.forlderId = "7A88EC3856C446EBE053BF1A13ACC390";
          this.editableTabs.forEach((item) => {
            if (item.index === 1) {
              this.getShowTabField(item.id, 1);
              return false;
            }
          });
          break;
        // 获取关键风险控制点
        case this.editableTabsValue === "3":
          this.referClose = true;
          this.editableTabs.forEach((item) => {
            if (item.index === 3) {
              this.getShowTabField(item.id, 3);
              return false;
            }
          });
          break;
        // 关键成功要素
        case this.editableTabsValue === "4":
          this.referClose = true;
          this.editableTabs.forEach((item) => {
            if (item.index === 4) {
              this.getShowTabField(item.id, 4);
              return false;
            }
          });
          break;
        // 权限执行表
        case this.editableTabsValue === "9":
          this.referClose = true;
          this.editableTabs.forEach((item) => {
            if (item.index === 9) {
              this.getShowTabField(item.id, 9);
              return false;
            }
          });
          break;
        // 修订内容
        case this.editableTabsValue === "10":
          this.referClose = true;
          this.editableTabs.forEach((item) => {
            if (item.index === 10) {
              this.getShowTabField(item.id, 10);
              return false;
            }
          });
          break;
        // 相关性支撑内容
        case this.editableTabsValue === "11":
          this.referClose = true;
          this.editableTabs.forEach((item) => {
            if (item.index === 11) {
              this.getShowTabField(item.id, 11);
              return false;
            }
          });
          break;
        // 制度管理内容管理办法
        case this.editableTabsValue === "2":
          this.referClose = true;
          this.editableTabs.forEach((item) => {
            if (item.index === 2) {
              this.getShowTabField(item.id, 2);
              return false;
            }
          });
          break;
      }
    },
    // 获取Tab栏标题的显示字段的名称
    async getShowTablist() {
      const res = await controlField({
        attr: {},
        filters: [{ key: "sheetType", opt: "EQ", type: "S", value: "1" }],
        logic: "and",
        orderby: "createon",
        pageNum: 1,
        pageSize: 100,
        sort: "desc"
      });
      this.editableTabs = [];
      res.list.forEach((item) => {
        if (item.state === "1") {
          this.editableTabs.push({
            index: parseInt(item.sort),
            name: item.name,
            enname: item.enname,
            id: item.id
          });
        }
      });
      console.log(this.editableTabs);
      return new Promise((resolve, reject) => {
        resolve();
      });
    },
    // 获取显示Tab字段的名称/表格内容
    async getShowTabField(id, type) {
      const res = await tabField({
        attr: {},
        filters: [{ key: "sheetid", opt: "LIKE", type: "S", value: id }],
        logic: "and",
        orderby: "createon",
        pageNum: 1,
        pageSize: 100,
        sort: "desc"
      });
      this.showtabfiled = [];
      console.log(res.list);
      res.list.forEach((item) => {
        if (item.state == "1") {
          this.showtabfiled.push({
            name: item.name,
            enname: item.enname,
            pname: item.pname,
            necessary: item.necessary
          });
        }
      });
      console.log(this.showtabfiled);
      if (type == 0) {
        this.syslists.forEach((item) => {
          if (!this.showtabfiled.some((value, index) => value.pname == item)) {
            this.syslists.splice(this.syslists.indexOf(item), 1);
          }
        });
      }
    },
    existTab(index, type) {
      let obj = {};
      this.editableTabs.forEach((item) => {
        if (item.index === parseInt(index)) {
          obj = JSON.parse(JSON.stringify(item));
          return false;
        }
      });
      const lang = localStorage.getItem("language");
      if (type == "refer") {
        return !obj.index ? obj.index === 0 : true;
      } else {
        let showname;
        if (!obj.index) {
          if (obj.index === 0) {
            if (lang === "cn") {
              showname = obj.name;
            } else {
              showname = obj.enname;
            }
          }
        } else {
          if (lang === "cn") {
            showname = obj.name;
          } else {
            showname = obj.enname;
          }
        }
        // return !obj.index ? (obj.index === 0 ? obj.name : '') : obj.name
        return showname;
      }
    },
    existTabField(pname, type, bool) {
      let obj = {};
      this.showtabfiled.forEach((item) => {
        if (item.pname === pname) {
          obj = JSON.parse(JSON.stringify(item));
          return false;
        }
      });
      const lang = localStorage.getItem("language");
      if (type == "refer") {
        return !!obj.pname;
      } else if (type == "necessary") {
        return obj.necessary == "1";
      } else {
        return obj.pname && lang === "cn"
          ? obj.name + (!bool ? ":" : "")
          : obj.pname && lang === "en"
            ? obj.enname + (!bool ? ":" : "")
            : obj.enname + (!bool ? ":" : "");
      }
    },
    // 重置表单
    resetCard() {
      this.$confirm(
        this.existTabField(
          "areYouSureResetSomeOfTheInformationYouFilledIn",
          "",
          true
        ),
        this.$t("hintText.hint"),
        {
          confirmButtonText: this.$t("confirm"),
          cancelButtonText: this.$t("cancel"),
          type: "warning"
        }
      )
        .then(() => {
          this.attrsForm = Object.assign({}, this.attrsForm, {
            docTitle: "",
            systemCode: "",
            scope: "",
            standby1: "",
            standby2: "",
            standby3: "",
            standby4: "",
            standby5: "",
            standby6: "",
            standby7: "",
            standby8: "",
            standby9: "",
            standby10: "",
            standby11: "",
            standby12: "",
            disScope: "",
            codistribution: "",
            distribution: "",
            writtenName: "",
            contactName: "",
            introduction: "",
            reason: "",
            updm: "",
            updmName: "",
            downdm: "",
            downdmName: "",
            checkList: [],
            relationProcess: [],
            fileList: [],
            fileListRevisionNotes: [],
            fileListAdoptionNotes: [],
            fileListClause: []
          });
        })
        .catch((err) => {
          console.log("重置");
        });
    },
    // 保存流程卡片
    saveBooks() {
      const self = this;
      console.log(this.$refs)
      this.$refs.attrsFormRef.validate(async(valid) => {
        if (valid) {
          // 主文档验证
          if (
            this.existTabField("c_systemDocument", "necessary") &&
            this.attrsForm.fileList.length !== 1
          ) {
            this.$message({
              type: "warning",
              message: this.existTabField(
                "pleaseUploadTheSystemDocument",
                "",
                true
              )
            });
            return;
          }
          // 制度编写说明
          if (
            this.existTabField("c_systemCompilationNotes", "necessary") &&
            this.attrsForm.fileListRevisionNotes.length === 0
          ) {
            this.$message({
              type: "warning",
              message: this.existTabField(
                "pleaseUploadTheSystemCompilationNotes",
                "",
                true
              )
            });
            return;
          }
          // 征求意见情况采纳说明
          if (
            this.existTabField(
              "c_adoptionNotesForSolicitingComments",
              "necessary"
            ) &&
            this.attrsForm.fileListAdoptionNotes.length === 0
          ) {
            this.$message({
              type: "warning",
              message: this.existTabField(
                "pleaseUploadAdoptionNotesForSolicitingComments",
                "",
                true
              )
            });
            return;
          }
          // 条款及依据表
          if (
            this.existTabField("c_termsAndConditions", "necessary") &&
            this.attrsForm.fileListClause.length === 0
          ) {
            this.$message({
              type: "warning",
              message: this.existTabField(
                "pleaseUploadTermsAndConditions",
                "",
                true
              )
            });
            return;
          }
          // 关联流程
          if (
            this.existTabField("c_associatedProcess", "necessary") &&
            this.attrsForm.relationProcess.length === 0
          ) {
            this.$message({
              type: "warning",
              message: this.existTabField(
                "pleaseSelectAssociatedProcess",
                "",
                true
              )
            });
            return;
          }
          // 保存卡片的信息功能=========保存
          this.isSaving = true;
          const loading = this.$loading({
            lock: true,
            text: "Loading",
            spinner: "el-icon-loading",
            background: "rgba(255, 255, 255, 0.5)",
            customClass: "bpa_loading-s"
          });
          console.log(this.attrsForm);
          const res = await saveBooks({
            docId: !this.attrsForm.docId ? "" : this.attrsForm.docId,
            signerlist: [{ userid: this.userid, cnname: this.username }],
            version: this.attrsForm.version,
            frameCode: this.attrsForm.frameCode,
            frameName: this.attrsForm.frameName,
            docTitle: this.attrsForm.docTitle,
            systemCode: this.attrsForm.systemCode,
            orgname: this.attrsForm.orgname,
            orgnameid: this.attrsForm.orgnameid,
            scope: this.attrsForm.scope,
            standby1: this.attrsForm.standby1,
            standby2: this.attrsForm.standby2,
            standby3: this.attrsForm.standby3,
            standby4: this.attrsForm.standby4,
            standby5: this.attrsForm.standby5,
            standby6: this.attrsForm.standby6,
            standby7: this.attrsForm.standby7,
            standby8: this.attrsForm.standby8,
            standby9: this.attrsForm.standby9,
            standby10: this.attrsForm.standby10,
            standby11: this.attrsForm.standby11,
            standby12: this.attrsForm.standby12,
            codistribution: this.attrsForm.codistribution,
            codistributionid: this.attrsForm.codistributionid,
            writtenName: this.attrsForm.writtenName,
            writtenId: this.attrsForm.writtenId,
            contactName: this.attrsForm.contactName,
            contactId: this.attrsForm.contactId,
            introduction: this.attrsForm.introduction,
            reason: this.attrsForm.reason,
            system: this.attrsForm.checkList.toString(),
            relationProcess: this.attrsForm.relationProcess,
            updm: this.attrsForm.updm,
            updmName: this.attrsForm.updmName,
            downdm: this.attrsForm.downdm,
            downdmName: this.attrsForm.downdmName,
            fileId: this.attrsForm.fileList.map((item) => item.id).join(),
            revisionNotes: this.attrsForm.fileListRevisionNotes
              .map((item) => item.id)
              .join(),
            adoptionNotes: this.attrsForm.fileListAdoptionNotes
              .map((item) => item.id)
              .join(),
            clause: this.attrsForm.fileListClause.map((item) => item.id).join(),
            inDate: getFormateDate(new Date(), "yyyy-MM-dd hh:mm:ss"),
            folderDocumentList: [{ documentid: "", folderid: this.folderid || this.modelid }]
          });
          console.log(res);
          this.isSaving = false;
          loading.close();
          if (!res) return false;
          this.$message({
            message: this.existTabField("saveSuccessfully", "", true),
            type: "success"
          });
          this.$emit("confirm");
          this.isDialogsVisible = false;
        } else {
          this.$message({
            message: this.existTabField(
              "requiredFieldsForProcessBasicPropertiesCannotBeEmpty",
              "",
              true
            ),
            type: "warning"
          });
          return false;
        }
      });
    },
    diff(obj1, obj2) {
      var o1 = obj1 instanceof Object;
      var o2 = obj2 instanceof Object;
      if (!o1 || !o2) {
        /*  判断不是对象  */
        return obj1 === obj2;
      }

      if (Object.keys(obj1).length !== Object.keys(obj2).length) {
        return false;
        // Object.keys() 返回一个由对象的自身可枚举属性(key值)组成的数组,例如：数组返回下表：let arr = ["a", "b", "c"];console.log(Object.keys(arr))->0,1,2;
      }

      for (var attr in obj1) {
        var t1 = obj1[attr] instanceof Object;
        var t2 = obj2[attr] instanceof Object;
        if (t1 && t2) {
          return this.diff(obj1[attr], obj2[attr]);
        } else if (obj1[attr] !== obj2[attr]) {
          return false;
        }
      }
      return true;
    },
    confirmprocess(arr) {
      this.attrsForm.relationProcess = JSON.parse(JSON.stringify(arr));
      console.log(this.attrsForm.relationProcess);
    },
    delProcess(i, type) {
      this.attrsForm[type].splice(i, 1);
      this.$forceUpdate();
    },

    // 点击选择事件
    distributeClick() {
      this.showtype = "consultmanager";
      this.selectedID = [];
      console.log(this.attrsForm.orgname);
      console.log(this.attrsForm.orgnameid);
      if (this.attrsForm.orgname !== "") {
        this.attrsForm.orgname.split(",").forEach((item, index) => {
          this.selectedID.push({
            name: item,
            id: this.attrsForm.orgnameid
          });
          // console.log(this.attrsForm.orgnameid)
          // console.log(index)
          // console.log(this.selectedID)
          // console.log(this.attrsForm);
        });
      }

      this.isGroupVisible = true;
    },
    // 点击选择事件
    codistributeClick() {
      this.selectedID = [];
      this.showtype = "codistribute";
      console.log(this.attrsForm.codistribution);
      if (this.attrsForm.codistribution !== "") {
        this.attrsForm.codistribution.split(",").forEach((item, index) => {
          this.selectedID.push({
            name: item,
            id: this.attrsForm.codistributionid
          });
          // this.selectedID = [];
          console.log(item);
          console.log(this.attrsForm);
        });
      }

      this.isGroupVisible = true;
    },

    distributeClear() {
      this.selectedID = [];
    },
    codistributeClear() {
      this.selectedID = [];
    }
  }
};
</script>
<style>
.bpa_loading-s {
  font-size: 40px
}
</style>
<style lang="scss" scoped>
.regulationCard {
  /deep/ .el-dialog__headerbtn {
    top: 12px;
    right: 10px;
    z-index: 999;
  }

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

.subTitle {
  width: 110px;
  text-align: right;
  margin-bottom: 10px;
  font-size: 16px;
}

/*附件部分*/
.fileList {
  margin-top: 6px;

  span {
    display: inline-block;
    line-height: 24px;
    height: 24px;
    padding: 0 4px;
    border: 1px solid #2d42af;
    border-radius: 4px;
    font-size: 12px;
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
      padding: 0 8px;
      margin-right: 15px;
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

/deep/ .el-button:hover,
.el-button:focus {
  background-color: #2d42af !important;
  color: #fff !important;
}

/deep/ .el-input-group__append > .el-button:hover,
.el-button:focus {
  background-color: #2d42af !important;
}

.commonSort {
  &.active {
    background: #2d42af !important;
    border-color: #2d42af !important;
    color: #fff !important;
  }
}

.el-button {
  background-color: #2d42af;
  color: white;
}

</style>
