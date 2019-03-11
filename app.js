'use strict';
const fs = require('fs');
const readline = require('readline');
const rs = fs.ReadStream('./students.csv');
const rl = readline.createInterface({ 'input': rs, 'output': {} });
const studentDataMap = new Map(); // key: 生徒の名前  value: 集計データのオブジェクト

rl.on('line', (lineString) => {
    // lineString: 
   // 集計年, 試験の種類, 学生ID, 名前, 男女区分, 点数
    const columns = lineString.split(',');
    const year = parseInt(columns[0]);
    const name = columns[3];
    const score = parseInt(columns[5]);
    if (year === 2018 || year === 2019) {
        let value = studentDataMap.get(name);
        if (!value) {
            value = {
                score18: 0,
                score19: 0,
                change: null
            };
        }
        if (year === 2018) {
            value.score18 += score;
        }
        if (year === 2019) {
            value.score19 += score;
        }
        studentDataMap.set(name, value);
    }
});
rl.on('close', () => {
    for (let [key, value] of studentDataMap) {
        value.change = value.score19 / value.score18;
    }
    const rankingArray = Array.from(studentDataMap).sort((pair1, pair2) => {
        return pair2[1].change - pair1[1].change;
    });
    const rankingStrings = rankingArray.map(([key, value], i) =>{
        return (i+1) + '位 ' + key + ': ' + value.score18 + '=>' + value.score19 + ' 変化率: ' + value.change;
    });
    console.log(rankingStrings);
});
