// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import { store } from './store'
import axios from 'axios'


import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.css'

const fb = require('./firebaseConfig.js')

Vue.use(Vuetify)

axios.defaults.baseURL = "https://api.nasa.gov"
axios.defaults.headers.get['Accepts'] = 'application/json'

Vue.config.productionTip = false

//handle page reloads
//user will be null if user is logged out
//we are not checking user status here though, we only use to make sure firebase stuff already load
/*
Well, it’s simply because in the lifecycle of our app, the execution of our navigation guard beforeEach take place before Firebase initialization end.
 So, when we first load the app, since Firebase module has not finish his initialization, firebase.auth().currentUser return null!
 https://medium.com/@anas.mammeri/vue-2-firebase-how-to-build-a-vue-app-with-firebase-authentication-system-in-15-minutes-fdce6f289c3c
 */
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
