<style scoped lang="scss">
    .cover {
        height: 100%;
        width: 100%;
    }

    .pre-load{
        display: none;

        img {
            height: 0;
            width: 0;
        }
    }
</style>

<template>
    <div style="height: 100%">
        <img class="cover" :src="cover">

        <div class="pre-load">
            <img v-for="item in preloadList" :key="item" :src="item">
        </div>
    </div>
</template>

<script>
    // import index from "https://img.guoanfamily.com/newyear/index/index.jpg";
    const index = "https://img.guoanfamily.com/newyear/index/index.jpg";

    //其他页面的资源
    // import body from "https://img.guoanfamily.com/newyear/form/body.jpg";
    // import header from "https://img.guoanfamily.com/newyear/form/header.jpg";
    // import start from "https://img.guoanfamily.com/newyear/form/start.png";
    //
    // import gameBackground from "https://img.guoanfamily.com/newyear/game/game_background.jpg";
    // import gameWindow from "https://img.guoanfamily.com/newyear/game/game_window.jpg";
    //
    // import image001 from "https://img.guoanfamily.com/newyear/game/image001.png";
    // import image002 from "https://img.guoanfamily.com/newyear/game/image002.png";
    // import image003 from "https://img.guoanfamily.com/newyear/game/image003.png";
    // import image004 from "https://img.guoanfamily.com/newyear/game/image004.png";
    // import image005 from "https://img.guoanfamily.com/newyear/game/image005.png";
    // import image006 from "https://img.guoanfamily.com/newyear/game/image006.png";
    //
    // import rule_worker from "https://img.guoanfamily.com/newyear/rule/rule_worker.jpg";
    // import rule_tourist from "https://img.guoanfamily.com/newyear/rule/rule_tourist.jpg";
    //
    // import scoreBackground from "https://img.guoanfamily.com/newyear/score/score_background.jpg";
    // import scoreBox from "https://img.guoanfamily.com/newyear/score/score_box.png";
    // import qrcode from "https://img.guoanfamily.com/newyear/score/qrcode.jpg";

    const body = "https://img.guoanfamily.com/newyear/form/body.jpg";
    const header = "https://img.guoanfamily.com/newyear/form/header.jpg";
    const start = "https://img.guoanfamily.com/newyear/form/start.png";
    const gameBackground = "https://img.guoanfamily.com/newyear/game/game_background.jpg";
    const gameWindow = "https://img.guoanfamily.com/newyear/game/game_window.jpg";
    const image001 = "https://img.guoanfamily.com/newyear/game/image001.png";
    const image002 = "https://img.guoanfamily.com/newyear/game/image002.png";
    const image003 = "https://img.guoanfamily.com/newyear/game/image003.png";
    const image004 = "https://img.guoanfamily.com/newyear/game/image004.png";
    const image005 = "https://img.guoanfamily.com/newyear/game/image005.png";
    const image006 = "https://img.guoanfamily.com/newyear/game/image006.png";
    const rule_worker = "https://img.guoanfamily.com/newyear/rule/rule_worker.jpg";
    const rule_tourist = "https://img.guoanfamily.com/newyear/rule/rule_tourist.jpg";
    const scoreBackground = "https://img.guoanfamily.com/newyear/score/score_background.jpg";
    const scoreBox = "https://img.guoanfamily.com/newyear/score/score_box.png";
    const qrcode = "https://img.guoanfamily.com/newyear/score/qrcode.jpg";

    const preloadList = [
        body,
        header,
        start,
        gameBackground,
        gameWindow,
        image001,
        image002,
        image003,
        image004,
        image005,
        image006,
        rule_worker,
        rule_tourist,
        scoreBackground,
        scoreBox,
        qrcode];

    export default {
        data() {
            return {
                cover: index,
                preloadList: preloadList,
            }
        },

        created() {
            setTimeout(() => {
                this.$router.push("/form")
            }, 2500)
        },

        mounted() {

            let ua = navigator.userAgent.toLowerCase()
            if (ua.match(/MicroMessenger/i) == "micromessenger") {
                this.wxConfig();
            }

        },

        methods: {
            wxConfig() {
                const URL = window.location.href; //.split('#')[0]

                this.post("jsapi/getJsapiSignature?local_url=" + URL,//encodeURIComponent(location.href.split('#')[0]), //URL, // encodeURIComponent(URL),
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
            }
        },

        components: {}
    }
</script>
