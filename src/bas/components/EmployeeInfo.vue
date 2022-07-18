<template>
  <el-dialog
    id="staffManageDialog"
    :title="title"
    :visible.sync="dialogVisible"
    append-to-body
    class="BasEmployeeEdit bas"
    top="10px"
    width="900PX"
  >
    <el-form ref="item" :model="item" :rules="rules" label-width="120px" class="content">
      <div class="title">
        基本信息
      </div>
      <el-form-item :label="$t('basEmployee.loginAccount') + ':'" prop="empuid" style="display:inline-block">
        <el-input v-model="item.empuid" clearable style="width:300px" disabled />
      </el-form-item>
      <el-form-item :label="$t('basEmployee.jobNumber') + ':'" prop="empid" style="display:inline-block">
        <el-input v-model="item.empid" clearable style="width:300px" disabled />
      </el-form-item>
      <el-form-item :label="$t('basEmployee.name') + ':'" prop="displayname" style="display:inline-block">
        <el-input v-model="item.displayname" clearable style="width:300px" disabled />
      </el-form-item>
      <!--      <el-form-item :label="$t('basEmployee.chineseName') + ':'" prop="cnname" style="display:inline-block">-->
      <!--        <el-input clearable v-model="item.cnname" style="width:300px" />-->
      <!--      </el-form-item>-->
      <el-form-item :label="$t('basEmployee.englishName') + ':'" prop="enname" style="display:inline-block">
        <el-input v-model="item.enname" clearable style="width:300px" disabled />
      </el-form-item>
      <!-- <el-form-item :label="$t('basEmployee.showName') + ':'" prop="displayname" style="display:inline-block">
        <el-input clearable v-model="item.displayname" style="width:300px" />
      </el-form-item> -->
      <el-form-item :label="$t('basEmployee.sex') + ':'" prop="sex" style="display:inline-block">
        <el-radio v-model="item.sex" label="1" disabled>
          {{
            $t("basEmployee.male")
          }}
        </el-radio>
        <el-radio v-model="item.sex" label="0" disabled>
          {{
            $t("basEmployee.female")
          }}
        </el-radio>
      </el-form-item>
      <el-form-item :label="$t('basEmployee.defaultPosition') + ':'" prop="defaultposname" style="display:inline-block">
        <el-input v-model="item.defaultposname" clearable style="width:300px" @focus="showPos" disabled />
      </el-form-item>
      <el-form-item :label="$t('basEmployee.defaultDepartment') + ':'" prop="deptName" style="display:inline-block">
        <el-input v-model="item.deptName" clearable style="width:300px" disabled />
      </el-form-item>
      <el-form-item :label="$t('basEmployee.defaultcompany') + ':'" prop="companyName" style="display:inline-block">
        <el-input v-model="item.companyName" clearable style="width:300px" disabled />
      </el-form-item>
      <el-form-item :label="$t('basEmployee.directSupervisor') + ':'" prop="superiorName" style="display:inline-block">
        <el-input
          v-model="item.superiorName"
          :placeholder="$t('basEmployee.placeholderText.pleaseSelect')"
          style="width:300px"
          disabled
          @focus="showOrg"
        />
      </el-form-item>
      <el-form-item :label="$t('basEmployee.IDNumber') + ':'" prop="icnum" style="display:inline-block">
        <el-input v-model="item.icnum" clearable style="width:300px" disabled />
      </el-form-item>
      <el-form-item :label="$t('basEmployee.state') + ':'" prop="status" style="display:inline-block">
        <el-select
          disabled
          v-model="item.status"
          clearable
          class="w100"
          :placeholder="
            $t(
              'basEmployee.placeholderText.pleaseSelect'
            )
          "
          style="width:300px"
        >
          <el-option v-for="item in typeList" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('basEmployee.concurrentPost') + ':'" prop="icnum" style="display:inline-block">
        <el-input type="textarea" :value="item.concurrentPost ? item.concurrentPost.join('\r\n') : ''" clearable style="width:300px" disabled />
      </el-form-item>
      <div class="title">
        联系方式
      </div>
      <el-form-item :label="$t('basEmployee.mobilePhone') + ':'" prop="mobilephone" style="display:inline-block">
        <el-input v-model="item.mobilephone" clearable style="width:300px" />
      </el-form-item>
      <el-form-item :label="$t('basEmployee.email') + ':'" prop="email" style="display:inline-block">
        <el-input v-model="item.email" clearable style="width:300px" />
      </el-form-item>
      <el-form-item :label="$t('basEmployee.officeTelephone') + ':'" prop="officephone" style="display:inline-block">
        <el-input v-model="item.officephone" clearable style="width:300px" />
      </el-form-item>
      <el-form-item :label="$t('basEmployee.faxNumber') + ':'" prop="faxnumber" style="display:inline-block">
        <el-input v-model="item.faxnumber" clearable style="width:300px" />
      </el-form-item>
      <el-form-item :label="$t('basEmployee.extensionNumber') + ':'" prop="extension" style="display:inline-block">
        <el-input v-model="item.extension" clearable style="width:300px" />
      </el-form-item>
      <el-form-item :label="$t('basEmployee.phone') + ':'" prop="phone" style="display:inline-block">
        <el-input v-model="item.phone" clearable style="width:300px" />
      </el-form-item>
      <el-form-item :label="$t('basEmployee.phone2') + ':'" prop="phone2" style="display:inline-block">
        <el-input v-model="item.phone2" clearable style="width:300px" />
      </el-form-item>
      <el-form-item :label="$t('basEmployee.mobilePhoneCornet1') + ':'" prop="phone1_s" style="display:inline-block">
        <el-input v-model="item.phone1_s" clearable style="width:300px" />
      </el-form-item>
      <el-form-item :label="$t('basEmployee.mobilePhoneCornet2') + ':'" prop="phone2_s" style="display:inline-block">
        <el-input v-model="item.phone2_s" clearable style="width:300px" />
      </el-form-item>
      <el-form-item :label="$t('basEmployee.personalFaxNumber') + ':'" prop="homefax" style="display:inline-block">
        <el-input v-model="item.homefax" clearable style="width:300px" />
      </el-form-item>
      <el-form-item :label="$t('basEmployee.personalEmail') + ':'" prop="homeemail" style="display:inline-block">
        <el-input v-model="item.homeemail" clearable style="width:300px" />
      </el-form-item>
      <el-form-item :label="$t('basEmployee.homeTelephone') + ':'" prop="homemobile" style="display:inline-block">
        <el-input v-model="item.homemobile" clearable style="width:300px" />
      </el-form-item>
      <!-- <el-form-item :label="$t('basEmployee.fixedlineTelephone') + '2:'" prop="tel2" style="display:inline-block">
        <el-input clearable v-model="item.tel2" style="width:300px" />
      </el-form-item> -->
      <div class="title">
        员工地址
      </div>
      <!-- <el-form-item :label="$t('basEmployee.area') + ':'" prop="area" style="display:inline-block">
        <el-input clearable v-model="item.area" style="width:300px" />
      </el-form-item> -->
      <!-- <el-form-item :label="$t('basEmployee.birthProvince') + ':'" prop="province_birth" style="display:inline-block">
        <el-input clearable v-model="item.province_birth" style="width:300px" />
      </el-form-item> -->

      <el-form-item :label="$t('basEmployee.homeAddress') + ':'" prop="homeaddress" style="display:inline-block">
        <el-input v-model="item.homeaddress" clearable style="width:300px" />
      </el-form-item>
      <el-form-item :label="$t('basEmployee.residencePostcode') + ':'" prop="zzip2" style="display:inline-block">
        <el-input v-model="item.zzip2" clearable style="width:300px" />
      </el-form-item>
      <!-- <el-form-item :label="$t('basEmployee.homeAddressPostcode') + ':'" prop="zzip" style="display:inline-block">
        <el-input clearable v-model="item.zzip" style="width:300px" />
      </el-form-item> -->
      <el-form-item :label="$t('basEmployee.birthPlace') + ':'" prop="origin" style="display:inline-block">
        <el-input v-model="item.origin" clearable style="width:300px" />
      </el-form-item>
      <el-form-item :label="$t('basEmployee.registeredAddress') + ':'" prop="hukoaddress" style="display:inline-block">
        <el-input v-model="item.hukoaddress" clearable style="width:300px" />
      </el-form-item>

      <!-- <el-form-item :label="$t('basEmployee.otherAddress') + ':'" prop="oth2address" style="display:inline-block">
        <el-input clearable v-model="item.oth2address" style="width:300px" />
      </el-form-item> -->
      <!-- <el-form-item :label="$t('basEmployee.permanentAddress') + ':'" prop="permaddress" style="display:inline-block">
        <el-input clearable v-model="item.permaddress" style="width:300px" />
      </el-form-item> -->
      <!-- <div class="title">员工邮箱</div> -->
      <!-- <el-form-item :label="$t('basEmployee.email') + ':'" style="display:inline-block">
   <el-input clearable v-model="item.email" style="width:300px" />
 </el-form-item>
   <el-form-item :label="$t('basEmployee.emailPassword') + ':'" prop="emailpassword" style="display:inline-block">
   <el-input clearable type="password" v-model="item.emailpassword" style="width:300px" />
 </el-form-item> -->
      <div class="title">
        工资卡
      </div>
      <el-form-item
        :label="$t('basEmployee.payrollCardNumber') + ':'"
        prop="payrollcardnumber"
        style="display:inline-block"
      >
        <el-input v-model="item.payrollcardnumber" clearable style="width:300px" />
      </el-form-item>
      <el-form-item :label="$t('basEmployee.depositBank') + ':'" prop="bank" style="display:inline-block">
        <el-input v-model="item.bank" clearable style="width:300px" />
      </el-form-item>

      <div class="title">
        其他
      </div>
      <el-form-item
        :label="$t('basEmployee.personalDescription') + ':'"
        prop="personaldesc"
        style="display:inline-block"
      >
        <el-input v-model="item.personaldesc" clearable type="textarea" style="width:300px" />
      </el-form-item>
      <el-form-item :label="$t('basEmployee.remark') + ':'" prop="remark" style="display:inline-block">
        <el-input v-model="item.remark" clearable type="textarea" style="width:300px" />
      </el-form-item>
      <el-form-item :label="$t('basEmployee.role') + ':'" style="display:inline-block">
        <el-checkbox-group v-model="item.checkedRoleIds" disabled>
          <el-checkbox v-for="role in roleList" :key="role.id" :label="role.id" name="role">
            {{ role.name }}
          </el-checkbox>
        </el-checkbox-group>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel">{{ $t("basEmployee.cancel") }}</el-button>
      <el-button v-if="type !== 'view'" type="primary" @click="submit('item')">{{ $t("basEmployee.confirm") }}
      </el-button>
    </span>
    <!-- <bas-organieation v-model="organieationShow" :selectedElement="selectedElement" :isSpecifiedGroupBut="false"
      :isShowBustomGroupsBut="false" :selectElement="selectElement" :showElement="showElement" :title="orgtitle"
      @fnCallBack="fnBasOrganieationCallBack" :multiple="false" /> -->

    <!-- <bas-organieation
       v-model="organizeDialogManage"
       :is-specified-group-but="false"
       :is-show-bustom-groups-but="false"
       :is-show-post="true"
       :selected-element="selectManage"
       :select-element="['3']"
       :load="false"
       :multiple="true"
       title="系统信息"
       @fnCallBack="getManagerOrg"
     /> -->
  </el-dialog>
</template>
<script>
// import BasOrganieation from '../BasOrganieation/BasOrganieation'

export default {
  // components: {
  //   BasOrganieation: () => import('../BasOrganieation/BasOrganieation')
  // },
  // name: 'BasEmployeeEdit',
  components: {},
  props: {
    value: {
      type: Boolean,
      default: false
    },
    detail: {
      type: Object,
      default: () => {
        return {}
      }
    },
    orgData: {
      type: Object,
      default: () => {
        return {}
      }
    },
    posData: {
      type: Object,
      default: () => {
        return {}
      }
    },
    title: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      organizeDialogManage: false,
      // organieationShow: false,
      // selectedElement: {},
      // showElement: [],
      // selectElement: ["9"],
      // orgtitle: this.$t('basEmployee.ChooseImmediateSuperior'),
      action: `${this.$host}/attach/upload`,
      dialogVisible: this.value,
      peopleDialog: false,
      myHeaders: { token: localStorage.getItem('sxToken') },
      signatureUrl: '',
      headeUrl: '',
      item: {
        status: '1',
        checkedRoleIds: [],
        concurrentPost: []
      },
      checktype: '',
      typeList: [
        {
          value: '1',
          label: this.$t('basEmployee.inservice')
        },
        {
          value: '2',
          label: this.$t('basEmployee.dimission')
        }
      ],
      roleList: [],
      rules: {
        empuid: [
          {
            required: true,
            message: this.$t(
              'basEmployee.placeholderText.pleaseEnterYourLoginAccount'
            ),
            trigger: 'blur'
          },
          {
            max: 50,
            message: this.$t(
              'basEmployee.placeholderText.loginAccountOverlength'
            ),
            trigger: 'blur'
          }
        ],
        empid: [
          {
            required: true,
            message: this.$t(
              'basEmployee.placeholderText.pleaseEnterYourJobNumber'
            ),
            trigger: 'blur'
          },
          {
            max: 100,
            message: this.$t('basEmployee.placeholderText.jobNumberOverlength'),
            trigger: 'blur'
          }
        ],
        cnname: [
          {
            required: true,
            message: this.$t(
              'basEmployee.placeholderText.pleaseEnterChineseName'
            ),
            trigger: 'blur'
          },
          {
            max: 100,
            message: this.$t(
              'basEmployee.placeholderText.chineseNameOverlength'
            ),
            trigger: 'blur'
          }
        ],
        enname: [
          {
            required: true,
            message: this.$t(
              'basEmployee.placeholderText.pleaseEnterEnglishName'
            ),
            trigger: 'blur'
          },
          {
            max: 100,
            message: this.$t(
              'basEmployee.placeholderText.englishNameOverlength'
            ),
            trigger: 'blur'
          }
        ],
        displayname: [
          {
            required: true,
            message: this.$t('basEmployee.placeholderText.pleaseEnterName'),
            trigger: 'blur'
          },
          {
            max: 300,
            message: this.$t('basEmployee.placeholderText.showNameOverlength'),
            trigger: 'blur'
          }
        ],
        sex: [
          {
            required: true,
            message: this.$t('basEmployee.placeholderText.pleaseChooseSex'),
            trigger: 'blur'
          }
        ],
        defaultposname: [
          {
            required: true,
            message: this.$t('basEmployee.placeholderText.pleaseSelectDefaultPosition'),
            trigger: 'blur'
          }
        ],
        superiorName: [
          {
            required: true,
            message: this.$t('basEmployee.placeholderText.pleaseSelectDirectSupervisor'),
            trigger: 'blur'
          }
        ],
        email: [
          {
            required: true,
            message: this.$t(
              'basEmployee.placeholderText.pleaseEnterEmailAddress'
            ),
            trigger: 'blur'
          },
          {
            max: 100,
            message: this.$t(
              'basEmployee.placeholderText.emailAddressOverlength'
            ),
            trigger: 'blur'
          }
        ],

        phone2_s: [
          {
            max: 10,
            message: this.$t(
              'basEmployee.placeholderText.mobilePhoneCornet2Overlength'
            ),
            trigger: 'blur'
          }
        ],
        phone2: [
          {
            max: 10,
            message: this.$t(
              'basEmployee.placeholderText.phone2Overlength'
            ),
            trigger: 'blur'
          }
        ],
        phone1_s: [
          {
            max: 10,
            message: this.$t('basEmployee.placeholderText.mobilePhoneCornet1Overlength'),
            trigger: 'blur'
          }
        ],
        // phone: [
        //   {
        //     max: 50,
        //     message: this.$t("basEmployee.placeholderText.phone2Overlength"),
        //     trigger: "blur"
        //   }
        // ],
        icnum: [
          {
            required: true,
            message: this.$t('basEmployee.placeholderText.pleaseEnterIDNumber'),
            trigger: 'blur'
          },
          {

            max: 100,
            message: this.$t('basEmployee.placeholderText.IDNumberOverlength'),
            trigger: 'blur'
          }
        ],
        status: [
          {
            required: true,
            trigger: 'blur'
          }
        ],
        // emailpassword: [
        //   {
        //     max: 50,
        //     message: this.$t(
        //       "basEmployee.placeholderText.emailPasswordOverlength"
        //     ),
        //     trigger: "blur"
        //   }
        // ],
        faxnumber: [
          {
            max: 50,
            message: this.$t('basEmployee.placeholderText.faxNumberOverlength'),
            trigger: 'blur'
          }
        ],
        extension: [
          {
            max: 50,
            message: this.$t(
              'basEmployee.placeholderText.extensionNumberOverlength'
            ),
            trigger: 'blur'
          }
        ],
        phone: [
          {
            required: true,
            message: this.$t(
              'basEmployee.placeholderText.pleaseEnterPhone'
            ),
            trigger: 'blur'
          },
          {
            max: 50,
            message: this.$t(
              'basEmployee.placeholderText.phoneOverlength'
            ),
            trigger: 'blur'
          }
        ],
        // area: [
        //   {
        //     max: 30,
        //     message: this.$t("basEmployee.placeholderText.areaOverlength"),
        //     trigger: "blur"
        //   }
        // ],
        // province_birth: [
        //   {
        //     max: 100,
        //     message: this.$t(
        //       "basEmployee.placeholderText.birthProvinceOverlength"
        //     ),
        //     trigger: "blur"
        //   }
        // ],
        origin: [
          {
            required: true,
            message: this.$t(
              'basEmployee.placeholderText.pleaseEnterBirthPlace'
            ),
            trigger: 'blur'
          },
          {
            max: 100,
            message: this.$t(
              'basEmployee.placeholderText.birthPlaceOverlength'
            ),
            trigger: 'blur'
          }
        ],
        homeaddress: [
          {
            required: true,
            message: this.$t(
              'basEmployee.placeholderText.pleaseEnterHomeAddress'
            ),
            trigger: 'blur'
          },
          {
            max: 800,
            message: this.$t(
              'basEmployee.placeholderText.homeAddressOverlength'
            ),
            trigger: 'blur'
          }
        ],
        // zzip: [
        //   {
        //     max: 10,
        //     message: this.$t(
        //       "basEmployee.placeholderText.homeAddressPostcodeOverlength"
        //     ),
        //     trigger: "blur"
        //   }
        // ],
        hukoaddress: [
          {
            required: true,
            message: this.$t(
              'basEmployee.placeholderText.pleaseEnterRegisteredAddress'
            ),
            trigger: 'blur'
          },
          {
            max: 100,
            message: this.$t(
              'basEmployee.placeholderText.registeredAddressOverlength'
            ),
            trigger: 'blur'
          }
        ],
        // oth2address: [
        //   {
        //     max: 100,
        //     message: this.$t(
        //       "basEmployee.placeholderText.otherAddressOverlength"
        //     ),
        //     trigger: "blur"
        //   }
        // ],
        // permaddress: [
        //   {
        //     max: 100,
        //     message: this.$t(
        //       "basEmployee.placeholderText.permanentAddressOverlength"
        //     ),
        //     trigger: "blur"
        //   }
        // ],
        zzip2: [
          {
            required: true,
            message: this.$t(
              'basEmployee.placeholderText.pleaseEnterResidencePostcode'
            ),
            trigger: 'blur'
          },
          {
            max: 10,
            message: this.$t(
              'basEmployee.placeholderText.residencePostcodeOverlength'
            ),
            trigger: 'blur'
          }
        ],
        homefax: [
          {
            max: 50,
            message: this.$t(
              'basEmployee.placeholderText.personalFaxNumberOverlength'
            ),
            trigger: 'blur'
          }
        ],
        workEmail: [
          {
            max: 100,
            message: this.$t(
              'basEmployee.placeholderText.personalEmailOverlength'
            ),
            trigger: 'blur'
          }
        ],
        homeemail: [
          {
            max: 100,
            message: this.$t(
              'basEmployee.placeholderText.personalEmailOverlength'
            ),
            trigger: 'blur'
          }
        ],
        homemobile: [
          {
            max: 30,
            message: this.$t(
              'basEmployee.placeholderText.homeTelephoneOverlength'
            ),
            trigger: 'blur'
          }
        ],
        officephone: [
          {
            max: 30,
            message: this.$t(
              'basEmployee.placeholderText.officeTelephoneOverlength'
            ),
            trigger: 'blur'
          }
        ],
        mobilephone: [
          {
            required: true,
            message: this.$t(
              'basEmployee.placeholderText.pleaseEnterMobilephone'
            ),
            trigger: 'blur'
          },
          {
            max: 30,
            message: this.$t(
              'basEmployee.placeholderText.mobilePhoneOverlength'
            ),
            trigger: 'blur'
          }
        ],
        // tel2: [
        //   {
        //     max: 30,
        //     message: this.$t(
        //       "basEmployee.placeholderText.fixedlineTelephoneOverlength"
        //     ),
        //     trigger: "blur"
        //   }
        // ],
        payrollcardnumber: [
          {
            required: true,
            message: this.$t(
              'basEmployee.placeholderText.pleaseEnterPayrollCardNumber'
            ),
            trigger: 'blur'
          },
          {
            max: 30,
            message: this.$t(
              'basEmployee.placeholderText.payrollCardNumberOverlength'
            ),
            trigger: 'blur'
          }
        ],
        bank: [
          {
            required: true,
            message: this.$t(
              'basEmployee.placeholderText.pleaseEnterDepositBank'
            ),
            trigger: 'blur'
          },
          {
            max: 100,
            message: this.$t(
              'basEmployee.placeholderText.depositBankOverlength'
            ),
            trigger: 'blur'
          }
        ],
        personaldesc: [
          {
            max: 1500,
            message: this.$t(
              'basEmployee.placeholderText.personalDescriptionOverlength'
            ),
            trigger: 'blur'
          }
        ],
        remark: [
          {
            max: 2000,
            message: this.$t('basEmployee.placeholderText.remarkOverlength'),
            trigger: 'blur'
          }
        ]
      },
      organationList: {},
      getUserDetailsUrl: '/userModel/get/',
      saveUserUrl: '/userModel/save',
      updateUserUrl: '/userModel/update',
      getAuthroleListUrl: '/bpm/authrole/query',
      getPosDepComInfo: '/orgTreeExtend/findHigherDatas'
    }
  },
  watch: {
    value(val) {
      if (val) {
        this.getRole()
        if (this.detail.id) {
          this.getUserDet()
        } else {
          this.item = {
            status: '1',
            checkedRoleIds: []
          }
        }
      }
      this.dialogVisible = val
    },
    dialogVisible(val) {
      this.$emit('input', val)
    },
    orgData(val) {
      console.log(val)
      this.$set(this.item, 'superior', val.id)
      this.$set(this.item, 'superiorName', val.name)
    },
    posData(val) {
      this.$set(this.item, 'defaultpos', val.id)
      this.$set(this.item, 'defaultposname', val.name)
      if (val.id) {
        this.$http({
          url: this.getPosDepComInfo,
          method: 'POST',
          data: { id: val.id }
        })
          .then(rt => {
            this.$set(this.item, 'deptid', rt.data.deptid)
            this.$set(this.item, 'deptName', rt.data.deptName)
            this.$set(this.item, 'companyId', rt.data.companyId)
            this.$set(this.item, 'companyName', rt.data.companyName)
          })
          .catch(() => { })
      }
    }
  },
  methods: {
    showPos() {
      this.organizeDialogManage = true
      this.$emit('showPosData', this.item)
    },
    showOrg() {
      this.organieationShow = true
      this.$emit('showOrgData', this.item)
    },
    fnBasOrganieationCallBack(data) {
      console.log(data)
    },
    beforeAvatarUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 100
      if (!isLt2M) {
        this.$message.error(
          this.$t('basEmployee.hintText.uploadAttachmentsShouldNotExceed100MB')
        )
      }
      return isLt2M
    },
    getUserDet() {
      this.$http({
        url: this.getUserDetailsUrl + this.detail.id,
        method: 'GET',
        data: {}
      })
        .then(rt => {
          if (rt.status === '200') {
            if (!rt.data.checkedRoleIds) {
              rt.data.checkedRoleIds = []
            }
            this.item = rt.data
          }
        })
        .catch(() => { })
    },
    // 文件上传
    uploadFile(res, file) {
      this.headeUrl = URL.createObjectURL(file.raw)
    },
    uploadFile1(res, file) {
      this.signatureUrl = URL.createObjectURL(file.raw)
    },
    getRole() {
      this.$http({
        url: this.getAuthroleListUrl,
        method: 'POST',
        data: {
          logic: 'and',
          filters: [{ key: 'isdelete', opt: 'EQ', type: 'S', value: '0' }]
        }
      })
        .then(rt => {
          this.roleList = rt.data.list
          if (!this.detail.id) {
            const checkedRoleIds = rt.data.list.filter(item => {
              return item.name === '普通用户'
            }).map(item => item.id)
            this.$set(this.item, 'checkedRoleIds', checkedRoleIds)
          }
        })
        .catch(() => { })
    },
    getUser(data) {
      if (this.checktype === '部门' && data[0].TYPE === '2') {
        this.item.deptid = data[0].ID
        this.item.deptName = data[0].NAME
      } else if (this.checktype === '岗位' && data[0].TYPE > '2') {
        this.item.defaultposname = data[0].NAME
        this.item.defaultpos = data[0].ID
      } else {
        this.$message('请选择对应的部门或岗位')
      }
    },
    submit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.item.cnname = this.item.displayname
          this.$http({
            url: this.updateUserUrl,
            method: 'POST',
            data: this.item
          })
            .then(rt => {
              if (rt.status === '200') {
                this.$message({
                  message: this.$t('basEmployee.hintText.saveSuccessfully'),
                  type: 'success'
                })
                this.dialogVisible = false
                // this.$emit('confirm', true)
              } else {
                this.$message({
                  message: this.$t('basEmployee.hintText.failToSave'),
                  type: 'error'
                })
              }
            })
            .catch(() => {
              this.$message({
                message: this.$t('basEmployee.hintText.failToSave'),
                type: 'error'
              })
            })
        }
      })
    },
    cancel() {
      this.dialogVisible = false
    },
    checkPost() {
      this.checktype = '岗位'
      this.peopleDialog = true
      this.organationList = {}
    }
  }
}
</script>
<style lang="scss" scoped>
.content {
  height: 500px;
  width: 95%;
  margin: 0 auto;
  overflow: auto;
  padding-right: 20px;
}
.w100 {
  width: 100%;
}
.el-form-item {
  width: 50%;
  .el-input,
  .el-textarea,
  .el-select {
    width: 100% !important;
  }
}
</style>
<style lang="scss">
#staffManageDialog {
  .avatar-uploader .el-upload {
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
  .title{
    height: 35px;
    line-height: 35px;
    color: rgb(51, 51, 51);
    font-weight: 700;
    border-bottom: 1px solid #e5e5e5;
    margin-bottom: 16px;
  }
}
</style>
