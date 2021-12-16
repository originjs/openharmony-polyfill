import 'openharmony-polyfill'
import axios from 'axios'
import util from '@ohos.util';

@Entry
@Component
struct Index {
  @State response: string = ''
  @State decode: string = '';

  build() {
    Flex({ direction: FlexDirection.Column, alignItems: ItemAlign.Center, justifyContent: FlexAlign.Center }) {
      Text('OpenHarmony Polyfill')
        .fontSize(20)
        .fontWeight(FontWeight.Bold)
      Button('Use Axios').onClick(() => {
        this.response = 'request...'
        axios.get('https://developer.harmonyos.com/cn/develop/')
          .then((res) => {
            console.log('---------')
            console.log(res.data)
            this.response = res.statusText
          });
      })
      Text(this.response)
        .fontSize(16)

      Button('Use TextDecoder').onClick(() => {
        this.decode= 'waiting'
        const start = new Date().getTime();
        // @ts-ignore
        const decoder = new TextDecoder();
        const utilDecoder = new util.TextDecoder();
        const u8arr = new Uint8Array([240, 160, 174, 183]);
        const i8arr = new Int8Array([-16, -96, -82, -73]);
        const u16arr = new Uint16Array([41200, 47022]);
        const u8Result = decoder.decode(u8arr);
        const i8Result = decoder.decode(i8arr);
        // @ts-ignore
        const u16Result = utilDecoder.decode(u16arr);
        const end = new Date().getTime();
        this.decode = `time:${end-start}ms,result:${i8Result === u8Result && u8Result=== u16Result}`
      })
      Text(this.decode).fontSize(16)
    }
    .width('100%')
    .height('100%')
  }
}
