/**
 * Расчет длины решения
 * @param solutionArr - список команд, используемых в решении
 * @param exec - код исполнителя задачи (строка)
 * @returns число - длина решения
 */

const changeSolLen = (solutionArr, exec) => {
    let len = 0;
    if (exec === 'grasshopper') {
        let solutionLen = 0;
        for (let i=0; i < solutionArr.length; i++) {
            let com = solutionArr[i];
            solutionLen += com.len;
        }
        len = solutionLen;
    } else len = solutionArr.length;
    return len;
}

/**
 * Изменение формата отображения текущего значения жидкости в емкости
 * @param volume - объем емкости 
 * @param value - текущее значение жидкости в емкости
 * @returns форматированная строка текущего значения жидкости в емкости
 */
const formatVolume = (volume, value) => {
    let padNum = 1;
    if (volume >= 10) padNum = 2;
    if (volume >= 100) padNum = 3;
    let currVal = value.toString().padStart(padNum);
    return currVal;
}

/**
 * Создание новой команды для списка решения задачи
 * @param command - текст отображаемой команды
 * @param exec - исполнитель задачи
 * @param isTarget - функция для проверки текущего значения в задаче, является ли оно целью задачи
 * @param currValue - текущее значение задачи
 * @param currA - текущее значение жидкости в емкости А
 * @param currB - текущее значение жидкости в емкости В
 * @param volA - объем емкости А
 * @param volB - объем емкости В
 * @returns объект новой команды, которую добавлят в список команд решения
 */
const createNewCommand = (command, exec, isTarget=null, currValue=null, currA=null, currB=null, volA=null, volB=null) => {
    let newCommand;
    if (exec === 'aquarius') {
        command += isTarget(currA, 'A');
        command += isTarget(currB, 'B');
        let currentA = formatVolume(volA, currA);
        let currentB = formatVolume(volB, currB);
        newCommand = {'text': `A = ${currentA}, B = ${currentB} | ${command}`, 'valueA': currA, 'valueB': currB};
    } else if (exec === 'grasshopper') {
        let win = isTarget(currValue);
        newCommand = {'text': command.text, 'value': currValue, 'len': command.len, 'win': win};
        if (command.procedure) {
            newCommand.procedure = command.procedure;
        }
    } else {
        newCommand = {'prevValue': command[0], 'command': command[1], 'value': currValue};
    }
    return newCommand;
}

/**
 * Добавление количества повторений команд для Удвоителя, Поделителя и Кузнечика,
 * а также добавление надписи с полученным результатом
 * @param solution - список команд для решения
 * @returns форматированный список команд решения
 */
const renderSolution = (solution) => {
    let arr = [];
    let repeatCom = 1;
    let savedValue;
    for (let i=0; i < solution.length; i++) {
        let com = solution[i];
        let text = com.text;
        if (!text) {
            let prevCom = solution[i-1];
            if (prevCom && prevCom.command === com.command) {
                repeatCom++;
                if (repeatCom === 2) {
                    savedValue = prevCom.prevValue;
                }
                text = `${savedValue}${com.command} (x${repeatCom}) -> ${com.value}`;
            } else {
                repeatCom = 1;
                text = `${com.prevValue}${com.command} -> ${com.value}`;
            }
        } else if (com.value !== undefined) {
            let prevCom = solution[i-1];
            if (prevCom && prevCom.text === com.text && !prevCom.win) {
                repeatCom++;
                text += ` (x${repeatCom})`;
            } else {
                repeatCom = 1;
            }
            if (com.win) {
                text += com.win;
            }
        }
        if (repeatCom === 1) {
            arr.push(text);
        } else {
            arr[arr.length - 1] = text;
        } 
    }
    return arr;
}

/**
 * Создание html-элемента для отображения созданной процедуры
 * @param com - объект процедуры, добавленной в список команд
 * @returns html-элемент с необходимым форматом отображения процедуры
 */
const createProcedureNode = (com) => {
    let node = document.createElement('div');
    node.className = 'command';
    node.id = 'p' + com.id;
    let procedureText = `<span class="operator">процедура ${com.text}\nначало процедуры</span>\n${com.procedure.join('\n')}\n<span class="operator">конец процедуры</span>\n\n`;
    node.innerHTML = procedureText;
    return node;
}

/**
 * Рекурсивная функция поиска процедур, используемых в других процедурах
 * @param prArray - список процедур для проверки
 * @param procedures - список созданных процедур
 * @returns список процедур, которые были использованы в других процедурах 
 */
const findProcedureInProcedures = (prArray, procedures) => {
    if (prArray.length < 1) {
        return prArray;
    } else {
        let usedInProcedures = [];
        prArray.forEach(pr => {
            procedures.forEach(el => {
                let isUsed = el.procedure.find(c => c.includes(pr.text));
                if (isUsed) usedInProcedures.push(el);
            });
        });
        return usedInProcedures.concat(findProcedureInProcedures(usedInProcedures, procedures));
    }
}

/**
 * Поиск процедур в решении задачи
 * @param prArray - список процедур для проверки
 * @param solution - список команд, используемых в решении задачи
 * @returns булевое значение, обозначающее, найдена ли хоть одна процедура из списка в решении
 */
const findProcedureInSolution = (prArray, solution) => {
    for (let el of prArray) {
        let isUsed = solution.find(c => c.text === el.text);
        if (isUsed) return true;
    };
    return false;
}

export default {changeSolLen, createNewCommand, renderSolution, createProcedureNode, findProcedureInProcedures, findProcedureInSolution};