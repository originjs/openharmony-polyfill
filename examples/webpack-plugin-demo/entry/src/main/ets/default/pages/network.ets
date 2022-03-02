import axios from 'axios'
import {LambdaClient, InvokeCommand} from "@aws-sdk/client-lambda";
import {CognitoIdentityClient} from "@aws-sdk/client-cognito-identity";
import {fromCognitoIdentityPool} from "@aws-sdk/credential-provider-cognito-identity";
import { fetch, TextEncoder,TextDecoder } from 'openharmony-polyfill';

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
        axios.get('https://www.openharmony.cn/sig')
          .then((res) => {
            console.log('---------')
            console.log(res.data)
            this.response = res.statusText
          });
      })

      Button('Use fetch').onClick(() => {
        this.response = 'request...'
        fetch('https://www.openharmony.cn/sig')
          .then(res => {
            console.log('-----------')
            console.log(res.data)
            this.response = res.statusText;
          });
      })

      Button('Use aws-sdk').onClick(() => {
        this.response = 'request aws...'
        const REGION = "us-west-2"
        const client = new LambdaClient({
          region: REGION,
          credentials: fromCognitoIdentityPool({
            client: new CognitoIdentityClient({ region: REGION }),
            identityPoolId: 'us-west-2:e88b2309-dcc2-4ea6-a5a9-1cd4b453e7b7' })
        });
        const params={
          FunctionName: "hello",
          InvocationType: "RequestResponse",
          LogType: "None"
        }
        client.send(new InvokeCommand(params)).then(
          (data) => {
            this.response = new TextDecoder('utf-8').decode(data.Payload)
          },
          (error) => {
            this.response = JSON.stringify(error)
          }
        );
      })

      Text(this.response)
        .fontSize(16)
    }
    .width('100%')
    .height('100%')
  }
}