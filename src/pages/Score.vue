<style scoped lang="scss">
    .background{
        position: relative;
        height: 100%;
        //padding-top: .5rem;

        .score-background{
            display: block;
            height: 100%;
            width: 100%;
        }

        .score-window{
            position: absolute;
            top: .5rem;
            display: block;
            height: 6rem;
            width: 100%;
            background: no-repeat center;
            background-size: contain;
            color: #fff;

            .current-score{
                font-size: 1rem;
                padding-top: .7rem;
                width: 100%;
                text-align: center;
                text-shadow: 5px 1px 6px rgba(0, 0, 0, 0.55);
            }

            .best-score{
                font-size: .3rem;
                font-weight: bold;
                text-align: center;
                width: 64%;
                margin: 0 auto;
                padding-bottom: .1rem;
                border-bottom: .05rem solid #dbc286;
            }

            .list-item{
                position: relative;
                margin: .2rem auto;
                height: .8rem;
                width: 62%;
                padding-left: .8rem;

                .user-header{
                    position: absolute;
                    left: 0;
                    top: 0;
                    border: .05rem solid #dbc286;
                    width: .8rem;
                    height: .8rem;
                }

                .ranking{
                    font-size: .32rem;
                    font-weight: bold;
                    padding-left: .3rem;

                    .label{
                        margin-right: .1rem;
                    }
                }

                .user-info{
                    padding: 0 0 0 .3rem;
                    font-size: .28rem;

                    .name{
                        font-weight: bold;
                        //text-transform: uppercase;
                    }

                    .score{
                        font-weight: bold;
                        float: right;
                        padding-right: .05rem;
                    }
                }
            }
        }

        .button-group{
            position: absolute;
            top: 6.5rem;
            width: 100%;

            .button{
                display: block;
                height: .8rem;
                width: 100%;
                border: none;
                margin: .3rem 0 0 0;

                &.again{
                    background: url("../../static/score/score_again.png") center no-repeat;
                    background-size: contain;
                }

                &.share{
                    background: url("../../static/score/score_share.png") center no-repeat;
                    background-size: contain;
                }
            }

            .tips{
                font-size: .2rem;
                color: #fff;
                display: block;
                text-align: center;
                margin: .1rem 0 0 0;
            }

            .qrcode{
                display: block;
                width: 2rem;
                margin: .2rem auto .05rem auto;
            }

            .share-one{
                font-size: .1rem;
                color: #fff;
                display: block;
                text-align: center;
                transform: scale(.8);
            }

            .share-two{
                font-size: .2rem;
                color: #fff;
                display: block;
                text-align: center;
                letter-spacing: .19rem;
                position: relative;
                left: .1rem;
                transform: scale(.8);
            }
        }
    }
</style>

<template>
    <div class="background">
        <img class="score-background" :src="scoreBackground">

        <div class="score-window" :style="{backgroundImage: `url(${scoreBox})`}">

            <h1 class="current-score">{{currentScore}}</h1>
            <p class="best-score">历史最佳成绩：{{bestScore}}</p>

            <div class="list-item">
                <img class="user-header" src="https://tvax4.sinaimg.cn/crop.0.0.1242.1242.180/66134906ly8fhsne431fuj20yi0yijte.jpg">
                <p class="ranking">
                    <span class="label">NO</span>
                    <span>1</span>
                </p>
                <p class="user-info">
                    <span class="name">asdasd</span>
                    <span class="score">15616</span>
                </p>
            </div>

            <div class="list-item">
                <img class="user-header" src="https://tvax4.sinaimg.cn/crop.0.0.1242.1242.180/66134906ly8fhsne431fuj20yi0yijte.jpg">
                <p class="ranking">
                    <span class="label">NO</span>
                    <span>1</span>
                </p>
                <p class="user-info">
                    <span class="name">asdasd</span>
                    <span class="score">15616</span>
                </p>
            </div>

            <div class="list-item">
                <img class="user-header" src="https://tvax4.sinaimg.cn/crop.0.0.1242.1242.180/66134906ly8fhsne431fuj20yi0yijte.jpg">
                <p class="ranking">
                    <span class="label">NO</span>
                    <span>1</span>
                </p>
                <p class="user-info">
                    <span class="name">asdasd</span>
                    <span class="score">15616</span>
                </p>
            </div>
        </div>

        <div class="button-group">
            <button class="button again" @click="again"></button>
            <button class="button share" @click="share"></button>
            <p class="tips">分享活动可获得再玩一次机会</p>
            <img class="qrcode" :src="qrcode">
            <p class="share-one">长按关注国安科技控股</p>
            <p class="share-two">我们更关心你</p>
        </div>

    </div>
</template>

<script>
    import scoreBackground from "../../static/score/score_background.jpg";
    import scoreBox from "../../static/score/score_box.png";
    import qrcode from "../../static/score/qrcode.jpg";

    export default {
        data() {
            return {
                scoreBackground: scoreBackground,
                scoreBox: scoreBox,
                qrcode: qrcode,

                currentScore: 0,
                bestScore: 0,

                scoreList: [],
            }
        },

        created() {
            console.log("12312213")
        },

        mounted() {

        },

        methods: {
            again(){

            },

            share(){

            }
        },

        components: {}
    }
</script>
