<template>
    <div>
        <v-container fluid>
            <v-layout justify-center align-center row wrap fill-height>
                <v-flex xs10 sm10 md4 pr-2>
                    <h5 class=" headline font-weight-black">Settings</h5>
                    <p class="font-weight-light">Update your user profile</p>

                    <transition name="fade">
                        <v-alert
                        :value="showSuccess"
                        type="success"
                        style="max-height: 20px;"
                        outline
                        >
                        SUCCESS
                        </v-alert>
                    </transition>

                    <v-form @submit.prevent>
                        <h6 class="title font-weight-light" style="text-decoration: underline">Current Avatar</h6>
                        <v-img
                            :src="user_image_url"
                            aspect-ratio="1"
                            class="grey lighten-2"
                           
                            min-width="250px"
                            max-width="250px"
                       
                            min-height="250px"
                            max-height="250px"
                            style="margin-left: 0; margin-right:auto; margin-top:10px; margin-bottom:10px;border-radius: 7px"
                            
                        > </v-img>

                        <h6 class="title font-weight-light" style="text-decoration: underline">Name</h6>
                        <v-text-field
                            label="Name"
                            v-model.trim="name"
                            type="text"
                            :placeholder="userProfile.name" 
                            id="name"
                            style="margin-bottom:10px; padding: 0"
                            single-line
                            
                        ></v-text-field>
                         
                        <h6 class="title font-weight-light" style="text-decoration: underline">Title</h6>
                        <v-text-field
                            label="Title"
                            v-model.trim="title"
                            type="text"
                            :placeholder="userProfile.title"
                            id="title"
                            style="margin-bottom:10px; padding: 0"
                            single-line
                        ></v-text-field>

                        <h6 class="title font-weight-light" style="text-decoration: underline">Upload New Avatar</h6>
                        <input @change="handleImageFileUpload()" type="file" id="image_file" ref="file" style="width: 100%; padding-top: 12px; margin-top: 4px; padding-bottom: 12px; margin-bottom: 4px;"></input>

                        <v-btn style="margin-top:10px; margin-bottom:10px;" round outline @click="updateProfile" color="primary" dark class="button">Update Profile</v-btn>
                        
                    </v-form>
                </v-flex>
            </v-layout>
        </v-container>            
    </div>  

</template>

<script>

    import { mapState } from 'vuex'
    const fb = require('../../firebaseConfig.js')

    export default {
        data() {
            return {
                name: '',
                title: '',
                image_file: null,
                user_image_url: 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=',
                showSuccess: false
            }
        },
        computed: {
            ...mapState(['userProfile', 'currentUser', 'userProfileImage'])
        },
        methods: {
            updateProfile() {
                
                //upload user profile image
                //change filename
                var user_image =  this.currentUser.uid + '_' + new Date().getTime() + '_' + this.image_file.name

                this.$store.dispatch('updateProfile', {
                    //ternary [condition ? (true) : (false)]
                    name: this.name !== '' ? this.name : this.userProfile.name,
                    title: this.title !== '' ? this.title : this.userProfile.title,
                    user_image: user_image
                })

                fb.storage.ref().child(`user_profile_image/${user_image}`).put(this.image_file).then(snapshot => {
                    console.log("succesful upload")
                    this.getUserImage() 
                }).catch(err => {
                    console.log(err)
                });

                this.name = ''
                this.title = ''

                this.showSuccess = true

                setTimeout(() => {
                    this.showSuccess = false
                }, 2000)
            },
            handleImageFileUpload() {
                this.image_file = this.$refs.file.files[0];
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
            }
        },
        created() {
            this.getUserImage()
        }
    }
</script>

<style scoped>



</style>
