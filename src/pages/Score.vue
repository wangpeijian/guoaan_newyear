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
                margin: .1rem 0 0 0;

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
                font-size: .2rem;
                color: #fff;
                display: block;
                text-align: center;
                //transform: scale(.8);
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

        .share-mask{
            position: fixed;
            top: 0;
            bottom: 0;
            width: 100%;
            background: rgba(0, 0, 0, 0.49) url("../../static/score/share_img.png");
            background-size: 3rem 3rem;
            background-position: 110% 10%;
            background-repeat: no-repeat;
        }
    }
</style>

<template>
    <div class="background">
        <img class="score-background" :src="scoreBackground">

        <div class="score-window" :style="{backgroundImage: `url(${scoreBox})`}">

            <h1 class="current-score">{{currentScore}}</h1>
            <p class="best-score">历史最佳成绩：{{bestScore}}</p>

            <div class="list-item" v-for="(item, index) in scoreList" :key="index">
                <img class="user-header" :src="item.head">
                <p class="ranking">
                    <span class="label">NO</span>
                    <span>{{index + 1}}</span>
                </p>
                <p class="user-info">
                    <span class="name">{{item.name}}</span>
                    <span class="score">{{item.score}}</span>
                </p>
            </div>

        </div>

        <div class="button-group">
            <button class="button again" @click="again"></button>
            <p class="tips">剩余活动次数:{{leftTimes}}</p>
            <button class="button share" @click="shareMask = true"></button>
            <p class="tips">分享活动可获得再玩一次机会</p>
            <img class="qrcode" :src="qrcode">
            <p class="share-one">长按关注国安科技控股</p>
            <p class="share-two">我们更关心你</p>
        </div>

        <div class="share-mask" v-if="shareMask" @click="shareMask = false"></div>

    </div>
</template>

<script>
    // import scoreBackground from "https://img.guoanfamily.com/newyear/score/score_background.jpg";
    // import scoreBox from "https://img.guoanfamily.com/newyear/score/score_box.png";
    // import qrcode from "https://img.guoanfamily.com/newyear/score/qrcode.jpg";

    const scoreBackground = "https://img.guoanfamily.com/newyear/score/score_background.jpg";
    const scoreBox = "https://img.guoanfamily.com/newyear/score/score_box.png";
    const qrcode = "https://img.guoanfamily.com/newyear/score/qrcode.jpg";

    export default {
        data() {
            return {
                scoreBackground: scoreBackground,
                scoreBox: scoreBox,
                qrcode: qrcode,

                currentScore: 0,
                bestScore: 0,
                leftTimes: 0,

                scoreList: [],

                shareMask: false,
            }
        },

        created() {
            let userInfo = this.getStorage("userInfo");
            this.post("saveScore", userInfo).then(res => {
                if(res.Code === 0){
                    let {Score, BestScore, LeftTimes, Rank} = res.Data;

                    this.currentScore = Score;
                    this.bestScore = BestScore;
                    this.leftTimes = LeftTimes;
                    this.scoreList = Rank.map(item => {

                        return {
                            name: item.Wx_name || item.Yun_name,
                            score: item.Best_score,
                            head: item.Wx_head || "https://img.guoanfamily.com/www/default_head.png"
                        }

                    });

                }else{
                    alert(res.Msg)
                }
            })
        },

        mounted() {
            let ua = navigator.userAgent.toLowerCase()
            if (ua.match(/MicroMessenger/i) == "micromessenger") {
                this.wxConfig();
            }
        },

        methods: {
            wxConfig() {
                return;
                const URL = window.location.href; //.split('#')[0]

                this.post("jsapi/getJsapiSignature?local_url=" + encodeURIComponent(location.href.split('#')[0]), //URL, // encodeURIComponent(URL),
                    {}, {
                        interfaceType: "weichat"
                    }).then(response => {
                    wx.config({
                        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                        appId: response.appid, // 必填，公众号的唯一标识
                        timestamp: parseInt(response.timestamp), // 必填，生成签名的时间戳
                        nonceStr: response.noncestr, // 必填，生成签名的随机串
                        signature: response.signature, // 必填，签名，见附录1
                        jsApiList: [
                            'onMenuShareTimeline',
                            'onMenuShareAppMessage',
                            'onMenuShareQQ',
                            'onMenuShareWeibo',
                            'onMenuShareQZone']// 必填，需要使用的JS接口列表
                    });
                    wx.ready(() => {
                        // 分享给朋友
                        wx.onMenuShareAppMessage({
                            title: "迎元旦 贴窗花", //标题
                            desc: "新年伊始是元旦，万象更新又一年，国安科技控股真诚答谢活动，欢迎您的参与。", //描述
                            link: "http://act.guoanfamily.com/staticWeb/newyear/#/",
                            imgUrl: "https://img.guoanfamily.com/www/newyearShare.jpg", //图片
                            trigger: (res) => {
                            },
                            success: (res) => {
                                this.addGameTimes("ShareAppMessage")
                            },
                            cancel: (res) => {
                            },
                            fail: (res) => {
                            }
                        });
                        // 分享到朋友圈
                        wx.onMenuShareTimeline({
                            title: "迎元旦 贴窗花", //标题
                            desc: "新年伊始是元旦，万象更新又一年，国安科技控股真诚答谢活动，欢迎您的参与。", //描述
                            link: "http://act.guoanfamily.com/staticWeb/newyear/#/",
                            imgUrl: "https://img.guoanfamily.com/www/newyearShare.jpg", //图片
                            trigger: (res) => {
                            },
                            success: (res) => {
                                this.addGameTimes("ShareTimeline")
                            },
                            cancel: (res) => {
                            },
                            fail: (res) => {
                            }
                        });

                        wx.error(function (res) {
                            console.error(res)
                        });
                    })
                });
            },

            addGameTimes(type){
                let userInfo = Object.assign(this.getStorage("userInfo"), {
                    share_type: type,
                });

                if(!userInfo.wx_id){
                    return;
                }

                this.post("addGameTimes", userInfo).then(res => {
                    if(res.Code === 0){
                        alert("分享成功")
                    }
                });
            },

            again(){
                this.$router.go(-1);
            },
        },

        components: {}
    }
</script>
