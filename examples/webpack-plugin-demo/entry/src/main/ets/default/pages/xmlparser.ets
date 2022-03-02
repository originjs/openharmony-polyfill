import { XMLParser, XMLBuilder, XMLValidator} from "fast-xml-parser"

@Entry
@Component
struct Xmlparser {
  @State result1: string = ''
  @State result2: string = ''

  build() {
    Flex({ direction: FlexDirection.Column, alignItems: ItemAlign.Center, justifyContent: FlexAlign.Center }) {
      Button('XMLParser').onClick(() => {
        const parser = new XMLParser()
        const xmlDataStr = `<root a="nice" checked><a>wow</a></root>`
        let jObj = parser.parse(xmlDataStr)
        this.result1 = JSON.stringify(jObj)
      })
      Text(this.result1)
        .fontSize(12)

      Button('XMLBuilder').onClick(() => {
        const options = {
          ignoreAttributes : false
        };
        const builder = new XMLBuilder(options);
        const jObj ={
          a: 'nice',
          type : 123,
        }
        this.result2 = builder.build(jObj);
      })
      Text(this.result2)
        .fontSize(12)
    }
    .width('100%')
    .height('100%')
  }
}