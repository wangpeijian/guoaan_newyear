<style scoped lang="scss">

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
            }

            .combo-tip{
                position: absolute;
                bottom: 0;
                z-index: 1;
                font-size: .5rem;
                color: rgba(245, 152, 34, 0);
                animation: comboFade 3s 1;
                width: 100%;
                text-align: center;

                @keyframes comboFade
                {
                    from {
                        bottom: -1rem;
                        color: #f59822;
                    }
                    to {
                        bottom: 1rem;
                        color: rgba(245, 152, 34, 0);
                    }
                }
            }

            .success-tip{
                position: absolute;
                text-align: center;
                width: 2rem;
                z-index: 1;
                font-size: .5rem;
                color: rgba(245, 152, 34, 0);
                animation: comboFade 2s 1;

                @keyframes comboFade
                {
                    from {
                        transform: translateY(0rem);
                        color: #f59822;
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

            &.fall-image {
                top: -3rem;
                margin: 0 0 0 50%;
                left: -1.5rem;
                transition: 4s;
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
                 :key="index"
                 :src="item.src"
                 :style="{top: `${item.y}rem`, left: `${item.x}rem`}"
                 :ref="`target_00${index + 1}`"
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
        <img class="base-image " v-for="(item, index) in getFallList"
             :key="item.uuid"
             :src="item.src"
             :class="{fall: item.fall, 'fall-image': !item.touch}"
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
    import gameBackground from "../../static/game/game_background.jpg";
    import gameWindow from "../../static/game/game_window.jpg";

    import image001 from "../../static/game/image001.png";
    import image002 from "../../static/game/image002.png";
    import image003 from "../../static/game/image003.png";
    import image004 from "../../static/game/image004.png";
    import image005 from "../../static/game/image005.png";
    import image006 from "../../static/game/image006.png";

    const imageStore = [image001, image002, image003, image004, image005, image006];

    const fixImages = [{
        src: image001,
        x: 1,
        y: 3.4,
    }, {
        src: image002,
        x: 4.6,
        y: 3.4,
    }, {
        src: image003,
        x: 1,
        y: 5.9,
    }, {
        src: image004,
        x: 4.6,
        y: 5.9,
    }, {
        src: image005,
        x: 1,
        y: 8.7,
    }, {
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

                }
            }
        },

        created() {

        },

        mounted() {
            this.gameTimer = setInterval(this.run, 1000);
            this.run();

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
                ele.setAttribute("style", `transform: translate(${_x - ele.clientWidth / 2}px, ${_y - ele.clientWidth / 2}px)`);
            },

            touchEnd(e) {
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

                if( _x >= tx && _x<= bx && _y >= ty && _y <= by ){
                    this.hit++;
                    this.combo++;
                    let tip_uuid = new Date().getTime();

                    //2连击开始展示
                    if(this.combo > 1){
                        this.$set(this.comboTips, tip_uuid, {
                            uuid: tip_uuid,
                            combo: this.combo,
                        });
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
            },

            run() {
                this.time--;
                if(!this.time){
                    this.setSession("score", this.score);
                    this.$router.push("/score");
                }

                let uuid = new Date().getTime();
                let type = Math.floor(Math.random() * 6);
                this.$set(this.fallList, uuid, {
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
