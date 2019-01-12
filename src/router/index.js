import Vue from 'vue'
import Router from 'vue-router'
import Home from '../components/Home.vue'
import Menu from '../components/Menu.vue'
import Apod from '../components/subcomponents/Apod.vue'
import Lyrics from '../components/subcomponents/Lyrics.vue'
import Tracks from '../components/subcomponents/Tracks.vue'
import Login from '../components/Login.vue'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '*',
      redirect: '/home'
    },
    {
      path: '/home',
      name: 'Home',
      component: Home,
      children: [
        {
          path: 'apod',
          name: 'Apod',
          component: Apod
        },
        {
          path: 'lyrics',
          name: 'Lyrics',
          component: Lyrics
        },
        {
          path: 'tracks',
          name: 'Tracks',
          component: Tracks
        }       
      ]
    },
    {
      path: '/menu',
      name: 'Menu',
      component: Menu,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    }

  ]
})

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(x => x.meta.requiresAuth)
  const currentUser = firebase.auth().currentUser

  if (requiresAuth && !currentUser) {
      next('/login')
  } else if (requiresAuth && currentUser) {
      next()
  } else {
      next()
  }
})

export default router
