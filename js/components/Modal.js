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
    props: ['isActive', 'commands', 'procedures', 'args', 'currentValue', 'changeCurrentValue', 'addCommandToSolution', 'ch'],
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
        closeAndCleanModal() {
            this.$emit('closeModal');
            this.canClose = false;
            this.procedureName = '';
            this.modalCommands = [];
            this.modalSolution = [];
            this.modalDeleteArr = [];
            this.modalCurrentValue = 0;
            this.modalSolutionLength = 0;
            this.afterChange = false;
        },
        checkClose({ target: t }) {
            if (!t.closest('.modal')) this.canClose = true;
        },
        canCloseModal({ target: t }) {
            if (!t.closest('.modal') && this.canClose) {
                this.closeAndCleanModal();
            }
        },
        forward() {
            this.modalCurrentValue += this.args.forward;
            let thisCommand = this.modalCommands.find(el => el.name === 'forward');
            this.modalSolution.push({'text': thisCommand.text, 'value': this.modalCurrentValue, 'len': thisCommand.len});
            this.modalSolutionLength = this.ch.changeSolLen(this.modalSolution, 'grasshopper');
        },
        backward() {
            this.modalCurrentValue -= this.args.backward;
            let thisCommand = this.modalCommands.find(el => el.name === 'backward');
            this.modalSolution.push({'text': thisCommand.text, 'value': this.modalCurrentValue, 'len': thisCommand.len});
            this.modalSolutionLength = this.ch.changeSolLen(this.modalSolution, 'grasshopper');
        },
        clean() {
            this.modalSolution = [];
            this.modalDeleteArr = [];
            this.modalSolutionLength = this.ch.changeSolLen(this.modalSolution, 'grasshopper');
            this.modalCurrentValue = 0;
        },
        back() {
            let com = this.modalSolution.pop();
            if (com) {
                this.modalDeleteArr.push(com);
                this.modalSolutionLength = this.ch.changeSolLen(this.modalSolution, 'grasshopper');
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
                this.modalSolutionLength = this.ch.changeSolLen(this.modalSolution, 'grasshopper');
                this.modalCurrentValue = com.value;
            }
        },
        addCommandToModalSolution(com) {
            this.modalCurrentValue += com.value;
            this.modalSolution.push(com);
            this.modalSolutionLength = this.ch.changeSolLen(this.modalSolution, 'grasshopper');
        },
        makeProcedure() {
            if (this.procedureName) {
                let value = this.modalCurrentValue;
                let name = this.procedureName;
                let len = this.modalSolutionLength;
                let procedureSolution = this.ch.renderSolution(this.modalSolution);
                let command = {
                    'text': name, 'len': len,
                    'procedure': procedureSolution
                };
                let com = {
                    'text': name,
                    'len': len,
                    'func': () => {
                        if (this.isActive === true) {
                            command.value = value;
                            this.addCommandToModalSolution(command);
                        } else {
                            let newValue = this.currentValue + value;
                            this.changeCurrentValue(newValue);
                            this.addCommandToSolution(command);
                        }
                    },
                    'procedure': procedureSolution
                };
                this.$emit('addProcedure', com);
                this.closeAndCleanModal();
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
                    <span class="command" v-for="(com, index) in ch.renderSolution(modalSolution)" :key=index>{{com}}</span>
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