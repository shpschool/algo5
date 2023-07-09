export default {
    props: ['taskTitle', 'taskText', 'maxTask'],
    methods: {
        prev() {
            let path = new URL(document.location);
            let taskNumber = Number(path.searchParams.get('task'));
            if (taskNumber === 1) {
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
                path.searchParams.set('task', 1)
            } else {
                path.searchParams.set('task', taskNumber + 1)
            }
            document.location = path;
        }
    },
    template: `
    <div class="task-condition right-content">
        <button class="btn-arrow" @click="prev"><img src="/assets/prev.png" class="arrow"></button>
        <div class="task-inner">
            <h3>Задача "{{taskTitle}}". Условие</h3>
            <p v-for="line in taskText" class="task-line">{{line}}</p>
        </div>
        <button class="btn-arrow" @click="next"><img src="/assets/next.png" class="arrow"></button>
    </div>
    `
}