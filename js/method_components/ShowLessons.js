import "https://cdn.jsdelivr.net/npm/xlsx-js-style@1.2.0/dist/xlsx.min.js";

const styling = {
    headerStyle: {
        font: { bold: true, name: "Arial", sz: "10"},
        alignment: {vertical: "center", horizontal: "center", wrapText: true},
        border: { bottom: { style: 'thin', color: { rgb: '00000000' } } },
    },
    cellStyle: {
        font: {name: "Arial", sz: "10"},
        alignment: {vertical: "center", wrapText: true}
    },
    vhCellStyle: {
        font: {name: "Arial", sz: "10"},
        alignment: {vertical: "center", horizontal: "center", wrapText: true}
    },
    lastCellStyle: {
        font: {name: "Arial", sz: "10"},
        alignment: {vertical: "center", wrapText: true},
        border: { bottom: { style: 'thin', color: { rgb: '00000000' } } },
    },
    lastCell2Style: {
        font: {name: "Arial", sz: "10"},
        alignment: {vertical: "center", horizontal: "center", wrapText: true},
        border: { bottom: { style: 'thin', color: { rgb: '00000000' } } },
    }
};

export default {
    data() {
        return {
            lessons: [],
        }
    },
    emits: ['back'],
    methods: {
        copy(button, lesson, level, task) {
            let link = `https://shpschool.github.io/algo5/?lesson=${lesson}&level=${level}&task=${task}`;
            navigator.clipboard.writeText(link)
                .then(() => {
                    button.textContent = 'Скопировано!'
                    setTimeout(() => {
                        button.textContent = 'Скопировать ссылку'
                    }, 3000);
                })
                .catch(err => {
                    console.log('Something went wrong: ', err);
                });
        },
        showToggle(header) {
            header.closest('.accordion-item').classList.toggle('show');
        },
        styleSheet(sheet, len) {
            for (let i = 0; i < 6; i++) {
                sheet[XLSX.utils.encode_cell({r:0, c:i})].s = styling.headerStyle;
            }
            sheet["!rows"] = [{}];
            for (let row = 1; row < len; row++) {
                sheet["!rows"].push({hpt: 25})
                for (let i = 0; i < 6; i++) {
                    if (row % 3 === 0) {
                        if (i === 2) {
                            sheet[XLSX.utils.encode_cell({r:row, c:i})].s = styling.lastCell2Style;
                        } else {
                            sheet[XLSX.utils.encode_cell({r:row, c:i})].s = styling.lastCellStyle;
                        }
                    } else if (i === 2 || i === 5) {
                        sheet[XLSX.utils.encode_cell({r:row, c:i})].s = styling.vhCellStyle;
                    } else {
                        sheet[XLSX.utils.encode_cell({r:row, c:i})].s = styling.cellStyle;
                    } 
                }
            }
            sheet["!cols"] = [{wch: 3}, {}, {wch: 10}, {wch: 22}, {wch: 22}, {wch: 10}];
        },
        mergeCells(len) {
            let merge = [];
            let cols = [0, 1, 4, 5];
            for (let row = 1; row < len; row += 3) {
                for (let i = 0; i < cols.length; i++) {
                    merge.push({
                        s: {r: row, c: cols[i]},
                        e: {r: row + 2, c: cols[i]}
                    });
                }
            }
            return merge;
        },
        makeAlgorithm(exec, params) {
            if (exec === "divider") {
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
            } else if (exec === "doubler") {
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
            } else if (exec === "aquarius") {
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
                            if (a === params.volumeA) solution.push(`${steps}. A = ${A}, B = ${B} | наполнить А`);
                            if (a === params.volumeB) solution.push(`${steps}. A = ${B}, B = ${A} | наполнить B`);
                        } else if (B !== b) {
                            if (b - B > 0 && b - B <= A) {
                                x = b - B;
                            } else {
                                x = A
                            }
                            B += x;
                            A -= x;
                            if (a === params.volumeA) solution.push(`${steps}. A = ${A}, B = ${B} | перелить из А в В`);
                            if (a === params.volumeB) solution.push(`${steps}. A = ${B}, B = ${A} | перелить из B в A`);
                        } else if (B === b) {
                            B = 0;
                            if (a === params.volumeA) solution.push(`${steps}. A = ${A}, B = ${B} | опустошить В`);
                            if (a === params.volumeB) solution.push(`${steps}. A = ${B}, B = ${A} | опустошить A`);
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
            return "";
        },
        async downloadExcel(lesson, ind) {
            let book = [["№", "Название", "Вариант", "Код", "Алгоритм", "Шагов"]];
            let num = 1;
            for (let i = 0; i < lesson.length; i++) {
                let tasks = lesson[i].tasks;
                for (let j = 0; j < tasks.length; j++) {
                    let task = tasks[j];
                    let codes = task.verif_code;
                    let algo = this.makeAlgorithm(task.executor, task.params);
                    book.push([num, task.task_title, "ошиб.", codes["0"], algo, task.params.steps]);
                    book.push(["", "", "неопт.", codes["75"], "", ""]);
                    book.push(["", "", "опт.", codes["100"], "", ""]);
                    num++;
                }
            }
            let worksheet = XLSX.utils.aoa_to_sheet(book);
            worksheet["!merges"] = this.mergeCells(book.length);
            this.styleSheet(worksheet, book.length);
            let workbook = XLSX.utils.book_new();
            workbook.SheetNames.push("Коды");
            workbook.Sheets["Коды"] = worksheet;
            XLSX.writeFile(workbook, `lesson${ind}.xlsx`);
        },
    },
    async created() {
        let ind = 1;
        let lesson = await fetch(`db/lesson${ind}.json`).then(res => res.json());
        while (lesson) {
                this.lessons.push(lesson);
                ind++;
            try {
                lesson = await fetch(`db/lesson${ind}.json`).then(res => res.json());
            } catch (e) {
                console.log('Занятия закончились');
                lesson = null;
            }
        }
    },
    template: `
    <h1>Просмотр занятий</h1>
    <a @click="$emit('back')" class="btn-back">На главную</a>
    <div class="accordion">
        <div v-for="(lesson, ind) in lessons" class="accordion-item">
            <div class="accordion-header" @click="showToggle($event.target)">
                <svg class="svg-arrow" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18.2929 15.2893C18.6834 14.8988 18.6834 14.2656 18.2929 13.8751L13.4007 8.98766C12.6195 8.20726 11.3537 8.20757 10.5729 8.98835L5.68257 13.8787C5.29205 14.2692 5.29205 14.9024 5.68257 15.2929C6.0731 15.6835 6.70626 15.6835 7.09679 15.2929L11.2824 11.1073C11.673 10.7168 12.3061 10.7168 12.6966 11.1073L16.8787 15.2893C17.2692 15.6798 17.9024 15.6798 18.2929 15.2893Z" fill="#1197d5"/>
                </svg>
                <h2>Занятие {{ind + 1}}</h2>
            </div>
            <div class="accordion-body">
                <button class="btn-save" @click="downloadExcel(lesson, ind+1)">Скачать коды занятия</button>
                <div v-for="level in lesson" class="step">
                    <h3>Шаг {{level.level}}</h3>
                    <ul v-for="task in level.tasks" class="task">
                        <li>
                            Задание {{task.task}}: https://shpschool.github.io/algo5/?lesson={{ind + 1}}&level={{level.level}}&task={{task.task}}
                            <button
                                @click="copy($event.target, ind + 1, level.level, task.task)"
                                class="btn-copy"
                            >Скопировать ссылку</button>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
    `
}