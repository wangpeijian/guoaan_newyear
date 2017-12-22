<style scoped lang="scss">
    .background {
        height: 100%;

        .header {
            height: 4.7rem;
            background: no-repeat center;
            background-size: cover;
            position: relative;

            .text {
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

            .form-group {
                width: 80%;
                margin: 0 auto;
                padding-top: 1.3rem;
                height: 5.8rem;

                input::-webkit-input-placeholder{
                    color: #dbc286;
                }
                　　input:-moz-placeholder{
                    color: #dbc286;
                }
                　　input::-moz-placeholder{
                    color: #dbc286;
                }
                　　input:-ms-input-placeholder{
                    color: #dbc286;
                }

                input, select {
                    height: .8rem;
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

            .start-btn {
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
                值此2018年元旦来临之际，感谢您对中信国安科技控股有限公司的关注和支持，对此表示衷心的祝福，并致以最诚挚的新年问候和深深的敬意！特此举办“迎元旦 贴窗花”互动小游戏活动，对广大粉丝表达真诚答谢。
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

                    <!--<input type="text" placeholder="公司" v-model="worker.company">-->

                    <select v-model="worker.company">
                        <option disabled value="">请选择</option>
                        <option v-for="item in getCompanyList" :key="item.Id" :value="item.CompanyName">{{item.CompanyName}}</option>
                    </select>
                    <input type="text" placeholder="部门" v-model="worker.department">
                    <input type="text" placeholder="姓名" v-model="worker.name">
                    <input type="number" placeholder="手机" v-model="worker.phone">

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
                },

                companyList: [],
            }
        },

        created() {
            let userInfo = this.getStorage("userInfo");

            //本地存储了用户信息
            if(userInfo.user_type !== undefined){
                this.type = userInfo.user_type;
                if(userInfo.user_type === 0){
                    this.tourist = {
                        name: userInfo.wx_name,
                        phone: userInfo.wx_phone,
                        address: userInfo.wx_address,
                    }
                }else{
                    this.worker = {
                        name: userInfo.yun_name,
                        phone: userInfo.yun_phone,
                        company: userInfo.yun_company,
                        department: userInfo.yun_department,
                    }
                }
            }

            let companyList = this.getStorage("companyList")

            if(!companyList.length){
                this.post("getCompanyList").then(res => {
                    this.setStorage("companyList", res.Data);
                    this.companyList = res.Data;
                })
            }else {
                this.companyList = companyList;
            }

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

            changeForm(type) {
                this.type = type;
                // if(confirm("切换入口类型会覆盖旧的记录！")){
                //
                // }
            },

            submit() {
                let userInfo = Object.assign(this.getStorage("userInfo"), {
                    user_type: this.type,
                });

                if (this.type === 0) {

                    if(this.tourist.name && this.tourist.phone && this.tourist.address){

                    }else {
                        alert("请填写完整信息")
                        return;
                    }

                    //游客
                    userInfo = Object.assign(userInfo, {
                        // wx_head: "",
                        // wx_id: "",
                        wx_name: this.tourist.name,
                        wx_phone: this.tourist.phone,
                        wx_address: this.tourist.address,

                        // yun_id: "",
                        // yun_name: "",
                        //yun_phone: "",
                        yun_company: "",
                        yun_department: "",
                    });

                } else {

                    if(this.worker.name && this.worker.phone && this.worker.company && this.worker.department){

                    }else {
                        alert("请填写完整信息")
                        return;
                    }

                    //员工
                    userInfo = Object.assign(userInfo, {
                       // yun_id: "",
                        yun_name: this.worker.name,
                        yun_phone: this.worker.phone,
                        yun_company: this.worker.company,
                        yun_department: this.worker.department,

                        // wx_head: "",
                        // wx_id: "",
                        wx_name: "",
                        wx_phone: "",
                        wx_address: "",
                    });
                }

                this.setStorage("userInfo", userInfo);

                this.$router.push(`/rule`);
            }
        },

        computed:{
          getCompanyList(){
              return this.companyList
          }
        },

        components: {}
    }
</script>
