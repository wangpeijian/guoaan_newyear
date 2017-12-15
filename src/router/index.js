import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter);

const Index = resolve => require(['../pages/Index'], resolve);

const Form = resolve => require(['../pages/Form'], resolve);

const Rule = resolve => require(['../pages/Rule'], resolve);

const Game = resolve => require(['../pages/Game'], resolve);

const Score = resolve => require(['../pages/Score'], resolve);


const routes = [{
    path: '/',
    meta: {},
    component: Index
},{
    path: '/form',
    meta: {},
    component: Form
},{
    path: '/rule',
    meta: {},
    component: Rule
},{
    path: '/game',
    meta: {},
    component: Game
},{
    path: '/score',
    meta: {},
    component: Score
}, {
    path: '*',
    component: Index
},];

const router = new VueRouter({
    routes,
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition
        } else {
            return {x: 0, y: 0}
        }
    }
});

router.afterEach((to, from) => {

});

export default router
