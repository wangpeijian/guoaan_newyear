<style scoped lang="scss">
    img {
        height: 100%;
        width: 100%;
    }
</style>

<template>
    <img :src="rule" alt="" @click="begin">
</template>

<script>
    import rule_worker from "../../static/rule/rule_worker.jpg";
    import rule_tourist from "../../static/rule/rule_tourist.jpg";

    export default {
        data() {
            let type = ~~this.getSession("type");
            return {
                rule: !type  ? rule_tourist : rule_worker,
            }
        },

        created() {

        },

        mounted() {

        },

        methods: {
            begin(){
                this.$router.push("/game");
            }
        },

        components: {}
    }
</script>
