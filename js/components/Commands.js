export default {
    props: ['executor', 'args', 'commands', 'procedures', 'currentValue', 'volumeA', 'volumeB', 'currVolumeA', 'currVolumeB', 'procedure'],
    emits: ['addCommandToSolution', 'changeCurrentValue', 'changeVolumeA', 'changeVolumeB', 'saveCommands', 'openModal'],
    methods: {
        // команды Удвоителя
        plus() {
            this.$emit('changeCurrentValue', this.currentValue + this.args.plus);
            this.$emit('addCommandToSolution', `${this.currentValue} -> +${this.args.plus}`);
        },
        multi() {
            this.$emit('changeCurrentValue', this.currentValue * this.args.multi);
            this.$emit('addCommandToSolution', `${this.currentValue} -> x${this.args.multi}`)
        },
        // команды Поделителя
        minus() {
            this.$emit('changeCurrentValue', this.currentValue - this.args.minus);
            this.$emit('addCommandToSolution', `${this.currentValue} -> -${this.args.minus}`)
        },
        divide() {
            this.$emit('changeCurrentValue', this.currentValue / this.args.divide);
            this.$emit('addCommandToSolution', `${this.currentValue} -> :${this.args.divide}`)
        },
        // команды Кузнечика
        forward() {
            let newValue = this.currentValue + this.args.forward;
            if (newValue <= this.args.max) {
                this.$emit('changeCurrentValue', newValue);
                let thisCommand = this.commands.find(el => el.name === 'forward');
                this.$emit('addCommandToSolution', {'text': thisCommand.text, 'len': thisCommand.len});
            }
        },
        backward() {
            let newValue = this.currentValue - this.args.backward;
            if (newValue >= this.args.min) {
                this.$emit('changeCurrentValue', newValue);
                let thisCommand = this.commands.find(el => el.name === 'backward');
                this.$emit('addCommandToSolution', {'text': thisCommand.text, 'len': thisCommand.len});
            }
        },
        // команды Водолея
        fillA() {
            if (this.currVolumeA !== this.volumeA) {
                this.$emit('changeVolumeA', this.volumeA);
                this.$emit('addCommandToSolution', 'наполнить А');
            }
        },
        fillB() {
            if (this.currVolumeB !== this.volumeB) {
                this.$emit('changeVolumeB', this.volumeB);
                this.$emit('addCommandToSolution', 'наполнить В');
            }
        },
        emptyA() {
            if (this.currVolumeA !== 0) {
                this.$emit('changeVolumeA', 0);
                this.$emit('addCommandToSolution', 'опустошить А');
            }
        },
        emptyB() {
            if (this.currVolumeB !== 0) {
                this.$emit('changeVolumeB', 0);
                this.$emit('addCommandToSolution', 'опустошить В');
            }
        },
        fromAtoB() {
            if (this.currVolumeA !== 0 && this.currVolumeB !== this.volumeB) {
                let newAvalue = this.currVolumeA;
                let newBvalue = this.currVolumeB;
                while (newAvalue !== 0 && newBvalue !== this.volumeB) {
                    newAvalue--;
                    newBvalue++;
                }
                this.$emit('changeVolumeA', newAvalue);
                this.$emit('changeVolumeB', newBvalue);
                this.$emit('addCommandToSolution', 'перелить из А в В');
            }
        },
        fromBtoA() {
            if (this.currVolumeA !== this.volumeA && this.currVolumeB !== 0) {
                let newAvalue = this.currVolumeA;
                let newBvalue = this.currVolumeB;
                while (newAvalue !== this.volumeA && newBvalue !== 0) {
                    newAvalue++;
                    newBvalue--;
                }
                this.$emit('changeVolumeA', newAvalue);
                this.$emit('changeVolumeB', newBvalue);
                this.$emit('addCommandToSolution', 'перелить из В в А');
            }
        },
        makeCommands() {
            if (this.executor === 'doubler') {
                let list = [
                    {'text': `+${this.args.plus}`, 'func': this.plus},
                    {'text': `x${this.args.multi}`, 'func': this.multi},
                ];
                this.$emit('saveCommands', list);
            } else if (this.executor === 'divider') {
                let list = [
                    {'text': `-${this.args.minus}`, 'func': this.minus},
                    {'text': `:${this.args.divide}`, 'func': this.divide},
                ];
                this.$emit('saveCommands', list);
            } else if (this.executor === 'grasshopper') {
                let list = [
                    {'text': `вперёд ${this.args.forward}`, 'func': this.forward, 'len': 1, 'name': 'forward'},
                    {'text': `назад ${this.args.backward}`, 'func': this.backward, 'len': 1, 'name': 'backward'},
                ];
                this.$emit('saveCommands', list);
            } else if (this.executor === 'aquarius') {
                let list = [
                    {'text': 'наполнить А', 'func': this.fillA},
                    {'text': 'наполнить В', 'func': this.fillB},
                    {'text': 'опустошить А', 'func': this.emptyA},
                    {'text': 'опустошить В', 'func': this.emptyB},
                    {'text': 'перелить из А в В', 'func': this.fromAtoB},
                    {'text': 'перелить из В в А', 'func': this.fromBtoA},
                ];
                this.$emit('saveCommands', list);
            }
        }
    },
    watch: {
        executor() {
            this.makeCommands();
        },
    },
    created() {
        this.makeCommands();
    },
    template: `
    <div class="commands-cont colomn-cont left-content">
        <h3>Команды</h3>
        <hr>
        <div class="colomn-cont">
            <button v-for="com in commands" :key=com.text @click=com.func(currentValue) class="btn-command">{{com.text}}</button>
            <div v-if="executor === 'grasshopper' && procedure" class="colomn-cont">
                <button class="btn-main make-procedure" @click="this.$emit('openModal', true)">Создать процедуру</button>
                <button class="btn-command" v-for="com in procedures" :key=com.text @click=com.func>{{com.text}}</button>
            </div>
        </div>
    </div>
    `
}