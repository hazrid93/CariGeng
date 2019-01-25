<template>
        <v-container fluid fill-height>
            <v-layout justify-center align-center row wrap>
                <v-flex xs12>
                    
                        <transition name="fade">
                            <div v-if="performingRequest" class="loading">
                                <h3 style="text-align: center;">Loading...</h3>
                            </div>
                        </transition>
                   
                        <div class="col1 headerName">
                           <!-- <h3 class="display-2 font-weight-bold">CariGeng</h3> -->
                            <div class="svgWrap">
                                <svg class="iconSize" viewBox="0 0 60 20">
                                    <text font-family="Permanent Marker" class="left-leg" text-anchor="start" x="0%" y="50%" >Cari</text>
                                    <text font-family="Permanent Marker" text-anchor="start" x="50%" y="50%" >Geng</text>
                                </svg>
                            </div>
                        </div>
                        <div class="col2" :class="{ 'signup-form': !showLoginForm && !showForgotPassword }">
                        <!-- <v-form ref="form" lazy-validation>                  
                                <v-text-field v-model="event.title" label="Title" required ></v-text-field>
                                <v-text-field v-model="event.content" label="Content" required ></v-text-field>
                                <v-text-field v-model="event.address" label="Address" required ></v-text-field>
                                <v-text-field v-model="event.city" label="City" required ></v-text-field>
                                <v-text-field v-model="event.state" label="State" required ></v-text-field>
                                <v-text-field v-model="event.country" label="Country" required ></v-text-field>
                                <v-btn @click="submit">submit</v-btn>
                                <v-btn @click="clear">clear</v-btn>
                            </v-form> -->

                            <v-form v-if="showLoginForm" @submit.prevent>
                                <v-layout justify-center align-center row wrap>
                                    <v-flex xs8 text-xs-center>
                                        <v-text-field placeholder="email" clearable outline v-model.trim="loginForm.email" label="Email" id="email1" required ></v-text-field>
                                        <v-text-field placeholder="password" clearable outline v-model.trim="loginForm.password" label="Password" id="password1" type="password" required ></v-text-field>
                                        <v-btn @click="login">Log In</v-btn>

                                        <div class="extras">
                                            <br>
                                            <a @click="togglePasswordReset" style="padding: 5px">Forgot Password</a>
                                            <a @click="toggleForm" style="padding: 5px">Create an Account</a>
                                        </div>
                                    </v-flex>
                                </v-layout>
                            </v-form>
                            <v-form v-if="!showLoginForm && !showForgotPassword" @submit.prevent>
                                <h1>Get Started</h1>

                                <label for="name">Name</label>
                                <input v-model.trim="signupForm.name" type="text" placeholder="Savvy Apps" id="name" />

                                <label for="title">Title</label>
                                <input v-model.trim="signupForm.title" type="text" placeholder="Company" id="title" />

                                <label for="email2">Email</label>
                                <input v-model.trim="signupForm.email" type="text" placeholder="you@email.com" id="email2" />

                                <label for="password2">Password</label>
                                <input v-model.trim="signupForm.password" type="password" placeholder="min 6 characters" id="password2" />

                                <button @click="signup" class="button">Sign Up</button>

                                <div class="extras">
                                    <a @click="toggleForm">Back to Log In</a>
                                </div>
                            </v-form>
                            <v-form v-if="showForgotPassword" @submit.prevent class="password-reset">
                                <div v-if="!passwordResetSuccess">
                                    <h1>Reset Password</h1>
                                    <p>We will send you an email to reset your password</p>

                                    <label for="email3">Email</label>
                                    <input v-model.trim="passwordForm.email" type="text" placeholder="you@email.com" id="email3"/>

                                    <button @click="resetPassword" class="button">Submit</button>

                                    <div class="extras">
                                        <a @click="togglePasswordReset">Back to Log In</a>
                                    </div>
                                </div>
                                <div v-else>
                                    <h1>Email Sent</h1>
                                    <p>Check your email for a link to reset your password</p>
                                    <button @click="togglePasswordReset">Back to Log in</button>
                                </div>
                            </v-form>
                            <transition name="fade">
                                <div v-if="errorMsg !== ''" class="error-msg">
                                    <p>{{ errorMsg }}</p>
                                </div>
                            </transition>
                        </div>    
                  
                </v-flex>
            </v-layout>
        </v-container>
</template>

<script>

    const fb = require('../firebaseConfig.js')

    export default {
        data() {
            return {
                loginForm: {
                    email: '',
                    password: ''
                },
                signupForm: {
                    name: '',
                    title: '',
                    email: '',
                    password: ''
                },
                passwordForm: {
                    email: ''
                },
                showLoginForm: true,
                showForgotPassword: false,
                passwordResetSuccess: false,
                performingRequest: false,
                errorMsg: ''
            }
        },
        methods: {
            toggleForm() {
                this.errorMsg = ''
                this.showLoginForm = !this.showLoginForm
            },
            togglePasswordReset() {
                if (this.showForgotPassword) {
                    this.showLoginForm = true
                    this.showForgotPassword = false
                    this.passwordResetSuccess = false
                } else {
                    this.showLoginForm = false
                    this.showForgotPassword = true
                }
            },            
            login() {
                this.performingRequest = true;
                fb.auth.signInWithEmailAndPassword(this.loginForm.email, this.loginForm.password).then(user => {
                    
                   this.$store.commit('setCurrentUser', user.user)
                   this.$store.dispatch('fetchUserProfile')
                    this.performingRequest = false
                    this.$router.push('/home')
                    
                }).catch(err => {
                    console.log(err)
                    this.performingRequest = false
                    this.errMsg = err.message
                })
            },
            signup() {
                this.performingRequest = true;
                fb.auth.createUserWithEmailAndPassword(this.signupForm.email, this.signupForm.password).then(user => {
                    this.$store.commit('setCurrentUser', user.user)
                    // create user obj
                    fb.usersCollection.doc(user.user.uid).set({
                        name: this.signupForm.name,
                        title: this.signupForm.title
                    }).then(() => {
                        this.$store.dispatch('fetchUserProfile')
                        this.performingRequest = false;
                        this.$router.push('/home')
                    }).catch(err => {
                        console.log(err)
                        this.performingRequest = false;
                        this.errorMsg = err.message
                    })
                }).catch(err => {
                    console.log(err)
                    this.performingRequest = false
                    this.errorMsg = err.message
                })
            },
            resetPassword() {
                this.performingRequest = true

                fb.auth.sendPasswordResetEmail(this.passwordForm.email).then(() => {
                    this.performingRequest = false
                    this.passwordResetSuccess = true
                    this.passwordForm.email = ''
                }).catch(err => {
                    console.log(err)
                    this.performingRequest = false
                    this.errorMsg = err.message
                })
            }            
        }
    }
</script>

<style scoped>
.headerName {
    text-align: center;
    margin-bottom: 5px;
}
a {
  display: inline-block;
}

.iconSize {
width: 100%;
height: 100%;
}

.svgWrap {
    width: 100%;
    height: 70px;
}

.left-leg {
fill: orange;
animation: dance 2s infinite alternate;
}

@keyframes dance {
    100% {
        transform: rotate(6deg);
    }
}
</style>