<template>
    <div>
        <v-container fluid>
            <!-- justify-content (horizontal), align-items (vertical) 
                Note:cannot control xs6 sizes if use column layout -->
            <v-layout justify-center row wrap>
                <v-layout justify-center align-end row wrap>
                <v-flex xs12 sm12 md4 pa-2>
                    <div style="background-color: white ;box-shadow: 0px 2px 3px grey;  margin-top: 65px; margin-bottom: 0px; border-radius: 7px " class="v-card-profile">
                        <v-avatar
                            class="mx-auto d-block"
                            size="130"
                            style="top: -65px"
                        >
                            <img :src="user_image_url">
                        </v-avatar>
                        <v-card-text class="text-xs-center" style="position: relative; top: -65px">
                            <h5 class="category text-gray font-weight mb-3">{{ userProfile.title }}</h5>
                            <h4 class="card-title font-weight-light">{{ userProfile.name }}</h4>
                            <p class="card-description font-weight-light" style="padding-top: 10px">{{ userProfile.user_description | trimUserDescription }}</p>
                            <v-btn
                            color="success"
                            round
                            class="font-weight-light"
                            >Follow</v-btn>
                        </v-card-text>
                    </div>
                    <div>
                        
                        <!--<div class="create-post">
                            <v-form @submit.prevent>
                                <v-text-field
                                    label="Create a post"
                                    v-model.trim="post.content"
                                    type="text"
                                ></v-text-field>
                                <div style="width: 100%; text-align: center">
                                    <v-btn @click="createPost" color="primary" round outline dark :disabled="post.content == ''">Post</v-btn>
                                </div>
                            </v-form>
                        </div>-->
                    </div>
                   
                </v-flex>
                <v-flex xs12 sm12 md4 pa-2>
                     <!-- using color in vuetify https://vuetifyjs.com/en/framework/colors#classes -->
                    <v-card style="border-radius: 7px; margin-top: 15px" color="grey darken-4" class="white--text">
                        <v-card-title primary-title class="pa-0">
                            <div style="background-color: white; border-radius: 7px; top: -15px; position: relative; margin-left: 15px; margin-right: 15px">
                                <v-icon style="color:red ; height: 70px; width:70px; font-size: 50px">whatshot</v-icon> 
                            </div>
                            <div class="headline">{{ numberOfUserEvent }} Event's Created</div>
                         
                        </v-card-title>
                    </v-card>
                </v-flex>
                </v-layout>


                <!-- for comments section -->
                <v-flex xs12 sm12 md8 pa-2>
                    <v-card style="border-radius: 7px">
                    <v-list three-line pa--0>
                        <v-subheader>
                            <v-form @submit.prevent style="width: 100%">
                                <v-layout justify-center align-center>
                                    <v-flex xs6>
                                        <v-text-field
                                            label="Create a post"
                                            v-model.trim="post.content"
                                            type="text"
                                            single-line
                                        >
                                        </v-text-field> 
                                    </v-flex>
                                    <v-flex xs6>
                                        <v-btn @click="createPost" color="primary" round outline dark :disabled="post.content == ''">Post</v-btn>      
                                    </v-flex>

                                </v-layout>
                            </v-form>


                        </v-subheader>
                        <!--
                            <v-subheader
                                v-if="hiddenPosts.length" 
                                @click="showNewPosts"
                                :key="hiddenPosts.length"
                            >
                                <p>
                                    Click to show <span>{{ hiddenPosts.length }}</span> 
                                    new <span v-if="hiddenPosts.length > 1">posts</span><span v-else>post</span>
                                </p>                                
                            </v-subheader> -->
                        <v-divider></v-divider>
                        <div v-if="posts.length">
                            <template v-for="(post, index) in posts">
                                <v-list-tile :key="post.title" avatar ripple dark>   
                                    
                                    <v-list-tile-avatar size="45px">
                                    <img :src="user_image_url">
                                    </v-list-tile-avatar>
                    
                                    <v-list-tile-content>
                                        <v-list-tile-title>{{ post.userName }}</v-list-tile-title>
                                        <v-list-tile-sub-title>{{ post.content | trimLength }}</v-list-tile-sub-title>
                                        <v-list-tile-sub-title ><a @click="openCommentModal(post)">comments {{ post.comments }}</a> <a @click="viewPost(post)">view full post</a> </v-list-tile-sub-title>
                                    </v-list-tile-content>
                                    <v-list-tile-action>
                                        <v-icon style="color:red" @click="delete_post = post ; delete_dialog = true">close</v-icon> 
                                        <v-list-tile-action-text>{{ post.createdOn | formatDate }}</v-list-tile-action-text>
                                        <v-list-tile-action-text>{{ post.likes }} likes</v-list-tile-action-text>
                                        <v-icon v-if="selected.indexOf(index) < 0" @click="likePost(post.id, post.likes); toggle(index)" color="grey lighten-1">star_border</v-icon>
                                        <v-icon v-else color="yellow darken-2">star</v-icon>
                                    </v-list-tile-action>
                                </v-list-tile>
                                <v-divider
                                    v-if="index + 1 < posts.length"
                                    :key="index"
                                ></v-divider>
                            </template>
                        </div>
                        <div v-else>
                            <p>There are currently no posts</p>
                        </div>
                    </v-list>
                    <!--delete confirmation part -->
                    <v-dialog v-model="delete_dialog" persistent max-width="290">
                        <v-card>
                            <v-card-title class="headline">Delete this post?</v-card-title>
                            <v-card-text>Deleted post are not recoverable</v-card-text>
                            <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="green darken-1" flat @click="delete_dialog = false">Cancel</v-btn>
                            <v-btn color="green darken-1" flat @click="deletePost()">Delete</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                </v-card>
                </v-flex>
            </v-layout>
           
        </v-container>   

        <!-- comment modal -->
        <transition name="fade">
            <div v-if="showCommentModal" class="c-modal">
                <div class="c-container">
                    <a @click="closeCommentModal">X</a>
                    <p>add a comment</p>
                    <form @submit.prevent>
                        <textarea v-model.trim="comment.content"></textarea>
                        <div style="width: 100%; ">
                            <button style=" margin-left: auto; margin-right: auto" @click="addComment" :disabled="comment.content == ''" class="button">add comment</button>
                        </div>
                    </form>
                </div>
            </div>
        </transition>
        <!-- post modal -->
        <transition name="fade">
            <div v-if="showPostModal" class="p-modal">
                <div class="p-container">
                    <a @click="closePostModal" class="close">X</a>
                    <div class="post">
                        <h5>{{ fullPost.userName }}</h5>
                        <span>{{ fullPost.createdOn | formatDate }}</span>
                        <p>{{ fullPost.content }}</p>
                        <ul>
                            <li><a>comments {{ fullPost.comments }}</a></li>
                            <li><a>likes {{ fullPost.likes }}</a></li>
                        </ul>
                    </div>
                    <div v-show="postComments.length" class="comments">
                        <div v-for="comment in postComments" class="comment">
                            <p>{{ comment.userName }}</p>
                            <span>{{ comment.createdOn | formatDate }}</span>
                            <p>{{ comment.content }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
    </div>

</template>

<script>
    import { mapState } from 'vuex'
    import moment from 'moment'
    const fb = require('../../firebaseConfig.js')

    export default {
        data() {
            return {
                post: {
                    content: ''
                },
                comment: {
                    postId: '',
                    userId: '',
                    content: '',
                    postComments: 0
                },
                showCommentModal: false,
                showPostModal: false,
                fullPost: {},
                postComments: [],
                selected: [],
                //display base64 image *http://probablyprogramming.com/2009/03/15/the-tiniest-gif-ever
                user_image_url: 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=',
                delete_dialog: false,
                delete_post: {},
                numberOfUserEvent: 0
            }
        },
        computed: {
            //use mapState to get access to all state properties or
            //use mapGetters to get all the getters specified in store.js
            //will use mapState for now
            ...mapState(['userProfile','currentUser','posts','hiddenPosts','events'])

            /* mapGetter example

            {
                computed: {
                    ...mapGetters([
                        'getter1',
                        'getter2',
                        'getter3'
                    ]);
                }
            }

            {
                computed: {
                    getter1() {
                        return this.$store.getters.getter1;
                    },
                    getter2() {
                        return this.$store.getters.getter2;
                    },
                    getter3() {
                        return this.$store.getters.getter3;
                    },
                }
            }
            */
        },
        methods: {
            createPost() {
                fb.postsCollection.add({
                    createdOn: new Date(),
                    content: this.post.content,
                    userId: this.currentUser.uid,
                    userName: this.userProfile.name,
                    comments: 0,
                    likes: 0,
                    commentOn: this.currentUser.uid
                }).then(ref => {
                    this.post.content = ''
                }).catch(err => {
                    console.log(err)
                })
            },
            showNewPosts() {
                let updatedPostsArray = this.hiddenPosts.concat(this.posts)
                // clear hiddenPosts array and update posts array
                this.$store.commit('setHiddenPosts', null)
                this.$store.commit('setPosts', updatedPostsArray)
            },
            openCommentModal(post) {
                this.comment.postId = post.id
                this.comment.userId = post.userId
                this.comment.postComments = post.comments
                this.showCommentModal = true
            },
            closeCommentModal() {
                this.comment.postId = ''
                this.comment.userId = ''
                this.comment.content = ''
                this.showCommentModal = false
            },
            addComment() {
                let postId = this.comment.postId
                let postComments = this.comment.postComments
                
                fb.commentsCollection.add({
                    createdOn: new Date(),
                    content: this.comment.content,
                    postId: postId,
                    userId: this.currentUser.uid,
                    userName: this.userProfile.name
                }).then(doc => {
                    fb.postsCollection.doc(postId).update({
                        comments: postComments + 1
                    }).then(() => {
                        this.closeCommentModal()
                    })
                }).catch(err => {
                    console.log(err)
                })
            },
            likePost(postId, postLikes) {
                let docId = `${this.currentUser.uid}_${postId}`

                fb.likesCollection.doc(docId).get().then(doc => {
                    if (doc.exists) {
                        return
                    }

                    fb.likesCollection.doc(docId).set({
                        postId: postId,
                        userId: this.currentUser.uid
                    }).then(() => {
                        // update post likes
                        fb.postsCollection.doc(postId).update({
                            likes: postLikes + 1
                        })
                    })
                }).catch(err => {
                    console.log(err)
                })
            },
            viewPost(post) {
                fb.commentsCollection.where('postId', '==', post.id).get().then(docs => {
                    let commentsArray = []

                    docs.forEach(doc => {
                        let comment = doc.data()
                        comment.id = doc.id
                        commentsArray.push(comment)
                    })

                    this.postComments = commentsArray
                    this.fullPost = post
                    this.showPostModal = true
                }).catch(err => {
                    console.log(err)
                })
            },
            closePostModal() {
                this.postComments = []
                this.showPostModal = false
            },
            toggle(index) {
                const i = this.selected.indexOf(index)

                if (i > -1) {
                this.selected.splice(i, 1)
                } else {
                this.selected.push(index)
                }
            },
            getUserImage() {
                //use promise to watch store to finish update the user profile
                // fetchUserProfileImage will return a promise
                this.$store.dispatch('fetchUserProfileImage').then(() => {
                        var user_image_name = this.$store.getters.getUserProfile.user_image
                        fb.storage.ref().child(`user_profile_image/${user_image_name}`).getDownloadURL().then((url) => {
                        this.user_image_url = url
                    }).catch(function(error) {
                        // Handle any errors
                    });
                })
            },
            deletePost() {
                fb.postsCollection.doc(this.delete_post.id).delete().then(() => {
    
                }).catch(err => {
                    console.log(err)  
                })
                this.delete_dialog = false
            },
            getUserEvent() {
                //this.currentUser.uid
                   fb.eventsCollection.where("userId", "==", this.currentUser.uid).get().then(querySnapshot => {
                    let numberOfUserEvent = 0

                    querySnapshot.forEach(doc => {
                        numberOfUserEvent = numberOfUserEvent + 1
                    })
                   
                    this.numberOfUserEvent = numberOfUserEvent 
                    })
            },
        },
        filters: {
            formatDate(val) {
                if (!val) { return '-' }
                let date = val.toDate()
                return moment(date).fromNow()
            },
            trimLength(val) {
                if (val.length < 100) { return val }
                return `${val.substring(0, 100)}...`
            },
            trimUserDescription(val) {
                if (val.length < 500) { return val }
                return `${val.substring(0, 100)}...`
            }
        },
        created() {
            this.getUserImage()
        },
        mounted() {
            this.getUserEvent() 
        }
    }
</script>

<style scoped>


</style>
