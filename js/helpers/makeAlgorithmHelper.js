const dividerAlgorithm = (params) => {
    let divCommands = [];
    let x = params.start;
    let a = params.end;
    while (x > a) {
        if (x % 2 == 0 && x / 2 >= a) {
            x /= 2;
            divCommands.push(":2");
        } else {
            x -= 1;
            divCommands.push("-1");
        }
    }
    return divCommands.join(" ");
}

const doublerAlgorithm = (params) => {
    let doubCommands = [];
    let x = params.end;
    let a = params.start;
    while (x > a) {
        if (x % 2 == 0 && x / 2 >= a) {
            x /= 2;
            doubCommands.unshift("x2");
        } else {
            x -= 1;
            doubCommands.unshift("+1");
        }
    }
    return doubCommands.join(" ");
}

const formatVolume = (volume, value) => {
    let padNum = 1;
    if (volume >= 10) padNum = 2;
    if (volume >= 100) padNum = 3;
    let currVal = value.toString().padStart(padNum);
    return currVal;
}

const aquariusAlgorithm = (params) => {
    let solutions = [];
    let a = params.volumeA;
    let b = params.volumeB;
    let aStart = params.start_volumeA;
    let bStart = params.start_volumeB;
    let goals = params.target.sort();
    for (let i = 0; i < 2; i++) {
        let solution = [];
        let goalsCheck = [];
        goals.forEach(() => goalsCheck.push(0));
        let c = a;
        a = b, b = c;
        let cStart = aStart;
        aStart = bStart, bStart = cStart;
        let A = aStart, B = bStart, steps = 0, x;
        while (goalsCheck.includes(0)) {
            steps += 1
            if (A === 0) {
                A = a
                if (a === params.volumeA) solution.push(`${steps.toString().padStart(3)}. A = ${formatVolume(a, A)}, B = ${formatVolume(b, B)} | наполнить А`);
                if (a === params.volumeB) solution.push(`${steps.toString().padStart(3)}. A = ${formatVolume(b, B)}, B = ${formatVolume(a, A)} | наполнить B`);
            } else if (B !== b) {
                if (b - B > 0 && b - B <= A) {
                    x = b - B;
                } else {
                    x = A
                }
                B += x;
                A -= x;
                if (a === params.volumeA) solution.push(`${steps.toString().padStart(3)}. A = ${formatVolume(a, A)}, B = ${formatVolume(b, B)} | перелить из А в В`);
                if (a === params.volumeB) solution.push(`${steps.toString().padStart(3)}. A = ${formatVolume(b, B)}, B = ${formatVolume(a, A)} | перелить из B в A`);
            } else if (B === b) {
                B = 0;
                if (a === params.volumeA) solution.push(`${steps.toString().padStart(3)}. A = ${formatVolume(a, A)}, B = ${formatVolume(b, B)} | опустошить В`);
                if (a === params.volumeB) solution.push(`${steps.toString().padStart(3)}. A = ${formatVolume(b, B)}, B = ${formatVolume(a, A)} | опустошить A`);
            }
            if (goals.includes(A) && !goalsCheck.includes(A)) {
                goalsCheck[goals.indexOf(A)] = A;
            } else if (goals.includes(B) && !goalsCheck.includes(B)) {
                goalsCheck[goals.indexOf(B)] = B;
            }
        }
        solutions.push({"steps": steps, "solution": solution});
    }
    if (solutions[0].steps < solutions[1].steps) {
        return solutions[0].solution.join('\n');
    } else {
        return solutions[1].solution.join('\n');
    }
}

export default {dividerAlgorithm, doublerAlgorithm, aquariusAlgorithm}