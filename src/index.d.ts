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