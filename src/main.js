import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import firebase from 'firebase'



Vue.config.productionTip = false

const fireB = firebase.initializeApp({
    apiKey: "AIzaSyB-pB2clBdRs3ogJZaZQc5Dq3UoUkTfLbY",
    authDomain: "mintmesh-58154.firebaseapp.com",
    projectId: "mintmesh-58154",
    storageBucket: "mintmesh-58154.appspot.com",
    messagingSenderId: "263664153226",
    appId: "1:263664153226:web:d69216c44b70f3fc9f3373"
  });

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
