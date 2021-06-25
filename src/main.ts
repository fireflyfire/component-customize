import { createApp } from 'vue';
import App from './App.vue';
import router from "./router";
import store from "./store";
import 'ant-design-vue/dist/antd.less';
import { Pagination } from 'ant-design-vue';


export const app = createApp(App);

app.use(Pagination);

app.use(store).use(router).mount("#app");
