<template>
 
        <div>
            <v-navigation-drawer
            v-model="drawer"
            fixed
            left
            app
            >
                <v-list dense>
                    <v-list-tile @click.prevent="goToHome">
                        <v-list-tile-action>
                            <v-icon>home</v-icon>
                        </v-list-tile-action>
                        <v-list-tile-content>
                            <v-list-tile-title>Return</v-list-tile-title>
                        </v-list-tile-content>
                    </v-list-tile>

                    <v-list-tile @click.prevent="logoutUser">
                        <v-list-tile-action>
                            <v-icon>cancel</v-icon>
                        </v-list-tile-action>
                        <v-list-tile-content>
                            <v-list-tile-title>LogOut</v-list-tile-title>
                        </v-list-tile-content>
                    </v-list-tile>

                    <v-list-tile @click.prevent="">
                        <v-list-tile-action>
                            <v-icon>build</v-icon>
                        </v-list-tile-action>
                        <v-list-tile-content>
                            <v-list-tile-title><router-link to="/home/settings" tag="li" active-class="active" exact>Settings</router-link></v-list-tile-title>
                        </v-list-tile-content>
                    </v-list-tile>

                    <v-list-tile @click.prevent="">
                        <v-list-tile-action>
                            <v-icon>bubble_chart</v-icon>
                        </v-list-tile-action>
                        <v-list-tile-content>
                            <v-list-tile-title><router-link to="/home/events" tag="li" active-class="active" exact>Events</router-link></v-list-tile-title>
                        </v-list-tile-content>
                    </v-list-tile>

                    <v-list-tile @click.prevent="">
                        <v-list-tile-action>
                            <v-icon>account_circle</v-icon>
                        </v-list-tile-action>
                        <v-list-tile-content>
                            <v-list-tile-title><router-link to="/home/profile" tag="li" active-class="active" exact>Profile</router-link></v-list-tile-title>
                        </v-list-tile-content>
                    </v-list-tile>

                    <!--
                    <v-list-tile @click.prevent="goToMenu">
                        <v-list-tile-action>
                            <v-icon>explore</v-icon>
                        </v-list-tile-action>
                        <v-list-tile-content>
                            <v-list-tile-title>Menu</v-list-tile-title>
                        </v-list-tile-content>
                    </v-list-tile> -->
                    <!--
                    <v-list-tile @click="">
                        <v-list-tile-action>
                            <v-icon>bubble_chart</v-icon>
                        </v-list-tile-action>
                        <v-list-tile-content>
                            <v-list-tile-title><router-link to="/home/lyrics" tag="li" active-class="active" exact>Lyrics</router-link></v-list-tile-title>
                        </v-list-tile-content>
                    </v-list-tile> -->
                </v-list>
            </v-navigation-drawer>

            <v-toolbar color="black" dark fixed app>
                <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
                <v-toolbar-title>
                    <div class="col1 headerName">
                           <!-- <h3 class="display-2 font-weight-bold">CariGeng</h3> -->
                            <div class="svgWrap">
                                <svg class="iconSize" viewBox="60 -5 90 30">
                                    <text font-family="Permanent Marker" class="left-leg" text-anchor="start" x="0%" y="50%" >Cari</text>
                                    <text font-family="Permanent Marker" class="right-leg" text-anchor="start" x="50%" y="50%" >Geng</text>
                                </svg>
                            </div>
                        </div>
                </v-toolbar-title>
                <v-spacer></v-spacer>
                <v-toolbar-items class="hidden-sm-and-down">
        <!--    <v-btn flat>Link One</v-btn>
                <v-btn flat>Link Two</v-btn>
                <v-btn flat>Link Three</v-btn> style="background-color: black;" -->
                </v-toolbar-items>
            </v-toolbar>
            <v-content>
                <!-- https://router.vuejs.org/api/#route-object-properties 
                     https://stackoverflow.com/questions/52847979/what-is-router-view-key-route-fullpath
                -->
                <router-view :key="$route.fullPath"></router-view>
            </v-content>
            <v-footer color="black" app>
            <span class="white--text">&copy; 2017</span>
            </v-footer>
        </div>
<!--
        <div class="sidebar-left">

            <div class="left-navigation">
                <ul class="list">
                    <li><a href="#" @click.prevent="goToMenu">Open Menu</a></li>
                    <router-link to="/home/apod" tag="li" active-class="active" exact><a>APOD</a></router-link>
                    <router-link to="/home/lyrics" tag="li" active-class="active" exact><a>Lyrics</a></router-link>
                </ul>
            </div>
        </div>
        <router-view></router-view> -->
  

</template>

<script>
    import axios from 'axios'
    const fb = require('../firebaseConfig.js')

    export default {
        data: function() {
            return {
                drawer: false
            }
        },
        methods: {
            goToMenu: function(){
                this.$router.push('/menu');
                this.drawer = false;
            },
            goToHome: function(){
                this.$router.push('/home');
                this.drawer = false;
            },
            logoutUser: function(){ 
                fb.auth.signOut().then(()=> {
                    this.$store.dispatch('clearData')
                    this.$router.push('/login')
                }).catch(err => {
                    console.log(err)
                })
            }
        },
        computed:{
            userProfile: function(){
               return this.$store.getters.getUserProfile
            },
            currentUser: function(){
                return this.$store.getters.getCurrentUser
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
        created: function(){
           // console.log("hello");
        },
        //activated hook and deactivated hook will replace default lifecycle hook for component under keep-alive
        activated: function(){
           // console.log("activate");
        }
        
    }
</script>

<style scoped>
.headerName {
    text-align: left;
    padding: 5px;
}

.iconSize {
width: 100%;
height: 100%;
}

.svgWrap {
    width: 100%;
    height: 40px;
}

.left-leg {
fill: orange;
animation: dance 2s infinite alternate;

}
.right-leg {
    fill: white;
}

@keyframes dance {
    100% {
        transform: rotate(6deg);
    }
}

a {
    text-decoration: none;
    color: inherit;
}

/*
.left-navigation {
    margin-top: 40px;
}



#homeButton {
  position: relative;
  padding: 0 0 0 0;
  display: block;
}


.sidebar-left {
    width: 250px;
    top: 40px;
    text-align: center;
    border-right: 2px solid rgba(133, 128, 128, 0.322);
    overflow-x: hidden;
    overflow-y: auto;
    height: 100%;
    position: fixed;
    z-index: 1;
    background-color: white

    
}


.list {
    color: rgb(109, 103, 103);
    font-weight: bolder;
    list-style: none;
    padding-left: 0px;
    overflow-x: hidden;
}

.list::first-line {
    color: rgba(255, 255, 255, 0.5);
}

.list> li, h5 {
    padding: 10px 0px 10px 0px;
}

.list>li:hover {

    background: #F17153;
    
    background: -webkit-linear-gradient(-270deg,rgb(255, 255, 255), rgb(42, 40, 160), #0e0bda);
   
    background: -o-linear-gradient(-270deg,rgb(255, 255, 255), rgb(42, 40, 160), #0e0bda);
   
    background: -moz-linear-gradient(-270deg,rgb(255, 255, 255), rgb(42, 40, 160), #0e0bda);

    background: linear-gradient(-270deg,rgb(255, 255, 255), rgb(42, 40, 160), #0e0bda);
    

    background-color: rgba(255, 255, 255, 0.2);

    border-left: 5px solid white;
    color: white;
    padding-left: 35px;
}

ul {
    font-family: 'Ubuntu', sans-serif;    
}
*/

</style>
