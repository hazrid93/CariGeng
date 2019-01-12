<template>
    <div>
        <v-container>
            <v-layout justify-center align-center row>
                <v-flex xs8 pr-2>
                    <v-text-field
                            flat
                            hide-details
                            prepend-inner-icon="search"
                            label="Search"
                            v-model="inputArtist"
                           
                    ></v-text-field>
                </v-flex>
                <v-flex shrink pl-2>

                    <!-- use align="center" inside a div or set class="text-xs-right" for example into v-flex/div to align item inside v-flex -->
                    <!-- v-flex class="text-xs-right"> -->
                    <!-- <div class="text-xs-right"> </div> *wrap v-btn* -->
                    <!-- <div align="center"> </div> -->

                        <v-btn color="primary" round dark @click="getArtist">Search</v-btn>
                </v-flex>
            </v-layout>
        </v-container>       
    </div>  
<!--
    <div id="wrapper">
        <div class="container">
            <div class="row" id="sideMenu">
                <div class="col-md-8 sidebar-right">
                        <form @submit.prevent="onSubmit" class="form-inline">
                            <div class="form-group">
                                <label for="name">Search for artist:</label>
                                <input type="text" name="search" id="name" class="form-control" v-model="inputArtist">
                            </div>
                            <button @click="getArtist" type="submit" id="button" class="btn btn-default"><i class="fa fa-search"></i></button>
                        </form>
                </div>
            </div>
            <div class="row" id="sideMenu2">
                <div class="col-md-8 sidebar-right">
                    <h2 class="lead text-uppercase songName" style="text-align : left; position : relative; left : 25px;"><u>{{ watching }}</u></h2>
                   
                  
                    <ul id="artistList">
                        <li v-for="item in responseData" :key="item.artist_id">
                            <router-link to="/home/tracks" tag="li" active-class="active" exact><a class="lyricGroup">{{ item.artist_name }}</a></router-link>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div> -->
</template>

<script>
    import musixInstance from '../../axios-auth.js'

    export default {
        name: 'Apod',
        data: function() {
            return {
                responseData: [],
                inputArtist: '',
                watching: ''
            }
        },
        methods: {
           
            getArtist: function(name) {
                // using back-tick => ` for template literals = ${variable_value}
                // var name = "world";
                // var greetES5 = 'Hello '+name;//using single quote
                // var greetES6 = `Hello ${name}`;//using ticks
                musixInstance.get(`/artist.search?s_artist_rating=desc&q_artist=${this.inputArtist}&page=1&page_size=50`)
                .then( (response) => {
                    // handle success
                    console.log(response);
                    const data  = response.data;
                    this.responseData = data;



                })
                .catch(function (error) {
                    // handle error
                    console.log(error);
                })
                .then(function () {
                    // always executed
                });
            },
            onSubmit: function() {

            }
        },
        watch: {
            //for 'watch' must use same name as the data that we are observing
            inputArtist: function(){
                this.watching = this.inputArtist;
                //console.log(this.inputArtist);
            }
        },
        created: function(){
            // to get instance data use either this.copyrightNote or this.$data.copyrightNote
            // console.log(this.$data.copyrightNote);
            // this.getTest();
           // console.log("lyrics");
        }
    }
</script>

<style scoped>

/*
a {
    text-decoration: none;
    color: inherit;
}

.lyricGroup {
    font-family: 'Ubuntu', sans-serif;
}

.songName {
    font-family: 'Concert One', cursive;
}

#artistList{
    text-align: left
}
#explanation {
    width: 500px;
    margin-left: auto;
    margin-right: auto;
}
.sidebar-right {
    margin: 0;
    overflow-x: hidden;

}

#wrapper {
    margin: 0;
  /*  left: 250px; 
    top: 40px;
    position: absolute;
  /*  width: calc(100% - 250px); 
}

#sideMenu {
    margin: 50px 0 0 0;
    height: 100%;
}

#sideMenu2 {
    margin: 50px 0 50px 0;
    height: 100%;
}

.container {
    margin: 0 0 0 0;    
    padding: 0 0 0 0;
    height: 100%;
    width: 100%;
}


#button {
    border: 1px solid #521751;
    color: #521751;
    /*padding: 10px 20px; 
    font: inherit;
    cursor: pointer;
    height: 100%;
}

#button i {
    font-size: 17px;   
    min-height: 100%;
    
}

#artistSearch {
    display: inline-block;
}
*/

</style>
