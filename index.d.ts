declare function fetch(input: RequestInfo, init?: RequestInit): Promise<Response>;

declare class XMLHttpRequest {
    readonly readyState: number;
    readonly response: any;
    readonly responseText: string;
    responseType: string;
    readonly status: number;
    readonly statusText: string;
    timeout: number;
    readonly upload: XMLHttpRequestUpload;

    abort(): void;

    getAllResponseHeaders(): string;

    getResponseHeader(name: string): string | null;

    open(method: string, url: string | URL, async: boolean, username?: string | null, password?: string | null): void;

    overrideMimeType(mime: string): void;

    send(body?: Document | null): void;

    setRequestHeader(name: string, value: string): void;

    readonly DONE: number;
    readonly HEADERS_RECEIVED: number;
    readonly LOADING: number;
    readonly OPENED: number;
    readonly UNSENT: number;
}

declare class TextEncoder {
    constructor(encoding?: string);

    readonly encoding: string;

    encode(str: string): Uint8Array;

    encodeInto(str: string, arr: Uint8Array): { read: number, written: number }
}

declare class TextDecoder {
    constructor(encoding?: string, options?: { fatal?: boolean, ignoreBOM?: boolean }) ;

    readonly encoding: string;
    readonly fatal: boolean;
    readonly ignoreBOM: boolean

    decode(buffer?: ArrayBuffer, options?: { stream: boolean }): string
}

declare class URL {
    constructor(url: string, base?: string) ;

    hash: string;
    host: string;
    hostname: string;
    href: string;

    toString(): string;

    readonly origin: string;
    password: string;
    pathname: string;
    port: string;
    protocol: string;
    search: string;
    readonly searchParams: URLSearchParams;
    username: string;

    toJSON(): string;
}
