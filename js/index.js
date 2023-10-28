/**
 * Главный компонент, который рендерит метод. сторону, то есть роут "/"
 */


import createExcel from "./helpers/excelHelper.js";
import makeAlgorithmHelper from "./helpers/makeAlgorithmHelper.js";
import commandHelper from "./helpers/commandHelper.js";
const { createApp } = Vue;
import App from "./App.js";
import CreateLesson from "./method_components/CreateLesson.js";
import ShowLessons from "./method_components/ShowLessons.js";

let path = new URL(document.location);  // если ссылка формата "?lesson=N&level=M&task=K"
if (path.searchParams.get('lesson')) {
    createApp({
        data() {
            return {commandHelper}
        },
        components: {App},
        template: `<App :ch="commandHelper" />`
    }).mount('#app');       // то рендерим исполнителей
} else {
    createApp({
        data() {
            return {
                access: '',
                accessStatus: false,
                error: false,
                page: '',
                createExcel,
                makeAlgorithmHelper,
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
            exit() {
                localStorage.removeItem('methodPassword');
                this.access = '';
                this.accessStatus = false;
                this.error = false;
                this.page = '';
            }
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
                <button v-if="accessStatus" class="btn-exit" @click="exit">Выйти</button>
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
            <ShowLessons v-if="page==='show'"
                @back="back"
                :createExcel="createExcel"
                :makeAlgorithmHelper="makeAlgorithmHelper" />
            <CreateLesson v-if="page==='create'" @back="back" />
        </div>
        `,
    }).mount('#app');
};