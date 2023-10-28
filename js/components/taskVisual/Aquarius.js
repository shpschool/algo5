export default {
    data() {
        return {
            styleA: 'width: 120px',
            styleB: 'width: 120px',
            doneA: false,
            doneB: false,
        }
    },
    props: ['volumeA', 'volumeB', 'currVolumeA', 'currVolumeB', 'taskParams'],
    watch: {
        currVolumeA(newVolume) {
            if (this.taskParams.target.find(el => el === newVolume)) this.doneA = true;
            else this.doneA = false;
        },
        currVolumeB(newVolume) {
            if (this.taskParams.target.find(el => el === newVolume)) this.doneB = true;
            else this.doneB = false;
        },
    },
    created() {
        let maxWidth = 120;
        if (this.volumeA > this.volumeB) {
            let width = maxWidth / this.volumeA * this.volumeB;
            this.styleB = `width: ${width}px`;
        } else {
            let width = maxWidth / this.volumeB * this.volumeA;
            this.styleA = `width: ${width}px`;
        }
    },
    template: `
    <div class="left-content inline-cont">
        <div class="volume">
            <span class="max-volume">A = {{volumeA}}</span>
            <div class="progress-cont">
                <progress :max=volumeA :value=currVolumeA :style=styleA class="volume-progress" :class="{done: doneA}"></progress>
            </div>
            <span class="curr-volume">{{currVolumeA}}</span>
        </div>
        <div class="volume">
            <span class="max-volume">B = {{volumeB}}</span>
            <div class="progress-cont">
                <progress :max=volumeB :value=currVolumeB :style=styleB class="volume-progress" :class="{done: doneB}"></progress>
            </div>
            <span class="curr-volume">{{currVolumeB}}</span>
        </div>
    </div>
    `
}