<template>
    <div>
        <input style="width: 300px; height:150px" type="text" v-model="data"/>
        <p>{{ data }}</p>
        <a><router-link to="/home" tag="li" active-class="active" exact>Home</router-link></a>
    </div>
</template>

<script>
export default {
        data: function() {
            return {
                data: ''
            }
        },
        created(){
            console.log("created")
        },
        destroyed(){
            console.log("destroyed")
        }
}
</script>

<style scoped>

</style>
