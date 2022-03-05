const xlsx = require('node-xlsx');
const fs = require('fs');
const path = require('path');
const util = require('util');

const config = require('../config.json');
const browser_api_list = config.browser_api_list;

const node_api_list = config.node_api_list;
const ignoreDirs = config.ignoreDirs;

function searchWithRegex(data,regx) {
  var reg = new RegExp(regx, 'g');
  var apiCatch;
  var linecount = 1;
  var positions = [];
  let isCommentline = false;
  let isComment = false;
  let startOfLine = 1;
  while ((apiCatch = reg.exec(data)) !== null){
    if (apiCatch == '//') {
      isCommentline = true;
      continue;
    }
    if (apiCatch == '/*') {
      isComment = true;
      continue;
    }
    if (apiCatch[0] == '\n') {
      linecount++;
      isCommentline = false;
      startOfLine = reg.lastIndex;
      continue;
    }
    if (apiCatch == '*/'){
      isComment = false;
      continue;
    }
    if((!isCommentline) && (!isComment)) {
      var context = '';
      for (let i = startOfLine; i < data.length; i++) {
        if ((data[i] == '\n')||(i == data.length - 1)) {
          context = data.slice(startOfLine - 1, i);
          break;
        }
      }
      if (context.length > 1000) {
        context = context.slice(0, 1000);
      }
      var position = {
        'api': apiCatch[0],
        'position': linecount,
        'context': context.trim()
      };
      positions.push(position);
    }
  }
  return positions;
}

function searchDirWithRegex(dir, regx, library) {
  console.log('searching ' + dir);
  let filenames = fs.readdirSync(dir);
  let positionsOfFiles = [];
  filenames = filenames.filter((name) => {
    return !(ignoreDirs.includes(name));
  });
  //如果存在package.json, 则认为该目录为库名称
  if (filenames.includes('package.json') || (!library)){
    library = dir.substring(dir.lastIndexOf('\\') + 1);
  }
  filenames.forEach((file) => {
    let filepath = path.join(dir, file);
    if (fs.lstatSync(filepath).isDirectory()){
      searchDirWithRegex(filepath, regx, library).forEach((position) => {
        positionsOfFiles.push(position);
      });
    } else {
      if (!(file.endsWith('.d.ts') || file.endsWith('.min.js'))
      && ((file.endsWith('.js')) || (file.endsWith('.ts')) || (file.endsWith('.mjs')))){
        let data = fs.readFileSync(filepath);
        let positions = searchWithRegex(data.toString(), regx);
        if (positions.length > 0){
          positionsOfFiles.push({
            'lib':library,
            'filename': file,
            'path': filepath,
            'positions': positions
          });
        }
      }
    }
  })
  return positionsOfFiles;
}

function search(){
  let reg = '\n|//|/\\*|\\*/';
  for (let i = 0; i < browser_api_list.length; i++) {
    reg = reg.concat('|', '\\b' + browser_api_list[i] + '\\b');
  }
  for (let i = 0; i < node_api_list.length; i++) {
    reg = reg.concat('|', '"'+node_api_list[i]+'"');
    reg = reg.concat('|', "'"+node_api_list[i]+"'");
  }

  let result = searchDirWithRegex(config.root, reg);
  fs.writeFile(
    config.root + 'ApiSearchReport.txt', 
    util.inspect(result, { maxArrayLength:null, depth: null}), 
    {flag: 'w'},
    (err) => {
      if(err){
        console.error(err);
      } else {
        console.log('Write Success!');
      }
    });
  
  let summaryData = [['Library', 'API', 'Count']];
  let summary = {};
  result.forEach((positionInFile) => {
    if (!summary[positionInFile.lib]) {
      summary[positionInFile.lib] = {}
    }
    for (let position of positionInFile.positions){
      if (!summary[positionInFile.lib][position.api]){
        summary[positionInFile.lib][position.api] = 1;
      } else {
        summary[positionInFile.lib][position.api]++;
      }
    }
  });  
  Object.keys(summary).forEach(lib => {
    Object.keys(summary[lib]).forEach(api => {
      let row = [];
      row.push(lib);
      row.push(api);
      row.push(summary[lib][api]);
      summaryData.push(row);
    });
  })

  let detailData = [['Library', 'path', 'filename', 'API', 'line', 'context']];
  result.forEach((positionInFile) => {
    let row = [];
    for (let i = 0; i < positionInFile.positions.length; i++) {
      row = [];
      row.push(positionInFile.lib);
      row.push({
        t:'s',
        v:positionInFile.path,
        l:{Target:positionInFile.path}
      });
      row.push(positionInFile.filename);
      row.push((positionInFile.positions[i]).api);
      row.push((positionInFile.positions[i]).position);
      row.push((positionInFile.positions[i]).context);
      detailData.push(row);
    }
  })
  var buffer = xlsx.build([
    { name: 'Summary', data: summaryData },
    { name: 'Detail', data: detailData }
  ]);
  fs.writeFileSync(config.root + 'ApiSearchReport.xlsx', buffer);
}

search();
module.exports = searchWithRegex;