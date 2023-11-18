export default {
    data() {
        return {
            numbersPrev: [],
            numbersNext: [],
        }
    },
    props: ['currentValue'],
    watch: {
        currentValue() {
            this.setNumbers();
        },
    },
    computed: {
        changeMinWidth() {
            // увеличение размеров блока для чисел на прямой (без этого числа будут скакать по прямой)
            if (parseInt(this.currentValue / 1000) !== 0) {
                return 'min-width: 80px';
            } else if (parseInt(this.currentValue / 100) !== 0) {
                return 'min-width: 65px';
            } else {
                return 'min-width: 50px';
            }
        }
    },
    methods: {
        setNumbers() {
            this.numbersPrev = [];
            this.numbersNext = [];
            for (let i=this.currentValue - 30; i < this.currentValue; i++) {
                this.numbersPrev.push(i);
            }
            for (let i=this.currentValue + 1; i <= this.currentValue + 30; i++) {
                this.numbersNext.push(i);
            }
        },
    },
    created() {
        this.setNumbers();
    },
    template: `
    <div class="grasshopper-cont colomn-cont">
        <img src="assets/grasshopper.png" class="grasshopper">
        <hr>
        <div class="numbers">
            <p v-for="num in numbersPrev" :key=num class="num" :style="changeMinWidth">{{num}}</p>
            <p class="num curr-val-gh" :style="changeMinWidth">{{currentValue}}</p>
            <p v-for="num in numbersNext" :key=num class="num" :style="changeMinWidth">{{num}}</p>
        </div>
    </div>
    `
}