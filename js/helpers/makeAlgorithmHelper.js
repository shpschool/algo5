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

const formatWords = (num) => {
    let res = '';
    let residue = num % 10;
    if (num > 10 && num < 20 || residue === 0 || residue >= 5 && residue <= 9) {
        res = 'шагов';
    } else if (residue === 1) {
        res = 'шаг';
    } else {
        res = 'шага';
    }
    return res;
}

const get_solution = (t, start, a, b) => {
    let curr_val = start;
    let a_step = 0;
    let b_step = 0;
    while (curr_val !== t && (a_step < 2000 || b_step < 2000)) {
        if (curr_val < t) {
            a_step++;
            curr_val += a;
        } else if (curr_val > t) {
            b_step++;
            curr_val -= b;
        }
    }
    if (curr_val === t) {
        let res = `Решение для цели ${t}`
        res += `\nФормула: ${a}*${a_step} - ${b}*${b_step}`
        res += `\nВсего ${a_step + b_step} ${formatWords(a_step + b_step)}, ${a_step} ${formatWords(a_step)} вперёд, ${b_step} ${formatWords(b_step)} назад.`;
        return [a_step, b_step, res];
    } else {
        return [`\nРешение для цели ${t} не найдено`];
    }
}

const grasshopperAlgorithm = (params) => {
    let a = params.forward;
    let b = params.backward;
    let start = params.start;
    let targets = params.target;

    let res = get_solution(targets[0], start, a, b);
    let solution = '', a_steps = 0, b_steps = 0;
    if (res.length > 1) {
        a_steps = res[0];
        b_steps = res[1];
        solution = res[2];
    } else {
        solution = res[0];
    }
    for (let i = 1; i < targets.length; i++) {
        res = get_solution(targets[i], targets[i-1], a, b);
        if (res.length > 1) {
            a_steps += res[0];
            b_steps += res[1];
            solution += '\n\n' + res[2];
        } else {
            solution += '\n\n' + res[0];
        }
    }
    if (a_steps + b_steps !== 0 && targets.length > 1) {
        solution += `\n\nОбщее решение\nВсего ${a_steps + b_steps} ${formatWords(a_steps + b_steps)}, ${a_steps} ${formatWords(a_steps)} вперед, ${b_steps} ${formatWords(b_steps)} назад.`;
    }
    return solution;
}

export default {dividerAlgorithm, doublerAlgorithm, aquariusAlgorithm, grasshopperAlgorithm}