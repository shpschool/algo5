export default {
    props: ['solution', 'verifCode', 'points', 'checkSolution', 'show', 'clean', 'back', 'repeat', 'solutionLength'],
    template: `
    <div class="solution-cont colomn-cont right-content">
        <div class="solution-head inline-cont">
            <h3>Решение</h3>
            <div class="btn-sol-cont inline-cont">
                <button class="btn-sol" @click="back"><img src="assets/back.png" class="arrow"></button>
                <button class="btn-sol" @click="repeat"><img src="assets/repeat.png" class="arrow"></button>
                <button class="btn-sol" @click="clean">Сбросить</button>
            </div>
        </div>
        <hr>
        <div class="solution-field">
            <span class="command" v-for="(com, index) in solution" :key=index>{{com.text}}</span>
        </div>
        <div class="inline-cont">
            <button class="btn-main" @click="checkSolution">Проверить решение</button>
            <span>Количество команд: {{solutionLength}}</span>
        </div>
        <div class="colomn-cont" v-if="show">
            <span class="line">Балл: <span class="bold">{{points}}</span>/100</span>
            <span class="line">Код для проверки преподавателем: <span class="bold">{{verifCode[points]}}</span></span>
        </div>
    </div>
    `
}