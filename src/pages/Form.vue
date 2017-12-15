<style scoped lang="scss">
    .background {
        height: 100%;

        .header {
            height: 4.7rem;
            background: no-repeat center;
            background-size: cover;
            position: relative;

            .text{
                position: absolute;
                font-size: .25rem;
                color: #fff;
                top: 1.6rem;
                right: .5rem;
                left: 2.8rem;
                line-height: .36rem;
            }

            .button-group {
                position: absolute;
                height: .7rem;
                bottom: -0.02rem;
                right: .2rem;

                .entry-button {
                    background: #a36128;
                    border: none;
                    display: inline-block;
                    line-height: .7rem;
                    width: 2.4rem;
                    float: left;
                    margin-left: .1rem;
                    padding: 0;
                    color: #fff;
                    font-weight: bold;
                    font-size: .3rem;

                    &.active {
                        background: #dcbd96;
                        color: #e2483b;
                    }
                }
            }
        }

        .body {
            height: 8.7rem;
            margin: 0 5px;
            background: no-repeat center;
            background-size: cover;
            position: relative;

            .form-group{
                width: 80%;
                margin: 0 auto;
                padding-top: 1.3rem;
                height: 5.8rem;

                input::-webkit-input-placeholder {
                    color: #dbc286;
                }
            　　input:-moz-placeholder {
                    color: #dbc286;
                }
            　　input::-moz-placeholder {
                    color: #dbc286;
                }
            　　input:-ms-input-placeholder {
                    color: #dbc286;
                }

                input{
                    line-height: .8rem;
                    border: none;
                    font-weight: bold;
                    font-size: .3rem;
                    width: 80%;
                    display: block;
                    margin: 0 auto .3rem auto;
                    border-radius: .1rem;
                    padding: 0 .3rem;
                }
            }

            .start-btn{
                display: block;
                width: 64%;
                background: no-repeat center;
                background-size: contain;
                border: none;
                height: .8rem;
                margin: 0 auto;
            }
        }
    }

</style>

<template>
    <div class="background">

        <div class="header" :style="{backgroundImage: `url(${this.header})`}">
            <div class="text">
                接啊哈哈哈哈哈哈哈哈接啊哈哈哈哈哈哈哈哈接啊哈哈哈哈哈哈哈哈接啊哈哈哈哈哈哈哈哈接啊哈哈哈哈哈哈哈哈接啊哈哈哈哈哈哈哈哈接啊哈哈哈哈哈哈哈哈接啊哈哈哈哈哈哈哈哈
            </div>

            <div class="button-group">
                <button class="entry-button" :class="{'active': type === 0}" @click="changeForm(0)">游客入口</button>

                <button class="entry-button" :class="{'active': type === 1}" @click="changeForm(1)">员工入口</button>
            </div>
        </div>

        <div class="body" :style="{backgroundImage: `url(${this.body})`}">

            <div class="form-group">

                <!--游客表单-->
                <div class="form" v-show="type === 0">

                    <input type="text" placeholder="姓名" v-model="tourist.name">
                    <input type="number" placeholder="手机" v-model="tourist.phone">
                    <input type="text" placeholder="地址" v-model="tourist.address">

                </div>

                <!--员工表单-->
                <div class="form" v-show="type === 1">

                    <input type="text" placeholder="公司" v-model="tourist.company">
                    <input type="text" placeholder="部门" v-model="tourist.department">
                    <input type="text" placeholder="姓名" v-model="tourist.name">
                    <input type="number" placeholder="手机" v-model="tourist.phone">

                </div>
            </div>

            <button class="start-btn" :style="{backgroundImage: `url(${this.start})`}" @click="submit"></button>

        </div>

    </div>
</template>

<script>
    import body from "../../static/form/body.jpg";
    import header from "../../static/form/header.jpg";
    import start from "../../static/form/start.png";

    export default {
        data() {
            return {
                header: header,
                body: body,
                start: start,

                type: 0,

                tourist: {
                    name: "",
                    phone: "",
                    address: "",
                },

                worker: {
                    company: "",
                    department: "",
                    name: "",
                    phone: "",
                }
            }
        },

        created() {

        },

        mounted() {

        },

        methods: {
            changeForm(type){
                this.type = type;
            },

            submit(){
                window.sessionStorage.clear();

                this.setSession("type", this.type);
                this.$router.push(`/rule`);
            }
        },

        components: {}
    }
</script>
