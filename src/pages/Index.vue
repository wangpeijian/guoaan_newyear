<style scoped lang="scss">
    img {
        height: 100%;
        width: 100%;
    }
</style>

<template>
    <img :src="cover" alt="">
</template>

<script>
    import index from "../../static/index/index.jpg";

    //其他页面的资源

    export default {
        data() {
            return {
                cover: index
            }
        },

        created() {
            setTimeout(() => {
                this.$router.push("/form")
            }, 3000)
        },

        mounted() {

        },

        methods: {},

        components: {}
    }
</script>
