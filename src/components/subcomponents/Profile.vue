<template>
    <div>
        <v-container>
            <!-- justify-content (horizontal), align-items (vertical) 
                Note:cannot control xs6 sizes if use column layout -->
            <v-layout justify-center row wrap>
                <v-flex xs6 mb-4>
                    <div>
                        <p class="font-weight-black text-sm-center title">Name: {{ userProfile.name }}</p>
                        <p class="font-weight-black text-sm-center title">Title: {{ userProfile.title }}</p>
                        <div class="create-post">
                            <v-form @submit.prevent>
                                <v-text-field
                                    label="Create a post"
                                    v-model.trim="post.content"
                                    type="text"
                                ></v-text-field>
                                <v-btn @click="createPost" color="primary" dark :disabled="post.content == ''">Post</v-btn>
                            </v-form>
                        </div>
                    </div>
                </v-flex>

                <!-- for comments section -->
                <v-flex xs12 mb-4>
                    <v-list three-line>
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
                        <div v-if="posts.length">
                            <template v-for="(post, index) in posts">
                                <v-list-tile :key="post.title" avatar ripple >   
                                    
                                    <v-list-tile-avatar>
                                    <img :src="user_image_url">
                                    </v-list-tile-avatar>
                    
                                    <v-list-tile-content>
                                        <v-list-tile-title>{{ post.userName }}</v-list-tile-title>
                                        <v-list-tile-sub-title>{{ post.content | trimLength }}</v-list-tile-sub-title>
                                        <v-list-tile-sub-title ><a @click="openCommentModal(post)">comments {{ post.comments }}</a> <a @click="viewPost(post)">view full post</a> </v-list-tile-sub-title>
                                    </v-list-tile-content>
                                    <v-list-tile-action>
                                        <v-icon style="color:red" @click="delete_dialog = true; delete_post = post">close</v-icon> 
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
                    <v-dialog v-model="delete_dialog" max-width="290">
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
                </v-flex>
            </v-layout>
            <p>{{ delete_post }}</p>
        </v-container>   

        <!-- comment modal -->
        <transition name="fade">
            <div v-if="showCommentModal" class="c-modal">
                <div class="c-container">
                    <a @click="closeCommentModal">X</a>
                    <p>add a comment</p>
                    <form @submit.prevent>
                        <textarea v-model.trim="comment.content"></textarea>
                        <button @click="addComment" :disabled="comment.content == ''" class="button">add comment</button>
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
                user_image_url: '',
                delete_dialog: false,
                delete_post: {}
            }
        },
        computed: {
            //use mapState to get access to all state properties or
            //use mapGetters to get all the getters specified in store.js
            //will use mapState for now
            ...mapState(['userProfile','currentUser','posts','hiddenPosts'])

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
                    likes: 0
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

                fb.postsCollection.doc(this.delete_post.id).set({
                    postId: postId,
                    userId: this.currentUser.uid
                }).then(() => {
                    // update post likes
                    fb.postsCollection.doc(postId).update({
                        likes: postLikes + 1
                    })
                })

            }
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
            }
        },
        created() {
            this.getUserImage()
        }
    }
</script>

<style scoped>


</style>
