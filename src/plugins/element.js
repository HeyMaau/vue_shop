import Vue from "vue";
//引入element ui组件库
import {Button, Form, Input, FormItem, Message} from "element-ui";

Vue.prototype.$message = Message
Vue.component(Button.name, Button)
Vue.component(Form.name, Form)
Vue.component(Input.name, Input)
Vue.component(FormItem.name, FormItem)