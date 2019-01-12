<template>
    <div id="wrapper">
        <div class="container">
            <div class="row" id="sideMenu">
                <div class="col-md-8 sidebar-right">
                        <div v-if="loadingApod"><h1>LOADING</h1></div>
                        <h2 id="postTitle">{{ postTitle }}</h2>
                        <br>
                        <img :src="imgSource" width="50%">
                        <p id="copyright">{{ copyrightNote }}</p>
                        <br>
                        <p id="explanation">{{ explanation }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import axios from 'axios'
    export default {
        name: 'Apod',
        data: function() {
            return {
                copyrightNote: '',
                imgSource: '',
                date: '',
                postTitle: '',
                explanation: '',
                loadingApod: false
            }
        },
        methods: {
           
            getTest: function() {
                this.loadingApod = true;
                axios.get('/planetary/apod?api_key=D1tMmxp7Cdov4gHFMi03zAB0kUZINDXhNfd7I94o')
                .then( (response) => {
                    // handle success
                   // console.log(response);
                    const data  = response.data;
         
                    this.copyrightNote = data.copyright;
                    this.imgSource = data.url;
                    this.postTitle = data.title;
                    this.explanation = data.explanation;
                  

                })
                .catch(function (error) {
                    // handle error
                    console.log(error);
                    
                })
                .then( () => {
                    // always executed
                    
                    this.loadingApod = false;
                });
            }
        },
        created: function(){
            // to get instance data use either this.copyrightNote or this.$data.copyrightNote
            // console.log(this.$data.copyrightNote);
            this.getTest();
         //   console.log("test");
        }
    }
</script>

<style scoped>
#explanation {
    width: 500px;
    margin-left: auto;
    margin-right: auto;
}
.sidebar-right {
    margin: 0;
    overflow-x: auto;

}

#wrapper {
    margin: 0;
    left: 250px;
    top: 40px;
    position: absolute;
    width: calc(100% - 250px);
}

#sideMenu {
    margin: 0 0 0 0;
    height: 100%;
}

.container {
    margin: 0 0 0 0;    
    padding: 0 0 0 0;
    height: 100%;
    width: 100%;
    overflow:hidden;
}

</style>
