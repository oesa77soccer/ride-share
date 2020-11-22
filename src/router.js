import Vue from "vue";
import Router from "vue-router";

import Home from "./pages/Home.vue";
import SignIn from "./pages/SignIn.vue";
import SignUp from "./pages/SignUp.vue";
import About from "./pages/About.vue";
import Accounts from "./pages/Accounts.vue";
import ResetPassword from "./pages/ResetPassword.vue";
import Rides from "./pages/Rides.vue";
import Users from "./pages/Users.vue";
import BecomeDriver from "./pages/BecomeDriver.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    { name: "home-page", path: "/", component: Home },
    { name: "sign-up", path: "/sign-up", component: SignUp },
    { name: "sign-in", path: "/sign-in", component: SignIn },
    { name: "about-us", path: "/about-us", component: About },
    { name: "accounts", path: "/accounts", component: Accounts },
    { name: "reset-password", path: "/reset-password", component: ResetPassword },
    { name: "rides", path: "/rides", component: Rides },
    { name: "users", path: "/users", component: Users },
    { name: "become-driver", path: "/drivers", component: BecomeDriver }
  ]
});
