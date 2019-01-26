<template>
        <v-container fluid fill-height>
            <!-- justify-content (vertical), align-items (horizontal) 
                Note:cannot control xs6 sizes if use column layout -->
                <v-layout justify-center row wrap>
                    <v-flex xs10 sm10 md4 :class="{'pb-4': paddingBottom, 'pr-4': paddingRight}">
                        <v-layout justify-center>
                            <v-dialog v-model="dialogPostEvent" fullscreen hide-overlay transition="dialog-bottom-transition">
                                <v-btn round outline class="ma-0 text-md-center" slot="activator" color="primary" dark>Create Event</v-btn>
                                <v-card height="100%" min-height="100%">
                                    <v-toolbar dark color="black">
                                        <v-btn icon dark @click="dialogPostEvent = false">
                                            <v-icon>close</v-icon>
                                        </v-btn>
                                    <v-toolbar-title>Create Event</v-toolbar-title>
                                    <v-spacer></v-spacer>
                                    <v-toolbar-items>
                                        <v-btn dark flat @click="createEvent(); dialogPostEvent = false">Send</v-btn>
                                    </v-toolbar-items>
                                    </v-toolbar>
                                    <!--event form section-->  
                                    <div class="text-xs-center" style="height: 90%;">
                                        <v-layout align-center justify-center row wrap style="height: inherit;">
                                            <v-flex xs10 sm10 md8>
                                                <v-form ref="form" lazy-validation>    
                                                    <v-text-field v-model="event.title" label="Title" required ></v-text-field>
                                                    <v-text-field v-model="event.content" label="Content" required ></v-text-field>
                                                    <v-text-field v-model="event.address" label="Address" required ></v-text-field>
                                                    <v-text-field v-model="event.city" label="City" required ></v-text-field>
                                                    <v-text-field v-model="event.state" label="State" required ></v-text-field>
                                                    <v-text-field v-model="event.country" label="Country" required ></v-text-field>
                                                </v-form>
                                            </v-flex>
                                        </v-layout>
                                    </div>
                                </v-card>
                            </v-dialog>
                        </v-layout>
                    </v-flex>
                    <v-flex xs10 sm10 md8>
                        <div v-if="events.length">
                            <template v-for="(event, index) in events">
                                <v-card :key="event.title" class="mb-4">
                                    <v-img src="https://cdn.vuetifyjs.com/images/cards/house.jpg" height="200px" > 
                                    <v-container fill-height fluid >
                                        <v-layout fill-height align-start>
                                        <v-flex xs12 flexbox>
                                           <!-- <span class="headline white--text" v-text="event.title"></span> -->
                                        </v-flex>
                                        </v-layout>
                                    </v-container>
                                    </v-img>

                                    <v-card-actions>
                                        <v-card-title primary-title>
                                            <!-- event details when clicked -->
                                            <v-dialog v-model="dialogEvent" scrollable max-width="80%">
                                                <v-card>
                                                    <v-card-title>Event Details</v-card-title>
                                                    <v-divider></v-divider>
                                                    <v-card-text style="height: 80%;">
                                                        
                                                    </v-card-text>
                                                    <v-divider></v-divider>
                                                    <v-card-actions>
                                                    <v-btn color="blue darken-1" flat @click="dialogEvent = false">Close</v-btn>
                                                    </v-card-actions>
                                                </v-card>
                                            </v-dialog>

                                            <div>
                                                <div class="headline"><a style="text-decoration: none; color: inherit;" @click="expandEvent(event); dialogEvent = true">{{ event.title | trimCardText }}</a></div>
                                                <span class="grey--text">{{ event.createdOn | formatDate }}</span>
                                            </div>

                                        </v-card-title>
                                        <v-spacer></v-spacer>
                                        <v-list-tile-content>
                                            <v-list-tile-title class="text-xs-center">{{ event.userName }}</v-list-tile-title>
                                            <v-list-tile-title class="text-xs-center">{{ event.likes }} likes</v-list-tile-title>
                                        </v-list-tile-content>

                                        <v-btn icon>
                                            <v-icon @click="likeEvent(event)">favorite</v-icon>
                                        </v-btn>
                                        <v-btn icon>
                                            <v-icon>bookmark</v-icon>
                                        </v-btn>

                                       

                                    </v-card-actions>
                                </v-card>
                            </template>
                        </div>
                        <div v-else>
                            <p>There are currently no event</p>
                        </div>
                    </v-flex>
                </v-layout>
        </v-container>   
</template>

<script>
    import { mapState } from 'vuex'
    import moment from 'moment'
    const fb = require('../../firebaseConfig.js')

    export default {
        data() {
            return { 
                event: {
                    title: '',
                    about: '',
                    address: '',
                    city: '',
                    state: '',
                    country: ''
                },
                dialogPostEvent: false,
                dialogEvent: false,
                notifications: false,
                sound: true,
                widgets: false,
                paddingBottom: false,
                paddingRight: false
            }
                
        },
        computed: {
            //use mapState to get access to all state properties or
            //use mapGetters to get all the getters specified in store.js
            //will use mapState for now
 
            ...mapState(['userProfile','currentUser','events'])
        },
        methods: {
            onResize () {
              //  console.log(this.$vuetify.breakpoint.name)
                if(this.$vuetify.breakpoint.name=="xs" || this.$vuetify.breakpoint.name=="sm"){          
                    this.paddingBottom = true
                    this.paddingRight = false
                } else {
                    this.paddingBottom = false
                    this.paddingRight = true
                }
                
            },
            createEvent() {
                console.log("create event called")
                fb.eventsCollection.add({
                    createdOn: new Date(),
                    title: this.event.title,
                    userId: this.currentUser.uid,
                    userName: this.userProfile.name,
                    address: this.event.address,
                    content: this.event.content,
                    city: this.event.city,
                    state: this.event.state,
                    country: this.event.country

                }).then(ref => {
                    
                }).catch(err => {
                    console.log(err)
                })
            },
            likeEvent(event){
                let docId = `${this.currentUser.uid}_${event.id}`
                //search based on this id (docId)
                fb.eventslikesCollection.doc(docId).get().then(doc => {
                    //this part make sure same user doesnt like twice
                    if (doc.exists) {
                        return
                    }
                    fb.eventslikesCollection.doc(docId).set({
                        eventId: event.id,
                        userId: this.currentUser.uid
                    }).then(() => {
                        // update event likes
                        fb.eventsCollection.doc(event.id).update({
                            likes: event.likes + 1
                        })
                    })
                }).catch(err => {
                    console.log(err)
                })
            },
            expandEvent(event){
                fb.eventsCollection.doc(event.id).get().then(doc => {
                    console.log(event.content)
                })
            }
        },
        filters: {
            formatDate(val) {
                if (!val) { return '-' }
                let date = val.toDate()
                return moment(date).format('MMMM Do YYYY, h:mm:ss a');
            },
            trimLength(val) {
                if (val.length < 200) { return val }
                return `${val.substring(0, 200)}...`
            },
            trimCardText(val) {
                if (val.length < 30) { return val }
                return `${val.substring(0, 30)}...`
            }
        },
        mounted () {
            this.onResize()
            window.addEventListener('resize', this.onResize, { passive: true })
        },
        beforeDestroy () {
            if (typeof window !== 'undefined') {
            window.removeEventListener('resize', this.onResize, { passive: true })
            }
        }
    }
</script>

<style scoped>

</style>
