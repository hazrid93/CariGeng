<template>
  <div id="app">
    <v-app>
      <v-content style="height: 100%; padding: 0;">
        <keep-alive>
          <router-view/>
        </keep-alive>
      </v-content>
    </v-app> 
  </div>
</template>

<script>
  export default {
    name: 'App',
    created() {
      //just an example use of vuex
      this.$store.dispatch('setThemeInitial');
    }
  }
</script>

<style>
#app {
  /*font-family: 'Avenir', Helvetica, Arial, sans-serif;*/
  -webkit-font-smoothing: antialiased; 
  -moz-osx-font-smoothing: grayscale;
  /*text-align: center; */
  background-color: whitesmoke;
  /* margin-top: 0px; */
}

/*
body {
  font-family: Arial, Helvetica, sans-serif;
}
*/
</style>
