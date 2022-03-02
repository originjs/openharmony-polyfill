import checksum from "checksum";
import ability_featureAbility from '@ohos.ability.featureAbility'
import fileio from '@ohos.fileio';

@Entry
@Component
struct Checksum {
  @State result1: string = ''
  @State result2: string = ''
  fileName: string ;

  private aboutToAppear(): void {
    const data = `test file`;
    const context = ability_featureAbility.getContext();
    context.getFilesDir((error, dir) => {
      if (error) {
        console.error('Failed to obtain the file directory. Cause: ' + JSON.stringify(error));
        return;
      }
      this.fileName = dir + '/checksum.txt';
      let fd = fileio.openSync(this.fileName, 0o102, 0o666);
      fileio.writeSync(fd, data);
    })

  }

  build() {
    Flex({ direction: FlexDirection.Column, alignItems: ItemAlign.Center, justifyContent: FlexAlign.Center }) {
      Button('checksum').onClick(() => {
        const cs = checksum('dshaw')
        this.result1 = cs
      })
      Text(this.result1)
        .fontSize(12)

      Button('checksum file').onClick(() => {
        checksum.file(this.fileName, (err, sum) => {
          this.result2 = sum
        })
      })
      Text(this.result2)
        .fontSize(12)
    }
    .width('100%')
    .height('100%')
  }
}