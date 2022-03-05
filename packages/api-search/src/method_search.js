const xlsx = require('node-xlsx');
const fs = require('fs');
const config = require('../config.json');
const searchWithRegex = require('./search');

const api_name = config.apiName;
const report_path = config.root + 'ApiSearchReport.xlsx';
const outputExcel = config.root + api_name + '_ApiSearchReport.xlsx';

function method_search(){
  var regx = '\n|//|/\\*|\\*/';
  regx = regx.concat('|','\\b' + api_name + '\\.\\w\*');
  var xlsx_alldata = xlsx.parse(report_path);
  var xlsx_data = xlsx_alldata[1].data;
  var rowData;
  var apiData = [['Library','path','filename','api','line','context']];
  for (var i = 1; i < xlsx_data.length; i++){
    rowData = xlsx_data[i];
    if ((rowData[3] == ('"'+api_name+'"')) || (rowData[3] == ("'"+api_name+"'"))){
      console.log("searching " + rowData[1])
      var data = fs.readFileSync(rowData[1]);
      var methodPositions = searchWithRegex(data.toString(), regx);
      methodPositions.forEach((positionInFile)=>{
        var rowToWrite = [];
        rowToWrite[0] = rowData[0];
        rowToWrite[1] = {
          t:'s',
          v:rowData[1],
          l:{Target:rowData[1]}
        };
        rowToWrite[2] = rowData[2];
        rowToWrite[3] = positionInFile.api;
        rowToWrite[4] = positionInFile.position;
        rowToWrite[5] = positionInFile.context;
        apiData.push(rowToWrite);
      })
    }
  }
  var buffer = xlsx.build([{name: 'ApiDetail', data: apiData}]);
  fs.writeFileSync(outputExcel,buffer);
}

method_search();