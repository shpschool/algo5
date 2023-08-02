const { createApp } = Vue;
import Header from './components/Header.js';
import Task from './components/Task.js';
import Commands from './components/Commands.js';
import SolutionCont from './components/SolutionCont.js';
import DoublerDivider from './components/taskVisual/DoublerDivider.js';
import Aquarius from './components/taskVisual/Aquarius.js';
import Grasshopper from './components/taskVisual/Grasshopper.js';
import Modal from './components/Modal.js';

createApp({
    data() {
        return {
            task: 0,
            lessonData: [],
            maxTask: 0,
            minTask: 0,
            executor: '',
            title: '',
            taskText: [],
            taskTitle: '',
            taskParams: {},
            args: {},
            procedures: [],
            commands: [],
            currentValue: 0,
            volumeA: 0,
            volumeB: 0,
            currVolumeA: 0,
            currVolumeB: 0,
            doneA: false,
            doneB: false,
            min: 0,
            max: 0,
            isActive: false,
            receivedValues: [],
            verifCode: {},
            points: 0,
            solution: [],
            solutionLength: 0, 
            deleteArr: [],
            show: false,
            orientation: '',
            mobile: false,
        }
    },
    watch: {
        currVolumeA() {
            if (this.taskParams.target.find(el => el === this.currVolumeA)) this.doneA = true;
            else this.doneA = false;
        },
        currVolumeB() {
            if (this.taskParams.target.find(el => el === this.currVolumeB)) this.doneB = true;
            else this.doneB = false;
        },
    },
    methods: {
        modalActive(state) {
            this.isActive = state;
        },
        saveCommands(list) {
            this.commands = list;
        },
        addProcedure(com) {
            this.procedures.push(com);
        },
        changeCurrentValue(value) {
            this.currentValue = value;
        },
        changeVolumeA(value) {
            this.currVolumeA = value;
        },
        changeVolumeB(value) {
            this.currVolumeB = value;
        },
        changeSolLen() {
            if (this.executor === 'grasshopper') {
                let solutionLen = 0;
                for (let i=0; i< this.solution.length; i++) {
                    let com = this.solution[i];
                    solutionLen += com.len;
                }
                this.solutionLength = solutionLen;
            } else this.solutionLength = this.solution.length;
        },
        isTarget(value, volume='') {
            let command = '';
            if (this.taskParams.target.find(el => el === value)) {
                if (!(this.receivedValues.find(el => el === value))) {
                    if (volume) {
                        command = ` -> получено ${value} л. в емкости ${volume}`;
                    } else {
                        command = ` -> достигнута точка ${value}`;
                    }
                    this.receivedValues.push(value);
                }
            }
            return command;
        },
        addCommandToSolution(command) {
            if (this.executor === 'doubler' || this.executor === 'divider') {
                this.solution.push({'text': command + ' -> ' + this.currentValue, 'value': this.currentValue});
            } else if (this.executor === 'aquarius') {
                command += this.isTarget(this.currVolumeA, 'A');
                command += this.isTarget(this.currVolumeB, 'B');
                this.solution.push({'text': command, 'valueA': this.currVolumeA, 'valueB': this.currVolumeB});
            } else if (this.executor === 'grasshopper') {
                command.text += this.isTarget(this.currentValue);
                this.solution.push({'text': command.text, 'value': this.currentValue, 'len': command.len})
            }
            this.changeSolLen();
            this.deleteArr = [];
        },
        // для компонента "Решение"
        clean() {
            this.solution = [];
            this.deleteArr = [];
            this.changeSolLen();
            this.show = false;
            this.currentValue = this.taskParams.start;
            this.currVolumeA = this.taskParams.start_volumeA;
            this.currVolumeB = this.taskParams.start_volumeB;
            this.receivedValues = [];
            this.doneA = false;
            this.doneB = false;
        },
        popValue(value) {
            if (value === this.receivedValues[this.receivedValues.length - 1]) {
                this.receivedValues.pop();
            }
        },
        back() {
            let com = this.solution.pop();
            if (com) {
                this.changeSolLen();
                this.deleteArr.push(com);
                this.popValue(com.value);
                this.popValue(com.valueA);
                this.popValue(com.valueB);
                let el = this.solution[this.solution.length - 1];
                if (el) {
                    this.currentValue = el.value;
                    this.currVolumeA = el.valueA;
                    this.currVolumeB = el.valueB;
                }
                else {
                    this.currentValue = this.taskParams.start;
                    this.currVolumeA = this.taskParams.start_volumeA;
                    this.currVolumeB = this.taskParams.start_volumeB;
                }
                
            }
        },
        pushValue(value) {
            if (this.taskParams.target.find(el => el === value)) {
                this.receivedValues.push(value);
            }
        },
        repeat() {
            let com = this.deleteArr.pop();
            if (com) {
                this.solution.push(com);
                this.changeSolLen();
                this.currentValue = com.value;
                this.currVolumeA = com.valueA;
                this.currVolumeB = com.valueB;
                this.pushValue(com.value);
                this.pushValue(com.valueA);
                this.pushValue(com.valueB);
            }
        },
        checkAquaTargets() {
            let numberOfTargets = 0;
            for (let i=0; i < this.taskParams.target.length; i++) {
                if (this.receivedValues.find(el => el === this.taskParams.target[i]))
                    numberOfTargets++;
            }
            return numberOfTargets;
        },
        checkHopperTargets() {
            if (this.receivedValues.length !== this.taskParams.target.length) {
                return false;
            }
            for (let i=0; i < this.taskParams.target.length; i++) {
                if (this.receivedValues[i] !== this.taskParams.target[i]) {
                    return false;
                }
            }
            return true;
        },
        checkSolution() {
            let currPoints = 0;
            if (this.executor === 'doubler' || this.executor === 'divider') {
                if (this.currentValue === this.taskParams.end) {
                    currPoints += 75;
                    if (this.taskParams.steps >= this.solutionLength) currPoints += 25;
                }
            } else if (this.executor === 'aquarius') {
                let n = this.checkAquaTargets();
                if (n === this.taskParams.target.length) {
                    currPoints += 75;
                    if (this.taskParams.steps >= this.solutionLength) currPoints += 25;
                }
            } else if (this.executor === 'grasshopper') {
                if (this.checkHopperTargets()) {
                    currPoints += 75;
                    if (this.taskParams.steps >= this.solutionLength) currPoints += 25;
                }
            }
            this.points = currPoints;
            this.show = true;
        },
        changeRender() {
            let width = screen.availWidth;
            let heigth = screen.availHeight;
            const app = document.querySelector('#app');
            if (width <= 850 || heigth <= 500) {
                app.classList.add('mobile');
                this.mobile = true;
            } else {
                app.classList.remove('mobile');
                this.mobile = false;
            }
        },
    },
    async created() {
        let path = new URL(document.location);
        let les = path.searchParams.get('lesson');
        this.lessonData = await fetch(`db/lesson${les}.json`).then(res => res.json());
        let level = Number(path.searchParams.get('level'));
        let thisLevel = this.lessonData.find(el => el.level === level);
        let thisData = thisLevel.tasks;
        this.minTask = thisData[0].task;
        this.maxTask = thisData[thisData.length - 1].task;
        this.task = Number(path.searchParams.get('task'));
        let thisTask = thisData.find(el => el.task === this.task);
        this.executor = thisTask.executor;
        this.taskTitle = thisTask.task_title;
        this.taskText = thisTask.task_text;
        this.verifCode = thisTask.verif_code;
        this.taskParams = thisTask.params;
        if (this.executor === 'doubler') {
            this.title = 'Удвоитель';
            this.args = {'plus': this.taskParams.plus, 'multi': this.taskParams.multi};
            this.currentValue = this.taskParams.start;
        }
        else if (this.executor === 'divider') {
            this.title = 'Поделитель';
            this.args = {'minus': this.taskParams.minus, 'divide': this.taskParams.divide};
            this.currentValue = this.taskParams.start;
        }
        else if (this.executor === 'aquarius') {
            this.title = 'Водолей';
            this.volumeA = this.taskParams.volumeA;
            this.volumeB = this.taskParams.volumeB;
            this.currVolumeA = this.taskParams.start_volumeA;
            this.currVolumeB = this.taskParams.start_volumeB;
        }
        else if (this.executor === 'grasshopper') {
            this.title = 'Кузнечик';
            this.args = {'forward': this.taskParams.forward, 'backward': this.taskParams.backward,
                        'max': this.taskParams.max, 'min': this.taskParams.min};
            this.currentValue = this.taskParams.start;
            this.min = this.taskParams.min;
            this.max = this.taskParams.max;
        }
        this.changeRender();
        window.addEventListener('resize', this.changeRender);
    },
    components: {Header, Task, Commands, SolutionCont, DoublerDivider, Aquarius, Grasshopper, Modal},
    template: `
    <Header :title=title />
    <div v-if="mobile && executor!=='grasshopper'" class="content colomn-cont">
        <Task
        :taskTitle=taskTitle
        :taskText=taskText
        :max="maxTask"
        :min="minTask" />
        <div class="inline-cont bottom-content">
            <DoublerDivider 
                v-if="executor==='doubler' || executor==='divider'"
                :start=taskParams.start
                :end=taskParams.end
                :currentValue=currentValue />
            <Aquarius 
                v-if="executor==='aquarius'"
                :volumeA=volumeA
                :volumeB=volumeB
                :currVolumeA=currVolumeA
                :currVolumeB=currVolumeB
                :doneA=doneA
                :doneB=doneB />
            <Commands
                :executor=executor
                :args=args
                :volumeA=volumeA
                :volumeB=volumeB
                :currVolumeA=currVolumeA
                :currVolumeB=currVolumeB
                :currentValue=currentValue
                :procedure=taskParams.procedure
                :commands=commands
                :procedures=procedures
                @open-modal=modalActive
                @save-commands=saveCommands
                @add-command-to-solution="addCommandToSolution"
                @change-current-value="changeCurrentValue"
                @change-volume-a="changeVolumeA"
                @change-volume-b="changeVolumeB" />
        </div>
        <SolutionCont
            class="bottom-content"
            :solution=solution
            :solutionLength=solutionLength
            :verifCode=verifCode
            :points=points
            :checkSolution=checkSolution
            :show=show
            :clean=clean
            :back=back
            :repeat=repeat />
    </div>
    <div v-else class="content colomn-cont">
        <div class="top-content" :class="{colomn: executor==='grasshopper'}">
            <DoublerDivider 
                v-if="executor==='doubler' || executor==='divider'"
                :start=taskParams.start
                :end=taskParams.end
                :currentValue=currentValue />
            <Aquarius 
                v-if="executor==='aquarius'"
                :volumeA=volumeA
                :volumeB=volumeB
                :currVolumeA=currVolumeA
                :currVolumeB=currVolumeB
                :doneA=doneA
                :doneB=doneB />
            <Task
                :taskTitle=taskTitle
                :taskText=taskText
                :max="maxTask"
                :min="minTask" />
            <Grasshopper
                v-if="executor==='grasshopper'"
                :start=taskParams.start
                :currentValue=currentValue
                :min=min
                :max=max />
            <Modal
                v-if="executor==='grasshopper' && taskParams.procedure"
                :isActive=isActive
                :commands=commands
                :procedures=procedures
                :args=args
                :currentValue=currentValue
                @close-modal=modalActive
                :addCommandToSolution="addCommandToSolution"
                :changeCurrentValue="changeCurrentValue"
                @add-procedure=addProcedure />
        </div>
        <div class="bottom-content">
            <Commands
                :executor=executor
                :args=args
                :volumeA=volumeA
                :volumeB=volumeB
                :currVolumeA=currVolumeA
                :currVolumeB=currVolumeB
                :currentValue=currentValue
                :procedure=taskParams.procedure
                :commands=commands
                :procedures=procedures
                @open-modal=modalActive
                @save-commands=saveCommands
                @add-command-to-solution="addCommandToSolution"
                @change-current-value="changeCurrentValue"
                @change-volume-a="changeVolumeA"
                @change-volume-b="changeVolumeB" />
            <SolutionCont
                :solution=solution
                :solutionLength=solutionLength
                :verifCode=verifCode
                :points=points
                :checkSolution=checkSolution
                :show=show
                :clean=clean
                :back=back
                :repeat=repeat />
        </div>
    </div>
    `
}).mount('#app')