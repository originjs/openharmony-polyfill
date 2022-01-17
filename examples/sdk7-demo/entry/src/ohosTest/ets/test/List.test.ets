import Base64Js from './Base64-js.ets';
import URLSearchParamsPolyfillJsunit from './URLSearchParamsPolyfillJsunit.ets';
import URLPolyfillJsunit from './URLPolyfillJsunit.ets';
import TextEncoderPolyfillJsunit from './TextEncoderPolyfillJsunit.ets';
import TextDecoderPolyfillJsunit from './TextDecoderPolyfillJsunit.ets';
import exampleJsunit from "../test/XhrPolyfillJsunit.test.ets"

export default function testsuite() {
  exampleJsunit()
  TextDecoderPolyfillJsunit()
  TextEncoderPolyfillJsunit()
  URLPolyfillJsunit()
  URLSearchParamsPolyfillJsunit()
  Base64Js()
}
