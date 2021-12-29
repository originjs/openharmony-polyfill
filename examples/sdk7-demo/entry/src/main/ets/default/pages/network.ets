import axios from 'axios'
@Entry
@Component
struct Network {
  @State response: string = ''

  build() {
    Flex({ direction: FlexDirection.Column, alignItems: ItemAlign.Center,
      justifyContent: FlexAlign.Center }) {
      Text('OpenHarmony Network Demo')
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

      Button('Use fetch').onClick(() => {
        this.response = 'request...'
        fetch('https://developer.harmonyos.com/cn/develop/')
          .then(res => {
            console.log('-----------')
            console.log(res.data)
            this.response = res.statusText;
          });
      })
      Text(this.response)
        .fontSize(16)
    }
    .width('100%')
    .height('100%')
  }
}