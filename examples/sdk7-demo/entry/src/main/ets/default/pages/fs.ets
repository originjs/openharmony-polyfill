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
              console.error(err);
              throw ("Write failed at " + this.path + "!")
            }
            this.status = "Write Success!";
            console.info('File directory :' + this.path);
          });
        }).alignSelf(ItemAlign.Center)
        Button('Overwrite').onClick(() => {
          try {
            let fs = this.getFs();
            fs.writeFileSync(this.path, this.text);
            console.info('File directory :' + this.path);
            this.status = "Overwrite Success!";
          } catch (err) {
            this.status = "Overwrite Fail!";
            console.error(err);
          }
        }).alignSelf(ItemAlign.Center)
        Button('OverwriteAsync').onClick(async () => {
          let fs = this.getFs();
          fs.writeFile(this.path, this.text, (err) => {
            if (!err) {
              this.status = "Overwrite Success!";
            } else {
              this.status = "Overwrite Fail!";
            }
          });
        }).alignSelf(ItemAlign.Center)
        Button('appendWriteSync').onClick(() => {
          try{
            let fs = this.getFs();
            this.status = "Overwrite Success!";
            fs.appendFileSync(this.path, this.text)
          }catch (e){
            this.status = "Overwrite Fail!";
          }
        }).alignSelf(ItemAlign.Center)
        Button('Add to end').onClick(async () => {
          try {
            let fs = this.getFs();
            fs.writeFileSync(this.path, this.text, { flag: 'a' });
            console.info('File directory :' + this.path);
            this.status = "Add success!";
          } catch (err) {
            this.status = "Add fail!";
            console.error(err);
          }
        }).alignSelf(ItemAlign.Center)
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
            console.error(err);
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
              console.error(err);
            })
        })
      }

      Button('Delete file').onClick(() => {
        try {
          let fs = this.getFs();
          fs.unlinkSync(this.path);
          this.status = "Delete Success!";
        } catch (err) {
          this.status = "Delete Fail!";
          console.error(err);
        }
      })
      Text('Content:').fontSize(16).fontWeight(FontWeight.Bolder)
      Scroll() {
        Text(this.readText).fontSize(16)
          .textOverflow({ overflow: TextOverflow.None })
          .border({ width: 1, color: "red" }).width('100%')
      }

      Button('Read File').onClick(async () => {
        try {
          let fs = this.getFs();
          this.readText = fs.readFileSync(this.path, { encoding: 'utf8', flag: 'r' })
          //this.readText = fileio.readTextSync(this.path);
          this.status = "Read file Success!";
        } catch (err) {
          this.status = "Read file Fail!";
          console.error(err);
        }
      }).alignSelf(ItemAlign.Center)
      Button('Read Dir').onClick(async () => {
        try {
          let fs = this.getFs();
          const result1 = fs.readdirSync(this.appDir, { withFileTypes: true });
          console.log(JSON.stringify(result1));
          this.readText = `${JSON.stringify(result1)}`;
          this.status = "Read dir Success!";
        } catch (err) {
          this.status = "Read dir Fail!";
          console.error(err);
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
