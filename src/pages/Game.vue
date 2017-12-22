<style scoped lang="scss">
    $gold: #d8da62;

    .game-body {
        transform: translate3d(0, 0, 0);
        height: 100%;
        position: relative;

        .game-background {
            height: 100%;
            width: 100%;
        }

        .window {
            position: absolute;
            height: 12rem;
            width: 100%;
            top: 0;
            background-position-y: 2.4rem;
            background-repeat: no-repeat;
            background-size: contain;

            .scoreboard{
                color: #fff;
                font-weight: bold;
                font-size: .7rem;
                padding-top: .5rem;

                .count-down{
                    float: left;
                    padding-left: .5rem;
                }

                .score{
                    float: right;
                    padding-right: .5rem;
                }
            }

            .fix-image {
                position: absolute;
                width: 2rem;
                height: 2rem;
                opacity: 0.5;

                &.success{
                    animation: twinkle .2s 3;

                    @keyframes twinkle
                    {
                        from {
                            opacity: 1;
                        }
                        to {
                            opacity: 0;
                        }
                    }
                }
            }

            .combo-tip{
                position: absolute;
                font-weight: bold;
                bottom: 0rem;
                z-index: 1;
                font-size: .8rem;
                color: rgba(245, 152, 34, 0);
                animation: comboFade 3s 1;
                width: 100%;
                text-align: center;

                @keyframes comboFade
                {
                    from {
                        bottom: 1rem;
                        color: $gold;
                    }
                    to {
                        bottom: 2rem;
                        color: rgba(245, 152, 34, 0);
                    }
                }
            }

            .success-tip{
                position: absolute;
                text-align: center;
                width: 2rem;
                z-index: 1;
                font-size: .8rem;
                color: rgba(245, 152, 34, 0);
                animation: comboFade 2s 1;

                @keyframes comboFade
                {
                    from {
                        transform: translateY(0rem);
                        color: $gold;
                    }
                    to {
                        transform: translateY(-1rem);
                        color: rgba(245, 152, 34, 0);
                    }
                }
            }
        }

        .base-image {
            height: 3rem;
            width: 3rem;
            position: absolute;
            top: 0;
            left: 0;
            z-index: 9;

            &.speed-0 {
                top: -3rem;
                margin: 0 0 0 50%;
                left: -1.5rem;
                transition: 3s;
                transition-timing-function: linear;

                &.fall {
                    transform: translateY(20rem);
                }
            }

            &.speed-1 {
                top: -3rem;
                margin: 0 0 0 50%;
                left: -1.5rem;
                transition: 2s;
                transition-timing-function: linear;

                &.fall {
                    transform: translateY(20rem);
                }
            }

            &.speed-2 {
                top: -3rem;
                margin: 0 0 0 50%;
                left: -1.5rem;
                transition: .5s;
                transition-timing-function: linear;

                &.fall {
                    transform: translateY(20rem);
                }
            }
        }

    }

</style>

<template>
    <div class="game-body" @touchstart.stop.prevent="topMove">
        <!--游戏背景-->
        <img class="game-background" :src="gameBackground">
        <div class="window" :style="{backgroundImage: `url(${gameWindow})`}">

            <!--计分板-->
            <div class="scoreboard">
                <span class="count-down">{{time}}</span>

                <span class="score">{{score}}</span>
            </div>

            <!--目标窗花-->
            <img class="fix-image" v-for="(item, index) in fixImages"
                 :class="{success: item.success}"
                 :key="index"
                 :src="item.src"
                 :style="{top: `${item.y}rem`, left: `${item.x}rem`}"
                 :ref="`target_00${index + 1}`"
                 @animationend="removeTargetSuccess(index)"
            >

            <!--窗花正确的提示-->
            <span class="success-tip" v-for="(item, index) in successTips"
                  :key="index"
                  :style="{top: `${item.y}px`, left: `${item.x}px`}"
                  :data-uuid="item.uuid"
                  @animationend="removeSuccessTip(item.uuid)"
            >+{{item.score}}</span>

            <!--combo提示-->
            <p class="combo-tip" v-for="(item, index) in comboTips"
               :key="item.uuid"
               :data-uuid="item.uuid"
               @animationend="removeComboTip(item.uuid)">
                连击 +{{item.combo}}
            </p>
        </div>

        <!--掉落的窗花-->
        <img class="base-image" v-for="(item, index) in getFallList"
             :key="item.uuid"
             :src="item.src"
             :class="{fall: item.fall, 'speed-0': !item.touch, 'speed-1': !item.touch && this.speedLevel === 1, 'speed-2':!item.touch &&  this.speedLevel === 2}"
             :style="{transform: `translate(${item._x}px, ${item._y}px)`}"

             :ref="item.uuid"
             :data-uuid="item.uuid"
             :data-bullet="item.bullet"
             @transitionend="removeFallImage(item.uuid)"

             @touchstart.prevent.stop="touchStart"
             @touchmove.prevent.stop="touchMove"
             @touchend.prevent.stop="touchEnd"
        >

    </div>
</template>

<script>
    // import gameBackground from "https://img.guoanfamily.com/newyear/game/game_background.jpg";
    // import gameWindow from "https://img.guoanfamily.com/newyear/game/game_window.jpg";
    //
    // import image001 from "https://img.guoanfamily.com/newyear/game/image001.png";
    // import image002 from "https://img.guoanfamily.com/newyear/game/image002.png";
    // import image003 from "https://img.guoanfamily.com/newyear/game/image003.png";
    // import image004 from "https://img.guoanfamily.com/newyear/game/image004.png";
    // import image005 from "https://img.guoanfamily.com/newyear/game/image005.png";
    // import image006 from "https://img.guoanfamily.com/newyear/game/image006.png";

    const gameBackground = "https://img.guoanfamily.com/newyear/game/game_background.jpg";
    const gameWindow = "https://img.guoanfamily.com/newyear/game/game_window.jpg";

    const image001 = "https://img.guoanfamily.com/newyear/game/image001.png";
    const image002 = "https://img.guoanfamily.com/newyear/game/image002.png";
    const image003 = "https://img.guoanfamily.com/newyear/game/image003.png";
    const image004 = "https://img.guoanfamily.com/newyear/game/image004.png";
    const image005 = "https://img.guoanfamily.com/newyear/game/image005.png";
    const image006 = "https://img.guoanfamily.com/newyear/game/image006.png";

    const imageStore = [image001, image002, image003, image004, image005, image006];

    const fixImages = [{
        success: false,
        src: image001,
        x: 1,
        y: 3.4,
    }, {
        success: false,
        src: image002,
        x: 4.6,
        y: 3.4,
    }, {
        success: false,
        src: image003,
        x: 1,
        y: 5.9,
    }, {
        success: false,
        src: image004,
        x: 4.6,
        y: 5.9,
    }, {
        success: false,
        src: image005,
        x: 1,
        y: 8.7,
    }, {
        success: false,
        src: image006,
        x: 4.6,
        y: 8.7,
    },];

    const speed = 1;

    export default {
        data() {
            return {
                //图片素材
                gameBackground: gameBackground,
                gameWindow: gameWindow,
                fixImages: fixImages,

                //窗花自动掉落的定时器
                gameTimer: null,

                //目标窗花的位置信息
                target: {},

                //掉落中的窗花Map对象
                fallList: {},

                //当前正确次数
                hit: 0,
                //当前连击次数
                combo: 0,
                //连击提示弹框
                comboTips: {},
                //得分
                score: 0,
                //当前成功后 的得分系数
                scoreRate: 10,
                //倒计时时间
                time: 30,

                //成功选中后的提示
                successTips: {

                },

                //加速等级
                speedLevel: 0
            }
        },

        created() {

        },

        mounted() {
            let ua = navigator.userAgent.toLowerCase()
            if (ua.match(/MicroMessenger/i) == "micromessenger") {
                this.wxConfig();
            }

            //游戏页面先去后台校验可玩游戏次数
            let userInfo = this.getStorage("userInfo");
            this.post("checkGameTimes", userInfo).then(res => {
                if (res.Code === 0) {
                    alert("游戏开始");
                    this.gameTimer = setInterval(this.run, 1000);
                } else {
                    alert(res.Msg)
                    this.$router.go(-1);
                }
            });

            //获取全部目标的位置
            this.fixImages.map((item, index) => {
                let key = `target_00${index + 1}`;
                let target = this.$refs[key][0];

                //计算命中区域(左上角坐标和右下角坐标)
                this.$set(this.target, key, {
                    tx: target.offsetLeft,
                    ty: target.offsetTop,
                    bx: target.offsetLeft + target.clientHeight,
                    by: target.offsetTop + target.clientHeight,
                });
            })
        },

        beforeDestroy() {
            clearInterval(this.gameTimer);
            this.gameTimer = null;
        },

        methods: {
            wxConfig() {
                return;
                // const URL = window.location.href; //.split('#')[0]
                //
                // this.post("jsapi/getJsapiSignature?local_url=" + URL,//encodeURIComponent(location.href.split('#')[0]), //URL, // encodeURIComponent(URL),
                //     {}, {
                //         interfaceType: "weichat"
                //     }).then(response => {
                //     wx.config({
                //         debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                //         appId: response.appid, // 必填，公众号的唯一标识
                //         timestamp: parseInt(response.timestamp), // 必填，生成签名的时间戳
                //         nonceStr: response.noncestr, // 必填，生成签名的随机串
                //         signature: response.signature, // 必填，签名，见附录1
                //         jsApiList: [
                //             'onMenuShareTimeline',
                //             'onMenuShareAppMessage',
                //             'onMenuShareQQ',
                //             'onMenuShareWeibo',
                //             'onMenuShareQZone']// 必填，需要使用的JS接口列表
                //     });
                //     wx.ready(() => {
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
                //     })
                // });
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

            //阻止背景移动
            topMove(e) {},

            //移动窗花
            touchStart(e) {
                let uuid = e.target.dataset.uuid;
                let image = this.fallList[uuid];
                if (image.fall) {
                    image.fall = false;
                    image.touch = true;
                    let ele = this.$refs[uuid][0];
                    let _x = e.touches[0].pageX;
                    let _y = e.touches[0].pageY;
                    image._x = _x - ele.clientWidth / 2;
                    image._y = _y - ele.clientWidth / 2;
                }
            },

            touchMove(e) {
                let uuid = e.target.dataset.uuid;
                let _x = e.touches[0].pageX;
                let _y = e.touches[0].pageY;
                let ele = this.$refs[uuid][0];
                try{
                    ele.setAttribute("style", `transform: translate(${_x - ele.clientWidth / 2}px, ${_y - ele.clientWidth / 2}px)`);
                }catch (e){

                }
            },

            touchEnd(e) {
                try {
                    let uuid = e.target.dataset.uuid;
                    let bullet = e.target.dataset.bullet;
                    //判断图标是否放在正确位置，在正确位置则加分
                    //根据bullet找到对应的target的坐标范围
                    let {tx, ty, bx, by} = this.target["target_" + bullet];

                    let target = this.$refs[uuid][0];
                    let transform = target.style.transform;
                    let coordinate = transform.replace("translate(", "").replace(")", "").replace(/px/g, "").split(",");

                    let _x = ~~coordinate[0] + e.target.clientWidth / 2;
                    let _y = ~~coordinate[1] + e.target.clientWidth / 2;

                    //位置正确
                    if( _x >= tx && _x<= bx && _y >= ty && _y <= by ){
                        this.hit++;
                        this.combo++;
                        let tip_uuid = new Date().getTime();

                        this.fixImages[bullet - 1].success = true;

                        //2连击开始展示
                        if(this.combo > 1){
                            this.$set(this.comboTips, tip_uuid, {
                                uuid: tip_uuid,
                                combo: this.combo,
                            });
                        }

                        //combo10个以上加分变多
                        if(this.combo > 10){
                            this.score += (this.combo - 10) *  this.scoreRate;
                        }

                        //显示正确提示
                        this.$set(this.successTips, tip_uuid, {
                            uuid: tip_uuid,
                            score: this.scoreRate,
                            x: tx,
                            y: ty,
                        });

                        this.score +=  this.scoreRate;
                    }else{
                        this.combo = 0;
                    }

                    //移动过的直接删除
                    this.$delete(this.fallList, uuid);
                }catch (e){
                    console.warn(e);
                }
            },

            run() {

                switch (this.time--){
                    //剩余20秒后加速一次
                    case 20:
                        this.speedLevel++;
                        clearInterval(this.gameTimer);
                        this.gameTimer = setInterval(this.run, 600);
                        break;
                    case 10:
                        this.speedLevel++;
                        clearInterval(this.gameTimer);
                        this.gameTimer = setInterval(this.run, 500);
                        break;
                }


                if(!this.time){
                    //游戏结束
                    let userInfo = this.getStorage("userInfo");
                    this.setStorage("userInfo", Object.assign(userInfo, {
                        best_score: this.score
                    }));

                    this.$router.replace("/score");
                }

                let uuid = new Date().getTime();
                let type = Math.floor(Math.random() * 6);
                this.$set(this.fallList, uuid, {
                    speedLevel: this.speedLevel,
                    src: imageStore[type],
                    fall: false,
                    touch: false,
                    uuid: uuid,
                    x: 0,
                    y: 0,
                    bullet: `00${type + 1}`
                });

                setTimeout(() => {
                    this.fallList[uuid].fall = true;
                }, 100)
            },

            removeFallImage(uuid) {
                let image = this.fallList[uuid];
                if (image.fall === true && image.touch === false) {
                    this.combo = 0;
                    this.$delete(this.fallList, uuid);
                }
            },

            removeComboTip(uuid){
                this.$delete(this.comboTips, uuid);
            },

            removeSuccessTip(uuid){
                this.$delete(this.successTips, uuid);
            },

            removeTargetSuccess(index){
                this.fixImages[index].success = false;
            }
        },

        components: {},

        computed: {
            getFallList() {
                return this.fallList;
            }
        }
    }
</script>
