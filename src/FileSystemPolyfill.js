import fileio from '@ohos.fileio';

const FILE_TYPE = { File: 1, Dirent: 2 };
//type BufferEncoding = 'ascii' | 'utf8' | 'utf-8' | 'utf16le' | 'ucs2' | 'ucs-2' | 'base64' | 'base64url' | 'latin1' | 'binary' | 'hex';
// 1.File 2.Dirent
const fileType = Symbol('type');

/**
 * Reads the contents of the directory.
 * @param {string} path - directory path
 * @param {string | Object } [options = { encoding : 'utf-8', withFileTypes: false}] - The optional options argument can
 * be a string specifying an encoding, or an object with an encoding property specifying the character encoding to use
 * for the filenames returned.
 * @returns {string[] | fileio.Dirent[]}
 */
function readdirSync(path, options) {
  if(!path || !path.toString || !path.toString()){
    throw('Data input cannot be converted to string.');
  }
  const dirStream = fileio.opendirSync(path.toString());
  let dirent;
  const result = [];

  if (!options) {
    options = { encoding: 'utf-8', withFileTypes: false };
  }

  // eslint-disable-next-line
  while (true) {
    dirent = dirStream.readSync();
    if (!dirent) {
      dirStream.closeSync();
      break;
    }

    if (options.withFileTypes) {
      Object.defineProperty(dirent, fileType, {
        value: dirent.isDirectory() ? FILE_TYPE.Dirent : FILE_TYPE.File,
        enumerable: true
      });

      dirent.toJSON = function () {
        return { name: this.name };
      };
      result.push(dirent);
    } else {
      result.push(dirent.name);
    }
  }
  return result;
}

/**
 * readFileSync
 * @param {string|Buffer|integer}path
 * @param options
 * @returns {string | Buffer}
 */
function readFileSync(path, options) {
  if (!options) {
    options = {};
  }
  let Buffer = require('buffer').Buffer;
  const mode = options.flag || 'r';
  let stream;
  if(Number.isInteger(path)){
    stream = fileio.fdopenStreamSync(path, mode);
  }else{
    if(!path || !path.toString || !path.toString()){
      throw('Data input cannot be converted to string.');
    }
    stream = fileio.createStreamSync(path.toString(), mode);
  }

  let data = [];
  let count = 0;
  // eslint-disable-next-line
  while (true) {
    let buffer = new ArrayBuffer(4096);
    let num = stream.readSync(buffer);
    if (0 == num) {
      break;
    }
    if (num < 4096) {
      data.push(buffer.slice(0, num));
    } else {
      data.push(buffer);
    }
    count += num;
  }
  stream.closeSync();
  //const buffer = new Buffer(count);
  const buffer = Buffer.alloc(count);
  let offset = 0;

  for (let arr of data) {
    let uint8Arr = new Uint8Array(arr);
    buffer.set(uint8Arr, offset);
    offset += arr.byteLength;
  }

  if (options.encoding) {
    return buffer.toString(options.encoding);
  }
  return buffer;
}

/**
 * exists
 * @param {string|buffer}path
 * @param {(boolean isExists)=>any}callback: isExists = true if the file exists, false otherwise
 */
function exists(path, callback){
  if(!path || !path.toString || !path.toString()){
    throw('Data input cannot be converted to string.');
  }
  fileio.access(path.toString(),(err)=>{
    if(err){
      callback(false);
      console.error(err);
    }else{
      callback(true);
    }
  })
}

/**
 * Returns true if the path exists, false otherwise.
 * @param {string|Buffer} path
 * @returns {boolean}
 */
function existsSync(path) {
  if(!path || !path.toString || !path.toString()){
    throw('Data input cannot be converted to string.');
  }
  try {
    fileio.accessSync(path.toString());
    return true;
  } catch (e) {
    if (e.message == 'No such file or directory') {
      return false;
    }
    throw e;
  }
}

function statSync(path, options){

}
/**
 * write
 * @param {integer}fd
 * @param {string|buffer|Object}buffer
 * @param {integer}offset
 * @param {integer}length
 * @param {integer}position
 * @param {function}callback:
 * @callback_param {Error}err
 * @callback_param {integer}bytesWritten
 * @callback_param {Buffer}buffer
 */
//Important Notice: If content is inserted behind any empty bytes(\0),
//such content cannot be displayed because Openharmony cannot recognize '\0'
function write(fd,buffer,offset,length,position,callback){
  var options = {};
  //Another version of write is defined as:
  //fs.write(fd, string[, position[,encoding]], callback)
  if (typeof buffer == 'string'){
    if(typeof(offset) == 'function'){
      callback = offset; //'offset' corresponds to callback
      options = {};
    }else{
      options['position'] = offset; //'offset' corresponds to position
      if(typeof(length)=='function'){
        callback = length; //'length' corresponds to encoding
      }else{
        options['encoding']=length;
      }
    }
  }else{
    if(!buffer || !buffer.toString || !buffer.toString()){
      throw('Buffer input cannot be converted to string.');
    }

    if (typeof offset == 'function') {
      callback = offset;
      options = {};
    }else{
      options['offset'] = offset;
      if (typeof length == 'function'){
        callback = length;
      }else{
        options['length'] = length;
        if(typeof position == 'function'){
          callback = position;
        }else{
          options['position'] = position;
        }
      }
    }
  }

  if(options.position){
    if(typeof(options.position)!='number'){
      delete options.position;
    }
  }
  if(options.encoding){
    if (options.encoding != 'utf8'){
      throw('Only utf8 is supported to write!');
    }
  }
  fileio.write(fd,buffer,options,(err,bytesWritten)=>{
    callback(err,bytesWritten,buffer);
  })
}

/**
 * Write data to files
 * @param {string|buffer|integer} file: path of the file
 * @param {string|Buffer|object} data: content of data to write
 * @param {string | Object } [options = { encoding : 'utf-8', flag: 'w', mode: 0o666}] - The optional options argument can
 * be a string specifying an encoding, or an object with an encoding property specifying the character encoding to use
 * for the data written(now only utf8 is supported), a flag property specifying the mode to open the file and
 * a mode property specifying the permission of the file if being created.
 */
function writeFileSync(file, data, options) {
  if (!options) {
    options = {};
  }
  if(!data || !data.toString || !data.toString()){
    throw('Data input cannot be converted to string.');
  }
  var coding;
  const flag = options.flag || 'w';
  if (typeof options == 'string'){
    coding = options;
  }else{
    coding = options.encoding || 'utf8';
  }
  const mode = options.mode || 0o666;

  if(coding != 'utf8'){
    throw('Only utf8 is supported to write');
  }

  const flagDic = {
    'a': 1089,
    'ax': 1217,
    'a+': 1090,
    'ax+': 1218,
    'as': 1053761,
    'as+': 1053762,
    'r': 0,
    'r+': 2,
    'rs+': 1052674,
    'w': 577,
    'wx': 705,
    'w+': 578,
    'wx+': 706
  };
  if(Number.isInteger(file)){
    try{
      fileio.writeSync(file,data.toString());
    }catch(err){
      console.error(err);
      throw("Write File failed at " + file + "! " + err.name + ':' + err.message);
    }
  }else{
    if(!file || !file.toString || !file.toString()){
      throw('Data input cannot be converted to string.');
    }
    try{
      let fd = fileio.openSync(file.toString(), flagDic[flag], mode);
      fileio.writeSync(fd,data.toString());
    }catch(err){
      console.error(err);
      throw("Write File failed at " + file + "! " + err.name + ':' + err.message);
    }
  }
}


/**
 * Delete a file
 * @param {string | Buffer} path: The path of the file to delete
 */
function unlinkSync(path) {
  if(!path || !path.toString || !path.toString()){
    throw('Data input cannot be converted to string.');
  }
  try{
    let file = path.toString();
    fileio.unlinkSync(file);
  }
  catch(e){
    console.error(e);
    throw ("Delete fail at "+path.toString()+"! "+e.name+": "+e.message);
  }
}

function createWriteStream(){}

/**
 * readFile callback
 *
 * @callback readFileCallback
 * @param {Error} err
 * @param {string  | Buffer} data
 */

/**
 * readFile
 * @param {string} path
 * @param {string | Object } [options = { encoding : null, flag: 'r',signal: AbortSignal}]  [options]
 * @param {readFileCallback } callback
 */
function readFile(path, options, callback) {
  if (typeof options == 'function') {
    callback = options;
  }

  if (!options) {
    options = {};
  }

  if (typeof callback == 'function') {
    readFilePromises(path, options)
      .then((data) => callback(null, data))
      .catch((err) => callback(err, null));
  } else {
    return readFilePromises(path, options);
  }
}

function readFilePromises(path, options) {
  if (!options) {
    options = {};
  }

  function _readFile(resolve, reject) {
    let Buffer = require('buffer').Buffer;
    const mode = options.flag || 'r';

    if(!path || !path.toString || !path.toString()){
      throw('Data input cannot be converted to string.');
    }
    fileio.createStream(path.toString(), mode, async function (err, stream) {
      if (err) {
        reject(err);
        return;
      }

      let data = [];
      let count = 0;
      let readOut;
      try {
        // eslint-disable-next-line
        while (true) {
          readOut = await stream.read(new ArrayBuffer(4096));
          if (0 == readOut.bytesRead) {
            break;
          }
          if (readOut.bytesRead < 4096) {
            data.push(readOut.buffer.slice(0, readOut.bytesRead));
          } else {
            data.push(readOut.buffer);
          }
          count += readOut.bytesRead;
        }
      } catch (error) {
        reject(error);
        return;
      }

      stream.closeSync();
      // const buffer = new Buffer(count);
      const buffer = Buffer.alloc(count);
      let offset = 0;

      for (let arr of data) {
        let uint8Arr = new Uint8Array(arr);
        buffer.set(uint8Arr, offset);
        offset += arr.byteLength;
      }

      if (options.encoding) {
        resolve(buffer.toString(options.encoding));
      } else {
        resolve(buffer);
      }
    });
  }

  const Promises = require('promise');
  return new Promises(_readFile);
}

const harmonyFS = {
  readdirSync,
  readFileSync,
  exists,
  existsSync,
  statSync,
  write,
  writeFileSync,
  unlinkSync,
  createWriteStream,
  readFile
};

export default harmonyFS;
