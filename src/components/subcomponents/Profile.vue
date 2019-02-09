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
                            <img v-if="userProfileImageURL" :src="userProfileImageURL">
                            <img v-else :src="'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='">
                        </v-avatar>
                        <div v-if="isUserProfile">
                            <v-card-text class="text-xs-center" style="position: relative; top: -65px">
                                <h5 class="category text-gray font-weight mb-3">{{ userProfile.title }}</h5>
                                <h4 class="card-title font-weight-light">{{ userProfile.name }}</h4>
                                <p class="card-description font-weight-light" style="padding-top: 10px">{{ userProfile.user_description | trimUserDescription }}</p>
                            
                            </v-card-text>
                        </div>
                        <div v-else>
                            <v-card-text class="text-xs-center" style="position: relative; top: -65px">
                                <h5 class="category text-gray font-weight mb-3">{{ visitingUserProfile.title }}</h5>
                                <h4 class="card-title font-weight-light">{{ visitingUserProfile.name }}</h4>
                                <p class="card-description font-weight-light" style="padding-top: 10px">{{ visitingUserProfile.user_description | trimUserDescription }}</p>
                            
                                <v-btn
                                color="success"
                                round
                                class="font-weight-light"
                                >Follow</v-btn>
                            </v-card-text>
                        </div>
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
                        <div v-if="isUserProfile">
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
                        </div>
                        <div v-if="isUserProfile">
                            <div v-if="posts.length">
                                <template v-for="(post, index) in posts">
                                    <v-list-tile :key="post.title" avatar ripple dark>   
                                        
                                        
                                        <v-list-tile-avatar size="45px">
                                            <img v-if="userProfileImageURL" :src="userProfileImageURL">
                                            <img v-else :src="'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='">
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
                                <p  class="font-weight-light" style="padding: 10px; margin: 0px">There are currently no posts...</p>
                            </div>
                        </div>
                        <!-- when viewing other user -->
                        <div v-else>
                            <div v-if="visitingPosts.length">
                                <template v-for="(post, index) in visitingPosts">
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
                                            <v-list-tile-action-text>{{ post.createdOn | formatDate }}</v-list-tile-action-text>
                                            <v-list-tile-action-text>{{ post.likes }} likes</v-list-tile-action-text>
                                            <v-icon v-if="selected.indexOf(index) < 0" @click="likePost(post.id, post.likes); toggle(index)" color="grey lighten-1">star_border</v-icon>
                                            <v-icon v-else color="yellow darken-2">star</v-icon>
                                        </v-list-tile-action>
                                    </v-list-tile>
                                    <v-divider
                                        v-if="index + 1 < visitingPosts.length"
                                        :key="index"
                                    ></v-divider>
                                </template>
                            </div>
                            <div v-else>
                                <p  class="font-weight-light" style="padding: 10px; margin: 0px">There are currently no posts...</p>
                            </div>
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
              <v-dialog v-model="showCommentModal" persistent max-width="800px">
                 <v-card>
                     <v-card-title class="headline">Add Your Comment</v-card-title>
                     <template>
                     <v-divider></v-divider>
                        <v-list-tile :key="comment.title" avatar ripple dark>   
                            <v-list-tile-avatar size="45px">
                            <img v-if="userProfileImageURL" :src="userProfileImageURL">
                            <img v-else :src="'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='">
                            </v-list-tile-avatar>
            
                            <v-list-tile-content>
                                <v-list-tile-title>{{ comment.userName }}</v-list-tile-title>
                                <v-list-tile-sub-title>{{ comment.content }}</v-list-tile-sub-title>
                            </v-list-tile-content>
                            <v-list-tile-action>
                                <v-list-tile-action-text>{{ comment.createdOn | formatDate }}</v-list-tile-action-text>
                                <v-list-tile-action-text>{{ comment.likes }} likes</v-list-tile-action-text>
                            </v-list-tile-action>
                        </v-list-tile>
                        <v-divider></v-divider>
                     
                        </template>
                      <v-form ref="form" lazy-validation> 
                            <v-card-title class="headline">Comment</v-card-title> 
                            <v-textarea
                            v-model="comment.newUserComment"
                            auto-grow
                            rows="1"
                            label="Default style"
                            hint="Enter your comment"
                            style="padding: 0px 20px 5px 20px"
                            ></v-textarea>
                           <!-- <v-text-field v-model="comment.newUserComment" required></v-text-field> -->
                      </v-form>
                      
                     <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="green darken-1" flat @click="closeCommentModal">Close</v-btn>
                        <v-btn color="green darken-1" flat @click="addComment">Add Comment</v-btn>
                    </v-card-actions>
                </v-card>
              </v-dialog>
        </transition>       
            <!--
            <div v-if="showCommentModal">
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
            </div> -->
        </transition>
        <!-- post modal -->
       <transition name="fade">
             <v-dialog v-model="showPostModal" persistent max-width="800px">
                 <v-card>
                     <v-card-title class="headline">Full Post</v-card-title>
                     <template>
                     <v-divider></v-divider>
                        <v-list-tile :key="fullPost.title" avatar ripple dark>   
                            <v-list-tile-avatar size="45px">
                            <img v-if="userProfileImageURL" :src="userProfileImageURL">
                            <img v-else :src="'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='">
                            </v-list-tile-avatar>
            
                            <v-list-tile-content>
                                <v-list-tile-title>{{ fullPost.userName }}</v-list-tile-title>
                                <v-list-tile-sub-title>{{ fullPost.content }}</v-list-tile-sub-title>
                            </v-list-tile-content>
                            <v-list-tile-action>
                                <v-list-tile-action-text>{{ fullPost.createdOn | formatDate }}</v-list-tile-action-text>
                                <v-list-tile-action-text>{{ fullPost.likes }} likes</v-list-tile-action-text>
                            </v-list-tile-action>
                        </v-list-tile>
                        <v-divider></v-divider>
                     </template>
                    <!-- post comments part -->
                    <div v-show="postComments.length">
                        <v-card-title class="title">All Comments</v-card-title>
                        <template v-for="(comments, index) in postComments">
                                
                                <v-list-tile :key="comments.title" avatar ripple dark>   
                                    <v-list-tile-avatar size="45px">
                                    <img v-if="postCommentsPicture[index]" :src="postCommentsPicture[index]">
                                    <img v-else :src="'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='">
                                    </v-list-tile-avatar>
                    
                                    <v-list-tile-content>
                                        <v-list-tile-title>{{ comments.userName }}</v-list-tile-title>
                                        <v-list-tile-sub-title>{{ comments.content }}</v-list-tile-sub-title>
                                    </v-list-tile-content>
                                    <v-list-tile-action>
                                        <v-list-tile-action-text>{{ comments.createdOn | formatDate }}</v-list-tile-action-text>
                                    </v-list-tile-action>
                                </v-list-tile>
                                <v-divider></v-divider>
                        </template>
                    </div>

                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="green darken-1" flat @click="closePostModal">Close</v-btn>
                    </v-card-actions>
                </v-card>

                <!--
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
                -->
            </v-dialog>
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
                    userName: '',
                    createdOn: '',
                    likes: '',
                    title: '',
                    newUserComment: '',
                    postComments: 0
                },
                showCommentModal: false,
                showPostModal: false,
                fullPost: {},
                postComments: [],
                postCommentsPicture: [],
                selected: [],
                //display base64 image *http://probablyprogramming.com/2009/03/15/the-tiniest-gif-ever
                user_image_url: 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=',
                delete_dialog: false,
                delete_post: {},
                numberOfUserEvent: 0,
                isUserProfile: false,
                profileUID: '',
                backup_actual_user_image: ''
            }
        },
        computed: {
            //use mapState to get access to all state properties or
            //use mapGetters to get all the getters specified in store.js
            //will use mapState for now
            ...mapState(['userProfile','currentUser','posts','hiddenPosts','events','visitingPosts','visitingUserProfile','userProfileImage','userProfileImageURL'])

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
                this.comment.userName = post.userName
                this.comment.content = post.content
                this.comment.createdOn = post.createdOn
                this.comment.likes = post.likes
                this.comment.title = post.title
                this.showCommentModal = true
                
            },
            closeCommentModal() {
                this.comment.postId = ''
                this.comment.userId = ''
                this.comment.content = ''
                this.comment.postComments = ''
                this.comment.userName = ''
                this.comment.createdOn = ''
                this.comment.likes = ''
                this.comment.title = ''
                this.showCommentModal = false
            },
            addComment() {
                let postId = this.comment.postId
                let postComments = this.comment.postComments
                
                fb.commentsCollection.add({
                    createdOn: new Date(),
                    content: this.comment.newUserComment,
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
                fb.commentsCollection.where('postId', '==', post.id).orderBy('createdOn', 'desc').get().then(docs => {
                    let commentsArray = []

                    docs.forEach(doc => {
                        let comment = doc.data()
                        comment.id = doc.id
                        commentsArray.push(comment)
                    })
                    //console.log(commentsArray)
                    this.postComments = commentsArray
                  
                    this.fullPost = post
                    this.showPostModal = true
                    this.getCommentUserImg()
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
                if(this.isUserProfile){
                    this.$store.dispatch('fetchUserProfileImage', { actualUser: true }).then(() => {
                            //var user_image_name = this.$store.getters.getUserProfileImage
                            //fb.storage.ref().child(`user_profile_image/${user_image_name}`).getDownloadURL().then((url) => {
                            this.user_image_url = this.userProfileImageURL
                        }).catch(function(error) {
                            // Handle any errors
                        });
                    
                } else {
                    this.backup_actual_user_image = ''
                    
                    this.$store.dispatch('fetchUserProfileImage', { actualUser: true }).then(() => {
                          //  var user_image_name = this.$store.getters.getUserProfileImage
                         //   console.log(user_image_name)
                         //   fb.storage.ref().child(`user_profile_image/${user_image_name}`).getDownloadURL().then((url) => {
                            this.backup_actual_user_image = this.userProfileImageURL

                        }).catch(function(error) {
                            // Handle any errors
                        });
                        // })
                    
                     this.$store.dispatch('fetchUserProfileImage', { actualUser: false, userId: this.profileUID }).then(() => {
                          //  var user_image_name = this.$store.getters.getUserProfileImage
                          //  fb.storage.ref().child(`user_profile_image/${user_image_name}`).getDownloadURL().then((url) => {
                            this.user_image_url = this.userProfileImageURL
                        }).catch(function(error) {
                            // Handle any errors
                        });
                  //  })
                }
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
                if(this.isUserProfile){
                   fb.eventsCollection.where("userId", "==", this.currentUser.uid).get().then(querySnapshot => {
                    let numberOfUserEvent = 0

                    querySnapshot.forEach(doc => {
                        numberOfUserEvent = numberOfUserEvent + 1
                    })
                   
                    this.numberOfUserEvent = numberOfUserEvent 
                    })
                } else {
                    fb.eventsCollection.where("userId", "==", this.profileUID).get().then(querySnapshot => {
                    let numberOfUserEvent = 0

                    querySnapshot.forEach(doc => {
                        numberOfUserEvent = numberOfUserEvent + 1
                    })
                   
                    this.numberOfUserEvent = numberOfUserEvent 
                    })
                }
            },
            getVisitingPosts(){ 
                this.$store.dispatch('fetchVisitingPosts', { userId: this.profileUID })   
            },
            getVisitingUserProfile(){
                this.$store.dispatch('fetchVisitingUserProfile', { userId: this.profileUID }) 
            },
            //use async/await to chain promise but maintain order *if not user image is not ordered properly*
            //https://stackoverflow.com/questions/42964102/syntax-for-async-arrow-function
            //https://stackoverflow.com/questions/46601552/calling-async-function-in-main-file
            getCommentUserImg(){
                this.postCommentsPicture = []
                let uniqueCommentPictureID = []

                //using 'indexOf' to check if userId existed in array ? *Array.prototype.indexOf*
                // however IE might not support this. https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf
                // so if indexOf is not supported don't do this performance enhancement algorithm
                let duplicateUserId = []
                let duplicateUserIdMap = []
                let iterator = 0
                for(let comment of this.postComments){
                   
                    if(comment.userId != this.currentUser.uid && duplicateUserId.indexOf(comment.userId) == -1){
                        duplicateUserId.push(comment.userId)

                        let UserIdMap = {}
                        UserIdMap.userId = comment.userId
                        UserIdMap.index = iterator
                        UserIdMap.imageURL = ''
                        duplicateUserIdMap.push(UserIdMap)
                    }
                    iterator = iterator + 1
                }

                console.log(duplicateUserId)
                console.log(duplicateUserIdMap)

                let postCommentImagesArray = []
                //async function to get image
                let getImages = async () => {

                    for (let comment of this.postComments){
                        if(this.currentUser.uid != comment.userId) {
                            if(duplicateUserId.indexOf(comment.userId) != -1){

                            }

                            let userIdData =  await  fb.usersCollection.doc(comment.userId).get()           
                            let userImgURL =  await fb.storage.ref().child(`user_profile_image/${userIdData.data().user_image}`).getDownloadURL()
                            postCommentImagesArray.push(userImgURL)   
                        } else {
                            if(this.isUserProfile){
                                postCommentImagesArray.push(this.user_image_url)
                            } else {
                                postCommentImagesArray.push(this.backup_actual_user_image)
                            }
                            
                        } 
                    }
                }

                getImages().then(result => {

                }).catch(error => {
                    console.log(error)

                })

                this.postCommentsPicture = postCommentImagesArray
                /*
                this.postComments.forEach(comment => {
                    //    console.log(comment.userId)
                    if(this.currentUser.uid != comment.userId) {
                       // console.log(comment.userId)
                        fb.usersCollection.doc(comment.userId).get().then(res => {
                            
                            fb.storage.ref().child(`user_profile_image/${res.data().user_image}`).getDownloadURL().then((url) => {
                             //   userImgUrl = url
                               // console.log("userImgUrl = " + userImgUrl)
                              // console.log(userImgUrl)
                                postCommentImagesArray.push(url)
                            }) 
                           
                        }).catch(err => {

                        })
                    } else {
                       // console.log(comment.userId)
                            if(this.userProfile) {
                                console.log(this.user_image_url)
                                postCommentImagesArray.push(this.user_image_url)
                            } else {
                                console.log(this.user_image_url)
                                postCommentImagesArray.push(this.backup_actual_user_image)
                            }
                      
                    } 

                    
                })*/
               // console.log(postCommentImagesArray)
               // this.postCommentsPicture = postCommentImagesArray
               // console.log(this.postCommentsPicture) 
                /*
                this.$store.dispatch('fetchCommentUserProfileImage', { userId: commentUserId }).then(result => {
                    console.log(result)
                    return result
                }).catch(function(error) {
                    // Handle any errors
                    return 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='
                });
                */

                /*
                let userImgUrl = 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='
                fb.usersCollection.doc(commentUserId).get().then(res => {
                    //console.log(res.data().user_image)
                    let userImgUrl2 = res.data().user_image
                    fb.storage.ref().child(`user_profile_image/${userImgUrl2}`).getDownloadURL().then((url) => {
                        console.log(url)
                        userImgUrl = url
                    })
                   
                }).catch(err => {
                    
                })

                return userImgUrl 
                */
            }
        },
        filters: {
            formatDate(val) {
                if (!val) { return '-' }
                let date = val.toDate()
                return moment(date).fromNow()
            },
            trimLength(val) {
                if (val.length < 60) { return val }
                return `${val.substring(0, 60)}...`
            },
            trimUserDescription(val) {
                if (val.length < 400) { return val }
                return `${val.substring(0, 400)}...`
            }
        },
        created() {
            this.profileUID = this.currentUser.uid
          
            this.$store.dispatch('fetchUserProfilePromise').then(() => {
               let userUsername =  this.userProfile.name 

               if(this.$route.params.username){
                    userUsername = this.$route.params.username
                }

                fb.usersCollection.where('name', '==', userUsername).get().then(docs => {
                    if(docs.docs.length){
                        
                            if(this.currentUser.uid == docs.docs[0].id && this.userProfile.name == userUsername){
                                this.isUserProfile = true
                                this.getUserImage()
                                this.getUserEvent() 
                            } else {
                                this.isUserProfile = false
                                //console.log(docs.docs[0].id)
                                this.profileUID = docs.docs[0].id
                                this.getUserImage()
                                this.getUserEvent() 
                                this.getVisitingUserProfile()
                                this.getVisitingPosts()
                                //this.$router.push('/home')
                            }
                    } else {
                            this.isUserProfile = false
                            // USER DOESNT EXIST
                            this.$router.push('/home')
                    }
                })
            }).catch(err => {
                this.isUserProfile = false
                // USER DOESNT EXIST
                this.$router.push('/home')
            })
        }
    }
</script>

<style scoped>


</style>
