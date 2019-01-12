<template>
 
        <div>
            <v-navigation-drawer
            v-model="drawer"
            fixed
            left
            app
            >
                <v-list dense>
                    <v-list-tile @click.prevent="goToMenu">
                        <v-list-tile-action>
                            <v-icon>home</v-icon>
                        </v-list-tile-action>
                        <v-list-tile-content>
                            <v-list-tile-title>Return</v-list-tile-title>
                        </v-list-tile-content>
                    </v-list-tile>

                    <v-list-tile @click="">
                        <v-list-tile-action>
                            <v-icon>bubble_chart</v-icon>
                        </v-list-tile-action>
                        <v-list-tile-content>
                            <v-list-tile-title><router-link to="/home/lyrics" tag="li" active-class="active" exact>Lyrics</router-link></v-list-tile-title>
                        </v-list-tile-content>
                    </v-list-tile>
                </v-list>
            </v-navigation-drawer>

            <v-toolbar color="blue" dark fixed app>
                <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
                <v-toolbar-title>Title</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-toolbar-items class="hidden-sm-and-down">
        <!--    <v-btn flat>Link One</v-btn>
                <v-btn flat>Link Two</v-btn>
                <v-btn flat>Link Three</v-btn> style="background-color: black;" -->
                </v-toolbar-items>
            </v-toolbar>
            <v-content>
                <router-view/>
            </v-content>
            <v-footer color="blue" app>
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
    export default {
        data: function() {
            return {
                drawer: null
            }
        },
        methods: {
            goToMenu: function(){
                this.$router.push('/home');
                this.drawer = false;
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
