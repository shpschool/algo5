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
const formatVolume = (volume, value) => {
    let padNum = 1;
    if (volume >= 10) padNum = 2;
    if (volume >= 100) padNum = 3;
    let currVal = value.toString().padStart(padNum);
    return currVal;
}
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
    } else {
        newCommand = {'prevValue': command[0], 'command': command[1], 'value': currValue};
    }
    return newCommand;
}

export default {changeSolLen, createNewCommand};