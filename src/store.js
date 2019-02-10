import Vue from 'vue'
import Vuex from 'vuex'
const fb = require('./firebaseConfig.js')

Vue.use(Vuex)

// handle page reload
fb.auth.onAuthStateChanged(user => {
  if (user) {
      store.commit('setCurrentUser', user)
      store.dispatch('fetchUserProfile')
      //need to update profile item when auth state change as well
      //need to add another one for event created
      store.dispatch('fetchUserProfileImage', { actualUser: true })
      
      fb.usersCollection.doc(user.uid).onSnapshot(doc => {
        store.commit('setUserProfile', doc.data())
       // console.log("setuserprofile logged")
      })

      // realtime updates from our posts collection
      fb.postsCollection.where("commentOn", "==", store.state.currentUser.uid).orderBy('createdOn', 'desc').onSnapshot(querySnapshot => {
        // check if created by currentUser
        let createdByCurrentUser
        //   console.log(querySnapshot.docChanges()[0].doc)
        //   console.log(querySnapshot.docChanges()[0].doc._firestore._config.credentials.currentUser.uid)
        //   console.log(querySnapshot.docChanges().length)
        if (querySnapshot.docs.length) {
            createdByCurrentUser = store.state.currentUser.uid == querySnapshot.docChanges()[0].doc.data().userId ? true : false
        }

        // add new posts to hiddenPosts array after initial load
        if (querySnapshot.docChanges().length !== querySnapshot.docs.length
            && querySnapshot.docChanges()[0].type == 'added' && !createdByCurrentUser) {

            let post = querySnapshot.docChanges()[0].doc.data()
            post.id = querySnapshot.docChanges()[0].doc.id

            store.commit('setHiddenPosts', post)
        } else {
            let postsArray = []

            querySnapshot.forEach(doc => {
                let post = doc.data()
                post.id = doc.id
                postsArray.push(post)
            
            })

            store.commit('setPosts', postsArray)
        }
    })

    //realtime update for events
    /*
    if(store.state.currentEventPage == 1){
      fb.eventsCollection.orderBy('createdOn', 'desc').limit(5).onSnapshot(querySnapshot => {
        let lastVisible = querySnapshot.docs[querySnapshot.docs.length-1];
        store.commit('setLastEventDocument', lastVisible)

        let eventsArray = []
  
        querySnapshot.forEach(doc => {
            let post = doc.data()
            post.id = doc.id
            eventsArray.push(post)
        
        })
  
        store.commit('setEvents', eventsArray)
      })
    } 
    */

    fb.eventsCollection.orderBy('createdOn', 'desc').onSnapshot(querySnapshot => {
      let eventsArray = []

      querySnapshot.forEach(doc => {
          let post = doc.data()
          post.id = doc.id
          eventsArray.push(post)
      
      })

      store.commit('setEvents', eventsArray)
      store.dispatch('fetchEventPageLength')
    })
  }
})


// https://stackoverflow.com/questions/49249528/firestore-security-rules-allow-user-access-to-their-data
export const store =  new Vuex.Store({
    state: {
        theme: null,    
        currentUser: null,
        userProfile: {},
        userProfileImage: '',
        userProfileImageURL: '',
        posts: [],
        hiddenPosts: [],
        events: [],
        visitingPosts: [],
        visitingUserProfile: {},
        visitingUserProfileImage: '',
        visitinguserProfileImageURL: '',
        lastEventDocument: null,
        currentEventPage: 1,
        currentPageLength: 1


    },
    //mutations are synhcronous
    mutations: {
        setLastEventDocument(state, val) {
          state.lastEventDocument = val
        },
        setCurrentEventPage(state, val) {
          state.currentEventPage = val
        },
        changeTheme(state) {
            state.theme = 'black';
        },
        setCurrentUser(state, val) {
          state.currentUser = val
        },
        setUserProfile(state, val) {
            state.userProfile = val
        },
        setPosts(state, val) {
          state.posts = val
        },
        setHiddenPosts(state, val) {
          if (val) {
              // make sure not to add duplicates
              if (!state.hiddenPosts.some(x => x.id === val.id)) {
                  state.hiddenPosts.unshift(val)
              }
          } else {
              state.hiddenPosts = []
          }
        },
        setEvents(state, val) {
          state.events = val
        },
        setuserProfileImage(state, val) {
          state.userProfileImage = val
        },
        setVisitingUserProfileImage(state, val) {
          state.visitingUserProfileImage = val
        },
        setVisitingPosts(state, val) {
          state.visitingPosts = val
        },
        setVisitingUserProfile(state, val) {
          state.visitingUserProfile = val
        },
        setuserProfileImageURL(state, val) {
          state.userProfileImageURL = val
        },
        setVisitingUserProfileImageURL(state, val) {
          state.visitingUserProfileImageURL = val
        },
        setCurrentPageLength(state, val) {
          state.currentPageLength = val
        }
    },
    //actions are asynchronous
    actions: {
        fetchEventPageLength({ commit, state }){
          /*
          fb.eventsCollection.get().then(querySnapshot => {
            let pageLength = querySnapshot.docs.length
            pageLength = Math.ceil(pageLength/5)
            store.commit('setCurrentPageLength', pageLength)
          })
          */
          let pageLength = state.events.length
          pageLength = Math.ceil(pageLength/5)
          store.commit('setCurrentPageLength', pageLength)
         
        },
        fetchEventsCollection({ commit, state }) {
          console.log(state.currentEventPage)
          let effectivePageIndex = state.currentEventPage
          effectivePageIndex = effectivePageIndex * 5
          let startAfterIndex = effectivePageIndex - 5
          if(startAfterIndex > 0){
            fb.eventsCollection.orderBy('createdOn', 'desc').limit(startAfterIndex).get().then(querySnapshot => {
              let lastVisible = querySnapshot.docs[querySnapshot.docs.length-1];
              store.commit('setLastEventDocument', lastVisible)

              fb.eventsCollection.orderBy('createdOn', 'desc').limit(effectivePageIndex).startAfter(lastVisible).get().then(querySnapshot => {
                let eventsArray = []
                querySnapshot.forEach(doc => {
                    let post = doc.data()
                    post.id = doc.id
                    eventsArray.push(post)
                })
          
                store.commit('setEvents', eventsArray)
              })
            })
          } else {
            fb.eventsCollection.orderBy('createdOn', 'desc').limit(effectivePageIndex).get().then(querySnapshot => {
              let eventsArray = []
              querySnapshot.forEach(doc => {
                  let post = doc.data()
                  post.id = doc.id
                  eventsArray.push(post)
              })
        
              store.commit('setEvents', eventsArray)
            })
          }
         
        },
        fetchVisitingPosts({ commit, state }, profileState) {
          fb.postsCollection.where("userId", "==", profileState.userId).orderBy('createdOn', 'desc').get().then(querySnapshot => {
            let visitingPostsArray = []

            querySnapshot.forEach(doc => {
                let visitingPost = doc.data()
                visitingPost.id = doc.id
                visitingPostsArray.push(visitingPost)
            
            })
      
            store.commit('setVisitingPosts', visitingPostsArray)
          })
        },
        setThemeInitial({commit}) {
            commit('changeTheme');
            //console.log("vuex called");
        },
        fetchUserProfile({ commit, state }) {
          fb.usersCollection.doc(state.currentUser.uid).get().then(res => {
              commit('setUserProfile', res.data())
          }).catch(err => {
              console.log(err)
          })
        },
        fetchVisitingUserProfile({ commit, state }, profileState) {
          fb.usersCollection.doc(profileState.userId).get().then(res => {
              commit('setVisitingUserProfile', res.data())
          }).catch(err => {
              console.log(err)
          })
        },
        fetchUserProfilePromise({ commit, state }) {

          // using interval to wait for userProfile to be updated when called from Profile.vue
          return new Promise((resolve, reject) => {
            let myInterval = setInterval(myTimer, 50);
              function myTimer(){
                if(state.userProfile.name){
                  clearInterval(myInterval)
                  resolve()
                } else {
                }
              }
          })
         
          /*
          return new Promise((resolve, reject) => {
            fb.usersCollection.doc(state.currentUser.uid).get().then(res => {
              commit('setUserProfile', res.data())
              resolve()
            }).catch(err => {
                reject()
            })
          })
          */
          
        },
        //check if user dont have image does it triger reject
        fetchUserProfileImage({ commit, state }, profileState) {
          let userId = state.currentUser.uid
          //console.log(userId)
          if(!profileState.actualUser){
            userId = profileState.userId
          }
          return new Promise((resolve, reject) => {
            fb.usersCollection.doc(userId).get().then(res => {
              commit('setuserProfileImage', res.data().user_image)
                fb.storage.ref().child(`user_profile_image/${res.data().user_image}`).getDownloadURL().then((url) => {
                  commit('setuserProfileImageURL', url)
                  resolve()
                }).catch(function(error) {
                    // Handle any errors
                    reject()
                });
              
              // console.log(res.data().user_image)
              }).catch(err => {
                //check if profile dont have image does it trigger this one
                 // commit('setuserProfileImage', 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=')
                  //console.log(err)
                  reject()
              })
          })

        },
        fetchCommentUserProfileImage({ commit, state }, profileState) {
          return new Promise((resolve, reject) => {
            fb.usersCollection.doc(profileState.userId).get().then(res => {      
              fb.storage.ref().child(`user_profile_image/${res.data().user_image}`).getDownloadURL().then((url) => {
                  resolve(url)
                }).catch(err => {
                    // Handle any errors
                  
              });   

            }).catch(err => {
                reject()
            })
          })

        },
        fetchVisitingUserProfileImage({ commit, state }, profileState) {

          let userId = profileState.userId
          
          return new Promise((resolve, reject) => {
            fb.usersCollection.doc(userId).get().then(res => {
              commit('setVisitingUserProfileImage', res.data().user_image)
                fb.storage.ref().child(`user_profile_image/${res.data().user_image}`).getDownloadURL().then((url) => {
                  commit('setVisitingUserProfileImageURL', url)
                  resolve()
                }).catch(function(error) {
                    // Handle any errors
                    reject()
                });
              
              // console.log(res.data().user_image)
              }).catch(err => {
                //check if profile dont have image does it trigger this one
                 // commit('setuserProfileImage', 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=')
                  //console.log(err)
                  reject()
              })
          })

        },
        clearData({commit}){
          commit('setCurrentUser', null)
          commit('setUserProfile', {})
          commit('setPosts', null)
          commit('setHiddenPosts', null)
        },
        updateProfile({ commit, state }, data) {
          let name = data.name
          let title = data.title
          let user_image = data.user_image
      
          fb.usersCollection.doc(state.currentUser.uid).update({ name, title, user_image }).then(user => {
              // update all posts by user to reflect new name
              fb.postsCollection.where('userId', '==', state.currentUser.uid).get().then(docs => {
                  docs.forEach(doc => {
                      fb.postsCollection.doc(doc.id).update({
                          userName: name
                      })
                  })
              })
              // update all comments by user to reflect new name
              fb.commentsCollection.where('userId', '==', state.currentUser.uid).get().then(docs => {
                  docs.forEach(doc => {
                      fb.commentsCollection.doc(doc.id).update({
                          userName: name
                      })
                  })
              })
            }).catch(err => {
                console.log(err)
            })
          }
    },
    getters: {
      getCurrentUser: (state)=>{
          return state.currentUser
      },
      getUserProfile: (state)=>{
          return state.userProfile
      },
      getUserProfileImage: (state)=>{
        return state.userProfileImage
      },
      getVisitingUserProfileImage: (state)=>{
        return state.visitingUserProfileImage
      }
    }
})

/*export default new Vuex.Store({
  state: {
    idToken: null,
    userId: null,
    user: null
  },
  //mutation must be synchronous, asynchronous stuff do at actions
  mutations: {
    authUser (state, userData) {
      state.idToken = userData.token
      state.userId = userData.userId
    },
    storeUser (state, user) {
      state.user = user
    },
    clearAuthData (state) {
      state.idToken = null
      state.userId = null
    }
  },
  actions: {
    setLogoutTimer ({commit}, expirationTime) {
      setTimeout(() => {
        commit('clearAuthData')
      }, expirationTime * 1000)
    },
    signup ({commit, dispatch}, authData) {
      axios.post('/signupNewUser?key=AIzaSyCMXzv3qHr7nhO6lVN7uPh85GBOO0pyR44', {
        email: authData.email,
        password: authData.password,
        returnSecureToken: true
      })
        .then(res => {
          console.log(res)
          commit('authUser', {
            token: res.data.idToken,
            userId: res.data.localId
          })
          const now = new Date()
          const expirationDate = new Date(now.getTime() + res.data.expiresIn * 1000)
          localStorage.setItem('token', res.data.idToken)
          localStorage.setItem('userId', res.data.localId)
          localStorage.setItem('expirationDate', expirationDate)
          dispatch('storeUser', authData)
          dispatch('setLogoutTimer', res.data.expiresIn)
        })
        .catch(error => console.log(error))
    },
    login ({commit, dispatch}, authData) {
      axios.post('/verifyPassword?key=AIzaSyCMXzv3qHr7nhO6lVN7uPh85GBOO0pyR44', {
        email: authData.email,
        password: authData.password,
        returnSecureToken: true
      })
        .then(res => {
          console.log(res)
          const now = new Date()
          const expirationDate = new Date(now.getTime() + res.data.expiresIn * 1000)
          localStorage.setItem('token', res.data.idToken)
          localStorage.setItem('userId', res.data.localId)
          localStorage.setItem('expirationDate', expirationDate)
          commit('authUser', {
            token: res.data.idToken,
            userId: res.data.localId
          })
          dispatch('setLogoutTimer', res.data.expiresIn)
        })
        .catch(error => console.log(error))
    },
    tryAutoLogin ({commit}) {
      const token = localStorage.getItem('token')
      if (!token) {
        return
      }
      const expirationDate = localStorage.getItem('expirationDate')
      const now = new Date()
      if (now >= expirationDate) {
        return
      }
      const userId = localStorage.getItem('userId')
      commit('authUser', {
        token: token,
        userId: userId
      })
    },
    logout ({commit}) {
      commit('clearAuthData')
      localStorage.removeItem('expirationDate')
      localStorage.removeItem('token')
      localStorage.removeItem('userId')
      router.replace('/signin')
    },
    storeUser ({commit, state}, userData) {
      if (!state.idToken) {
        return
      }
      globalAxios.post('/users.json' + '?auth=' + state.idToken, userData)
        .then(res => console.log(res))
        .catch(error => console.log(error))
    },
    fetchUser ({commit, state}) {
      if (!state.idToken) {
        return
      }
      globalAxios.get('/users.json' + '?auth=' + state.idToken)
        .then(res => {
          console.log(res)
          const data = res.data
          const users = []
          for (let key in data) {
            const user = data[key]
            user.id = key
            users.push(user)
          }
          console.log(users)
          commit('storeUser', users[0])
        })
        .catch(error => console.log(error))
    }
  },
  getters: {
    user (state) {
      return state.user
    },
    isAuthenticated (state) {
      return state.idToken !== null
    }
  }
})
*/