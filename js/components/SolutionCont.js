export default {
    props: ['solution', 'verifCode', 'points', 'checkSolution', 'show', 'clean', 'back', 'repeat', 'solutionLength'],
    computed: {
        renderSolution() {
            let arr = [];
            let repeatCom = 1;
            let savedValue, win;
            for (let i=0; i < this.solution.length; i++) {
                let com = this.solution[i];
                let text = com.text;
                if (!text) {
                    let prevCom = this.solution[i-1];
                    if (prevCom && prevCom.command === com.command) {
                        repeatCom++;
                        if (repeatCom === 2) {
                            savedValue = prevCom.prevValue;
                        }
                        text = `${savedValue}${com.command} (x${repeatCom}) -> ${com.value}`;
                    } else {
                        repeatCom = 1;
                        text = `${com.prevValue}${com.command} -> ${com.value}`;
                    }
                } else if (com.value !== undefined) {
                    let prevCom = this.solution[i-1];
                    if (prevCom && prevCom.text === com.text && !win) {
                        repeatCom++;
                        text += ` (x${repeatCom})`;
                        if (com.win) {
                            win = true;
                        }
                    } else {
                        repeatCom = 1;
                        win = false;
                    }
                    text += com.win;
                }
                if (repeatCom === 1) {
                    arr.push(text);
                } else {
                    arr[arr.length - 1] = text;
                } 
            }
            return arr;
        }
    },
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
            <span class="command" v-for="(com, index) in renderSolution" :key=index>{{com}}</span>
        </div>
        <div class="inline-cont">
            <button class="btn-main" @click="checkSolution">Проверить решение</button>
            <span>Количество команд: {{solutionLength}}</span>
        </div>
        <div class="colomn-cont" v-if="show">
            <span class="line">Балл: <span class="bold">{{points}}</span>/100</span>
            <span class="line">Код для проверки преподавателем: <span class="bold">{{verifCode[points]}}_{{solutionLength}}</span></span>
        </div>
    </div>
    `
}