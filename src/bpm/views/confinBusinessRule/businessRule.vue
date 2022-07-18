<template>
  <div id="businessRule" v-loading="loading">
    <el-tabs type="card" v-model="activeName" class="topCustom">
      <el-tab-pane :label="$t('businessRule')" name="1">
        <div style="text-align: right; margin-right: 10px">
          <el-button
            v-if="!isReadonly"
            @click="recoveryBRRule"
            type="primary"
            >{{ $t('reduction') }}</el-button
          >
          <el-button
            v-if="isReadonly"
            @click="saveForm('form')"
            type="primary"
            >{{ $t('save') }}</el-button
          >
          <el-button type="primary" @click="getRuleDetail">
            {{ $t('refresh') }}</el-button
          >
        </div>
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="form"
          label-width="120px"
        >
          <div class="card1" :class="[basic ? 'h-auto' : '']" ref="card1">
            <div class="header" @click.capture="isShow('card1', 'basic')">
              <span class="title">{{ $t('basicInformation') }}</span>
              <div class="space"></div>
              <el-button type="text">{{
                basic ? $t('putAway') : $t('unfold')
              }}</el-button>
            </div>
            <div class="card-info">
              <el-row>
                <el-col :span="8">
                  <el-form-item :label="$t('ruleName') + '：'" required>
                    <el-input
                      clearable
                      v-model="ruleForm.br.name"
                      :title="ruleForm.br.name"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="$t('priority') + '：'" required>
                    <el-input
                      class="w90"
                      clearable
                      @blur="checkPriority"
                      v-model.number="ruleForm.br.priority"
                    ></el-input>
                    <el-tooltip
                      effect="dark"
                      :enterable="false"
                      placement="top"
                    >
                      <div slot="content">
                        当流程申请创建时同时满足多条业务规则，则取多条中优先级数字最小的一条业务规则
                      </div>
                      <i class="el-icon-question"></i>
                    </el-tooltip>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="$t('whetherToAllowMerge') + '：'">
                    <el-select
                      clearable
                      v-model="ruleForm.br.ifmerge"
                      class="w80"
                      :placeholder="$t('placeholderText.pleaseSelect')"
                    >
                      <el-option
                        v-for="item in option"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      >
                      </el-option>
                    </el-select>
                    <el-tooltip
                      effect="dark"
                      :enterable="false"
                      placement="top"
                    >
                      <div slot="content">
                        选择“否”则只执行现有页面规则，选择“是”则会在“已存在的优先级”中按序号找到下一条规则一起合并执行，直到读取到否时才终止再往下读取，但读到的这条也需合并执行<br />（例：a规则中条件为金额＜1000，b规则中条件为＜2000，勾选允许合并后，当金额为500时，同时走a与b规则中所设置的所有审批节点及其所有审批人）
                      </div>
                      <i class="el-icon-question"></i>
                    </el-tooltip>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item :label="$t('organization2') + '：'" required>
                    <div class="textInput">
                      <el-input
                        class="w90"
                        clearable
                        type="textarea"
                        v-model="ruleForm.br.orgnames"
                        @focus="handleOrg()"
                        readonly
                      >
                      </el-input>
                      <i
                        v-show="ruleForm.br.orgnames"
                        class="clearButtons el-icon-circle-close btn-close-reset"
                        @click.prevent="
                          ruleForm.br.orgnames = ''
                          ruleForm.br.orgids = ''
                        "
                      />
                      <el-tooltip
                      effect="dark"
                      :enterable="false"
                      placement="top"
                    >
                      <div slot="content">
                        用于不同的组织发起审批时可以执行不同的业务规则，例如：行政部可以执行规则A，IT部可以执行规则B
                      </div>
                      <i class="el-icon-question"></i>
                    </el-tooltip>
                    </div>
                  </el-form-item>
                </el-col>

                <el-col :span="8">
                  <el-form-item :label="$t('existingPriority') + '：'">
                    <el-input
                      clearable
                      type="textarea"
                      v-model="ruleForm.prioritys"
                      disabled
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="$t('ruleDescription') + '：'">
                    <div class="textInput">
                      <el-input
                        clearable
                        type="textarea"
                        v-model="ruleForm.br.description"
                      ></el-input>
                      <i
                        v-show="ruleForm.br.description"
                        class="clearButtons el-icon-circle-close"
                        @click.prevent="ruleForm.br.description = ''"
                      />
                    </div>
                  </el-form-item>
                </el-col>
                <!-- <el-col :span="1" align="center"> -->
                <!-- <el-button type="text" @click="ruleForm.br.orgnames = '';ruleForm.br.orgids = ''">{{ $t('empty') }}
                  </el-button> -->
                <!-- </el-col> -->
              </el-row>
            </div>
          </div>
          <div class="card1" :class="[expand ? 'h-auto' : '']" ref="card">
            <div class="header header-title" @click="isShow('card', 'expand')">
              <span class="title">{{ $t('controlConditionCombination') }}</span>
              <el-tooltip
                effect="dark"
                :enterable="false"
                placement="top"
              >
                <div slot="content">
                  可对控制条件设定子条件，执行时从下往上执行（例：请假流程中，     子组合1“请假类型=事假”且“请假天数> 10”，或者子组合2“请假类型=病假”且“请假天数> 20”，<br />这种情况需要使用根组合，将子组合的判断逻辑设为满足所有，将根组合设为满足任一；否则需要配置2条规则）
                </div>
                <i class="el-icon-question"></i>
              </el-tooltip>
              <div class="space"></div>
              <el-button type="text">{{
                expand ? $t('putAway') : $t('unfold')
              }}</el-button>
            </div>
            <div class="card-info">
              <el-row>
                <el-col :span="22" :offset="1">
                  <el-col :span="6" style="overflow: auto">
                    <div class="block">
                      <el-tree
                        class="elTree"
                        :data="ruleForm.ruleComs"
                        node-key="id"
                        ref="elTree"
                        @node-click="nodeHandle"
                        default-expand-all
                        :expand-on-click-node="false"
                      >
                        <span
                          class="custom-tree-node"
                          slot-scope="{ node, data }"
                        >
                          <span>{{ data.name }}</span>
                          <span>
                            <el-button
                              :title="$t('addChildNode')"
                              type="text"
                              size="mini"
                              @click="() => append(node, data)"
                            >
                              <i class="el-icon-plus"></i>
                            </el-button>
                            <el-button
                              v-if="node.level !== 1"
                              :title="$t('deleteChildNode')"
                              type="text"
                              size="mini"
                              @click="() => remove(node, data)"
                            >
                              <i class="el-icon-minus"></i>
                            </el-button>
                          </span>
                        </span>
                      </el-tree>
                    </div>
                  </el-col>
                  <el-col :span="18">
                    <div class="tool-common-wrap">
                      <div class="btn-wrap">
                        <el-button type="primary" @click="addControl">
                          {{ $t('configurationControlType') }}
                          <!---->
                        </el-button>
                        <el-button type="primary" @click="addList('judgeData')">
                          {{ $t('addCondition') }}
                          <!---->
                        </el-button>
                      </div>
                    </div>
                    <div class="margin-t10">
                      <el-form>
                        <el-form-item :label="$t('judgmentLogic') + '：'">
                          <el-radio-group v-model="judgeData.type">
                            <el-radio label="Y">
                              {{ $t('satisfy') }}
                              <span v-if="levelShow === 1">
                                <span class="required">{{
                                  $t('allHave')
                                }}</span>
                                {{ $t('conditionsAndSubCombinations') }}
                              </span>
                              <span v-else>
                                <span class="required">{{
                                  $t('allHave')
                                }}</span>
                                {{ $t('conditionOrSubCombination') }}
                              </span>
                            </el-radio>
                            <el-radio label="N">
                              {{ $t('satisfy') }}
                              <span class="required">{{ $t('either') }}</span>
                              {{ $t('conditionOrSubCombination') }}
                            </el-radio>
                          </el-radio-group>
                        </el-form-item>
                      </el-form>
                      <el-table
                        :data="judgeData.conditions"
                        stripe
                        :header-cell-style="{
                          background: '#E1EAFD !important'
                        }"
                        highlight-current-row
                        style="width: 100%; margin: 15px 0"
                      >
                        <el-table-column
                          :label="$t('controlFieldName')"
                          width="140"
                          align="center"
                        >
                          <template slot-scope="scope">
                            <el-select
                              v-show="scope.row.orgattributeid && scope.row.conType !== 'newAdd'"
                              v-model="scope.row.orgattributeid"
                              @change="selectType(scope.row, scope.$index)"
                              class="w100"
                              :placeholder="$t('placeholderText.pleaseSelect')"
                            >
                              <el-option
                                v-for="item in ruleForm.controls"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id"
                              ></el-option>
                            </el-select>
                            <el-select
                              v-show="scope.row.controlid && scope.row.conType !== 'newAdd'"
                              v-model="scope.row.controlid"
                              @change="selectType(scope.row, scope.$index)"
                              class="w100"
                              :placeholder="$t('placeholderText.pleaseSelect')"
                            >
                              <el-option
                                v-for="item in ruleForm.controls"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id"
                              ></el-option>
                            </el-select>
                            <div style="margin-left: 10px;" v-show="scope.row.conType === 'newAdd'">
                              {{scope.row.conName}}
                            </div>
                          </template>
                        </el-table-column>
                        <el-table-column
                          :label="$t('conditionType')"
                          width="140"
                          align="center"
                        >
                          <template slot-scope="scope">
                            <el-select
                              v-show="scope.row.controltype === 'org'"
                              v-model="scope.row.conditiontype"
                              clearable
                              class="w100"
                              :placeholder="$t('placeholderText.pleaseSelect')"
                            >
                              <el-option
                                v-for="item in judgingList"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                              ></el-option>
                            </el-select>
                            <div v-show="scope.row.controltype === 0">
                              {{ $t('customCondition') }}
                            </div>
                            <div v-show="scope.row.controltype === 1">
                              {{ $t('rangeCondition') }}
                            </div>
                          </template>
                        </el-table-column>
                        <el-table-column width="210" align="center">
                          <template slot="header">
                            <span class="required">*</span>
                            {{ $t('conditionalResult') }}
                          </template>
                          <template slot-scope="scope">
                            <div
                              v-if="
                                conditionalResultList[scope.$index] &&
                                  conditionalResultList[scope.$index].length >=
                                    0 &&
                                  scope.row.controltype === 0
                              "
                            >
                              <el-select
                                clearable
                                collapse-tags
                                v-model="scope.row.result"
                                class="w100"
                              >
                                <el-option
                                  v-for="item in conditionalResultList[
                                    scope.$index
                                  ]"
                                  :key="item.value"
                                  :label="item.text"
                                  :value="item.value"
                                >
                                </el-option>
                              </el-select>
                            </div>
                            <template v-else>
                              <div v-show="scope.row.controltype === 'org'">
                                <el-input
                                  v-model="scope.row.conditionresult"
                                  maxlength="100"
                                  clearable
                                  show-word-limit
                                >
                                </el-input>
                              </div>
                              <div
                                v-show="scope.row.controltype === 0"
                                style="text-align: left"
                              >
                                {{ $t('customResult') }}：
                                <el-input
                                  v-model="scope.row.result"
                                  maxlength="100"
                                  clearable
                                  show-word-limit
                                  style="width: 50%"
                                ></el-input>
                              </div>
                              <div
                                v-show="scope.row.controltype === 1"
                                style="text-align: left"
                              >
                                <p>
                                  {{ $t('max') }}：
                                  <el-input
                                    :min="scope.row.minvalue"
                                    v-model="scope.row.maxvalue"
                                    clearable
                                    maxlength="10"
                                    show-word-limit
                                    oninput="value=value.replace(/[^\d.-]/g,'')"
                                    style="width: 50%"
                                  ></el-input>
                                </p>
                                <p>
                                  {{ $t('min') }}：
                                  <el-input
                                    :max="scope.row.maxvalue"
                                    maxlength="10"
                                    show-word-limit
                                    clearable
                                    v-model="scope.row.minvalue"
                                    oninput="value=value.replace(/[^\d.-]/g,'')"
                                    style="width: 50%"
                                  ></el-input>
                                </p>
                              </div>
                            </template>
                          </template>
                        </el-table-column>
                        <el-table-column :label="$t('comparisonLogic')"  prop="controltype">
                          <template slot-scope="scope">
                            {{getComparisonLogic(scope.row)}}
                          </template>
                        </el-table-column>
                        <el-table-column
                          :label="$t('operation')"
                          align="center"
                          width="60"
                        >
                          <template slot-scope="scope">
                            <el-button
                              type="text"
                              icon="el-icon-delete"
                              @click="deleteList(scope.$index, 'judgeData')"
                            >
                            </el-button>
                          </template>
                        </el-table-column>
                      </el-table>
                    </div>
                  </el-col>
                </el-col>
              </el-row>
            </div>
          </div>
        </el-form>
        <el-form label-width="0">
          <div
            class="card1"
            v-for="(item, index) in ruleForm.nodes"
            :ref="'approve' + index"
            :key="index"
          >
            <div class="header">
              <span
                class="title"
                @click.capture="isApprove('approve' + index, index)"
              >
                <el-button type="text">
                  <i
                    :class="[
                      shrink['approve' + index]
                        ? 'el-icon-minus'
                        : 'el-icon-plus'
                    ]"
                  ></i>
                </el-button>
                {{ item.processnodename }}
              </span>
              <div class="space">
                <el-form-item style="margin-left: 10px">
                  <el-checkbox
                    v-model="item.isUsed"
                    :disabled="item.newDisabled"
                    >{{ $t('startTheCurrentNode') }}</el-checkbox
                  >
                  <el-checkbox
                    v-model="item.isskip"
                    :disabled="item.newDisabled"
                    >{{ $t('whetherToSkipEmpty') }}</el-checkbox
                  >
                  <el-checkbox
                    v-model="item.ispreapproval"
                    :disabled="item.newDisabled"
                    @change="selectionRange(item)"
                    >{{ $t('rangeSelection') }}
                  </el-checkbox>
                </el-form-item>
              </div>
              <el-button
                type="text"
                @click.capture="isApprove('approve' + index, index)"
              >
                {{
                  shrink['approve' + index] ? $t('putAway') : $t('unfold')
                }}</el-button
              >
            </div>
            <div class="card-info">
              <el-row>
                <el-col :span="9" :offset="1">
                  <el-form-item>
                    <el-checkbox
                      slot-scope="slot"
                      v-model="item.posIsUsed"
                      :disabled="item.newDisabled"
                    >
                      <div class="textInput">
                        <label>{{ $t('post') }}：</label>
                        <el-input
                          type="textarea"
                          clearable
                          @focus="dialogHandle('isPostDialog', index)"
                          v-model="item.appposnames"
                          readonly
                          :disabled="item.newDisabled"
                        ></el-input>
                        <i
                          v-show="item.appposnames"
                          class="clearButton el-icon-circle-close"
                          @click.prevent="
                            item.appposids = ''
                            item.appposnames = ''
                          "
                        />
                      </div>
                    </el-checkbox>
                  </el-form-item>
                </el-col>
                <!-- <el-col :span="1">
                  <el-button type="text" @click="item.appposids = '';item.appposnames = ''">{{$t('empty')}}</el-button>
                </el-col> -->
                <el-col :span="9" :offset="1">
                  <el-form-item>
                    <el-checkbox
                      slot-scope="slot"
                      v-model="item.postIsUsed"
                      :disabled="item.newDisabled"
                    >
                      <div class="textInput">
                        <label>{{ $t('postGroup') }}：</label>
                        <el-input
                          type="textarea"
                          clearable
                          v-model="item.apppostnames"
                          @focus="dialogHandle('isPostGroupDialog', index)"
                          readonly
                          :disabled="item.newDisabled"
                        ></el-input>
                        <i
                          v-show="item.apppostnames"
                          class="clearButton el-icon-circle-close"
                          @click.prevent="
                            item.apppostids = ''
                            item.apppostnames = ''
                          "
                        />
                      </div>
                    </el-checkbox>
                  </el-form-item>
                </el-col>
                <!-- <el-col :span="1">
                  <el-button type="text" @click="item.apppostids = '';item.apppostnames = ''">{{$t('empty')}}</el-button>
                </el-col> -->
                <!-- 流程角色 -->
                <el-col :span="9" :offset="1">
                  <el-form-item>
                    <el-checkbox
                      slot-scope="slot"
                      v-model="item.processroleIfUsed"
                      :disabled="item.newDisabled"
                    >
                      <div class="textInput">
                        <label>{{ $t('processRole') }}：</label>
                        <el-input
                          type="textarea"
                          clearable
                          @focus="dialogHandle('isProcessRoles', index)"
                          v-model="item.processrolename"
                          :disabled="item.newDisabled"
                        ></el-input>
                        <i
                          v-show="item.processrolename"
                          class="clearButton el-icon-circle-close"
                          @click.prevent="
                            item.processroleid = ''
                            item.processrolename = ''
                          "
                        />
                      </div>
                    </el-checkbox>
                  </el-form-item>
                </el-col>
                <!-- <el-col :span="1">
                  <el-button type="text" @click="item.processroleid = '';item.processrolename = ''">{{$t('empty')}}
                  </el-button>
                </el-col> -->
                <!--            <el-col :span="1">&nbsp;</el-col>-->
                <!-- 业务角色 -->
                <el-col :span="9" :offset="1">
                  <el-form-item>
                    <el-checkbox
                      slot-scope="slot"
                      v-if="item.newDisabled"
                      :disabled="item.newDisabled"
                      v-model="item.brIsUsed"
                    >
                      <div class="textInput">
                        <label>{{ $t('businessRole') }}：</label>

                        <el-input
                          type="textarea"
                          clearable
                          :disabled="item.newDisabled"
                          @focus="dialogHandle('isBusinessRole', index)"
                          v-model="item.brnames"
                        ></el-input>
                        <i
                          v-show="item.brnames"
                          class="clearButton el-icon-circle-close"
                          @click.prevent="
                            item.brids = ''
                            item.brnames = ''
                          "
                        />
                      </div>
                    </el-checkbox>

                    <el-checkbox
                      slot-scope="slot"
                      v-else
                      :disabled="item.ispreapproval"
                      v-model="item.brIsUsed"
                    >
                      <div class="textInput">
                        <label>{{ $t('businessRole') }}：</label>

                        <el-input
                          type="textarea"
                          clearable
                          :disabled="item.ispreapproval"
                          @focus="dialogHandle('isBusinessRole', index)"
                          v-model="item.brnames"
                        ></el-input>
                        <i
                          v-show="item.brnames"
                          class="clearButton el-icon-circle-close"
                          @click.prevent="
                            item.brids = ''
                            item.brnames = ''
                          "
                        />
                      </div>
                    </el-checkbox>
                  </el-form-item>
                </el-col>
                <!-- <el-col :span="1">
                  <el-button type="text" @click="item.brids = '';item.brnames = ''">{{$t('empty')}}</el-button>
                </el-col> -->
              </el-row>
              <el-row>
                <!-- 页面选择人 -->
                <el-col :span="9" :offset="1">
                  <el-form-item>
                    <el-checkbox
                      slot-scope="slot"
                      v-if="item.newDisabled"
                      :disabled="item.newDisabled"
                      v-model="item.boIsUsed"
                    >
                      <label>{{ $t('pageSelector') }}：</label>
                      <el-select
                        style="width: 256px"
                        v-model="item.boid"
                        multiple
                        clearable
                        :disabled="item.newDisabled"
                        :placeholder="$t('placeholderText.pleaseSelect')"
                        @change="changeBoid(item)"
                      >
                        <el-option
                          v-for="item in ruleForm.controlField"
                          :key="item.id"
                          :label="item.name"
                          :value="item.id"
                        >
                        </el-option>
                      </el-select>
                    </el-checkbox>

                    <el-checkbox
                      slot-scope="slot"
                      v-else
                      :disabled="item.ispreapproval"
                      v-model="item.boIsUsed"
                    >
                      <label>{{ $t('pageSelector') }}：</label>
                      <el-select
                        style="width: 256px"
                        v-model="item.boid"
                        multiple
                        clearable
                        :disabled="item.ispreapproval"
                        :placeholder="$t('placeholderText.pleaseSelect')"
                        @change="changeBoid(item)"
                      >
                        <el-option
                          v-for="item in ruleForm.controlField"
                          :key="item.id"
                          :label="item.name"
                          :value="item.id"
                        >
                        </el-option>
                      </el-select>
                    </el-checkbox>
                  </el-form-item>
                </el-col>

                <!-- <el-col :span="1">
                  <el-button type="text" @click="item.appuserids = '';item.appusernames = ''">{{$t('empty')}}</el-button>
                </el-col> -->
                <el-col :span="10" :offset="1">
                  <el-form-item>
                    <el-checkbox
                      slot-scope="slot"
                      v-if="item.newDisabled"
                      :disabled="item.newDisabled"
                      v-model="item.uboIsUsed"
                    >
                      <label>{{ $t('userAdministrator') }}：</label>
                      <el-select
                        class="select-width"
                        clearable
                        v-model="item.uboid"
                        :disabled="item.newDisabled"
                        :placeholder="$t('placeholderText.pleaseSelect')"
                      >
                        <el-option
                          v-for="item in ruleForm.controlField"
                          :key="item.id"
                          :label="item.name"
                          :value="item.id"
                        >
                        </el-option>
                      </el-select>
                      <el-select
                        class="select-width"
                        clearable
                        v-model="item.userattr"
                        :disabled="item.newDisabled"
                        :placeholder="$t('placeholderText.pleaseSelect')"
                      >
                        <el-option
                          v-for="item in userattrList"
                          :key="item.fieldvalue"
                          :label="item.fieldname"
                          :value="item.fieldvalue"
                        ></el-option>
                      </el-select>
                    </el-checkbox>

                    <el-checkbox
                      slot-scope="slot"
                      v-else
                      :disabled="item.ispreapproval"
                      v-model="item.uboIsUsed"
                    >
                      <label>{{ $t('userAdministrator') }}：</label>
                      <el-select
                        class="select-width"
                        clearable
                        v-model="item.uboid"
                        :disabled="item.ispreapproval"
                        :placeholder="$t('placeholderText.pleaseSelect')"
                      >
                        <el-option
                          v-for="item in ruleForm.controlField"
                          :key="item.id"
                          :label="item.name"
                          :value="item.id"
                        >
                        </el-option>
                      </el-select>
                      <el-select
                        class="select-width"
                        clearable
                        v-model="item.userattr"
                        :disabled="item.ispreapproval"
                        :placeholder="$t('placeholderText.pleaseSelect')"
                      >
                        <el-option
                          v-for="item in userattrList"
                          :key="item.fieldvalue"
                          :label="item.fieldname"
                          :value="item.fieldvalue"
                        ></el-option>
                      </el-select>
                    </el-checkbox>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="9" :offset="1">
                  <el-form-item>
                    <el-checkbox
                      slot-scope="slot"
                      v-model="item.userIsUsed"
                      :disabled="item.newDisabled"
                    >
                      <div class="textInput">
                        <label>{{ $t('specificPerson') }}：</label>
                        <el-input
                          type="textarea"
                          clearable
                          @focus="dialogHandle('peopleDialog', index)"
                          v-model="item.appusernames"
                          :disabled="item.newDisabled"
                        ></el-input>
                        <i
                          v-show="item.appusernames"
                          class="clearButton el-icon-circle-close"
                          @click.prevent="
                            item.appuserids = ''
                            item.appusernames = ''
                          "
                        />
                      </div>
                    </el-checkbox>
                  </el-form-item>
                </el-col>
                <el-col :span="9" :offset="1">
                  <el-form-item>
                    <el-checkbox
                      slot-scope="slot"
                      v-if="item.newDisabled"
                      :disabled="item.newDisabled"
                      v-model="item.orgIfUsed"
                    >
                      <label>{{ $t('organization3') }}：</label>
                      <el-input
                        clearable
                        type="textarea"
                        :disabled="item.newDisabled"
                        @focus="dialogHandle('isOrganization', index)"
                        v-model="item.nodeorgnames"
                      ></el-input>
                    </el-checkbox>
                    <el-checkbox
                      slot-scope="slot"
                      v-else
                      :disabled="!item.ispreapproval"
                      v-model="item.orgIfUsed"
                    >
                      <label>{{ $t('organization3') }}：</label>
                      <el-input
                        clearable
                        type="textarea"
                        :disabled="!item.ispreapproval"
                        @focus="dialogHandle('isOrganization', index)"
                        v-model="item.nodeorgnames"
                      ></el-input>
                    </el-checkbox>
                  </el-form-item>
                </el-col>
                <!-- <el-col :span="1">
                  <el-button type="text" @click="item.nodeorgnames = '';item.nodeorgids = ''">{{$t('empty')}}</el-button>
                </el-col> -->
              </el-row>
              <!-- 角色 -->
              <!-- 职责 -->

              <el-row>
                <!-- <el-col :span="9" :offset="1">
                  <el-form-item>
                    <el-checkbox
                      slot-scope="slot"
                      v-model="item.roleIsUsed"
                      :disabled="item.newDisabled"
                    >
                      <div class="textInput">
                        <label>{{ $t("role") }}：</label>
                        <el-input
                          type="textarea"
                          clearable
                          @focus="dialogHandle('isRoles', index)"
                          v-model="item.rolenames"
                          :disabled="item.newDisabled"
                        ></el-input>
                        <i
                          v-show="item.rolenames"
                          class="clearButton el-icon-circle-close"
                          @click.prevent="
                            item.roleids = '';
                            item.rolenames = '';
                          "
                        />
                      </div>
                    </el-checkbox>
                  </el-form-item>
                </el-col> -->

                <el-col :span="9" :offset="1">
                  <el-form-item>
                    <el-checkbox
                      slot-scope="slot"
                      v-model="item.dutyIsUsed"
                      :disabled="item.newDisabled"
                    >
                      <div class="textInput">
                        <label>{{ $t('responsibility') }}：</label>
                        <el-input
                          type="textarea"
                          clearable
                          @focus="dialogHandle('isresponsibility', index)"
                          v-model="item.dutynames"
                          :disabled="item.newDisabled"
                        ></el-input>
                        <i
                          v-show="item.dutynames"
                          class="clearButton el-icon-circle-close"
                          @click.prevent="
                            item.dutyids = ''
                            item.dutynames = ''
                          "
                        />
                      </div>
                    </el-checkbox>
                  </el-form-item>
                </el-col>
              </el-row>
              <!-- 页面选择人 -->
              <!--
              <el-row>
                <el-col :span="9" :offset="1">
                  <el-form-item>
                    <el-checkbox
                      slot-scope="slot"
                      v-if="item.newDisabled"
                      :disabled="item.newDisabled"
                      v-model="item.boIsUsed"
                    >
                      <label>{{ $t("superiornode") }}：</label>
                      <el-select
                        style="width: 256px"
                        v-model="item.boid"
                        multiple
                        clearable
                        :disabled="item.newDisabled"
                        :placeholder="$t('placeholderText.pleaseSelect')"
                        @change="changeBoid(item)"
                      >
                        <el-option
                          v-for="item in ruleForm.controlField"
                          :key="item.id"
                          :label="item.name"
                          :value="item.id"
                        >
                        </el-option>
                      </el-select>
                    </el-checkbox>

                    <el-checkbox
                      slot-scope="slot"
                      v-else
                      :disabled="item.ispreapproval"
                      v-model="item.boIsUsed"
                    >
                      <label>{{ $t("pageSelector") }}：</label>
                      <el-select
                        style="width: 256px"
                        v-model="item.boid"
                        multiple
                        clearable
                        :disabled="item.ispreapproval"
                        :placeholder="$t('placeholderText.pleaseSelect')"
                        @change="changeBoid(item)"
                      >
                        <el-option
                          v-for="item in ruleForm.controlField"
                          :key="item.id"
                          :label="item.name"
                          :value="item.id"
                        >
                        </el-option>
                      </el-select>
                    </el-checkbox>
                  </el-form-item>
                </el-col>
              </el-row> -->
              <!-- <el-row>
                <el-col :span="9" :offset="1" v-show="item.ispreapproval">
                  <el-form-item>
                    <label>{{ $t("selectNode") }}：</label>
                    <el-select
                      v-model="item.prenodes"
                      multiple
                      clearable
                      collapse-tags
                      style="margin-left: 20px"
                      :placeholder="$t('placeholderText.pleaseSelect')"
                      :disabled="item.newDisabled"
                    >
                      <el-option
                        v-for="item in ruleForm.prenodes"
                        :key="item.id"
                        :label="item.activityname"
                        :value="item.id"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row> -->
            </div>
          </div>
        </el-form>
      </el-tab-pane>
      <el-tab-pane :label="$t('flowChart')" name="2">
        <instance-image-page
          v-model="dialogVisibleImage"
          :instanceId="ruleForm.processModelName"
          :bpaVersion="
            $route.query.bpaVersion
              ? $route.query.bpaVersion
              : processData.bpaVersion
              ? processData.bpaVersion
              : ''
          "
        />
      </el-tab-pane>
    </el-tabs>
    <bas-organieation
      v-model="organieationShow"
      :selectedElement="orgObj"
      :isSpecifiedGroupBut="false"
      :isShowBustomGroupsBut="false"
      :selectElement="selectElement"
      :showElement="showElement"
      :isShowOrgPost="true"
      :title="orgtitle"
      @fnCallBack="fnBasOrganieationCallBack"
    />
    <post-group-dialog
      v-model="isPostGroupDialog"
      :postGroupIds="postGroupIds"
      :title="$t('selectJobGroup')"
      @confirm="getPostGroupData"
    />
    <business-role-dialog
      v-model="isBusinessRole"
      :businessRoleIds="businessRoleIds"
      :title="$t('chooseABusinessRole')"
      @confirm="getBusinessRoleData"
    />
    <process-roles-dialog
      v-model="isProcessRoles"
      :itemList="processRolesList"
      @confirm="getProcessRolesData"
    />

    <roles-dialog
      v-model="isRoles"
      :itemList="RolesList"
      @confirm="getRolesData"
    />

    <duty-dialog v-model="isduty" :itemList="dutyList" @confirm="getdutyData" />

    <add-transaction-dialog
      v-model="dialogVisible"
      :treeData="processData"
      :editItem="editItem"
      :title="linkTitle"
      @confirm="saveSuccess"
    />
    <confition-control-type-dialog
      v-model="confitionControlTypeDialogShow"
      :businessRoleIds="businessRoleIds"
      :title="$t('configurationControlType')"
      ref="confitionControl"
      :selectItem="selectItem"
      @confirm="getConfitionRoleData"
      @addTransaction="addTransactionAction"
    />
  </div>
</template>
<script>
import Vue from 'vue'
import cookie from 'js-cookie'
import organizationDialog from '../flow_form/SelectOrganization'
import postGroupDialog from './postGroupDialog'
import businessRoleDialog from './businessRoleDialog'
import processRolesDialog from './processRolesDialog'
import RolesDialog from './RolesDialog'
import DutyDialog from './DutyDialog'
import confitionControlTypeDialog from './confitionControlTypeDialog' // 配置控制类型
import InstanceImagePage from '@/bpm/components/InstanceImagePage'
import {
  getBusinessRuleDetail,
  saveBusinessRule,
  recoveryBRTree
} from '../../api/confinBusinessRule'
import { getIsAdmin } from '@/bpm/api/configManage/navConfig'
import { getBusinessAttributeList } from '@/bpm/api/process/business/service_attribute'
import addTransactionDialog from './addTransactionDialog'
import { getOrgTree } from '@/bpm/api/app'
import BasComponent from 'bas-component'
Vue.use(BasComponent)
import 'bas-component/lib/BasComponent.css'
import { createNamespacedHelpers } from 'vuex'
const { mapMutations, mapGetters } = createNamespacedHelpers('processDesign')

export default {
  name: 'businessRule',
  computed: {
    ...mapGetters(['processData'])
  },
  components: {
    DutyDialog,
    RolesDialog,
    organizationDialog,
    postGroupDialog,
    businessRoleDialog,
    addTransactionDialog,
    processRolesDialog,
    InstanceImagePage,
    confitionControlTypeDialog
  },
  props: {
    treeData: {
      type: Object
    },
    type: {
      type: String,
      default: ''
    }
  },
  watch: {
    'judgeData.conditions': {
      handler: function(val) {
        if (val) {
          this.conditionalResultList = []
          val.forEach((item, index) => {
            this.conditionalResultList.push([])
            this.ruleForm.controls.forEach(element => {
              if (item.orgattributeid === element.id) {
                item.controltype = element.controltype
                item.controlid = ''
                this.conditionalResultList[index] = element.nodeoptions
              } else if (item.controlid === element.id) {
                item.controltype = element.controltype
                item.orgattributeid = ''
                this.conditionalResultList[index] = element.nodeoptions
              }
            })
          })
        }
      },
      deep: true
    },
    treeData(val) {
      console.log(val)
      if (val.type === '2') {
        getBusinessAttributeList({
          logic: 'and',
          filters: [{ key: 'type', opt: 'LIKE', type: 'S', value: '1' }]
        }).then(rt => {
          if (rt.status === '200') {
            this.userattrList = rt.data.list
          }
        })
        this.getRuleDetail() //刷新 获取详情值
      }
    },
    activeName(val) {
      if (val == '1') {
        this.dialogVisibleImage = false
      } else {
        this.dialogVisibleImage = true
      }
    }
  },
  data() {
    return {
      confitionControlTypeDialogShow: false,
      isduty: false,
      dutyList: [],
      RolesList: [],
      isRoles: false,
      activeName: '1',
      editItem: {},
      linkTitle: '',
      userattrList: [],
      orgType: '',
      dialogVisible: false,
      dialogVisibleImage: false,
      orgObj: {},
      postObj: [],
      isReadonly: this.$route.query.type === 'edit' || this.type === 'edit',
      shrink: {},
      priority: '',
      postIds: '',
      peopleList: [],
      processRolesList: [],
      businessRoleIds: '',
      postGroupIds: '',
      loading: false,
      isProcessRoles: false,
      isPostGroupDialog: false,
      isBusinessRole: false,
      ruleForm: {
        br: {}
      },
      rules: {},
      expand: true,
      basic: true,
      option: [
        {
          value: 'Y',
          label: this.$t('yes')
        },
        {
          value: 'N',
          label: this.$t('no')
        }
      ],
      judgingList: [
        {
          value: '=',
          label: '='
        },
        {
          value: '!=',
          label: '!='
        },
        {
          value: '包含',
          label: this.$t('contain')
        },
        {
          value: '被包含',
          label: this.$t('contained')
        }
      ],
      isNum: false,
      isResult: false,
      isNumNull: false,
      isConditionresult: false,
      judgeData: {},
      levelShow: 1,
      tabIndex: '',
      organieationShow: false,
      selectedElement: {},
      showElement: [],
      selectElement: ['9'],
      orgtitle: this.$t('selectPersonnel'),
      basOrganieationMultiple: true,
      userAll: [],
      conditionalResultList: [],
      isAdminBoolean: false, //true管理员 false非管理员
      loginUserId: cookie.get('username'),
      selectItem: {
        dialogType: 'match' //match 配置弹框；add 添加控制
      },
      compare: [
        {
          name: "Max≧Value＞Min",
          value: 1,
        },
        {
          name: "Max≧Value≧Min",
          value: 2,
        },
        {
          name: "Max＞Value≧Min",
          value: 3,
        },
        {
          name: "Max＞Value＞Min",
          value: 4,
        },
        {
          name: this.$t("equal"),
          value: 5,
        },
        {
          name: this.$t("noequal"),
          value: 6,
        },
        {
          name: this.$t("contained"),
          value: 7,
        },
        {
          name: this.$t("contain"),
          value: 8,
        }
      ]
    }
  },
  mounted() {
    this.getIsAdminHandle()
  },
  methods: {
    // 返回比较逻辑
    getComparisonLogic(item) {
      // console.log(item)
      var name = ''
      for (let i = 0; i < this.compare.length; i++) {
        let dic = this.compare[i]
        if (item.operator === dic.value) {
          name = dic.name
        }
      }
      return name
    },
    getConfitionRoleData(list) {
      console.log(list)
      if (this.selectItem.dialogType === 'add') {
        list.forEach(element => {
            this.judgeData.conditions.push({
              conditionresult: '',
              conditiontype: '=',
              operator: element.operator,
              controltype: this.ruleForm.controls[0].controltype,
              controlid: element.id,
              maxvalue: 0,
              minvalue: 0,
              conType: 'newAdd',
              conName: element.name,
              orgattributeid: '',
              id: '',
              // result: "Y"
              result: ''
            })
        })
        console.log(this.judgeData.conditions)
      }
    },
    addTransactionAction(item) {
      this.dialogVisible = true
      this.editItem = JSON.parse(JSON.stringify(item))
      this.editItem.processid = this.$route.query.processId
          ? this.$route.query.processId
          : this.processData.id,
      this.linkTitle = this.editItem.linkTitle
    },
    getInstanceImage() {
      this.dialogVisibleImage = true
      this.isActiveImage = true
      this.isActiveRule = false
    },
    changeBusinessRule() {
      this.dialogVisibleImage = false
      this.isActiveRule = true
      this.isActiveImage = false
    },
    getIsAdminHandle() {
      getIsAdmin()
        .then(rt => {
          if (rt.data === false) {
            //非管理员
            this.isAdminBoolean = false
          } else {
            this.isAdminBoolean = true
          }
        })
        .catch(er => {
          console.log(er)
        })
    },
    ruleFormDateInit() {
      this.ruleForm.nodes.map(item => {
        let result = item
        let containUserId
        //-1 不存在， 当前登录人不在业务规则权限人的选择范围里
        if (item.authusers) {
          containUserId = item.authusers
            .split(',')
            .findIndex(o => o == this.loginUserId)
        } else {
          containUserId = -1
        }
        // 不是管理员，且是刚性的，当前登录人不在业务规则权限人的选择范围里， 不可编辑
        if (
          !this.isAdminBoolean &&
          result.nodeattr === '1' &&
          containUserId === -1
        ) {
          result.newDisabled = true
        } else {
          result.newDisabled = false
        }
        return { ...result }
      })
      this.ruleForm = { ...this.ruleForm }
      console.log('this.ruleForm', this.ruleForm)
    },
    changeBoid(item) {
      item.boIsUsed = item.boid && item.boid.length > 0
    },
    addControl() {
      this.editItem = {
        processid: this.$route.query.processId
          ? this.$route.query.processId
          : this.processData.id,
        controltype: '',
        operator: '',
        applicationmodule: []
      }
      // console.log(this.editItem)
      this.selectItem = {}
      this.selectItem = this.editItem
      this.selectItem.dialogType = 'match'
      this.confitionControlTypeDialogShow = !this.confitionControlTypeDialogShow
    },
    saveSuccess(data) {
      let than = this
      than.loading = true
      let ids = {}
      // console.log('======',this.$refs.confitionControl)
      if (this.$refs.confitionControl) {
        this.$refs.confitionControl.getData()
      }
      if (this.treeData.brid) {
        ids = {
          id: than.treeData.id
        }
      } else {
        ids = {
          brtreeid: than.treeData.id
        }
      }
      getBusinessRuleDetail({
        processId: than.$route.query.processId
          ? than.$route.query.processId
          : than.processData.id,
        version:
          than.$route.query.version || than.$route.query.version === ''
            ? than.$route.query.version
            : than.processData.version,
        ...ids
      })
        .then(rt => {
          than.loading = false
          than.ruleForm.controls = rt.data.controls
        })
        .catch(er => {
          than.loading = false
        })
    },
    checkPriority() {
      let arr = []
      if (this.ruleForm.prioritys) {
        arr = this.ruleForm.prioritys
          .split(',')
          .filter(x => Number(x) === Number(this.ruleForm.br.priority))
      }

      if (/\D/.test(this.ruleForm.br.priority)) {
        this.$message.error(this.$t('hintText.onlyIntegersCanBeEntered'))
        this.ruleForm.br.priority = ''
      } else if (Number(this.ruleForm.br.priority) < 1) {
        this.$message.error(
          this.$t('hintText.priorityMustBeGreaterThanOrEqualTo')
        )
        this.ruleForm.br.priority = ''
      } else if (
        this.priority !== this.ruleForm.br.priority &&
        arr.length > 0
      ) {
        this.$message.error(
          this.$t('hintText.itIsNotAllowedToAddAnExistingPriority')
        )
        this.ruleForm.br.priority = ''
      }
    },

    selectionRange(item) {
      if (item.ispreapproval) {
        item.boIsUsed = false
        item.brIsUsed = false
        item.uboIsUsed = false
        item.boid = ''
        item.brids = ''
        item.brnames = ''
        item.uboid = ''
        item.userattr = ''
      } else {
        item.orgIfUsed = false
        item.nodeorgids = ''
        item.nodeorgnames = ''
      }
    },
    recoveryBRRule() {
      this.loading = true
      recoveryBRTree(this.treeData.id)
        .then(rt => {
          this.loading = false
          if (rt.status === '200') {
            this.$message.success(this.$t('hintText.addedSuccess'))
          } else {
            this.$message.success(rt.message)
          }
        })
        .catch(er => {
          this.loading = false
        })
    },
    getRuleDetail() {
      let than = this
      than.loading = true
      let ids = {}
      if (this.treeData.brid) {
        ids = {
          id: than.treeData.id
        }
      } else {
        ids = {
          brtreeid: than.treeData.id
        }
      }
      getBusinessRuleDetail({
        processId: than.$route.query.processId
          ? than.$route.query.processId
          : than.processData.id,
        version:
          than.$route.query.version || than.$route.query.version === ''
            ? than.$route.query.version
            : than.processData.version,
        ...ids
      })
        .then(rt => {
          than.loading = false
          if (rt.status === '200') {
            rt.data.treeId = than.treeData.id
            rt.data.nodes.forEach(e => {
              if (e.boid) {
                e.boid = e.boid.split(',')
              }
              if (e.prenodes) {
                e.prenodes = e.prenodes.split(',')
              }
              e.isUsed = e.isUsed === 'Y'
              e.isskip = e.isskip === 'Y'
              e.ispreapproval = e.ispreapproval === 'Y'
              e.postIsUsed = e.postIsUsed === 'Y'
              e.boIsUsed = e.boIsUsed === 'Y'
              e.brIsUsed = e.brIsUsed === 'Y'
              e.userIsUsed = e.userIsUsed === 'Y'
              e.uboIsUsed = e.uboIsUsed === 'Y'
              e.orgIfUsed = e.orgIfUsed === 'Y'
              e.posIsUsed = e.posIsUsed === 'Y'
              e.roleIsUsed = e.roleIsUsed === 'Y'
              e.dutyIsUsed = e.dutyIsUsed === 'Y'
              e.processroleIfUsed = e.processroleIfUsed === 'Y'
            })
            if (rt.data.ruleComs && rt.data.ruleComs.length > 0) {
              // 添加控制条件支持多选
              rt.data.ruleComs.forEach(item1 => {
                if(item1.conditions != null && item1.conditions.length) {
                  item1.conditions.forEach(item2 => {
                    if(item2.result && item2.result.trim().length) {
                      item2.result = item2.result.split(',')
                    }
                  })
                }
              })
              if (!rt.data.ruleComs[0].children) {
                rt.data.ruleComs[0].children = []
              }
              rt.data.ruleComs[0].parentId =
                rt.data.ruleComs[0].children.length + 1
              rt.data.ruleComs[0].children.forEach((element, index) => {
                element.name = `${element.name}${index + 1}`
                element.childrenId = 1
              })
              this.recursive(rt.data.ruleComs[0].children)
            }
            
            rt.data.orgAttrs.forEach(element => {
              rt.data.controls.push({
                name: element.orgattributename,
                id: element.id,
                controltype: 'org'
              })
            })
            rt.data.nodes.map(n => {
              let result = {}
              result = n
              rt.data.prenodes.forEach(m => {
                if (n.processnodeid === m.id) {
                  result.nodeattr = m.nodeattr || ''
                  result.authusers = m.authusers || ''
                }
              })
              return result
            })
            than.ruleForm = rt.data
            than.priority = than.ruleForm.br.priority
            if (than.ruleForm.br.ifmerge !== 'Y') {
              than.ruleForm.br.ifmerge = 'N'
            }
            than.ruleForm = { ...than.ruleForm }
            this.ruleFormDateInit()
          }
          than.$nextTick().then(() => {
            const firstNode = document.querySelector(
              '.block .el-tree-node__content'
            )
            firstNode.click()
          })
        })
        .catch(er => {
          than.loading = false
        })
    },
    recursive(data) {
      let num = 0
      const getStr = function(list, i) {
        num++
        list.forEach(function(row, index) {
          if (i && i > 0) {
            row.name = `${row.name}${i}`
            row.name += `.${index + 1}`
            row.childrenId = row.children.length + 1
          }
          if (row.children && row.children.length > 0) {
            getStr(row.children, num)
          }
        })
      }
      getStr(data)
    },
    dialogHandle(el, index) {
      this.tabIndex = index
      if (el === 'isPostDialog') {
        this.selectElement = ['3']
        this.orgtitle = this.$t('chooseAPosition')
        this.orgType = 'isPostDialog'
        this.orgObj = {}
        if (this.ruleForm.nodes[index].appposids) {
          let list = this.ruleForm.nodes[index].appposnames.split(',').join('&')
          let idType = []
          this.ruleForm.nodes[index].appposids.split(',').forEach((item, i) => {
            idType.push(`${item}-3`)
          })
          this.orgObj = {
            id: this.ruleForm.nodes[index].appposids.split(','),
            name: list,
            idType: idType.join(';')
          }
        }
        this.organieationShow = true
      } else if (el === 'isPostGroupDialog') {
        this.postGroupIds = this.ruleForm.nodes[index].apppostids
        this[el] = true
      } else if (el === 'isBusinessRole') {
        this.businessRoleIds = this.ruleForm.nodes[index].brids
        this[el] = true
      } else if (el === 'isProcessRoles') {
        this.processRolesList = []
        if (this.ruleForm.nodes[index].processroleid) {
          this.processRolesList = this.ruleForm.nodes[
            index
          ].processroleid.split(',')
        }
        this[el] = true
      } else if (el === 'isRoles') {
        this.RolesList = []
        if (this.ruleForm.nodes[index].roleids) {
          this.RolesList = this.ruleForm.nodes[index].roleids.split(',')
        }
        this[el] = true
      } else if (el === 'isresponsibility') {
        this.dutyList = []
        if (this.ruleForm.nodes[index].dutyids) {
          this.dutyList = this.ruleForm.nodes[index].dutyids.split(',')
        }
        this.isduty = true
      } else if (el === 'peopleDialog') {
        this.selectElement = ['9']
        this.orgtitle = this.$t('chooseASpecificPerson')
        this.orgType = 'peopleDialog'
        this.orgObj = {}
        if (this.ruleForm.nodes[index].appuserids) {
          let list = this.ruleForm.nodes[index].appusernames
            .split(',')
            .join('&')
          let idType = []
          this.ruleForm.nodes[index].appuserids
            .split(',')
            .forEach((item, i) => {
              idType.push(`${item}-9`)
            })
          this.orgObj = {
            id: this.ruleForm.nodes[index].appuserids.split(','),
            name: list,
            idType: idType.join(';')
          }
        }
        this.organieationShow = true
      } else if (el === 'isOrganization') {
        this.selectElement = ['0', '1', '2', '3', '4', '5']
        this.orgType = 'isOrganization'
        this.orgtitle = this.$t('chooseAnOrganization')
        this.orgObj = {}
        if (this.ruleForm.nodes[index].nodeorgnames) {
          let list = this.ruleForm.nodes[index].nodeorgnames
            .split(',')
            .join('&')
          let idType = []

          this.getOrgTree(this.ruleForm.nodes[index].nodeorgids)
          // this.ruleForm.nodes[index].nodeorgids
          //   .split(",")
          //   .forEach((item, i) => {
          //     idType.push(`${item}-0`);
          //   });
          // this.orgObj = {
          //   id: this.ruleForm.nodes[index].nodeorgids.split(","),
          //   name: list,
          //   idType: idType.join(";")
          // };
        } else {
          this.organieationShow = true
        }
      }
    },
    handleOrg() {
      this.selectElement = ['0', '1', '2', '3', '4', '5']
      this.orgType = 'org'
      this.orgtitle = this.$t('chooseAnOrganization')
      this.orgObj = {}
      if (this.ruleForm.br.orgnames) {
        let list = this.ruleForm.br.orgnames.split(',').join('&')
        let idType = []
        this.getOrgTree(this.ruleForm.br.orgids)
        // this.ruleForm.br.orgids.split(",").forEach((item, i) => {
        //   idType.push(`${item}-0`);
        // });
        // this.orgObj = {
        //   id: this.ruleForm.br.orgids.split(","),
        //   name: list,
        //   idType: idType.join(";")
        // };
      } else {
        this.organieationShow = true
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
            this.orgObj = {
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
    fnBasOrganieationCallBack(data) {
      if (this.orgType === 'isOrganization') {
        this.ruleForm.nodes[this.tabIndex].nodeorgnames = data.name
          .split('&')
          .join(',')
        this.ruleForm.nodes[this.tabIndex].nodeorgids = data.id
        this.organieationShow = false
      } else if (this.orgType === 'org') {
        this.ruleForm.br.orgnames = data.name.split('&').join(',')
        this.ruleForm.br.orgids = data.id
        this.organieationShow = false
      } else if (this.orgType === 'peopleDialog') {
        this.ruleForm.nodes[this.tabIndex].appusernames = data.name
          .split('&')
          .join(',')
        this.ruleForm.nodes[this.tabIndex].appuserids = data.id
        this.organieationShow = false
      } else if (this.orgType === 'isPostDialog') {
        this.ruleForm.nodes[this.tabIndex].appposnames = data.name
          .split('&')
          .join(',')
        this.ruleForm.nodes[this.tabIndex].appposids = data.id
        this.organieationShow = false
      }
    },
    getPostGroupData(data) {
      let _ids = data
        .filter(item => {
          return item.org && item.org !== ''
        })
        .map(item => {
          return {
            id: item.id,
            _id: item.id,
            name: item.name
          }
        })
      _ids.forEach(item => {
        data.forEach(val => {
          if (val.pid != '' && item._id === val.pid) {
            if (item.id.indexOf('_') === -1) {
              item.id = item.id + '_' + val.fieldvalue
              item.name = item.name + '_' + val.fieldname
            } else {
              item.id = item.id + '-' + val.fieldvalue
              item.name = item.name + '-' + val.fieldname
            }
          }
        })
      })
      let apppostnames = _ids.map(item => item.name).join('\n')
      let apppostids = _ids.map(item => item.id).join(',')
      if (apppostnames.length > 200 || apppostids.length > 200) {
        this.$message.error(this.$t('hintText.tooManyJobGroupsSelected'))
      } else {
        this.isPostGroupDialog = false
        this.ruleForm.nodes[this.tabIndex].apppostnames = apppostnames
        this.ruleForm.nodes[this.tabIndex].apppostids = apppostids
      }
    },
    getBusinessRoleData(data) {
      let _ids = data
        .filter(item => {
          return item.tablevalue && item.tablevalue !== ''
        })
        .map(item => {
          return {
            id: item.id,
            _id: item.id,
            name: item.name
          }
        })
      _ids.forEach(item => {
        data.forEach(val => {
          if (val.pid != '' && item._id === val.pid) {
            if (item.id.indexOf('_') === -1) {
              item.id = item.id + '_' + val.fieldvalue
              item.name = item.name + '_' + val.fieldname
            } else {
              item.id = item.id + '-' + val.fieldvalue
              item.name = item.name + '-' + val.fieldname
            }
          }
        })
      })
      let brnames = _ids.map(item => item.name).join('\n')
      let brids = _ids.map(item => item.id).join(',')
      if (brnames.length > 200 || brids.length > 200) {
        this.$message.error(this.$t('hintText.tooManyBusinessRolesSelected'))
      } else {
        this.isBusinessRole = false
        this.ruleForm.nodes[this.tabIndex].brnames = brnames
        this.ruleForm.nodes[this.tabIndex].brids = brids
      }
    },
    getdutyData(data) {
      this.ruleForm.nodes[this.tabIndex].dutynames = data
        .map(item => item.name)
        .join(',')
      this.ruleForm.nodes[this.tabIndex].dutyids = data
        .map(item => item.id)
        .join(',')
      this.isduty = false
    },
    getRolesData(data) {
      this.ruleForm.nodes[this.tabIndex].rolenames = data
        .map(item => item.name)
        .join(',')
      this.ruleForm.nodes[this.tabIndex].roleids = data
        .map(item => item.id)
        .join(',')
      this.isRoles = false
    },
    getProcessRolesData(data) {
      this.ruleForm.nodes[this.tabIndex].processrolename = data
        .map(item => item.people)
        .join(',')
      this.ruleForm.nodes[this.tabIndex].processroleid = data
        .map(item => item.id)
        .join(',')
      this.isProcessRoles = false
    },
    isControlNull(list) {
      list.forEach(item => {
        if (item.conditions.length !== 0) {
          item.conditions.forEach(val => {
            if (val.controltype === 1) {
              if (val.minvalue !== '' && val.maxvalue !== '') {
                if (Number(val.minvalue) >= Number(val.maxvalue)) {
                  this.isNum = true
                }
              } else {
                this.isNumNull = true
              }
            } else if (val.controltype === 0) {
              if (!val.result) {
                this.isResult = true
              }
            } else if (val.controltype === 'org') {
              if (!val.conditionresult) {
                this.isConditionresult = true
              }
            }
          })
        }
        if (item.children.length !== 0) {
          this.isControlNull(item.children)
        }
      })
    },
    saveForm(formName) {
      if (!this.ruleForm.br.name) {
        this.$message.error(this.$t('hintText.pleaseEnterTheRuleName'))
        return
      } else if (this.ruleForm.br.name.length > 100) {
        this.$message.error('规则名称超长')
        return
      }
      if (!this.ruleForm.br.orgnames) {
        this.$message.error(this.$t('hintText.pleaseSelectThOrganization'))
        return
      }
      if (!this.ruleForm.br.priority) {
        this.$message.error(this.$t('hintText.pleaseEnterPriority'))
        return
      } else if (this.ruleForm.br.priority.length > 10) {
        this.$message.error('优先级超长')
        return
      }
      if (this.ruleForm.br.priority && this.ruleForm.prioritys) {
        let arr = this.ruleForm.prioritys
          .split(',')
          .filter(x => Number(x) === Number(this.ruleForm.br.priority))
        if (this.priority !== this.ruleForm.br.priority && arr.length > 0) {
          this.$message.error(
            this.$t('hintText.itIsNotAllowedToAddAnExistingPriority')
          )
          this.ruleForm.br.priority = ''
          return
        }
      }
      this.isNum = false
      this.isResult = false
      this.isNumNull = false
      this.isConditionresult = false
      this.isControlNull(this.ruleForm.ruleComs)
      if (this.isNum) {
        this.$message.error(
          this.$t(
            'hintText.theMinimumValueOfTheControlConditionCombinationCannotBeGreaterThanOrEqualToTheMaximumValue'
          )
        )
        return
      }
      if (this.isResult || this.isConditionresult || this.isNumNull) {
        this.$message.error(
          this.$t('hintText.pleaseFillInTheControlConditions')
        )
        return
      }
      let formData = JSON.parse(JSON.stringify(this.ruleForm))
      // 添加控制条件支持多选
      formData.ruleComs.forEach(item1 => {
        if(item1.conditions.length) {
          item1.conditions?.forEach(item2 => {
            if(item2.result.length && item2.result.constructor === Array && item2.result !== '') {
              item2.result = item2.result.join(',')
            } else if (item2.result.length === 0) {
              item2.result = ''
            }
          })
        }
      })
      formData.nodes.forEach(e => {
        if (e.boid) {
          e.boid = e.boid.join(',')
        }
        if (e.prenodes) {
          e.prenodes = e.prenodes.join(',')
        }
        e.isUsed = e.isUsed ? 'Y' : 'N'
        e.isskip = e.isskip ? 'Y' : 'N'
        e.ispreapproval = e.ispreapproval ? 'Y' : 'N'
        e.postIsUsed = e.postIsUsed ? 'Y' : 'N'
        e.boIsUsed = e.boIsUsed ? 'Y' : 'N'
        e.brIsUsed = e.brIsUsed ? 'Y' : 'N'
        e.userIsUsed = e.userIsUsed ? 'Y' : 'N'
        e.uboIsUsed = e.uboIsUsed ? 'Y' : 'N'
        e.orgIfUsed = e.orgIfUsed ? 'Y' : 'N'
        e.posIsUsed = e.posIsUsed ? 'Y' : 'N'
        e.dutyIsUsed = e.dutyIsUsed ? 'Y' : 'N'
        e.roleIsUsed = e.roleIsUsed ? 'Y' : 'N'
        e.processroleIfUsed = e.processroleIfUsed ? 'Y' : 'N'
      })
      this.loading = true
      saveBusinessRule({
        ...formData,
        version:
          this.$route.query.version || this.$route.query.version === ''
            ? this.$route.query.version
            : this.processData.version
      })
        .then(rt => {
          this.loading = false
          if (rt.status === '200') {
            this.$message.success(this.$t('hintText.saveSuccessfully'))
          } else if (rt.status === '500') {
            this.$message.error(rt.message)
          }
        })
        .catch(er => {
          this.loading = false
        })
    },
    selectType(item, index) {
      this.ruleForm.controls.forEach(element => {
        if (item.orgattributeid === element.id) {
          item.controltype = element.controltype
          item.controlid = ''
        } else if (item.controlid === element.id) {
          item.controltype = element.controltype
          item.orgattributeid = ''
        }
      })
    },
    addList(type) {
      if (type === 'judgeData') {
        if (!this.judgeData.name) {
          this.$message.error(this.$t('hintText.pleaseSelectACombinationFirst'))
          return
        }
        if (this.ruleForm.controls.length !== 0) {
          this.editItem = {
            processid: this.$route.query.processId
              ? this.$route.query.processId
              : this.processData.id,
            controltype: '',
            operator: '',
            applicationmodule: []
          }
          this.selectItem = {}
          this.selectItem = this.editItem
          this.selectItem.dialogType = 'add'
          this.confitionControlTypeDialogShow = !this.confitionControlTypeDialogShow
        } else {
          this.$message.error(
            this.$t('hintText.pleaseAddControlConditionsFirst')
          )
          return
        }
      } else {
        this.ruleForm.br.orgConditions.push({
          conditionresult: '',
          conditiontype: '=',
          orgattributeid: '',
          orgconditionid: ''
        })
      }
    },
    deleteList(index, type) {
      if (type === 'judgeData') {
        this.judgeData.conditions.splice(index, 1)
      } else {
        this.ruleForm.br.orgConditions.splice(index, 1)
      }
    },
    isShow(c, el) {
      this[el] = !this[el]
      this.slideToggle(c, this[el])
    },
    isApprove(e, i) {
      this.shrink['approve' + i] = !this.shrink['approve' + i]
      this.slideToggle(e, this.shrink['approve' + i], 'approve')
      this.$forceUpdate()
    },
    slideToggle(c, show, type) {
      let parent = {}
      if (type === 'approve') {
        parent = this.$refs[c][0]
      } else {
        parent = this.$refs[c]
      }
      if (show) {
        parent.style.overflow = 'hidden'
        parent.style.height = 40 + parent.lastElementChild.offsetHeight + 'px'
        if (this.timer) {
          clearTimeout(this.timer)
        }
        this.timer = setTimeout(() => {
          parent.style.overflow = 'auto'
          parent.style.height = 'auto'
        }, 500)
      } else {
        parent.style.overflow = 'hidden'
        parent.style.height = 40 + parent.lastElementChild.offsetHeight + 'px'
        setTimeout(() => {
          parent.style.overflow = 'hidden'
          parent.style.height = '35px'
        }, 10)
      }
    },
    nodeHandle(data, node) {
      this.levelShow = node.level
      if (!data.conditions) {
        data.conditions = []
      }
      data.conditions.forEach(item => {
        if (item.controlid) {
          item.controlid = item.controlid + ''
        }
        if (item.orgattributeid) {
          item.orgattributeid = item.orgattributeid + ''
        }
        this.ruleForm.controls.forEach(element => {
          if (item.controlid === element.id) {
            item.controltype = element.controltype
          } else if (item.orgattributeid === element.id) {
            item.controltype = element.controltype
          }
        })
      })
      data.type = data.type ? data.type : 'Y'
      this.judgeData = data
      this.$forceUpdate()
    },
    append(node, data) {
      let name = ''
      if (node.level === 1) {
        name = `子组合${data.parentId++}`
      } else {
        name = `${data.name}.${data.childrenId++}`
      }
      const newChild = {
        name: name,
        childrenId: 1,
        children: [],
        conditions: [],
        type: 'Y'
      }
      if (!data.children) {
        this.$set(data, 'children', [])
      }
      data.children.push(newChild)
    },
    remove(node, data) {
      if (data.type === '1') {
        this.$message.error(this.$t('hintText.rootNodeIsNotAllowedToBeDeleted'))
        return
      }
      const parent = node.parent
      const children = parent.data.children || parent.data
      const index = children.findIndex(d => d.id === data.id)
      children.splice(index, 1)
    }
  }
}
</script>
<style lang="scss">
#businessRule {
  margin-bottom: 40px;
  min-width: 900px;
  .el-form-item__label {
    color: $tc1;
    font-size: 12px;
  }
  .el-checkbox__label {
    label {
      display: inline-block;
      width: 80px;
    }
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
  .isBlue {
    color: blue;
    border-bottom: 2px solid blue;
  }
}
</style>
<style lang="scss" scoped>
#businessRule {
  .table-header {
    position: relative;
    background: $bc2;
    display: flex;
    align-items: center;
    .all-check {
      position: absolute;
      left: 20px;
    }
  }
  .w100 {
    width: 100%;
  }
  .card1 {
    padding: 0 5px 15px 15px;
    background: white;
    border-bottom: 1px solid $dc1;
    overflow: hidden;
    transition-duration: 0.5s;
    box-sizing: border-box;
    height: 35px;
    .header {
      margin-right: 10px;
      display: flex;
      cursor: pointer;
      .title {
        height: 35px;
        line-height: 35px;
        color: $tc1;
        font-weight: bold;
      }
      .space {
        flex-grow: 1;
      }
    }
  }
  .h-auto {
    height: auto;
  }
  .select-width {
    width: 130px;
  }
  .textInput {
    position: relative;

    .clearButton {
      position: absolute;
      border-radius: 5px;
      right: -78px;
      z-index: 2;
      border: none;
      top: 1px;
      height: 40px;
      cursor: pointer;
      color: #ccc;
      transform: translateX(2px);
    }
    .clearButtons {
      position: absolute;
      border-radius: 5px;
      right: 3px;
      z-index: 2;
      border: none;
      top: 2px;
      height: 40px;
      cursor: pointer;
      color: #ccc;
      transform: translateX(2px);
    }
    .clearButton:hover {
      color: #878d99;
    }
  }
}
.el-icon-question {
  font-size: 16px;
  color: #2d42af;
}
.header-title {
  display: flex;
  align-items: center;
}
.w80 {
  width: 80% !important;
}
.btn-close-reset {
  right: 20px !important;
}
</style>
