# Usage of API-search tool
## I. What APIs are used?
1. Open [config.json](/config.json) and change content of root into the file path you want to search.  
(Remember to keep using '\\\\' to divide path segments like 'D:\\\\YourPath')
2. Open terminal at root folder of api-search, and run:
```
node ./src/search.js
``` 
&emsp; &ensp;to get the report in txt and excel at:

* YourPath/ApiSearchReport.txt

* YourPath/ApiSearchReport.xlsx

## II. What methods of an API are used?
1. Make sure you finish part I.
2. Open [config.json](/config.json) and change content of apiName into the name of API you want to search.(e.g. YourAPI)
3. Open terminal at root folder of api-search and run:
```
node ./src/method_search.js
```
&emsp; &nbsp;to get the report in txt and excel at： 

* YourPath/YourAPI_ApiSearchReport.xlsx

* **Notice**: Make sure the api you choose is in search list. You can find the it in the Appendix.

# Appendix
* **Browser API list:**
    * backgroundFetch
    * BarcodeDetector
    * getBattery
    * canvas
    * MessageChannel
    * clipboard
    * navigator.contacts
    * navigator.serviceWorker
    * TextDecoder
    * TextEncoder
    * TextDecoderStream
    * TextEncoderStream
    * fetch
    * navigator.geolocation
    * performance
    * history.
    * indexedDB
    * navigator.mediaCapabilities
    * MediaStream
    * navigator.mediaSession
    * MediaSource
    * MediaRecorder
    * navigator
    * PaymentRequest
    * periodicSync
    * navigator.permissions
    * requestPictureInPicture
    * ResizeObserver
    * navigator.mediaDevices
    * ScreenOrientation
    * navigator.wakeLock
    * EventSource
    * navigator.serviceWorker
    * StorageManager
    * ReadableStream
    * ReadableStreamDefaultReader
    * WritableStream
    * WritableStreamDefaultWriter
    * changedTouches
    * URL
    * URLPattern
    * navigator.vibrate
    * visualViewport
    * Animation
    * AudioContext
    * navigator.credentials
    * crypto.getRandomValues
    * crypto.randomUUID
    * crypto.subtle
    * Notification
    * navigator.share
    * localStorage
    * sessionStorage
    * BroadcastChannel
    * Worker
    * WebSocket
    * XMLHttpRequest
    * AbortController
    * AbortSignal
    * Buffer
    * Event
    * EventTarget
    * MessageChannel
    * MessageEvent
    * MessagePort
    * WebAssembly
    * process
  
* **Node API list:**
    * assert
    * buffer
    * crypto
    * domain
    * errors
    * events
    * fs
    * fs/promises
    * http
    * https
    * module
    * net
    * os
    * path
    * querystring
    * stream
    * string_decoder
    * timers
    * url
    * util
* **Ignored Directory:**
    * .git
    * node_modules
    * test
    * tests
    * browsers-test
    * \_\_tests\_\_
    * scripts
    * spec
    * bin
    * dist
    * doc
    * docs
    * resources
    * samples
    * benchmark
    * release
    * example
    * examples
* Notice: These lists can be altered at [config.json](/config.json)
