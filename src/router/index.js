import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
import routes from './routes'

const createHistory = process.env.VUE_ROUTER_MODE === 'history' ? createWebHistory : createWebHashHistory

const Router = createRouter({
  scrollBehavior: () => ({ left: 0, top: 0 }),
  routes,
  history: createHistory(process.env.VUE_ROUTER_BASE)
})

Router.beforeEach((to, from, next) => {
  if (localStorage.getItem("auth_token") == undefined) {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("u_i");
    next();
  } else {
    const userInfoStr = localStorage.getItem("u_i");
    if (!userInfoStr) {
      next();
      return;
    }
    let roles = [];
    try {
      const userInfo = JSON.parse(userInfoStr);
      if (userInfo && userInfo.roles) {
        userInfo.roles.map(oo => roles.push(oo.hierarchy.hierarchyCode));
      }
    } catch (e) {
      console.error("Error parsing user info", e);
    }

    if (to.matched.length > 0 && roles.includes(to.matched[0].name)) {
      next();
    } else {
      if (to.matched.length > 0 && to.matched[0].name == "primaryLogin") {
        next();
      } else {
        // For visual parity with old behavior which was next(false)
        next(false);
      }
    }
  }
});

export default Router;
