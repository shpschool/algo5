/**
 * Главный компонент по отрисовке исполнителей
 */

import Header from './components/Header.js';
import Task from './components/Task.js';
import Commands from './components/Commands.js';
import SolutionCont from './components/SolutionCont.js';
import DoublerDivider from './components/taskVisual/DoublerDivider.js';
import Aquarius from './components/taskVisual/Aquarius.js';
import Grasshopper from './components/taskVisual/Grasshopper.js';
import Modal from './components/Modal.js';
import commandHelper from './helpers/commandHelper.js';

export default {
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
            usedProcedures: [],
        }
    },
    props: ['ch'],
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
        pushValue(value) {
            if (this.taskParams.target && this.taskParams.target.find(el => el === value) && !(this.receivedValues.find(el => el.value === value))) {
                this.receivedValues.push({'value': value, 'number': this.solutionLength});
                console.log('received values array: ', this.receivedValues);
                return true;
            }
            return false;
        },
        isTarget(value, volume='') {
            let command = '';
            let target = this.pushValue(value);
            console.log(`${volume ? 'volume ' + volume + ' is target:' : 'value is target:'} ${target}`);
            if (target) {
                if (volume) {
                    command = ` -> получено ${value} л. в емкости ${volume}`;
                } else {
                    command = ` -> достигнута точка ${value}`;
                }
            }
            return command;
        },
        addUsedProcedure(command) {
            if (command.procedure) {
                const node = document.getElementById('procedure-field');
                let procedure = this.usedProcedures.find(el => el.procedure === command.text);
                if (!procedure) {
                    let field = this.ch.createProcedureNode(command);
                    this.usedProcedures.push({'procedure': command.text, 'number': this.solutionLength});
                    node.append(field);
                } 
            }
        },
        addCommandToSolution(command) {
            let newCom = this.ch.createNewCommand(
                command, this.executor, this.isTarget, this.currentValue, this.currVolumeA, this.currVolumeB, this.volumeA, this.volumeB
            );
            console.log(newCom);
            this.addUsedProcedure(command);
            this.solution.push(newCom);
            this.solutionLength = this.ch.changeSolLen(this.solution, this.executor);
            this.deleteArr = [];
        },
        // для компонента "Решение"
        clean() {
            this.solution = [];
            this.deleteArr = [];
            this.solutionLength = this.ch.changeSolLen(this.solution, this.executor);
            this.show = false;
            this.currentValue = this.taskParams.start;
            this.currVolumeA = this.taskParams.start_volumeA;
            this.currVolumeB = this.taskParams.start_volumeB;
            this.receivedValues = [];
            this.usedProcedures = [];
            document.getElementById('procedure-field').innerHTML = '';
        },
        popValue(value) {
            let lastValue = this.receivedValues[this.receivedValues.length - 1];
            if (lastValue && value === lastValue.value && lastValue.number === this.solutionLength) {
                let res = this.receivedValues.pop();
                console.log('poped value: ', res);
                console.log('received values array: ', this.receivedValues);
            }
        },
        removeProcedure(com) {
            let procedure = this.usedProcedures.find(el => el.procedure === com.text);
            if (procedure && procedure.number === this.solutionLength) {
                let index = this.usedProcedures.indexOf(procedure);
                this.usedProcedures.splice(index, 1);
                let parent = document.getElementById('procedure-field');
                let procedureNode = parent.querySelector('#p'+com.text);
                procedureNode.remove();
            }
        },
        back() {
            let com = this.solution.pop();
            if (com) {
                this.solutionLength = this.ch.changeSolLen(this.solution, this.executor);
                this.deleteArr.push(com);
                console.log('delete array: ', this.deleteArr);
                console.log('try to pop received value');
                this.popValue(com.value);
                this.popValue(com.valueA);
                this.popValue(com.valueB);
                this.removeProcedure(com);
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
        repeat() {
            let com = this.deleteArr.pop();
            console.log('delete array: ', this.deleteArr);
            if (com) {
                this.solution.push(com);
                console.log('repeat command: ', com);
                this.addUsedProcedure(com);
                this.solutionLength = this.ch.changeSolLen(this.solution, this.executor);
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
                if (this.receivedValues.find(el => el.value === this.taskParams.target[i]))
                    numberOfTargets++;
            }
            return numberOfTargets;
        },
        checkHopperTargets() {
            if (this.receivedValues.length !== this.taskParams.target.length) {
                return false;
            }
            for (let i=0; i < this.taskParams.target.length; i++) {
                if (this.receivedValues[i].value !== this.taskParams.target[i]) {
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
            this.args = {'forward': this.taskParams.forward, 'backward': this.taskParams.backward};
            this.currentValue = this.taskParams.start;
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
                :taskParams=taskParams />
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
            :repeat=repeat
            :renderSolution=ch.renderSolution />
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
                :taskParams=taskParams />
            <Task
                :taskTitle=taskTitle
                :taskText=taskText
                :max="maxTask"
                :min="minTask" />
            <Grasshopper
                v-if="executor==='grasshopper'"
                :currentValue=currentValue />
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
                @add-procedure=addProcedure
                :ch=ch />
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
                :repeat=repeat
                :renderSolution=ch.renderSolution />
        </div>
    </div>
    `
}