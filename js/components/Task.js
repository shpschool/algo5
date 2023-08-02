export default {
    props: ['taskTitle', 'taskText', 'minTask', 'maxTask'],
    watch: {
        minTask(minNew, minOld) {
            console.log(minOld, minNew);
        }
    },
    methods: {
        prev() {
            let path = new URL(document.location);
            let taskNumber = Number(path.searchParams.get('task'));
            if (taskNumber === this.minTask) {
                path.searchParams.set('task', this.maxTask)
            } else {
                path.searchParams.set('task', taskNumber - 1)
            }
            document.location = path;
        },
        next() {
            let path = new URL(document.location);
            let taskNumber = Number(path.searchParams.get('task'));
            if (taskNumber === this.maxTask) {
                path.searchParams.set('task', this.minTask)
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