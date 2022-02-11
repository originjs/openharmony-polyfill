@Entry
@Component
struct Test {
  @State path: string = this.getPath().resolve('.');
  @State isAbsolute: boolean = false;
  @State dirname: string = '';
  @State basename: string = '';
  @State extname: string = '';
  @State parse: string = '';

  private getPath() {
    return Function(`return require('path')`)();
  }

  build() {
    Flex({ direction: FlexDirection.Column, alignItems: ItemAlign.Center, justifyContent: FlexAlign.Center }) {
      TextInput({ placeholder: "please type the path", text: this.path})
        .height(40)
        .onChange((value: string) => {
          this.path = value;
          const pathLib = this.getPath();
          this.isAbsolute = pathLib.isAbsolute(this.path);
          this.dirname = pathLib.dirname(this.path);
          this.basename = pathLib.basename(this.path);
          this.extname = pathLib.extname(this.path);
          this.parse = JSON.stringify(pathLib.parse(this.path));
        })

      Text(`isAbsolute：${this.isAbsolute}`).fontSize(15).backgroundColor('#faebd7');
      Text(`dirname：${this.dirname}`).fontSize(15).backgroundColor('#add8e6');
      Text(`basename：${this.basename}`).fontSize(15).backgroundColor('#ffa500');
      Text(`extname：${this.extname}`).fontSize(15).backgroundColor('#fa8072');
      Text(`parse：${(this.parse)}`).fontSize(15).backgroundColor('##ee82ee');
    }
    .width('100%')
    .height('100%')
  }
}
