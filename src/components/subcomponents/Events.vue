<template>
    <div>
        <v-container fluid>
            <!-- justify-content (horizontal), align-items (vertical) 
                Note:cannot control xs6 sizes if use column layout -->
            <v-layout justify-center row wrap>
                <v-flex xs10 sm10 md4 :class="{'pb-4': paddingBottom, 'pr-4': paddingRight}">
                    <v-layout row justify-center>
                        <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
                        <v-btn class="ma-0" slot="activator" color="primary" dark>Open Dialog</v-btn>
                        <v-card>
                            <v-toolbar dark color="primary">
                            <v-btn icon dark @click="dialog = false">
                                <v-icon>close</v-icon>
                            </v-btn>
                            <v-toolbar-title>Settings</v-toolbar-title>
                            <v-spacer></v-spacer>
                            <v-toolbar-items>
                                <v-btn dark flat @click="dialog = false">Save</v-btn>
                            </v-toolbar-items>
                            </v-toolbar>
                            <v-list three-line subheader>
                            <v-subheader>User Controls</v-subheader>
                            <v-list-tile avatar>
                                <v-list-tile-content>
                                <v-list-tile-title>Content filtering</v-list-tile-title>
                                <v-list-tile-sub-title>Set the content filtering level to restrict apps that can be downloaded</v-list-tile-sub-title>
                                </v-list-tile-content>
                            </v-list-tile>
                            <v-list-tile avatar>
                                <v-list-tile-content>
                                <v-list-tile-title>Password</v-list-tile-title>
                                <v-list-tile-sub-title>Require password for purchase or use password to restrict purchase</v-list-tile-sub-title>
                                </v-list-tile-content>
                            </v-list-tile>
                            </v-list>
                            <v-divider></v-divider>
                            <v-list three-line subheader>
                            <v-subheader>General</v-subheader>
                            <v-list-tile avatar>
                                <v-list-tile-action>
                                <v-checkbox v-model="notifications"></v-checkbox>
                                </v-list-tile-action>
                                <v-list-tile-content>
                                <v-list-tile-title>Notifications</v-list-tile-title>
                                <v-list-tile-sub-title>Notify me about updates to apps or games that I downloaded</v-list-tile-sub-title>
                                </v-list-tile-content>
                            </v-list-tile>
                            <v-list-tile avatar>
                                <v-list-tile-action>
                                <v-checkbox v-model="sound"></v-checkbox>
                                </v-list-tile-action>
                                <v-list-tile-content>
                                <v-list-tile-title>Sound</v-list-tile-title>
                                <v-list-tile-sub-title>Auto-update apps at any time. Data charges may apply</v-list-tile-sub-title>
                                </v-list-tile-content>
                            </v-list-tile>
                            <v-list-tile avatar>
                                <v-list-tile-action>
                                <v-checkbox v-model="widgets"></v-checkbox>
                                </v-list-tile-action>
                                <v-list-tile-content>
                                <v-list-tile-title>Auto-add widgets</v-list-tile-title>
                                <v-list-tile-sub-title>Automatically add home screen widgets</v-list-tile-sub-title>
                                </v-list-tile-content>
                            </v-list-tile>
                            </v-list>
                        </v-card>
                        </v-dialog>
                    </v-layout>
                </v-flex>
                <v-flex xs10 sm10 md8>
                    <div v-if="events.length">
                        <template v-for="(event, index) in events">
                            <v-card :key="event.title" mb-3>
                                <v-img
                                src="https://cdn.vuetifyjs.com/images/cards/house.jpg"
                                height="200px"
                                >
                                <v-container
                                    fill-height
                                    fluid
                                >
                                    <v-layout fill-height>
                                    <v-flex xs12 align-end flexbox>
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
                <!-- for events section -->
                <!--
                <v-flex xs12 mb-4>
                    <v-list two-line>

                        <div v-if="events.length">
                            <template v-for="(event, index) in events">

                                <v-list-tile
                                    :key="event.title"
                                    avatar
                                    ripple
                                >   

                                    <v-list-tile-content>
                                        <v-list-tile-title>{{ event.userName }}</v-list-tile-title>
                                        <v-list-tile-sub-title>{{ event.content | trimLength }}</v-list-tile-sub-title>
                
                                    </v-list-tile-content>
                                    <v-list-tile-action>
                                        <v-list-tile-action-text>{{ event.createdOn | formatDate }}</v-list-tile-action-text>
                                        <v-list-tile-action-text>{{ event.eventLikes }} likes</v-list-tile-action-text>
                                    </v-list-tile-action>
                                </v-list-tile>
                                <v-divider
                                    v-if="index + 1 < event.length"
                                    :key="index"
                                ></v-divider>
                            </template>
                        </div>
                        <div v-else>
                            <p>There are currently no event</p>
                        </div>
                    </v-list>
                </v-flex>
                -->
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
