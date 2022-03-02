import router from '@system.router';

class PageData {
  name: string;
  page: string
}

@Entry
@Component
struct Index {
  private pageItems: PageData[] = [
    { name: 'Checksum', page: 'pages/checksum' },
    { name: 'Network', page: 'pages/network' },
    { name: 'fast-xml-parser', page: 'pages/xmlparser' },
  ]

  build() {
    Stack({ alignContent: Alignment.TopStart }) {
      Column() {
        Text('OpenHarmony Polyfill Demo')
          .width('100%')
          .height(40)
          .fontSize(16)
          .fontWeight(FontWeight.Bold)
          .textAlign(TextAlign.Center)

        List({ space: 20, initialIndex: 0 }) {
          ForEach(this.pageItems, (item) => {
            ListItem() {
              Text('' + item.name)
                .width('100%')
                .height(80)
                .fontSize(16)
                .textAlign(TextAlign.Center)
                .borderRadius(10)
                .backgroundColor(0xFFFFFF)
            }.onClick(() => {
              router.push({ uri: item.page })
            })
          }, item => item.page)
        }
        .width('90%')
      }.width('100%')
    }.width('100%').height('100%').backgroundColor(0xDCDCDC).padding({ top: 5 })
  }
}
