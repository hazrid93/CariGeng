<template>
    <div>
        <v-container fluid>
            <!-- justify-content (horizontal), align-items (vertical) 
                Note:cannot control xs6 sizes if use column layout -->
            <v-layout justify-center row wrap>
                <v-flex xs10 sm10 md4 :class="{'pb-4': paddingBottom, 'pr-4': paddingRight}">
                    <v-layout row justify-center>
                        <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
                        <v-btn class="ma-0" slot="activator" color="primary" dark>Create Event</v-btn>
                        
                        <v-card>
                            <v-toolbar dark color="primary">
                                <v-btn icon dark @click="dialog = false">
                                    <v-icon>close</v-icon>
                                </v-btn>
                            <v-toolbar-title>Create Event</v-toolbar-title>
                            <v-spacer></v-spacer>
                            <v-toolbar-items>
                                <v-btn dark flat @click="createEvent(); dialog = false">Send</v-btn>
                            </v-toolbar-items>
                            </v-toolbar>
                            <!--event form section-->
                            <v-layout justify-center>
                                <v-flex xs10>
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
                        </v-card>
                        </v-dialog>
                    </v-layout>
                </v-flex>
                <v-flex xs10 sm10 md8>
                    <div v-if="events.length">
                        <template v-for="(event, index) in events">
                            <v-card :key="event.title" class="mb-4">
                                <v-img
                                src="https://cdn.vuetifyjs.com/images/cards/house.jpg"
                                height="200px"
                                >
                                <v-container
                                    fill-height
                                    fluid
                                >
                                    <v-layout fill-height align-start>
                                    <v-flex xs12 flexbox>
                                        <span class="headline white--text" v-text="event.title"></span>
                                    </v-flex>
                                    </v-layout>
                                </v-container>
                                </v-img>

                                <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn icon>
                                    <v-icon>favorite</v-icon>
                                </v-btn>
                                <v-btn icon>
                                    <v-icon>bookmark</v-icon>
                                </v-btn>
                                <v-btn icon>
                                    <v-icon>share</v-icon>
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
    </div>

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
                dialog: false,
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
                console.log(this.$vuetify.breakpoint.name)
                if(this.$vuetify.breakpoint.name=="xs" || this.$vuetify.breakpoint.name=="sm"){
                    console.log("sm or xs")
                    this.paddingBottom = true
                    this.paddingRight = false
                } else {
                    console.log("md or larger")
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
