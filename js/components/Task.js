export default {
    props: ['taskTitle', 'taskText', 'min', 'max'],
    methods: {
        prev() {
            let path = new URL(document.location);
            let taskNumber = Number(path.searchParams.get('task'));
            if (taskNumber === this.min) {
                path.searchParams.set('task', this.max)
            } else {
                path.searchParams.set('task', taskNumber - 1)
            }
            document.location = path;
        },
        next() {
            let path = new URL(document.location);
            let taskNumber = Number(path.searchParams.get('task'));
            if (taskNumber === this.max) {
                path.searchParams.set('task', this.min)
            } else {
                path.searchParams.set('task', taskNumber + 1)
            }
            document.location = path;
        }
    },
    template: `
    <div class="task-condition right-content">
        <button class="btn-arrow" @click="prev"><img src="assets/prev.png" class="arrow"></button>
        <div class="task-inner">
            <h3>Задача "{{taskTitle}}". Условие</h3>
            <p v-for="line in taskText" class="task-line" v-html="line"></p>
        </div>
        <button class="btn-arrow" @click="next"><img src="assets/next.png" class="arrow"></button>
    </div>
    `
}