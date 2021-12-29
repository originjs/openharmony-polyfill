import * as protobuf from "@originjs/protobufjs";

const jsonDescriptor = {
  "nested": {
    "awesomepackage": {
      "nested": {
        "AwesomeMessage": {
          "fields": {
            "awesomeField": {
              "type": "string",
              "id": 1
            }
          }
        }
      }
    }
  }
}

@Entry
@Component
struct Protobuf {
  @State result: string = ''

  build() {
    Flex({ direction: FlexDirection.Column, alignItems: ItemAlign.Center, justifyContent: FlexAlign.Center }) {
      Button('protobuf json').onClick(() => {
        var root = protobuf.Root.fromJSON(jsonDescriptor);
        // Obtain a message type
        var AwesomeMessage = root.lookupType("awesomepackage.AwesomeMessage");
        // Exemplary payload
        var payload = { awesomeField: "AwesomeString" };
        // Verify the payload if necessary (i.e. when possibly incomplete or invalid)
        var errMsg = AwesomeMessage.verify(payload);
        if (errMsg)
        throw Error(errMsg);
        // Create a new message
        var message = AwesomeMessage.create(payload); // or use .fromObject if conversion is necessary
        // Encode a message to an Uint8Array (browser) or Buffer (node)
        var buffer = AwesomeMessage.encode(message).finish();
        // Decode an Uint8Array (browser) or Buffer (node) to a message
        var message = AwesomeMessage.decode(buffer);
        // Maybe convert the message back to a plain object
        var object = AwesomeMessage.toObject(message, {
          longs: String,
          enums: String,
          bytes: String,
          // see ConversionOptions
        });
        this.result = JSON.stringify(object)
      })

      Text(this.result)
        .fontSize(12)
    }
    .width('100%')
    .height('100%')
  }
}