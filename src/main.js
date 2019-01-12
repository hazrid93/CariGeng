// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import axios from 'axios'


import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.css'

const fb = require('./firebaseConfig.js')

Vue.use(Vuetify)

axios.defaults.baseURL = "https://api.nasa.gov"
axios.defaults.headers.get['Accepts'] = 'application/json'

Vue.config.productionTip = false

//handle page reloads
let app
fb.auth.onAuthStateChanged(user => {
  if (!app) { 
    app = new Vue({
        el: '#app',
        router: router,
        store: store,
        render: h => h(App)
    })
  }
})
