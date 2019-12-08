import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import { store } from "./store";
const fb = require("./firebaseConfig");

Vue.config.productionTip = false;

// handle page reloads
let app;
fb.auth.onAuthStateChanged(user => {
  console.debug(user);
  if (!app) {
    app = new Vue({
      router,
      store,
      render: h => h(App)
    });
    app.$mount("#app");
  }
});
