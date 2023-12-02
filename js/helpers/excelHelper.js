import "https://cdn.jsdelivr.net/npm/xlsx-js-style@1.2.0/dist/xlsx.min.js";

/**
 * Стилизация таблицы
 * @param sheet - сама таблица
 * @param len - количество строк в таблице
 * Результатом выступает добавление стилей для каждой ячейки таблицы
 */
function styleSheet(sheet, len) {
    sheet["!rows"] = [{}];
    for (let row = 0; row < len; row++) {
        if (row !== 0) sheet["!rows"].push({hpt: 25});
        for (let i = 0; i < 6; i++) {
            sheet[XLSX.utils.encode_cell({r:row, c:i})].s = {
                font: {name: "Arial", sz: "10"},
                alignment: {vertical: "center", wrapText: true}
            };
            if (row === 0) {
                sheet[XLSX.utils.encode_cell({r:row, c:i})].s.font.bold = true;
            }
            if (row % 3 === 0) {
                sheet[XLSX.utils.encode_cell({r:row, c:i})].s.border = { bottom: { style: 'thin', color: { rgb: '00000000' } } };
            } 
            if (i === 2 || i === 5 || row === 0) {
                sheet[XLSX.utils.encode_cell({r:row, c:i})].s.alignment.horizontal = "center";
            }
            if (i === 4) {
                sheet[XLSX.utils.encode_cell({r:row, c:i})].s.font.name = "Consolas";
            }
        }
    }
    sheet["!cols"] = [{wch: 3}, {}, {wch: 10}, {wch: 22}, {wch: 50}, {wch: 10}];
}

/**
 * Объединение нужных ячеек в таблице
 * @param len - количество строк в таблице 
 * @returns список объединений
 */
function mergeCells(len) {
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
}

/**
 * Создание алгоритма решения задачи
 * @param exec - Исполнитель задачи
 * @param params - параметры задачи для текущего Исполнителя
 * @param makeAlgorithmHelper - модуль с функциями составления алгоритмов в зависимости от Исполнителя
 * @returns форматированная строка решения задачи
 */
function makeAlgorithm(exec, params, makeAlgorithmHelper) {
    let algorithm = "";
    if (exec === "divider") {
        algorithm = makeAlgorithmHelper.dividerAlgorithm(params);
    } else if (exec === "doubler") {
        algorithm = makeAlgorithmHelper.doublerAlgorithm(params);
    } else if (exec === "aquarius") {
        algorithm = makeAlgorithmHelper.aquariusAlgorithm(params);
    } else if (exec === "grasshopper") {
        algorithm = makeAlgorithmHelper.grasshopperAlgorithm(params);
    }
    return algorithm;
}

/**
 * Создание excel-таблицы эталонных решений урока
 * @param lesson - объект урока, содержащий в себе в том числе задачи урока
 * @param makeAlgorithmHelper - модуль с функциями соствления алгоритмов в зависимости от Исполнителя
 * @returns объект excel-таблицы для формирования excel-файла
 */
export default function createExcel(lesson, makeAlgorithmHelper) {
    let book = [["№", "Название", "Вариант", "Код", "Алгоритм", "Шагов"]];
    let num = 1;
    for (let i = 0; i < lesson.length; i++) {
        let tasks = lesson[i].tasks;
        for (let j = 0; j < tasks.length; j++) {
            let task = tasks[j];
            let codes = task.verif_code;
            let algo = makeAlgorithm(task.executor, task.params, makeAlgorithmHelper);
            book.push([num, task.task_title, "ошиб.", codes["0"], algo, task.params.steps]);
            book.push(["", "", "неопт.", codes["75"], "", ""]);
            book.push(["", "", "опт.", codes["100"], "", ""]);
            num++;
        }
    }
    let worksheet = XLSX.utils.aoa_to_sheet(book);
    worksheet["!merges"] = mergeCells(book.length);
    styleSheet(worksheet, book.length);
    let workbook = XLSX.utils.book_new();
    workbook.SheetNames.push("Коды");
    workbook.Sheets["Коды"] = worksheet;
    return workbook;
}