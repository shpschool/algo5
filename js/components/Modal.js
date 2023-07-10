export default {
    data() {
        return {
            procedureName: '',
            canClose: false,
            modalCommands: [],
            modalSolution: [],
            modalDeleteArr: [],
            modalCurrentValue: 0,
            modalSolutionLength: 0,
            afterChange: false,
        }
    },
    props: ['isActive', 'commands', 'procedures', 'args', 'currentValue', 'changeCurrentValue', 'addCommandToSolution'],
    emits: ['closeModal', 'addProcedure'],
    watch: {
        isActive() {
            if (this.isActive === true) {
                this.commands.forEach(el => this.modalCommands.push({
                    'text': el.text,
                    'len': el.len,
                    'name': el.name
                }));
                this.procedures.forEach(el => this.modalCommands.push({
                    'text': el.text,
                    'len': el.len,
                    'func': el.func
                }));
                let thisCommand = this.modalCommands.find(el => el.name === 'forward');
                thisCommand.func = this.forward;
                thisCommand = this.modalCommands.find(el => el.name === 'backward');
                thisCommand.func = this.backward;
            }
        },
        procedureName() {
            if (this.isActive === true) {
                this.afterChange = true;
            } else {
                this.afterChange = false;
            }
        }
    },
    methods: {
        checkClose({ target: t }) {
            if (!t.closest('.modal')) this.canClose = true;
        },
        canCloseModal({ target: t }) {
            if (!t.closest('.modal') && this.canClose) {
                this.$emit('closeModal');
                this.procedureName = '';
                this.modalCommands = [];
                this.modalSolution = [];
                this.modalDeleteArr = [];
                this.modalCurrentValue = 0;
                this.modalSolutionLength = 0;
                this.afterChange = false;
            }
        },
        changeSolLength() {
            let solutionLen = 0;
            for (let i=0; i< this.modalSolution.length; i++) {
                let com = this.modalSolution[i];
                solutionLen += com.len;
            }
            this.modalSolutionLength = solutionLen;
        },
        forward() {
            this.modalCurrentValue += this.args.forward;
            let thisCommand = this.modalCommands.find(el => el.name === 'forward');
            this.modalSolution.push({'text': thisCommand.text, 'value': this.modalCurrentValue, 'len': thisCommand.len});
            this.changeSolLength();
        },
        backward() {
            this.modalCurrentValue -= this.args.backward;
            let thisCommand = this.modalCommands.find(el => el.name === 'backward');
            this.modalSolution.push({'text': thisCommand.text, 'value': this.modalCurrentValue, 'len': thisCommand.len});
            this.changeSolLength();
        },
        clean() {
            this.modalSolution = [];
            this.modalDeleteArr = [];
            this.changeSolLength();
            this.modalCurrentValue = 0;
        },
        back() {
            let com = this.modalSolution.pop();
            if (com) {
                this.modalDeleteArr.push(com);
                this.changeSolLength();
                let el = this.modalSolution[this.modalSolution.length - 1];
                if (el) {
                    this.modalCurrentValue = el.value;
                }
                else {
                    this.modalCurrentValue = 0;
                }
            }
        },
        repeat() {
            let com = this.modalDeleteArr.pop();
            if (com) {
                this.modalSolution.push(com);
                this.changeSolLength();
                this.modalCurrentValue = com.value;
            }
        },
        makeProcedure() {
            if (this.procedureName) {
                let value = this.modalCurrentValue;
                let name = this.procedureName;
                let len = this.modalSolutionLength;
                let com = {
                    'text': name,
                    'len': len,
                    'func': () => {
                        if (this.isActive === true) {
                            this.modalCurrentValue += value;
                            this.modalSolution.push({'text': name, 'value': this.modalCurrentValue, 'len': len});
                            this.changeSolLength();
                        } else {
                            let newValue = this.currentValue + value;
                            if (this.args.min <= newValue <= this.args.max) {
                                this.changeCurrentValue(newValue);
                                this.addCommandToSolution({'text': name, 'len': len});
                            }
                        }
                    }
                };
                this.$emit('addProcedure', com);
                this.$emit('closeModal');
                this.canClose = false;
                this.procedureName = '';
                this.modalCommands = [];
                this.modalSolution = [];
                this.modalDeleteArr = [];
                this.modalCurrentValue = 0;
                this.modalSolutionLength = 0;
                this.afterChange = false;
            } else this.afterChange = true;
        },
    },
    template: `
    <div class="modal-wrap" :class="{show: isActive}"
        @mousedown="checkClose"
        @mouseup="canCloseModal" >
        <div class="modal">
            <div class="commands-cont colomn-cont left-content">
                <h3>Команды</h3>
                <hr>
                <div class="colomn-cont">
                    <button v-for="com in modalCommands" :key=com.text @click=com.func class="btn-command">{{com.text}}</button>
                </div>
            </div>
            <div class="solution-cont colomn-cont right-content">
                <div class="solution-head inline-cont">
                    <h3>Создание процедуры</h3>
                    <div class="btn-sol-cont inline-cont">
                        <button class="btn-sol" @click="back"><img src="assets/back.png" class="arrow"></button>
                        <button class="btn-sol" @click="repeat"><img src="assets/repeat.png" class="arrow"></button>
                        <button class="btn-sol" @click="clean">Сбросить</button>
                    </div>
                </div>
                <hr>
                <div class="procedure-name-cont">
                    <h4>Название процедуры:</h4>
                    <input
                        v-model="procedureName"
                        class="name-input"
                        :class="{afterChange: afterChange}"
                        placeholder="Введи название процедуры"
                        maxlength="30"
                        required>
                </div>
                <div class="solution-field">
                    <span class="command" v-for="(com, index) in modalSolution" :key=index>{{com.text}}</span>
                </div>
                <div class="modal-btn-cont inline-cont">
                    <span>
                        Сумма шагов: {{modalCurrentValue}}
                        <br>
                        Количество шагов: {{modalSolutionLength}}
                    </span>
                    <button class="btn-main" @click="makeProcedure">Создать процедуру</button>
                </div>
            </div>
        </div>
    </div>
    `
}