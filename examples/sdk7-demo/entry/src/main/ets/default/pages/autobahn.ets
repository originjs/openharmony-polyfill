import * as autobahn from 'autobahn-browser'

@Entry
@Component
struct Autobahn {
  @State subMsg: string= '';
  @State appResult: string = '';
  @State routerUrl: string = '';

  build() {
    Flex({ direction: FlexDirection.Column, alignItems: ItemAlign.Center, justifyContent: FlexAlign.Center }) {
      TextInput({
        placeholder: "Please input router url...",
        text: this.routerUrl
      }).height(40)
        .onChange((value: string) => {
        this.routerUrl = 'ws://' + value;
      })
      Button('Connect to router')
        .onClick(() => {
          var connection = new autobahn.Connection({ url: this.routerUrl+'/nightlife', realm: 'realm1' });
          connection.onopen = ((session) => {

            // 1) subscribe to a topic
            session.subscribe('harmonyos.hello', (args)=> {
              console.log("Event:", args[0]);
              this.subMsg = args[0];
            });

            // 2) publish an event
            session.publish('harmonyos.hello', ['Hello, this is harmonyOS!']);

            // 3) register a procedure for remoting
            function add2(args) {
              return args[0] + args[1];
            }

            session.register('harmonyos.add2', add2);

            // 4) call a remote procedure
            session.call('harmonyos.add2', [2, 3]).then(
              (res) => {
                console.log("Result:", res);
                this.appResult = res;
              });
          });

          connection.open();
        })
        .fontSize(20)
        .fontWeight(FontWeight.Bold)
      Text('Subscribed message: ' + this.subMsg)
        .fontSize(17);
      Text('Application result: ' + this.appResult)
        .fontSize(17);
    }
    .width('100%')
    .height('100%')
  }
}