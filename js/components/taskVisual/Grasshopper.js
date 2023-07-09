export default {
    data() {
        return {
            numbersPrev: [],
            numbersNext: [],
        }
    },
    props: ['start', 'min', 'max', 'currentValue'],
    watch: {
        currentValue() {
            this.setNumbers();
        },
    },
    methods: {
        setNumbers() {
            this.numbersPrev = [];
            this.numbersNext = [];
            for (let i=this.min; i <= this.max; i++) {
                if (i < this.currentValue) this.numbersPrev.push(i);
                if (i > this.currentValue) this.numbersNext.push(i);
            }
        },
    },
    created() {
        this.setNumbers();
    },
    template: `
    <div class="grasshopper-cont colomn-cont">
        <div class="limit-line">
            <span class="min">Min: {{min}}</span>
            <span class="max">Max: {{max}}</span>
        </div>
        <img src="/assets/grasshopper.png" class="grasshopper">
        <hr>
        <div class="numbers">
            <div class="numbers-prev">
                <span v-for="num in numbersPrev" :key=num class="num">{{num}}</span>
            </div>
            <span class="curr-val-gh num">{{currentValue}}</span>
            <div class="numbers-next">
                <span v-for="num in numbersNext" :key=num class="num">{{num}}</span>
            </div>
        </div>
    </div>
    `
}