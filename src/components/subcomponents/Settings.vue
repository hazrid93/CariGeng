<template>
    <div>
        <v-container>
            <v-layout justify-center align-center column fill-height>
                <v-flex xs8 pr-2>
                    <h3 class="font-weight-black">Settings</h3>
                    <p class="font-weight-light">Update your profile</p>

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
                        <v-text-field
                            label="Name"
                            v-model.trim="name"
                            type="text"
                            :placeholder="userProfile.name" 
                            id="name"
                        ></v-text-field>

                        <v-text-field
                            label="Title"
                            v-model.trim="title"
                            type="text"
                            :placeholder="userProfile.title"
                            id="title"
                        ></v-text-field>

                        <v-btn @click="updateProfile" color="primary" round dark class="button">Update Profile</v-btn>
                    </v-form>
                </v-flex>
            </v-layout>
        </v-container>            
    </div>  

</template>

<script>

    import { mapState } from 'vuex'

    export default {
        data() {
            return {
                name: '',
                title: '',
                showSuccess: false
            }
        },
        computed: {
            ...mapState(['userProfile'])
        },
        methods: {
            updateProfile() {
                this.$store.dispatch('updateProfile', {
                    name: this.name !== '' ? this.name : this.userProfile.name,
                    title: this.title !== '' ? this.title : this.userProfile.title
                })

                this.name = ''
                this.title = ''

                this.showSuccess = true

                setTimeout(() => {
                    this.showSuccess = false
                }, 2000)
            }
        }
    }
</script>

<style scoped>



</style>
