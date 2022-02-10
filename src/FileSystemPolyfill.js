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
  const dirStream = fileio.opendirSync(path);
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
 * @param path
 * @param options
 * @returns {string | Buffer}
 */
function readFileSync(path, options) {
  if (!options) {
    options = {};
  }
  let Buffer = require('buffer').Buffer;
  const mode = options.flag || 'r';
  let stream = fileio.createStreamSync(path, mode);

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
 * Returns true if the path exists, false otherwise.
 * @param {string} path
 * @returns {boolean}
 */
function existsSync(path) {
  try {
    fileio.accessSync(path);
    return true;
  } catch (e) {
    if (e.message == 'No such file or directory') {
      return false;
    }
    throw e;
  }
}

/**
 * Write data to files
 * @param {string} file: path of the file
 * @param {string} data: content of data to write
 * @param {string | Object } [options = { encoding : 'utf-8', flag: 'w', mode: 0o666}] - The optional options argument can
 * be a string specifying an encoding, or an object with an encoding property specifying the character encoding to use
 * for the data written(now only utf8 is supported), a flag property specifying the mode to open the file and
 * a mode property specifying the permission of the file if being created.
 */
function writeFileSync(file, data, options) {
  if (!options) {
    options = {};
  }
  if(!data.toString()){
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
  let fd = fileio.openSync(file, flagDic[flag], mode);

  fileio.writeSync(fd,data.toString());
}


/**
 * Delete a file
 * @param {string | Buffer} path: The path of the file to delete
 */
function unlinkSync(path) {
    try{
      let file = path.toString();
      fileio.unlinkSync(file);
    }
    catch(e){
      console.log("Error: " + e);
      throw e;
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

    fileio.createStream(path, mode, async function (err, stream) {
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
  existsSync,
  writeFileSync,
  unlinkSync,
  createWriteStream,
  readFile
};

export default harmonyFS;
