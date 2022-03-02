import Base64Js from "./Base64-js.ets";
import URLSearchParamsPolyfillJsunit from "./URLSearchParamsPolyfillJsunit.ets";
import URLPolyfillJsunit from "./URLPolyfillJsunit.ets";
import TextEncoderPolyfillJsunit from "./TextEncoderPolyfillJsunit.ets";
import TextDecoderPolyfillJsunit from "./TextDecoderPolyfillJsunit.ets";
import XhrPolyfillJsunit from "./XhrPolyfillJsunit.ets";
import FetchPolyfillJsunit from "./FetchPolyfillJsunit.ets"

export default function testsuite() {
  TextDecoderPolyfillJsunit()
  TextEncoderPolyfillJsunit()
  URLPolyfillJsunit()
  URLSearchParamsPolyfillJsunit()
  Base64Js()
  XhrPolyfillJsunit()
  FetchPolyfillJsunit()
}
