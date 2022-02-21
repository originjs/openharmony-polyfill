import fileio from '@ohos.fileio';
import ability_featureAbility from '@ohos.ability.featureAbility'

@Entry
@Component
struct FSPage {
  @State text: string = '';
  @State readText: string = '';
  @State path: string = '';
  @State status: string = 'Ready';
  @State appDir: string = '';
  @State protoFilePath: string = 'awesome.proto';
  @State writeStreamState: string = 'None';
  @State readStreamState: string = 'None';
  @State errmsg: string = '';
  stream;
  rstream;
  private aboutToAppear(): void {
    this.createFiles();
  }

  private getFs() {
    return Function("return " + "quire".replace(/^/, "re") + "('fs')")();
  }

  async getAppDir() {
    return new Promise((resolve, reject) => {
      if (this.path) {
        resolve(this.path);
        return;
      }
      const filePath = '/testfs.text';
      const context = ability_featureAbility.getContext();
      context.getFilesDir()
        .then((data) => {
          this.appDir = data;
          this.path = data + filePath;
          resolve(this.path);
        }).catch((error) => {
        console.error('Failed to obtain the file directory. Cause: ' + error.message);
        this.errmsg = error.message;
        reject(error);
      })
    });
  }

  async createFiles() {
    let fs = this.getFs();
    await this.getAppDir()

    const file1 = this.appDir + '/test1.text';
    const file2 = this.appDir + '/test2.text';
    const file3 = this.appDir + '/test3.text';
    const dir1 = this.appDir + '/testdir';
    if (!fs.existsSync(dir1)) {
      fileio.mkdirSync(dir1)
    }
    if (!fs.existsSync(file1)) {
      let fd = fileio.openSync(file1, 0o102, 0o666);
      fileio.writeSync(fd, "file1");
    }
    if (!fs.existsSync(file2)) {
      let fd = fileio.openSync(file2, 0o102, 0o666);
      fileio.writeSync(fd, "file2");
    }
    if (!fs.existsSync(file3)) {
      let fd = fileio.openSync(file3, 0o102, 0o666);
      fileio.writeSync(fd, "file3");
    }
    this.createProtobufFile();
  }

  createProtobufFile() {
    const data = `
    package awesomepackage;
    syntax = "proto3";
    message AwesomeMessage {
      string awesome_field = 1; // becomes awesomeField
    }`;

    this.protoFilePath = this.appDir + this.protoFilePath;
    let fs = this.getFs();
    if (!fs.existsSync(this.protoFilePath)) {
      let fd = fileio.openSync(this.protoFilePath, 0o102, 0o666);
      fileio.writeSync(fd, data);
    }
  }

  build() {
    Flex({ direction: FlexDirection.Column, alignItems: ItemAlign.Start, justifyContent: FlexAlign.Center }) {
      // @ts-ignore
      Text(`Status：${this.status}`).fontSize(16).fontWeight(FontWeight.Bolder)
      Text(`Error Message：${this.errmsg}`).fontSize(16).fontWeight(FontWeight.Bolder)
      Text('File Path：').fontSize(16).fontWeight(FontWeight.Bolder)
      Text(this.path).fontSize(16).border({ width: 1, color: "red" }).width('100%')
      Text('Data to write：').fontSize(16).fontWeight(FontWeight.Bolder)
      TextInput({ placeholder: "please...", text: this.text }).height(40).onChange((value: string) => {
        this.text = value;
      })
      Row() {
        Button('Write').onClick(async () => {
          let fs = this.getFs();
          let fd = fileio.openSync(this.path, 65, 0o666);
          fs.write(fd, this.text, (err, written, string) => {
            if (err) {
              this.status = "Write Fail!";
              this.errmsg = err.message;
              throw ("Write failed at " + this.path + "!")
            }
            this.status = "Write Success!";
            console.info('File directory :' + this.path);
          });
        })
        Button('Overwrite').onClick(() => {
          try {
            let fs = this.getFs();
            fs.writeFileSync(this.path, this.text);
            console.info('File directory :' + this.path);
            this.status = "Overwrite Success!";
          } catch (err) {
            this.status = "Overwrite Fail!";
            this.errmsg = err.message;
          }
        })
        Button('OverwriteAsync').onClick(async () => {
          let fs = this.getFs();
          fs.writeFile(this.path, this.text, (err) => {
            if (!err) {
              this.status = "Overwrite Success!";
            } else {
              this.status = "Overwrite Fail!";
            }
          });
        })
      }

      Row() {
        Button('appendSync').onClick(() => {
          try {
            let fs = this.getFs();
            fs.appendFileSync(this.path, this.text)
            this.status = "appendSync Success!";
          } catch (e) {
            this.status = "appendSync Fail!";
          }
        })
        Button('appendAsync').onClick(() => {
          let fs = this.getFs();
          fs.appendFile(this.path, this.text, (err) => {
            if (!err) {
              this.status = "appendAsync Success!";
            } else {
              this.status = "appendAsync Fail!";
            }
          })
        })
        Button('Add to end').onClick(async () => {
          try {
            let fs = this.getFs();
            fs.writeFileSync(this.path, this.text, { flag: 'a' });
            console.info('File directory :' + this.path);
            this.status = "Add success!";
          } catch (err) {
            this.status = "Add fail!";
            this.errmsg = err.message;
          }
        })
      }

      Row() {
        Button('Get File Stat(sync)').onClick(() => {
          try {
            let fs = this.getFs();
            let status = fs.statSync(this.path);
            this.status = "Stat Success(sync)!";
            this.readText = "";
            for (let prop in status) {
              if ((status[prop].toString) && (status[prop].toString()) && (typeof (status[prop]) != 'function'))
              this.readText += prop + ': ' + status[prop].toString() + '\n';
            }
          } catch (err) {
            this.status = "Stat Fail(sync)!";
            this.errmsg = err.message;
          }
        })
        Button('Get File Stat(async)').onClick(() => {
          let fs = this.getFs();
          fs.stat(this.path)
            .then((status) => {
              this.status = "Stat Success(async)!";
              this.readText = "";
              for (let prop in status) {
                if ((status[prop].toString) && (status[prop].toString()) && (typeof (status[prop]) != 'function'))
                this.readText += prop + ': ' + status[prop].toString() + '\n';
              }
            })
            .catch((err) => {
              this.status = "Stat Success(async)!";
              this.errmsg = err.message;
            })
        })
      }
      Text('WriteStream').fontSize(16).fontWeight(FontWeight.Bolder)
      Text(this.writeStreamState).fontSize(16)
        .textOverflow({overflow:TextOverflow.None})
        .border({ width: 1, color: "red" }).width('100%')
      Row(){
        Button('Create').onClick(() => {
          try {
            let fs = this.getFs();
            this.stream = fs.createWriteStream(this.path);
            this.status = "Create Success!";
            this.writeStreamState = this.stream.path;
            this.stream.on('open',(fd)=>{
              console.log('Stream open.');
            })
            this.stream.on('ready',()=>{
              console.log('Stream is ready.');
            })
            this.stream.on('error',(err)=>{
              this.errmsg = err.message;
              throw(err);
            })
            this.stream.on('close',()=>{
              console.log('Stream close.');
              this.writeStreamState = 'None';
              this.status = 'WriteStream Close!';
            })
          } catch (err) {
            this.status = "Create Fail!";
            this.errmsg = err.message;
          }
        })
        Button('Write').onClick(() => {
          let fs = this.getFs();
          this.stream.write(this.text,(err)=>{
            if(err){
              this.status = "Stream Write Fail!";
              this.errmsg = err.message;
            }else{
              this.status = "Stream Write Success!";
            }
          });
        })
        Button('bytesWritten').onClick(() => {
          this.readText  = this.stream.bytesWritten.toString();
        })
        Button('Close').onClick(() => {
          this.stream.close((err)=>{
            if(err){
              this.status = "Stream Close Fail!";
              this.errmsg = err.message;
            }else{
              this.status = "Stream Closed";
            }
          });
        })
      }

      Text('ReadStream').fontSize(16).fontWeight(FontWeight.Bolder)
      Text(this.readStreamState).fontSize(16)
        .textOverflow({overflow:TextOverflow.None})
        .border({ width: 1, color: "red" }).width('100%')
      Row(){
        Button('Create').onClick(() => {
          let fs = this.getFs();
          const readPath = this.appDir + '/testfs2.text';
          try {
            let fd = fileio.openSync(readPath, 0o102, 0o666);
            fileio.writeSync(fd, "Pipe Stream success!");
            fileio.closeSync(fd);
          }catch(err){
            throw('Read File create fail!')
          }
          try{
            let fs = this.getFs();
            this.rstream = fs.createReadStream(readPath);
            this.status = "Create Readstream Success!";
            this.readStreamState = this.rstream.path;
            this.rstream.on('open',(fd)=>{
              console.log('ReadStream open.');
            })
            this.rstream.on('ready',()=>{
              console.log('ReadStream is ready.');
            })
            this.rstream.on('close',()=>{
              console.log('Read Stream close.');
              this.readStreamState = 'None';
              this.status = 'ReadStream Close!';

            })
          } catch (err) {
            this.status = "Create Fail!";
            this.errmsg = err.message;
          }
        })
        Button('Pipe').onClick(() => {
          let fs = this.getFs();
          try {
            this.rstream.pipe(this.stream, { end: false });
            this.status = "Pipe Stream Success!";
          } catch (err) {
            this.status = "Pipe Stream Fail!";
            this.errmsg = err.message;
          }
        })
        Button('Read').onClick(()=>{
          let fs = this.getFs();
          let chunks = '';
          const fileToBuffer = (readStream, cb) => {
            readStream.on('error', err => {
              cb(err);
            });
            readStream.on('data', chunk => {
              if(chunk && (chunk.toString)){
                chunks = chunks.concat(chunk.toString());
              }else{
                readStream.emit('error',new Error('Data chunk cannot be converted to string!'))
              }
            });
            readStream.on('end', () => {
              cb(null, chunks);
            });
          }
          let self = this;
          fileToBuffer(this.rstream,(err,buffer)=>{
            if(err){
              this.errmsg = err.message;
              throw(err);
            }else{
              self.readText = buffer.toString();
            }
          })
        })
        Button('Close').onClick(() => {
          this.rstream.close((err)=>{
            if(err){
              this.status = "Stream Close Fail!";
              this.errmsg = err.message;
            }else{
              this.status = "Stream Closed";
            }
          });
        })
      }
      Row(){
        Button('Delete file').onClick(() => {
          try {
            let fs = this.getFs();
            fs.unlinkSync(this.path);
            this.status = "Delete Success!";
          } catch (err) {
            this.status = "Delete Fail!";
            this.errmsg = err.message;
          }
        })
      }

      Text('Content:').fontSize(16).fontWeight(FontWeight.Bolder)
      Scroll() {
        Text(this.readText).fontSize(16)
          .textOverflow({ overflow: TextOverflow.None })
          .border({ width: 1, color: "red" }).width('100%')
      }
      Row(){
        Button('Read File 1').onClick(async () => {
          try {
            let fs = this.getFs();
            this.readText = fs.readFileSync(this.path, { encoding: 'utf8', flag: 'r' })
            //this.readText = fileio.readTextSync(this.path);
            this.status = "Read file Success!";
          } catch (err) {
            this.status = "Read file Fail!";
            this.errmsg = err.message;
          }
        }).alignSelf(ItemAlign.Center)
        Button('Read File 2').onClick(async () => {
          try {
            let fs = this.getFs();
            this.readText = fs.readFileSync(this.appDir+'/testfs2.text', { encoding: 'utf8', flag: 'r' })
            //this.readText = fileio.readTextSync(this.appDir+'/testfs2.text');
            this.status = "Read file Success!";
          } catch (err) {
            this.status = "Read file Fail!";
            this.errmsg = err.message;
          }
        }).alignSelf(ItemAlign.Center)
      }

      Button('Read Dir').onClick(async () => {
        try {
          let fs = this.getFs();
          const result1 = fs.readdirSync(this.appDir, { withFileTypes: true });
          console.log(JSON.stringify(result1));
          this.readText = `${JSON.stringify(result1)}`;
          this.status = "Read dir Success!";
        } catch (err) {
          this.status = "Read dir Fail!";
          this.errmsg = err.message;
        }

      }).alignSelf(ItemAlign.Center)

      Button('create folder sync').onClick(() => {
        const fs = this.getFs();
        const path = `${this.appDir}/dir1/dir2/dir3/dir4`;
        try {
          const returnValue = fs.mkdirSync(path, { recursive: true });
          this.status = `create folder successfully(returnValue=${returnValue})`
        } catch (e) {
          this.status = 'create folder failed';
        }
      }).alignSelf(ItemAlign.Center)

      Button('create folder async').onClick(() => {
        const fs = this.getFs();
        const path = `${this.appDir}/dir11/dir22/dir33/dir44`;
        fs.mkdir(path, { recursive: true }, (err, returnValue) => {
          if (!err) {
            this.status = `create folder successfully(returnValue=${returnValue})`
          } else {
            this.status = 'create folder failed';
          }
        });
      }).alignSelf(ItemAlign.Center)
    }
    .width('100%')
    .height('100%')
  }
}
