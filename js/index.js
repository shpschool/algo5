const { createApp } = Vue;
import App from "./App.js";
import CreateLesson from "./method_components/CreateLesson.js";
import ShowLessons from "./method_components/ShowLessons.js";

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
                page: '',
            }
        },
        methods: {
            async accessCheck() {
                let pass = await fetch(`db/pass.json`).then(res => res.json());
                if (this.access == pass) {
                    this.accessStatus = true;
                    this.error = false;
                    localStorage.setItem('methodPassword', 'correct');
                } else {
                    this.accessStatus = false;
                    this.error = true;
                    localStorage.setItem('methodPassword', 'incorrect');
                }
                console.log(localStorage.getItem('methodPassword'));
            },
            back() {
                this.page = ''
            },
            checkSessionAccess() {
                console.log(localStorage.getItem('methodPassword'));
                if (localStorage.getItem('methodPassword') === 'correct') {
                    this.accessStatus = true;
                    this.error = false;
                    return true;
                }
                return false;
            },
        },
        created() {
            document.title = 'Главная';
        },
        components: {CreateLesson, ShowLessons},
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
        <div v-if="!accessStatus && !checkSessionAccess()" class="colomn-cont">
            <h3>Вход для методистов:</h3>
            <input type="password" v-model="access" class="field">
            <span v-if="error" class="error">Неверный пароль</span>
            <button class="btn-main" @click="accessCheck">Войти</button>
        </div>
        <div v-else class="cont colomn-cont">
            <div v-if="!page" class="colomn-cont">
                <h2 @click="page = 'show'" class="btn-link">Посмотреть занятия</h2>
                <h2 @click="page = 'create'" class="btn-link">Создать занятие</h2>
            </div>
            <ShowLessons v-if="page==='show'" @back="back" />
            <CreateLesson v-if="page==='create'" @back="back" />
        </div>
        `,
    }).mount('#app');
};