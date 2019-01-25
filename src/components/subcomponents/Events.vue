<template>
    <div>
        <v-container fluid>
            <!-- justify-content (horizontal), align-items (vertical) 
                Note:cannot control xs6 sizes if use column layout -->
            <v-layout justify-end align-start row wrap>
                <v-flex xs8>
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
            return { }
                
        },
        computed: {
            //use mapState to get access to all state properties or
            //use mapGetters to get all the getters specified in store.js
            //will use mapState for now
            ...mapState(['userProfile','currentUser','events'])
        },
        methods: {

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
