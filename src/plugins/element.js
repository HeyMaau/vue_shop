import Vue from "vue";
//引入element ui组件库
import {
    Button, Form, Input, FormItem, Message, Container, Header, Aside, Main, Menu, Submenu, MenuItem, MenuItemGroup
} from "element-ui";

Vue.prototype.$message = Message
Vue.component(Button.name, Button)
Vue.component(Form.name, Form)
Vue.component(Input.name, Input)
Vue.component(FormItem.name, FormItem)
Vue.component(Container.name, Container)
Vue.component(Header.name, Header)
Vue.component(Aside.name, Aside)
Vue.component(Main.name, Main)
Vue.component(Menu.name, Menu)
Vue.component(Submenu.name, Submenu)
Vue.component(MenuItem.name, MenuItem)
Vue.component(MenuItemGroup.name, MenuItemGroup)