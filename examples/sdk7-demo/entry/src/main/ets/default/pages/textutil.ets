//import util from '@ohos.util';
@Entry
@Component
struct TextPage {
  @State decode: string = '';
  @State encode: string = ''
  @State urlResult: string= ''

  build() {
    Flex({ direction: FlexDirection.Column, alignItems: ItemAlign.Center, justifyContent: FlexAlign.Center }) {
      Button('Use TextDecoder').onClick(() => {
        this.decode = 'waiting'
        const start = new Date().getTime();
        const decoder = new TextDecoder();
        //const utilDecoder = new util.TextDecoder();
        const u8arr = new Uint8Array([240, 160, 174, 183]);
        const i8arr = new Int8Array([-16, -96, -82, -73]);
        const u16arr = new Uint16Array([41200, 47022]);
        const u8Result = decoder.decode(u8arr);
        const i8Result = decoder.decode(i8arr);
        //const u16Result = utilDecoder.decode(u16arr);
        const end = new Date().getTime();
        this.decode = `time:${end - start}ms,result:${i8Result === u8Result }`
      })
      Text(this.decode).fontSize(16)


      Button('Use TextEncoder').onClick(() => {
        this.encode = 'waiting';
        const start = new Date().getTime();
        const encoder = new TextEncoder();
        //const utilEncoder = new util.TextEncoder();
        const encoderResult = encoder.encode('€');
        //const utilResult = utilEncoder.encode('€');
        const arr1 = new Uint8Array(2);
        const arr2 = new Uint8Array(2);
        encoder.encodeInto('11', arr1);
        //utilEncoder.encodeInto('11', arr2);
        const end = new Date().getTime();
        this.encode = `time:${end - start}ms,result:${JSON.stringify(arr1) === JSON.stringify(arr2)}`
      })
      Text(this.encode).fontSize(16)

      Button('Use URL').onClick(() => {
        const url = new URL('/abc', 'https://abc.com')
        this.urlResult = `result:${'abc.com' == url.host && 'https:' === url.protocol && '/abc' === url.pathname}`
      })
      Text(this.urlResult).fontSize(16)
    }
    .width('100%')
    .height('100%')
  }
}