import * as autobahn from 'autobahn-browser'

@Entry
@Component
struct Autobahn {
  @State subMsg: string= '';
  @State appResult: string = '';
  @State routerUrl: string = '';
  @State connectState: string = 'Disconnected';
  @State subTopic: string ='default';
  @State pubTopic: string = 'default';
  @State pubText: string = '';
  connection: any = null;

  build() {
    Flex({ direction: FlexDirection.Column, alignItems: ItemAlign.Center, justifyContent: FlexAlign.Center }) {
      Text(this.connectState).fontSize(25)
      Text('Please input router url:').fontSize(20)

      TextInput({
        placeholder: "Please input router url...",
        text: this.routerUrl
      }).height(40)
        .onChange((value: string) => {
        this.routerUrl = 'ws://' + value;
      })

      Button('Connect to router')
        .onClick(() => {
          this.connection = new autobahn.Connection({ url: this.routerUrl+'/nightlife', realm: 'realm1' });
          this.connection.onopen = ((session) => {
            if (session.isOpen)
                    this.connectState='Connected';
          })
          this.connection.onclose = ((reason: string, details: object)=>{
            console.log(reason);
            this.connectState = 'Disconnected';
          })
          this.connection.open();
          })
      .fontSize(15)
      .fontWeight(FontWeight.Bold)

      Divider()

      Button('Subscribe')
      .onClick(()=>{
          this.connection.session.subscribe(this.subTopic, (args)=> {
              console.log("Event:", args[0]);
              this.subMsg = args[0];
            });
      })

      Text('Subscribed message: ' + this.subMsg)
        .fontSize(20)

      Divider()

      Text('Publish Text')
        .fontSize(15)
      TextInput({
        placeholder: "Please input text to publish...",
        text: this.pubText
      }).height(40)
        .onChange((value: string) => {
        this.pubText = value;
      })

      Button('Publish')
      .onClick(()=>{
        if(!(this.pubText===''))
          this.connection.session.publish(this.pubTopic, [this.pubText]);
      })

      Divider()
      Text('Press Register to set the add function').fontSize(15)
      Button('Register')
      .onClick(()=>{
        function add2(args){
            return (parseInt(args[0]) + parseInt(args[1])).toString();
        }

        this.connection.session.register('harmonyos.add2', add2);
      })
      Divider()

      Button('Call(Add)')
      .onClick(()=>{
        this.connection.session.call('harmonyos.add2', [2, 3]).then(
            (res) => {
                console.log("Result:", res);
                this.appResult = res;
              });
      })

      Text('Application result: 2+3=' + this.appResult)
        .fontSize(20)
    }
    .width('100%')
    .height('100%')
  }
}