const generateRandomString = (length) => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
};

export default {
    data() {return {
        code: [],
        levels: 0,
    }},
    methods: {
        createLevel() {
            this.levels++;
            this.code.push({
                "level": this.levels,
                "tasks": []
            });
        },
        createTask(level) {
            let number = this.code[level-1].tasks.length + 1;
            this.code[level-1].tasks.push({
                "task": number,
                "executor": "",
                "task_title": "",
                "task_text": [""],
                "params": {},
                "verif_code": {
                    "0": generateRandomString(6) + `-0L${level}T${number}`,
                    "75": generateRandomString(6) + `-75L${level}T${number}`,
                    "100": generateRandomString(6) + `-100L${level}T${number}`
                }
            });
        },
        changeTaskText(task, text) {
            task.task_text = text.split('\n');
        },
        changeTaskTarget(task, values) {
            task.params.target = values.split(',').map(Number);
        },
        changeCode(task) {
            if (task.executor === 'doubler') {
                task.params = {
                    "start": 0,
                    "plus": 1,
                    "multi": 2
                }
            }
            if (task.executor === 'divider') {
                task.params = {
                    "end": 0,
                    "minus": 1,
                    "divide": 2
                }
            }
            if (task.executor === 'aquarius') {
                task.params = {
                    "start_volumeA": 0,
                    "start_volumeB": 0
                }
            }
            if (task.executor === 'grasshopper') {
                task.params = {
                    "start": 0,
                    "procedure": 0
                }
            }
        },
    },
    template: `
    <div class="method-cont">
        <div class="editor">
            <div v-for="level in code" :key="level.level" class="level-cont">
                <h3>Шаг {{level.level}}</h3>
                <div v-for="task in level.tasks" :key="task.task" class="task-cont">
                    <h4>Задача {{task.task}}</h4>
                    <select v-model="task.executor" class="field" @change="changeCode(task)">
                        <option value="" disabled selected hidden>Выберите исполнителя</option>
                        <option value="doubler">Удвоитель</option>
                        <option value="divider">Поделитель</option>
                        <option value="aquarius">Водолей</option>
                        <option value="grasshopper">Кузнечик</option>
                    </select>
                    <div>
                        <label for="task-title">Введите название задачи:</label>
                        <input v-model="task.task_title" class="field wide-field" name="task-title">
                    </div>
                    <div>
                        <label for="task-text">Введите условие задачи:</label>
                        <textarea
                            class="field wide-field" 
                            name="task-text" rows="4"
                            @input="event => changeTaskText(task, event.target.value)"
                        ></textarea>
                    </div>


                    <div v-if="task.executor==='doubler'">
                        <div>
                            <label class="inline" for="start">Введите стартовую точку:</label>
                            <input v-model="task.params.start" type="number" class="field" name="start">
                        </div>
                        <div>
                            <label class="inline" for="end">Введите конечную точку:</label>
                            <input v-model="task.params.end" type="number" class="field" name="end">
                        </div>
                        <div>
                            <label class="inline" for="plus">Введите команду "плюс":</label>
                            <input v-model="task.params.plus" type="number" class="field" name="plus">
                        </div>
                        <div>
                            <label class="inline" for="multi">Введите команду "умножить":</label>
                            <input v-model="task.params.multi" type="number" class="field" name="multi">
                        </div>
                        <div>
                            <label class="inline" for="steps">Введите эталонное количество шагов:</label>
                            <input v-model="task.params.steps" type="number" class="field" name="steps">
                        </div>
                    </div>


                    <div v-if="task.executor==='divider'">
                        <div>
                            <label class="inline" for="start">Введите стартовую точку:</label>
                            <input v-model="task.params.start" type="number" class="field" name="start">
                        </div>
                        <div>
                            <label class="inline" for="end">Введите конечную точку:</label>
                            <input v-model="task.params.end" type="number" class="field" name="end">
                        </div>
                        <div>
                            <label class="inline" for="minus">Введите команду "минус":</label>
                            <input v-model="task.params.minus" type="number" class="field" name="minus">
                        </div>
                        <div>
                            <label class="inline" for="divide">Введите команду "разделить":</label>
                            <input v-model="task.params.divide" type="number" class="field" name="divide">
                        </div>
                        <div>
                            <label class="inline" for="steps">Введите эталонное количество шагов:</label>
                            <input v-model="task.params.steps" type="number" class="field" name="steps">
                        </div>
                    </div>


                    <div v-if="task.executor==='aquarius'">
                        <div>
                            <label class="inline" for="volumeA">Введите объем емкости А:</label>
                            <input v-model="task.params.volumeA" type="number" class="field" name="volumeA">
                        </div>
                        <div>
                            <label class="inline" for="volumeB">Введите объем емкости B:</label>
                            <input v-model="task.params.volumeB" type="number" class="field" name="volumeB">
                        </div>
                        <div>
                            <label class="inline" for="start_volumeA">Введите значение воды, налитое в начале задачи в емкость А:</label>
                            <input v-model="task.params.start_volumeA" type="number" class="field" name="start_volumeA">
                        </div>
                        <div>
                            <label class="inline" for="start_volumeB">Введите значение воды, налитое в начале задачи в емкость B:</label>
                            <input v-model="task.params.start_volumeB" type="number" class="field" name="start_volumeB">
                        </div>
                        <div>
                            <label for="target">Введите через запятую значения воды, которые нужно набрать в одной из емкостей:</label>
                            <input 
                                @input="event => changeTaskTarget(task, event.target.value)"
                                class="field" name="target">
                        </div>
                        <div>
                            <label class="inline" for="steps">Введите эталонное количество шагов:</label>
                            <input v-model="task.params.steps" type="number" class="field" name="steps">
                        </div>
                    </div>


                    <div v-if="task.executor==='grasshopper'">
                        <div>
                            <label class="inline" for="forward">Введите значение для команды "вперед":</label>
                            <input v-model="task.params.forward" type="number" class="field" name="forward">
                        </div>
                        <div>
                            <label class="inline" for="backward">Введите значение для команды "назад":</label>
                            <input v-model="task.params.backward" type="number" class="field" name="backward">
                        </div>
                        <div>
                            <label class="inline" for="min">Введите минимальное значение, доступное на числовой прямой:</label>
                            <input v-model="task.params.min" type="number" class="field" name="min">
                        </div>
                        <div>
                            <label class="inline" for="max">Введите максимальное значение, доступное на числовой прямой:</label>
                            <input v-model="task.params.max" type="number" class="field" name="max">
                        </div>
                        <div>
                            <label class="inline" for="start">Введите стартовую точку:</label>
                            <input v-model="task.params.start" type="number" class="field" name="start">
                        </div>
                        <div>
                            <label for="target">Введите через запятую значения, которые нужно получить в последовательности решения:</label>
                            <input 
                                @input="event => changeTaskTarget(task, event.target.value)"
                                class="field" name="target">
                        </div>
                        <div>
                            <label class="inline" for="steps">Введите эталонное количество шагов:</label>
                            <input v-model="task.params.steps" type="number" class="field" name="steps">
                        </div>
                        <div>
                            <label class="inline" for="procedure">Возможность составлять и применять процедуры:</label>
                            <select v-model="task.params.procedure" class="field" name="procedure">
                                <option value="0" selected>Выключена</option>
                                <option value="1">Включена</option>
                            </select>
                        </div>
                    </div>


                </div>
                <button class="btn-main" @click="createTask(level.level)">Создать задачу</button>
            </div>
            <button @click="createLevel" class="btn-main">Создать шаг</button>
        </div>
        <div class="code-cont">
            <pre>{{code}}</pre>
        </div>
    </div>
    `
}