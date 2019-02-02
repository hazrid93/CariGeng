import firebase from 'firebase'
import 'firebase/firestore'

// firebase init goes here
const config = {
    apiKey: "AIzaSyCMXzv3qHr7nhO6lVN7uPh85GBOO0pyR44",
    authDomain: "my-project-1536942914988.firebaseapp.com",
    databaseURL: "https://my-project-1536942914988.firebaseio.com",
    projectId: "my-project-1536942914988",
    storageBucket: "my-project-1536942914988.appspot.com",
    messagingSenderId: "571219777796"
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