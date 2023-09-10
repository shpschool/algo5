export default {
    data() {
        return {
            lessons: [],
        }
    },
    emits: ['back'],
    methods: {
        copy(button, lesson, level, task) {
            let link = `https://shpschool.github.io/algo5/?lesson=${lesson}&level=${level}&task=${task}`;
            navigator.clipboard.writeText(link)
                .then(() => {
                    button.textContent = 'Скопировано!'
                    setTimeout(() => {
                        button.textContent = 'Скопировать ссылку'
                    }, 3000);
                })
                .catch(err => {
                    console.log('Something went wrong: ', err);
                });
        },
        showToggle(header) {
            header.closest('.accordion-item').classList.toggle('show');
        },
    },
    async created() {
        let ind = 1;
        let lesson = await fetch(`db/lesson${ind}.json`).then(res => res.json());
        while (lesson) {
            this.lessons.push(lesson);
            ind++;
            lesson = await fetch(`db/lesson${ind}.json`).then(res => res.json());
        }
    },
    template: `
    <h1>Просмотр занятий</h1>
    <a @click="$emit('back')" class="btn-back">На главную</a>
    <div class="accordion">
        <div v-for="(lesson, ind) in lessons" class="accordion-item">
            <div class="accordion-header" @click="showToggle($event.target)">
                <svg class="svg-arrow" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18.2929 15.2893C18.6834 14.8988 18.6834 14.2656 18.2929 13.8751L13.4007 8.98766C12.6195 8.20726 11.3537 8.20757 10.5729 8.98835L5.68257 13.8787C5.29205 14.2692 5.29205 14.9024 5.68257 15.2929C6.0731 15.6835 6.70626 15.6835 7.09679 15.2929L11.2824 11.1073C11.673 10.7168 12.3061 10.7168 12.6966 11.1073L16.8787 15.2893C17.2692 15.6798 17.9024 15.6798 18.2929 15.2893Z" fill="#1197d5"/>
                </svg>
                <h2>Занятие {{ind + 1}}</h2>
            </div>
            <div class="accordion-body">
                <div v-for="level in lesson" class="step">
                    <h3>Шаг {{level.level}}</h3>
                    <ul v-for="task in level.tasks" class="task">
                        <li>
                            Задание {{task.task}}: https://shpschool.github.io/algo5/?lesson={{ind + 1}}&level={{level.level}}&task={{task.task}}
                            <button
                                @click="copy($event.target, ind + 1, level.level, task.task)"
                                class="btn-copy"
                            >Скопировать ссылку</button>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
    `
}