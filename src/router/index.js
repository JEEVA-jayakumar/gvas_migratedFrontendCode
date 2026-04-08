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

    const matchedName = to.matched.length > 0 ? to.matched[0].name : null;
    console.log("ROLES:", roles);
    console.log("MATCHED NAME:", matchedName);
    console.log("TO MATCHED NAMES:", to.matched.map(m => m.name));
    let isAuthorized = roles.includes(matchedName);

    // SAT/OPS_HEAD module authorization: OH_3 or OH roles map to SAT or OPS_HEAD route
    if (!isAuthorized && (matchedName === "SAT" || matchedName === "OPS_HEAD") && (roles.includes("OH_3") || roles.includes("OH"))) {
      console.log("Authorizing SAT/OPS_HEAD for " + (roles.includes("OH_3") ? "OH_3" : "OH"));
      isAuthorized = true;
    }

    // Inventory module authorization: INH_2 role maps to INH route
    if (!isAuthorized && matchedName === "INH" && roles.includes("INH_2")) {
      console.log("Authorizing INH for INH_2");
      isAuthorized = true;
    }

    if (isAuthorized) {
      next();
    } else {
      if (matchedName === "primaryLogin") {
        next();
      } else {
        // For visual parity with old behavior which was next(false)
        console.log("Unauthorized, blocking navigation to:", to.fullPath);
        next(false);
      }
    }
  }
});

export default Router;
