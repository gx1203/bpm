// import AppHeader from './AppHeader.vue'
// import AppHeader from '../../bpm/views/parent/AppHeader'
import AppHeader from '../../bas/components/AppHeader'


// import AppHeader from './AppHeader.vue'
import RightFloat from '../../bas/components/RightFloat.vue'
import AppFooter from './AppFooter.vue'
import MidBreadCrumb from '../../bas/components/MidBreadCrumb.vue'
import ThemeChange from './ThemeChange.vue'
import Calendar from './Calendar.vue'
import SelectPerson from './SelectPerson.vue'
import SelectPerson2 from './SelectPerson2.vue'
import SelectGroup from './SelectGroup.vue'
import SelectRole from './SelectRole.vue'
import FormItem from './FormItem.vue'
import ProcessIframe from './ProcessIframe.vue'
import SelectFile from './SelectFile.vue'
import Test from './Test.vue'
const components = [
  RightFloat,
  AppHeader,
  AppFooter,
  MidBreadCrumb,
  ThemeChange,
  Calendar,
  SelectPerson,
  SelectPerson2,
  SelectGroup,
  SelectRole,
  FormItem,
  ProcessIframe,
  SelectFile,
  Test
]
export default function (Vue) {
  components.forEach(component => {
    Vue.component(component.name, component)
  })
}
