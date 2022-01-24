import * as protobuf from "protobufjs";
import ability_featureAbility from '@ohos.ability.featureAbility'
import fileio from '@ohos.fileio';

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
  @State result1: string = ''
  @State result2: string = ''
  @State result3: string = ''
  fileName: string ;

  private aboutToAppear(): void {
    const data = `
    package awesomepackage;
    syntax = "proto3";
    message AwesomeMessage {
      string awesome_field = 1; // becomes awesomeField
    }`;
    const context = ability_featureAbility.getContext();
    context.getFilesDir((error, dir) => {
      if (error) {
        console.error('Failed to obtain the file directory. Cause: ' + JSON.stringify(error));
        return;
      }
      this.fileName = dir + '/awesome1.proto';
      let fd = fileio.openSync(this.fileName, 0o102, 0o666);
      fileio.writeSync(fd, data);
    })

  }

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
        this.result1 = JSON.stringify(object)
      })
      Text(this.result1)
        .fontSize(12)

      Button('protobuf load').onClick(() => {
        let that = this;
        protobuf.load(this.fileName, function (err, root) {
          if (err) {
            that.result2 = err.message;
            throw err;
          }

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
          // ... do something with buffer

          // Decode an Uint8Array (browser) or Buffer (node) to a message
          var message = AwesomeMessage.decode(buffer);
          // ... do something with message
          // If the application uses length-delimited buffers, there is also encodeDelimited and decodeDelimited.
          // Maybe convert the message back to a plain object
          var object = AwesomeMessage.toObject(message, {
            longs: String,
            enums: String,
            bytes: String,
            // see ConversionOptions
          });
          that.result2 = JSON.stringify(object)
        });
      })
      Text(this.result2)
        .fontSize(12)

      Button('protobuf loadSync').onClick(() => {
        // protobuf.util.isNode = true;
        const root = protobuf.loadSync(this.fileName);
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
        // ... do something with buffer

        // Decode an Uint8Array (browser) or Buffer (node) to a message
        var message = AwesomeMessage.decode(buffer);
        // ... do something with message
        // If the application uses length-delimited buffers, there is also encodeDelimited and decodeDelimited.
        // Maybe convert the message back to a plain object
        var object = AwesomeMessage.toObject(message, {
          longs: String,
          enums: String,
          bytes: String,
          // see ConversionOptions
        });
        this.result3 = JSON.stringify(object)
      })
      Text(this.result3)
        .fontSize(12)
    }
    .width('100%')
    .height('100%')
  }
}