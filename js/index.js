const { createApp } = Vue;
import App from "./App.js";
import Main from "./Main.js";

let path = new URL(document.location);
if (path.searchParams.get('lesson')) {
    createApp(App).mount('#app');
} else {
    createApp({
        data() {
            return {
                access: '',
                accessStatus: false,
                error: false,
            }
        },
        methods: {
            async accessCheck() {
                if (this.access == "23method_IS_really_work19") {
                    this.accessStatus = true;
                    this.error = false;
                } else {
                    this.accessStatus = false;
                    this.error = true;
                }
                let pass = await fetch(`https://gist.github.com/iamgo100/5417ba47df4a889f1739b71f92d75325`).then(res => res.json());
                console.log(pass);
            },
        },
        created() {
            document.title = 'Главная';
        },
        components: {Main},
        template: `
        <div class="header colomn-cont">
            <div class="header-wrap inline-cont">
                <span class="left-content colomn-cont">
                    <img src="assets/logo.png" class="logo">
                </span>
                <h1 v-if="!accessStatus" class="right-content">ГЛАВНАЯ</h1>
                <h1 v-else class="right-content">СТРАНИЦА МЕТОДИСТА</h1>
            </div>
        </div>
        <div v-if="!accessStatus" class="colomn-cont ">
            <h3>Вход для методистов:</h3>
            <input type="password" v-model="access" class="field">
            <span v-if="error" class="error">Неверный пароль</span>
            <button class="btn-main" @click="accessCheck">Войти</button>
        </div>
        <Main v-else/>
        `,
    }).mount('#app');
};