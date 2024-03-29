import firebase from 'firebase/app'
//need to use firebase/app to avoid development mode log in console.
//https://github.com/firebase/firebase-js-sdk/issues/848
import 'firebase/firestore'
import 'firebase/storage'
import 'firebase/auth'
import 'firebase/messaging'

// firebase init goes here
const config = {
    apiKey: <API_KEY>,
    authDomain: <AUTH_DOMAIN>,
    databaseURL: <DATABASE_URL>,
    projectId: <PROJECT_ID>,
    storageBucket: <STORAGE>,
    messagingSenderId: <MESSAGING_ID>
  };
firebase.initializeApp(config)

// firebase utils
const db = firebase.firestore()
const storage = firebase.storage()
const auth = firebase.auth()
const currentUser = auth.currentUser

// date issue fix according to firebase
const settings = {
    timestampsInSnapshots: true
}
db.settings(settings)

// firebase collections
const usersCollection = db.collection('users')
const postsCollection = db.collection('posts')
const commentsCollection = db.collection('comments')
const likesCollection = db.collection('likes')
const eventsCollection = db.collection('events')
const eventslikesCollection = db.collection('events_likes')

export {
    db,
    auth,
    currentUser,
    usersCollection,
    postsCollection,
    commentsCollection,
    likesCollection,
    eventsCollection,
    eventslikesCollection,
    storage
}
