export default {
    data() {
        return {
            maxi: 0,
            mini: 0,
        }
    },
    props: ['taskTitle', 'taskText', 'min', 'max'],
    watch: {
        max(maxNew, maxOld) {
            console.log(maxOld, maxNew);
            this.maxi = maxNew;
        },
        min(minNew, minOld) {
            console.log(minOld, minNew);
            this.mini = minNew;
        }
    },
    methods: {
        prev() {
            let path = new URL(document.location);
            let taskNumber = Number(path.searchParams.get('task'));
            console.log(this.min, this.mini);
            if (taskNumber === this.mini) {
                path.searchParams.set('task', this.maxi)
            } else {
                path.searchParams.set('task', taskNumber - 1)
            }
            // document.location = path;
        },
        next() {
            let path = new URL(document.location);
            let taskNumber = Number(path.searchParams.get('task'));
            console.log(this.max, this.maxi);
            if (taskNumber === this.maxi) {
                path.searchParams.set('task', this.mini)
            } else {
                path.searchParams.set('task', taskNumber + 1)
            }
            // document.location = path;
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