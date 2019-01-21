<template>
    <div>
        <v-container>
            <!-- justify-content (horizontal), align-items (vertical) 
                Note:cannot control xs6 sizes if use column layout -->
            <v-layout justify-center row wrap>

                <!-- for events section -->
                <v-flex xs12 mb-4>
                    <v-list two-line>
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

                                <v-list-tile
                                    :key="post.title"
                                    avatar
                                    ripple
                                >   
                                    
                                    <v-list-tile-avatar>
                                    <img :src="post.avatar">
                                    </v-list-tile-avatar>
                    
                                    <v-list-tile-content>
                                        <v-list-tile-title>{{ post.userName }}</v-list-tile-title>
                                        <v-list-tile-sub-title>{{ post.content | trimLength }}</v-list-tile-sub-title>
                                        <v-list-tile-sub-title ><a @click="openCommentModal(post)">comments {{ post.comments }}</a> <a @click="viewPost(post)">view full post</a></v-list-tile-sub-title>
                                    </v-list-tile-content>
                                    <v-list-tile-action>
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
                </v-flex>
            </v-layout>
        </v-container>   
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
                selected: []
            }
        },
        computed: {
            //use mapState to get access to all state properties or
            //use mapGetters to get all the getters specified in store.js
            //will use mapState for now
            ...mapState(['userProfile','currentUser','posts','hiddenPosts'])
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
            }
        },
        filters: {
            formatDate(val) {
                if (!val) { return '-' }
                let date = val.toDate()
                return moment(date).fromNow()
            },
            trimLength(val) {
                if (val.length < 200) { return val }
                return `${val.substring(0, 200)}...`
            }
        }
    }
</script>

<style scoped>


</style>
