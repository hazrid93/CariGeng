<template>
    <div id="wrapper">
        <div class="container">
            <div class="row" id="sideMenu">
                <div class="col-md-8 sidebar-right">
                        <form @submit.prevent="onSubmit">
                            <label for="name">Search for artist:</label>
                            <br>
                            <div id="artistSearch">
                                <input type="text" name="search" id="name" v-model="inputArtist">
                                
                                <button @click="getArtist" type="submit" id="button"><i class="fa fa-search"></i></button>
                            </div>
                        </form>
                </div>
            </div>
            <div class="row" id="sideMenu2">
                <div class="col-md-8 sidebar-right">
                    <h2 style="text-align : left; position : relative; left : 25px;"><u>{{ watching }}</u></h2>
                    <!--<p>{{ responseData }}</p>-->
                    <ul id="artistList">
                        <li v-for="item in responseData" :key="item.artist_id">
                            {{ item.artist_name }}
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
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
    left: 250px;
    top: 40px;
    position: absolute;
    width: calc(100% - 250px);
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
    border: 2px solid #521751;
    color: #521751;
    /*padding: 10px 20px;*/
    font: inherit;
    cursor: pointer;
    height: 100%;
}

#name 

#button i {
    font-size: 17px;   
    
}

#artistSearch {
    display: inline-block;
}


</style>
