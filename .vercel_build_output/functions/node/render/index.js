var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", {value: true});
var __export = (target, all) => {
  for (var name2 in all)
    __defProp(target, name2, {get: all[name2], enumerable: true});
};
var __reExport = (target, module2, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, {get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable});
  }
  return target;
};
var __toModule = (module2) => {
  return __reExport(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", module2 && module2.__esModule && "default" in module2 ? {get: () => module2.default, enumerable: true} : {value: module2, enumerable: true})), module2);
};

// .svelte-kit/vercel/entry.js
__markAsModule(exports);
__export(exports, {
  default: () => entry_default
});

// node_modules/@sveltejs/kit/dist/http.js
function getRawBody(req) {
  return new Promise((fulfil, reject) => {
    const h = req.headers;
    if (!h["content-type"]) {
      fulfil(null);
      return;
    }
    req.on("error", reject);
    const length = Number(h["content-length"]);
    let data;
    if (!isNaN(length)) {
      data = new Uint8Array(length);
      let i = 0;
      req.on("data", (chunk) => {
        data.set(chunk, i);
        i += chunk.length;
      });
    } else {
      if (h["transfer-encoding"] === void 0) {
        fulfil(null);
        return;
      }
      data = new Uint8Array(0);
      req.on("data", (chunk) => {
        const new_data = new Uint8Array(data.length + chunk.length);
        new_data.set(data);
        new_data.set(chunk, data.length);
        data = new_data;
      });
    }
    req.on("end", () => {
      const [type] = h["content-type"].split(/;\s*/);
      if (type === "application/octet-stream") {
        fulfil(data.buffer);
      }
      const decoder = new TextDecoder(h["content-encoding"] || "utf-8");
      fulfil(decoder.decode(data));
    });
  });
}

// node_modules/@sveltejs/kit/dist/install-fetch.js
var import_http = __toModule(require("http"));
var import_https = __toModule(require("https"));
var import_zlib = __toModule(require("zlib"));
var import_stream = __toModule(require("stream"));
var import_util = __toModule(require("util"));
var import_crypto = __toModule(require("crypto"));
var import_url = __toModule(require("url"));
function dataUriToBuffer(uri) {
  if (!/^data:/i.test(uri)) {
    throw new TypeError('`uri` does not appear to be a Data URI (must begin with "data:")');
  }
  uri = uri.replace(/\r?\n/g, "");
  const firstComma = uri.indexOf(",");
  if (firstComma === -1 || firstComma <= 4) {
    throw new TypeError("malformed data: URI");
  }
  const meta = uri.substring(5, firstComma).split(";");
  let charset = "";
  let base64 = false;
  const type = meta[0] || "text/plain";
  let typeFull = type;
  for (let i = 1; i < meta.length; i++) {
    if (meta[i] === "base64") {
      base64 = true;
    } else {
      typeFull += `;${meta[i]}`;
      if (meta[i].indexOf("charset=") === 0) {
        charset = meta[i].substring(8);
      }
    }
  }
  if (!meta[0] && !charset.length) {
    typeFull += ";charset=US-ASCII";
    charset = "US-ASCII";
  }
  const encoding = base64 ? "base64" : "ascii";
  const data = unescape(uri.substring(firstComma + 1));
  const buffer = Buffer.from(data, encoding);
  buffer.type = type;
  buffer.typeFull = typeFull;
  buffer.charset = charset;
  return buffer;
}
var src = dataUriToBuffer;
var {Readable} = import_stream.default;
var wm = new WeakMap();
async function* read(parts) {
  for (const part of parts) {
    if ("stream" in part) {
      yield* part.stream();
    } else {
      yield part;
    }
  }
}
var Blob = class {
  constructor(blobParts = [], options2 = {}) {
    let size = 0;
    const parts = blobParts.map((element) => {
      let buffer;
      if (element instanceof Buffer) {
        buffer = element;
      } else if (ArrayBuffer.isView(element)) {
        buffer = Buffer.from(element.buffer, element.byteOffset, element.byteLength);
      } else if (element instanceof ArrayBuffer) {
        buffer = Buffer.from(element);
      } else if (element instanceof Blob) {
        buffer = element;
      } else {
        buffer = Buffer.from(typeof element === "string" ? element : String(element));
      }
      size += buffer.length || buffer.size || 0;
      return buffer;
    });
    const type = options2.type === void 0 ? "" : String(options2.type).toLowerCase();
    wm.set(this, {
      type: /[^\u0020-\u007E]/.test(type) ? "" : type,
      size,
      parts
    });
  }
  get size() {
    return wm.get(this).size;
  }
  get type() {
    return wm.get(this).type;
  }
  async text() {
    return Buffer.from(await this.arrayBuffer()).toString();
  }
  async arrayBuffer() {
    const data = new Uint8Array(this.size);
    let offset = 0;
    for await (const chunk of this.stream()) {
      data.set(chunk, offset);
      offset += chunk.length;
    }
    return data.buffer;
  }
  stream() {
    return Readable.from(read(wm.get(this).parts));
  }
  slice(start = 0, end = this.size, type = "") {
    const {size} = this;
    let relativeStart = start < 0 ? Math.max(size + start, 0) : Math.min(start, size);
    let relativeEnd = end < 0 ? Math.max(size + end, 0) : Math.min(end, size);
    const span = Math.max(relativeEnd - relativeStart, 0);
    const parts = wm.get(this).parts.values();
    const blobParts = [];
    let added = 0;
    for (const part of parts) {
      const size2 = ArrayBuffer.isView(part) ? part.byteLength : part.size;
      if (relativeStart && size2 <= relativeStart) {
        relativeStart -= size2;
        relativeEnd -= size2;
      } else {
        const chunk = part.slice(relativeStart, Math.min(size2, relativeEnd));
        blobParts.push(chunk);
        added += ArrayBuffer.isView(chunk) ? chunk.byteLength : chunk.size;
        relativeStart = 0;
        if (added >= span) {
          break;
        }
      }
    }
    const blob = new Blob([], {type: String(type).toLowerCase()});
    Object.assign(wm.get(blob), {size: span, parts: blobParts});
    return blob;
  }
  get [Symbol.toStringTag]() {
    return "Blob";
  }
  static [Symbol.hasInstance](object) {
    return object && typeof object === "object" && typeof object.stream === "function" && object.stream.length === 0 && typeof object.constructor === "function" && /^(Blob|File)$/.test(object[Symbol.toStringTag]);
  }
};
Object.defineProperties(Blob.prototype, {
  size: {enumerable: true},
  type: {enumerable: true},
  slice: {enumerable: true}
});
var fetchBlob = Blob;
var FetchBaseError = class extends Error {
  constructor(message, type) {
    super(message);
    Error.captureStackTrace(this, this.constructor);
    this.type = type;
  }
  get name() {
    return this.constructor.name;
  }
  get [Symbol.toStringTag]() {
    return this.constructor.name;
  }
};
var FetchError = class extends FetchBaseError {
  constructor(message, type, systemError) {
    super(message, type);
    if (systemError) {
      this.code = this.errno = systemError.code;
      this.erroredSysCall = systemError.syscall;
    }
  }
};
var NAME = Symbol.toStringTag;
var isURLSearchParameters = (object) => {
  return typeof object === "object" && typeof object.append === "function" && typeof object.delete === "function" && typeof object.get === "function" && typeof object.getAll === "function" && typeof object.has === "function" && typeof object.set === "function" && typeof object.sort === "function" && object[NAME] === "URLSearchParams";
};
var isBlob = (object) => {
  return typeof object === "object" && typeof object.arrayBuffer === "function" && typeof object.type === "string" && typeof object.stream === "function" && typeof object.constructor === "function" && /^(Blob|File)$/.test(object[NAME]);
};
function isFormData(object) {
  return typeof object === "object" && typeof object.append === "function" && typeof object.set === "function" && typeof object.get === "function" && typeof object.getAll === "function" && typeof object.delete === "function" && typeof object.keys === "function" && typeof object.values === "function" && typeof object.entries === "function" && typeof object.constructor === "function" && object[NAME] === "FormData";
}
var isAbortSignal = (object) => {
  return typeof object === "object" && object[NAME] === "AbortSignal";
};
var carriage = "\r\n";
var dashes = "-".repeat(2);
var carriageLength = Buffer.byteLength(carriage);
var getFooter = (boundary) => `${dashes}${boundary}${dashes}${carriage.repeat(2)}`;
function getHeader(boundary, name2, field) {
  let header = "";
  header += `${dashes}${boundary}${carriage}`;
  header += `Content-Disposition: form-data; name="${name2}"`;
  if (isBlob(field)) {
    header += `; filename="${field.name}"${carriage}`;
    header += `Content-Type: ${field.type || "application/octet-stream"}`;
  }
  return `${header}${carriage.repeat(2)}`;
}
var getBoundary = () => (0, import_crypto.randomBytes)(8).toString("hex");
async function* formDataIterator(form, boundary) {
  for (const [name2, value] of form) {
    yield getHeader(boundary, name2, value);
    if (isBlob(value)) {
      yield* value.stream();
    } else {
      yield value;
    }
    yield carriage;
  }
  yield getFooter(boundary);
}
function getFormDataLength(form, boundary) {
  let length = 0;
  for (const [name2, value] of form) {
    length += Buffer.byteLength(getHeader(boundary, name2, value));
    if (isBlob(value)) {
      length += value.size;
    } else {
      length += Buffer.byteLength(String(value));
    }
    length += carriageLength;
  }
  length += Buffer.byteLength(getFooter(boundary));
  return length;
}
var INTERNALS$2 = Symbol("Body internals");
var Body = class {
  constructor(body, {
    size = 0
  } = {}) {
    let boundary = null;
    if (body === null) {
      body = null;
    } else if (isURLSearchParameters(body)) {
      body = Buffer.from(body.toString());
    } else if (isBlob(body))
      ;
    else if (Buffer.isBuffer(body))
      ;
    else if (import_util.types.isAnyArrayBuffer(body)) {
      body = Buffer.from(body);
    } else if (ArrayBuffer.isView(body)) {
      body = Buffer.from(body.buffer, body.byteOffset, body.byteLength);
    } else if (body instanceof import_stream.default)
      ;
    else if (isFormData(body)) {
      boundary = `NodeFetchFormDataBoundary${getBoundary()}`;
      body = import_stream.default.Readable.from(formDataIterator(body, boundary));
    } else {
      body = Buffer.from(String(body));
    }
    this[INTERNALS$2] = {
      body,
      boundary,
      disturbed: false,
      error: null
    };
    this.size = size;
    if (body instanceof import_stream.default) {
      body.on("error", (err) => {
        const error2 = err instanceof FetchBaseError ? err : new FetchError(`Invalid response body while trying to fetch ${this.url}: ${err.message}`, "system", err);
        this[INTERNALS$2].error = error2;
      });
    }
  }
  get body() {
    return this[INTERNALS$2].body;
  }
  get bodyUsed() {
    return this[INTERNALS$2].disturbed;
  }
  async arrayBuffer() {
    const {buffer, byteOffset, byteLength} = await consumeBody(this);
    return buffer.slice(byteOffset, byteOffset + byteLength);
  }
  async blob() {
    const ct = this.headers && this.headers.get("content-type") || this[INTERNALS$2].body && this[INTERNALS$2].body.type || "";
    const buf = await this.buffer();
    return new fetchBlob([buf], {
      type: ct
    });
  }
  async json() {
    const buffer = await consumeBody(this);
    return JSON.parse(buffer.toString());
  }
  async text() {
    const buffer = await consumeBody(this);
    return buffer.toString();
  }
  buffer() {
    return consumeBody(this);
  }
};
Object.defineProperties(Body.prototype, {
  body: {enumerable: true},
  bodyUsed: {enumerable: true},
  arrayBuffer: {enumerable: true},
  blob: {enumerable: true},
  json: {enumerable: true},
  text: {enumerable: true}
});
async function consumeBody(data) {
  if (data[INTERNALS$2].disturbed) {
    throw new TypeError(`body used already for: ${data.url}`);
  }
  data[INTERNALS$2].disturbed = true;
  if (data[INTERNALS$2].error) {
    throw data[INTERNALS$2].error;
  }
  let {body} = data;
  if (body === null) {
    return Buffer.alloc(0);
  }
  if (isBlob(body)) {
    body = body.stream();
  }
  if (Buffer.isBuffer(body)) {
    return body;
  }
  if (!(body instanceof import_stream.default)) {
    return Buffer.alloc(0);
  }
  const accum = [];
  let accumBytes = 0;
  try {
    for await (const chunk of body) {
      if (data.size > 0 && accumBytes + chunk.length > data.size) {
        const err = new FetchError(`content size at ${data.url} over limit: ${data.size}`, "max-size");
        body.destroy(err);
        throw err;
      }
      accumBytes += chunk.length;
      accum.push(chunk);
    }
  } catch (error2) {
    if (error2 instanceof FetchBaseError) {
      throw error2;
    } else {
      throw new FetchError(`Invalid response body while trying to fetch ${data.url}: ${error2.message}`, "system", error2);
    }
  }
  if (body.readableEnded === true || body._readableState.ended === true) {
    try {
      if (accum.every((c) => typeof c === "string")) {
        return Buffer.from(accum.join(""));
      }
      return Buffer.concat(accum, accumBytes);
    } catch (error2) {
      throw new FetchError(`Could not create Buffer from response body for ${data.url}: ${error2.message}`, "system", error2);
    }
  } else {
    throw new FetchError(`Premature close of server response while trying to fetch ${data.url}`);
  }
}
var clone = (instance, highWaterMark) => {
  let p1;
  let p2;
  let {body} = instance;
  if (instance.bodyUsed) {
    throw new Error("cannot clone body after it is used");
  }
  if (body instanceof import_stream.default && typeof body.getBoundary !== "function") {
    p1 = new import_stream.PassThrough({highWaterMark});
    p2 = new import_stream.PassThrough({highWaterMark});
    body.pipe(p1);
    body.pipe(p2);
    instance[INTERNALS$2].body = p1;
    body = p2;
  }
  return body;
};
var extractContentType = (body, request) => {
  if (body === null) {
    return null;
  }
  if (typeof body === "string") {
    return "text/plain;charset=UTF-8";
  }
  if (isURLSearchParameters(body)) {
    return "application/x-www-form-urlencoded;charset=UTF-8";
  }
  if (isBlob(body)) {
    return body.type || null;
  }
  if (Buffer.isBuffer(body) || import_util.types.isAnyArrayBuffer(body) || ArrayBuffer.isView(body)) {
    return null;
  }
  if (body && typeof body.getBoundary === "function") {
    return `multipart/form-data;boundary=${body.getBoundary()}`;
  }
  if (isFormData(body)) {
    return `multipart/form-data; boundary=${request[INTERNALS$2].boundary}`;
  }
  if (body instanceof import_stream.default) {
    return null;
  }
  return "text/plain;charset=UTF-8";
};
var getTotalBytes = (request) => {
  const {body} = request;
  if (body === null) {
    return 0;
  }
  if (isBlob(body)) {
    return body.size;
  }
  if (Buffer.isBuffer(body)) {
    return body.length;
  }
  if (body && typeof body.getLengthSync === "function") {
    return body.hasKnownLength && body.hasKnownLength() ? body.getLengthSync() : null;
  }
  if (isFormData(body)) {
    return getFormDataLength(request[INTERNALS$2].boundary);
  }
  return null;
};
var writeToStream = (dest, {body}) => {
  if (body === null) {
    dest.end();
  } else if (isBlob(body)) {
    body.stream().pipe(dest);
  } else if (Buffer.isBuffer(body)) {
    dest.write(body);
    dest.end();
  } else {
    body.pipe(dest);
  }
};
var validateHeaderName = typeof import_http.default.validateHeaderName === "function" ? import_http.default.validateHeaderName : (name2) => {
  if (!/^[\^`\-\w!#$%&'*+.|~]+$/.test(name2)) {
    const err = new TypeError(`Header name must be a valid HTTP token [${name2}]`);
    Object.defineProperty(err, "code", {value: "ERR_INVALID_HTTP_TOKEN"});
    throw err;
  }
};
var validateHeaderValue = typeof import_http.default.validateHeaderValue === "function" ? import_http.default.validateHeaderValue : (name2, value) => {
  if (/[^\t\u0020-\u007E\u0080-\u00FF]/.test(value)) {
    const err = new TypeError(`Invalid character in header content ["${name2}"]`);
    Object.defineProperty(err, "code", {value: "ERR_INVALID_CHAR"});
    throw err;
  }
};
var Headers = class extends URLSearchParams {
  constructor(init2) {
    let result = [];
    if (init2 instanceof Headers) {
      const raw = init2.raw();
      for (const [name2, values] of Object.entries(raw)) {
        result.push(...values.map((value) => [name2, value]));
      }
    } else if (init2 == null)
      ;
    else if (typeof init2 === "object" && !import_util.types.isBoxedPrimitive(init2)) {
      const method = init2[Symbol.iterator];
      if (method == null) {
        result.push(...Object.entries(init2));
      } else {
        if (typeof method !== "function") {
          throw new TypeError("Header pairs must be iterable");
        }
        result = [...init2].map((pair) => {
          if (typeof pair !== "object" || import_util.types.isBoxedPrimitive(pair)) {
            throw new TypeError("Each header pair must be an iterable object");
          }
          return [...pair];
        }).map((pair) => {
          if (pair.length !== 2) {
            throw new TypeError("Each header pair must be a name/value tuple");
          }
          return [...pair];
        });
      }
    } else {
      throw new TypeError("Failed to construct 'Headers': The provided value is not of type '(sequence<sequence<ByteString>> or record<ByteString, ByteString>)");
    }
    result = result.length > 0 ? result.map(([name2, value]) => {
      validateHeaderName(name2);
      validateHeaderValue(name2, String(value));
      return [String(name2).toLowerCase(), String(value)];
    }) : void 0;
    super(result);
    return new Proxy(this, {
      get(target, p, receiver) {
        switch (p) {
          case "append":
          case "set":
            return (name2, value) => {
              validateHeaderName(name2);
              validateHeaderValue(name2, String(value));
              return URLSearchParams.prototype[p].call(receiver, String(name2).toLowerCase(), String(value));
            };
          case "delete":
          case "has":
          case "getAll":
            return (name2) => {
              validateHeaderName(name2);
              return URLSearchParams.prototype[p].call(receiver, String(name2).toLowerCase());
            };
          case "keys":
            return () => {
              target.sort();
              return new Set(URLSearchParams.prototype.keys.call(target)).keys();
            };
          default:
            return Reflect.get(target, p, receiver);
        }
      }
    });
  }
  get [Symbol.toStringTag]() {
    return this.constructor.name;
  }
  toString() {
    return Object.prototype.toString.call(this);
  }
  get(name2) {
    const values = this.getAll(name2);
    if (values.length === 0) {
      return null;
    }
    let value = values.join(", ");
    if (/^content-encoding$/i.test(name2)) {
      value = value.toLowerCase();
    }
    return value;
  }
  forEach(callback) {
    for (const name2 of this.keys()) {
      callback(this.get(name2), name2);
    }
  }
  *values() {
    for (const name2 of this.keys()) {
      yield this.get(name2);
    }
  }
  *entries() {
    for (const name2 of this.keys()) {
      yield [name2, this.get(name2)];
    }
  }
  [Symbol.iterator]() {
    return this.entries();
  }
  raw() {
    return [...this.keys()].reduce((result, key) => {
      result[key] = this.getAll(key);
      return result;
    }, {});
  }
  [Symbol.for("nodejs.util.inspect.custom")]() {
    return [...this.keys()].reduce((result, key) => {
      const values = this.getAll(key);
      if (key === "host") {
        result[key] = values[0];
      } else {
        result[key] = values.length > 1 ? values : values[0];
      }
      return result;
    }, {});
  }
};
Object.defineProperties(Headers.prototype, ["get", "entries", "forEach", "values"].reduce((result, property) => {
  result[property] = {enumerable: true};
  return result;
}, {}));
function fromRawHeaders(headers = []) {
  return new Headers(headers.reduce((result, value, index2, array) => {
    if (index2 % 2 === 0) {
      result.push(array.slice(index2, index2 + 2));
    }
    return result;
  }, []).filter(([name2, value]) => {
    try {
      validateHeaderName(name2);
      validateHeaderValue(name2, String(value));
      return true;
    } catch {
      return false;
    }
  }));
}
var redirectStatus = new Set([301, 302, 303, 307, 308]);
var isRedirect = (code) => {
  return redirectStatus.has(code);
};
var INTERNALS$1 = Symbol("Response internals");
var Response2 = class extends Body {
  constructor(body = null, options2 = {}) {
    super(body, options2);
    const status = options2.status || 200;
    const headers = new Headers(options2.headers);
    if (body !== null && !headers.has("Content-Type")) {
      const contentType = extractContentType(body);
      if (contentType) {
        headers.append("Content-Type", contentType);
      }
    }
    this[INTERNALS$1] = {
      url: options2.url,
      status,
      statusText: options2.statusText || "",
      headers,
      counter: options2.counter,
      highWaterMark: options2.highWaterMark
    };
  }
  get url() {
    return this[INTERNALS$1].url || "";
  }
  get status() {
    return this[INTERNALS$1].status;
  }
  get ok() {
    return this[INTERNALS$1].status >= 200 && this[INTERNALS$1].status < 300;
  }
  get redirected() {
    return this[INTERNALS$1].counter > 0;
  }
  get statusText() {
    return this[INTERNALS$1].statusText;
  }
  get headers() {
    return this[INTERNALS$1].headers;
  }
  get highWaterMark() {
    return this[INTERNALS$1].highWaterMark;
  }
  clone() {
    return new Response2(clone(this, this.highWaterMark), {
      url: this.url,
      status: this.status,
      statusText: this.statusText,
      headers: this.headers,
      ok: this.ok,
      redirected: this.redirected,
      size: this.size
    });
  }
  static redirect(url2, status = 302) {
    if (!isRedirect(status)) {
      throw new RangeError('Failed to execute "redirect" on "response": Invalid status code');
    }
    return new Response2(null, {
      headers: {
        location: new URL(url2).toString()
      },
      status
    });
  }
  get [Symbol.toStringTag]() {
    return "Response";
  }
};
Object.defineProperties(Response2.prototype, {
  url: {enumerable: true},
  status: {enumerable: true},
  ok: {enumerable: true},
  redirected: {enumerable: true},
  statusText: {enumerable: true},
  headers: {enumerable: true},
  clone: {enumerable: true}
});
var getSearch = (parsedURL) => {
  if (parsedURL.search) {
    return parsedURL.search;
  }
  const lastOffset = parsedURL.href.length - 1;
  const hash2 = parsedURL.hash || (parsedURL.href[lastOffset] === "#" ? "#" : "");
  return parsedURL.href[lastOffset - hash2.length] === "?" ? "?" : "";
};
var INTERNALS = Symbol("Request internals");
var isRequest = (object) => {
  return typeof object === "object" && typeof object[INTERNALS] === "object";
};
var Request = class extends Body {
  constructor(input, init2 = {}) {
    let parsedURL;
    if (isRequest(input)) {
      parsedURL = new URL(input.url);
    } else {
      parsedURL = new URL(input);
      input = {};
    }
    let method = init2.method || input.method || "GET";
    method = method.toUpperCase();
    if ((init2.body != null || isRequest(input)) && input.body !== null && (method === "GET" || method === "HEAD")) {
      throw new TypeError("Request with GET/HEAD method cannot have body");
    }
    const inputBody = init2.body ? init2.body : isRequest(input) && input.body !== null ? clone(input) : null;
    super(inputBody, {
      size: init2.size || input.size || 0
    });
    const headers = new Headers(init2.headers || input.headers || {});
    if (inputBody !== null && !headers.has("Content-Type")) {
      const contentType = extractContentType(inputBody, this);
      if (contentType) {
        headers.append("Content-Type", contentType);
      }
    }
    let signal = isRequest(input) ? input.signal : null;
    if ("signal" in init2) {
      signal = init2.signal;
    }
    if (signal !== null && !isAbortSignal(signal)) {
      throw new TypeError("Expected signal to be an instanceof AbortSignal");
    }
    this[INTERNALS] = {
      method,
      redirect: init2.redirect || input.redirect || "follow",
      headers,
      parsedURL,
      signal
    };
    this.follow = init2.follow === void 0 ? input.follow === void 0 ? 20 : input.follow : init2.follow;
    this.compress = init2.compress === void 0 ? input.compress === void 0 ? true : input.compress : init2.compress;
    this.counter = init2.counter || input.counter || 0;
    this.agent = init2.agent || input.agent;
    this.highWaterMark = init2.highWaterMark || input.highWaterMark || 16384;
    this.insecureHTTPParser = init2.insecureHTTPParser || input.insecureHTTPParser || false;
  }
  get method() {
    return this[INTERNALS].method;
  }
  get url() {
    return (0, import_url.format)(this[INTERNALS].parsedURL);
  }
  get headers() {
    return this[INTERNALS].headers;
  }
  get redirect() {
    return this[INTERNALS].redirect;
  }
  get signal() {
    return this[INTERNALS].signal;
  }
  clone() {
    return new Request(this);
  }
  get [Symbol.toStringTag]() {
    return "Request";
  }
};
Object.defineProperties(Request.prototype, {
  method: {enumerable: true},
  url: {enumerable: true},
  headers: {enumerable: true},
  redirect: {enumerable: true},
  clone: {enumerable: true},
  signal: {enumerable: true}
});
var getNodeRequestOptions = (request) => {
  const {parsedURL} = request[INTERNALS];
  const headers = new Headers(request[INTERNALS].headers);
  if (!headers.has("Accept")) {
    headers.set("Accept", "*/*");
  }
  let contentLengthValue = null;
  if (request.body === null && /^(post|put)$/i.test(request.method)) {
    contentLengthValue = "0";
  }
  if (request.body !== null) {
    const totalBytes = getTotalBytes(request);
    if (typeof totalBytes === "number" && !Number.isNaN(totalBytes)) {
      contentLengthValue = String(totalBytes);
    }
  }
  if (contentLengthValue) {
    headers.set("Content-Length", contentLengthValue);
  }
  if (!headers.has("User-Agent")) {
    headers.set("User-Agent", "node-fetch");
  }
  if (request.compress && !headers.has("Accept-Encoding")) {
    headers.set("Accept-Encoding", "gzip,deflate,br");
  }
  let {agent} = request;
  if (typeof agent === "function") {
    agent = agent(parsedURL);
  }
  if (!headers.has("Connection") && !agent) {
    headers.set("Connection", "close");
  }
  const search = getSearch(parsedURL);
  const requestOptions = {
    path: parsedURL.pathname + search,
    pathname: parsedURL.pathname,
    hostname: parsedURL.hostname,
    protocol: parsedURL.protocol,
    port: parsedURL.port,
    hash: parsedURL.hash,
    search: parsedURL.search,
    query: parsedURL.query,
    href: parsedURL.href,
    method: request.method,
    headers: headers[Symbol.for("nodejs.util.inspect.custom")](),
    insecureHTTPParser: request.insecureHTTPParser,
    agent
  };
  return requestOptions;
};
var AbortError = class extends FetchBaseError {
  constructor(message, type = "aborted") {
    super(message, type);
  }
};
var supportedSchemas = new Set(["data:", "http:", "https:"]);
async function fetch2(url2, options_) {
  return new Promise((resolve2, reject) => {
    const request = new Request(url2, options_);
    const options2 = getNodeRequestOptions(request);
    if (!supportedSchemas.has(options2.protocol)) {
      throw new TypeError(`node-fetch cannot load ${url2}. URL scheme "${options2.protocol.replace(/:$/, "")}" is not supported.`);
    }
    if (options2.protocol === "data:") {
      const data = src(request.url);
      const response2 = new Response2(data, {headers: {"Content-Type": data.typeFull}});
      resolve2(response2);
      return;
    }
    const send = (options2.protocol === "https:" ? import_https.default : import_http.default).request;
    const {signal} = request;
    let response = null;
    const abort = () => {
      const error2 = new AbortError("The operation was aborted.");
      reject(error2);
      if (request.body && request.body instanceof import_stream.default.Readable) {
        request.body.destroy(error2);
      }
      if (!response || !response.body) {
        return;
      }
      response.body.emit("error", error2);
    };
    if (signal && signal.aborted) {
      abort();
      return;
    }
    const abortAndFinalize = () => {
      abort();
      finalize();
    };
    const request_ = send(options2);
    if (signal) {
      signal.addEventListener("abort", abortAndFinalize);
    }
    const finalize = () => {
      request_.abort();
      if (signal) {
        signal.removeEventListener("abort", abortAndFinalize);
      }
    };
    request_.on("error", (err) => {
      reject(new FetchError(`request to ${request.url} failed, reason: ${err.message}`, "system", err));
      finalize();
    });
    request_.on("response", (response_) => {
      request_.setTimeout(0);
      const headers = fromRawHeaders(response_.rawHeaders);
      if (isRedirect(response_.statusCode)) {
        const location = headers.get("Location");
        const locationURL = location === null ? null : new URL(location, request.url);
        switch (request.redirect) {
          case "error":
            reject(new FetchError(`uri requested responds with a redirect, redirect mode is set to error: ${request.url}`, "no-redirect"));
            finalize();
            return;
          case "manual":
            if (locationURL !== null) {
              try {
                headers.set("Location", locationURL);
              } catch (error2) {
                reject(error2);
              }
            }
            break;
          case "follow": {
            if (locationURL === null) {
              break;
            }
            if (request.counter >= request.follow) {
              reject(new FetchError(`maximum redirect reached at: ${request.url}`, "max-redirect"));
              finalize();
              return;
            }
            const requestOptions = {
              headers: new Headers(request.headers),
              follow: request.follow,
              counter: request.counter + 1,
              agent: request.agent,
              compress: request.compress,
              method: request.method,
              body: request.body,
              signal: request.signal,
              size: request.size
            };
            if (response_.statusCode !== 303 && request.body && options_.body instanceof import_stream.default.Readable) {
              reject(new FetchError("Cannot follow redirect with body being a readable stream", "unsupported-redirect"));
              finalize();
              return;
            }
            if (response_.statusCode === 303 || (response_.statusCode === 301 || response_.statusCode === 302) && request.method === "POST") {
              requestOptions.method = "GET";
              requestOptions.body = void 0;
              requestOptions.headers.delete("content-length");
            }
            resolve2(fetch2(new Request(locationURL, requestOptions)));
            finalize();
            return;
          }
        }
      }
      response_.once("end", () => {
        if (signal) {
          signal.removeEventListener("abort", abortAndFinalize);
        }
      });
      let body = (0, import_stream.pipeline)(response_, new import_stream.PassThrough(), (error2) => {
        reject(error2);
      });
      if (process.version < "v12.10") {
        response_.on("aborted", abortAndFinalize);
      }
      const responseOptions = {
        url: request.url,
        status: response_.statusCode,
        statusText: response_.statusMessage,
        headers,
        size: request.size,
        counter: request.counter,
        highWaterMark: request.highWaterMark
      };
      const codings = headers.get("Content-Encoding");
      if (!request.compress || request.method === "HEAD" || codings === null || response_.statusCode === 204 || response_.statusCode === 304) {
        response = new Response2(body, responseOptions);
        resolve2(response);
        return;
      }
      const zlibOptions = {
        flush: import_zlib.default.Z_SYNC_FLUSH,
        finishFlush: import_zlib.default.Z_SYNC_FLUSH
      };
      if (codings === "gzip" || codings === "x-gzip") {
        body = (0, import_stream.pipeline)(body, import_zlib.default.createGunzip(zlibOptions), (error2) => {
          reject(error2);
        });
        response = new Response2(body, responseOptions);
        resolve2(response);
        return;
      }
      if (codings === "deflate" || codings === "x-deflate") {
        const raw = (0, import_stream.pipeline)(response_, new import_stream.PassThrough(), (error2) => {
          reject(error2);
        });
        raw.once("data", (chunk) => {
          if ((chunk[0] & 15) === 8) {
            body = (0, import_stream.pipeline)(body, import_zlib.default.createInflate(), (error2) => {
              reject(error2);
            });
          } else {
            body = (0, import_stream.pipeline)(body, import_zlib.default.createInflateRaw(), (error2) => {
              reject(error2);
            });
          }
          response = new Response2(body, responseOptions);
          resolve2(response);
        });
        return;
      }
      if (codings === "br") {
        body = (0, import_stream.pipeline)(body, import_zlib.default.createBrotliDecompress(), (error2) => {
          reject(error2);
        });
        response = new Response2(body, responseOptions);
        resolve2(response);
        return;
      }
      response = new Response2(body, responseOptions);
      resolve2(response);
    });
    writeToStream(request_, request);
  });
}
globalThis.fetch = fetch2;
globalThis.Response = Response2;
globalThis.Request = Request;
globalThis.Headers = Headers;

// node_modules/@sveltejs/kit/dist/ssr.js
var chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_$";
var unsafeChars = /[<>\b\f\n\r\t\0\u2028\u2029]/g;
var reserved = /^(?:do|if|in|for|int|let|new|try|var|byte|case|char|else|enum|goto|long|this|void|with|await|break|catch|class|const|final|float|short|super|throw|while|yield|delete|double|export|import|native|return|switch|throws|typeof|boolean|default|extends|finally|package|private|abstract|continue|debugger|function|volatile|interface|protected|transient|implements|instanceof|synchronized)$/;
var escaped$1 = {
  "<": "\\u003C",
  ">": "\\u003E",
  "/": "\\u002F",
  "\\": "\\\\",
  "\b": "\\b",
  "\f": "\\f",
  "\n": "\\n",
  "\r": "\\r",
  "	": "\\t",
  "\0": "\\0",
  "\u2028": "\\u2028",
  "\u2029": "\\u2029"
};
var objectProtoOwnPropertyNames = Object.getOwnPropertyNames(Object.prototype).sort().join("\0");
function devalue(value) {
  var counts = new Map();
  function walk(thing) {
    if (typeof thing === "function") {
      throw new Error("Cannot stringify a function");
    }
    if (counts.has(thing)) {
      counts.set(thing, counts.get(thing) + 1);
      return;
    }
    counts.set(thing, 1);
    if (!isPrimitive(thing)) {
      var type = getType(thing);
      switch (type) {
        case "Number":
        case "String":
        case "Boolean":
        case "Date":
        case "RegExp":
          return;
        case "Array":
          thing.forEach(walk);
          break;
        case "Set":
        case "Map":
          Array.from(thing).forEach(walk);
          break;
        default:
          var proto = Object.getPrototypeOf(thing);
          if (proto !== Object.prototype && proto !== null && Object.getOwnPropertyNames(proto).sort().join("\0") !== objectProtoOwnPropertyNames) {
            throw new Error("Cannot stringify arbitrary non-POJOs");
          }
          if (Object.getOwnPropertySymbols(thing).length > 0) {
            throw new Error("Cannot stringify POJOs with symbolic keys");
          }
          Object.keys(thing).forEach(function(key) {
            return walk(thing[key]);
          });
      }
    }
  }
  walk(value);
  var names = new Map();
  Array.from(counts).filter(function(entry) {
    return entry[1] > 1;
  }).sort(function(a, b) {
    return b[1] - a[1];
  }).forEach(function(entry, i) {
    names.set(entry[0], getName(i));
  });
  function stringify(thing) {
    if (names.has(thing)) {
      return names.get(thing);
    }
    if (isPrimitive(thing)) {
      return stringifyPrimitive(thing);
    }
    var type = getType(thing);
    switch (type) {
      case "Number":
      case "String":
      case "Boolean":
        return "Object(" + stringify(thing.valueOf()) + ")";
      case "RegExp":
        return "new RegExp(" + stringifyString(thing.source) + ', "' + thing.flags + '")';
      case "Date":
        return "new Date(" + thing.getTime() + ")";
      case "Array":
        var members = thing.map(function(v, i) {
          return i in thing ? stringify(v) : "";
        });
        var tail = thing.length === 0 || thing.length - 1 in thing ? "" : ",";
        return "[" + members.join(",") + tail + "]";
      case "Set":
      case "Map":
        return "new " + type + "([" + Array.from(thing).map(stringify).join(",") + "])";
      default:
        var obj = "{" + Object.keys(thing).map(function(key) {
          return safeKey(key) + ":" + stringify(thing[key]);
        }).join(",") + "}";
        var proto = Object.getPrototypeOf(thing);
        if (proto === null) {
          return Object.keys(thing).length > 0 ? "Object.assign(Object.create(null)," + obj + ")" : "Object.create(null)";
        }
        return obj;
    }
  }
  var str = stringify(value);
  if (names.size) {
    var params_1 = [];
    var statements_1 = [];
    var values_1 = [];
    names.forEach(function(name2, thing) {
      params_1.push(name2);
      if (isPrimitive(thing)) {
        values_1.push(stringifyPrimitive(thing));
        return;
      }
      var type = getType(thing);
      switch (type) {
        case "Number":
        case "String":
        case "Boolean":
          values_1.push("Object(" + stringify(thing.valueOf()) + ")");
          break;
        case "RegExp":
          values_1.push(thing.toString());
          break;
        case "Date":
          values_1.push("new Date(" + thing.getTime() + ")");
          break;
        case "Array":
          values_1.push("Array(" + thing.length + ")");
          thing.forEach(function(v, i) {
            statements_1.push(name2 + "[" + i + "]=" + stringify(v));
          });
          break;
        case "Set":
          values_1.push("new Set");
          statements_1.push(name2 + "." + Array.from(thing).map(function(v) {
            return "add(" + stringify(v) + ")";
          }).join("."));
          break;
        case "Map":
          values_1.push("new Map");
          statements_1.push(name2 + "." + Array.from(thing).map(function(_a) {
            var k = _a[0], v = _a[1];
            return "set(" + stringify(k) + ", " + stringify(v) + ")";
          }).join("."));
          break;
        default:
          values_1.push(Object.getPrototypeOf(thing) === null ? "Object.create(null)" : "{}");
          Object.keys(thing).forEach(function(key) {
            statements_1.push("" + name2 + safeProp(key) + "=" + stringify(thing[key]));
          });
      }
    });
    statements_1.push("return " + str);
    return "(function(" + params_1.join(",") + "){" + statements_1.join(";") + "}(" + values_1.join(",") + "))";
  } else {
    return str;
  }
}
function getName(num) {
  var name2 = "";
  do {
    name2 = chars[num % chars.length] + name2;
    num = ~~(num / chars.length) - 1;
  } while (num >= 0);
  return reserved.test(name2) ? name2 + "_" : name2;
}
function isPrimitive(thing) {
  return Object(thing) !== thing;
}
function stringifyPrimitive(thing) {
  if (typeof thing === "string")
    return stringifyString(thing);
  if (thing === void 0)
    return "void 0";
  if (thing === 0 && 1 / thing < 0)
    return "-0";
  var str = String(thing);
  if (typeof thing === "number")
    return str.replace(/^(-)?0\./, "$1.");
  return str;
}
function getType(thing) {
  return Object.prototype.toString.call(thing).slice(8, -1);
}
function escapeUnsafeChar(c) {
  return escaped$1[c] || c;
}
function escapeUnsafeChars(str) {
  return str.replace(unsafeChars, escapeUnsafeChar);
}
function safeKey(key) {
  return /^[_$a-zA-Z][_$a-zA-Z0-9]*$/.test(key) ? key : escapeUnsafeChars(JSON.stringify(key));
}
function safeProp(key) {
  return /^[_$a-zA-Z][_$a-zA-Z0-9]*$/.test(key) ? "." + key : "[" + escapeUnsafeChars(JSON.stringify(key)) + "]";
}
function stringifyString(str) {
  var result = '"';
  for (var i = 0; i < str.length; i += 1) {
    var char = str.charAt(i);
    var code = char.charCodeAt(0);
    if (char === '"') {
      result += '\\"';
    } else if (char in escaped$1) {
      result += escaped$1[char];
    } else if (code >= 55296 && code <= 57343) {
      var next = str.charCodeAt(i + 1);
      if (code <= 56319 && (next >= 56320 && next <= 57343)) {
        result += char + str[++i];
      } else {
        result += "\\u" + code.toString(16).toUpperCase();
      }
    } else {
      result += char;
    }
  }
  result += '"';
  return result;
}
function noop() {
}
function safe_not_equal(a, b) {
  return a != a ? b == b : a !== b || (a && typeof a === "object" || typeof a === "function");
}
var subscriber_queue = [];
function writable(value, start = noop) {
  let stop;
  const subscribers = [];
  function set(new_value) {
    if (safe_not_equal(value, new_value)) {
      value = new_value;
      if (stop) {
        const run_queue = !subscriber_queue.length;
        for (let i = 0; i < subscribers.length; i += 1) {
          const s2 = subscribers[i];
          s2[1]();
          subscriber_queue.push(s2, value);
        }
        if (run_queue) {
          for (let i = 0; i < subscriber_queue.length; i += 2) {
            subscriber_queue[i][0](subscriber_queue[i + 1]);
          }
          subscriber_queue.length = 0;
        }
      }
    }
  }
  function update(fn) {
    set(fn(value));
  }
  function subscribe(run2, invalidate = noop) {
    const subscriber = [run2, invalidate];
    subscribers.push(subscriber);
    if (subscribers.length === 1) {
      stop = start(set) || noop;
    }
    run2(value);
    return () => {
      const index2 = subscribers.indexOf(subscriber);
      if (index2 !== -1) {
        subscribers.splice(index2, 1);
      }
      if (subscribers.length === 0) {
        stop();
        stop = null;
      }
    };
  }
  return {set, update, subscribe};
}
var s$1 = JSON.stringify;
async function render_response({
  options: options2,
  $session,
  page_config,
  status,
  error: error2,
  branch,
  page
}) {
  const css2 = new Set(options2.entry.css);
  const js = new Set(options2.entry.js);
  const styles = new Set();
  const serialized_data = [];
  let rendered;
  let is_private = false;
  let maxage;
  if (error2) {
    error2.stack = options2.get_stack(error2);
  }
  if (branch) {
    branch.forEach(({node, loaded, fetched, uses_credentials}) => {
      if (node.css)
        node.css.forEach((url2) => css2.add(url2));
      if (node.js)
        node.js.forEach((url2) => js.add(url2));
      if (node.styles)
        node.styles.forEach((content) => styles.add(content));
      if (fetched && page_config.hydrate)
        serialized_data.push(...fetched);
      if (uses_credentials)
        is_private = true;
      maxage = loaded.maxage;
    });
    const session = writable($session);
    const props = {
      stores: {
        page: writable(null),
        navigating: writable(null),
        session
      },
      page,
      components: branch.map(({node}) => node.module.default)
    };
    for (let i = 0; i < branch.length; i += 1) {
      props[`props_${i}`] = await branch[i].loaded.props;
    }
    let session_tracking_active = false;
    const unsubscribe = session.subscribe(() => {
      if (session_tracking_active)
        is_private = true;
    });
    session_tracking_active = true;
    try {
      rendered = options2.root.render(props);
    } finally {
      unsubscribe();
    }
  } else {
    rendered = {head: "", html: "", css: ""};
  }
  const include_js = page_config.router || page_config.hydrate;
  if (!include_js)
    js.clear();
  const links = options2.amp ? styles.size > 0 ? `<style amp-custom>${Array.from(styles).join("\n")}</style>` : "" : [
    ...Array.from(js).map((dep) => `<link rel="modulepreload" href="${dep}">`),
    ...Array.from(css2).map((dep) => `<link rel="stylesheet" href="${dep}">`)
  ].join("\n		");
  let init2 = "";
  if (options2.amp) {
    init2 = `
		<style amp-boilerplate>body{-webkit-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-moz-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-ms-animation:-amp-start 8s steps(1,end) 0s 1 normal both;animation:-amp-start 8s steps(1,end) 0s 1 normal both}@-webkit-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-moz-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-ms-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-o-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}</style>
		<noscript><style amp-boilerplate>body{-webkit-animation:none;-moz-animation:none;-ms-animation:none;animation:none}</style></noscript>
		<script async src="https://cdn.ampproject.org/v0.js"></script>`;
  } else if (include_js) {
    init2 = `<script type="module">
			import { start } from ${s$1(options2.entry.file)};
			start({
				target: ${options2.target ? `document.querySelector(${s$1(options2.target)})` : "document.body"},
				paths: ${s$1(options2.paths)},
				session: ${try_serialize($session, (error3) => {
      throw new Error(`Failed to serialize session data: ${error3.message}`);
    })},
				host: ${page && page.host ? s$1(page.host) : "location.host"},
				route: ${!!page_config.router},
				spa: ${!page_config.ssr},
				hydrate: ${page_config.ssr && page_config.hydrate ? `{
					status: ${status},
					error: ${serialize_error(error2)},
					nodes: [
						${branch.map(({node}) => `import(${s$1(node.entry)})`).join(",\n						")}
					],
					page: {
						host: ${page.host ? s$1(page.host) : "location.host"}, // TODO this is redundant
						path: ${s$1(page.path)},
						query: new URLSearchParams(${s$1(page.query.toString())}),
						params: ${s$1(page.params)}
					}
				}` : "null"}
			});
		</script>`;
  }
  const head = [
    rendered.head,
    styles.size && !options2.amp ? `<style data-svelte>${Array.from(styles).join("\n")}</style>` : "",
    links,
    init2
  ].join("\n\n		");
  const body = options2.amp ? rendered.html : `${rendered.html}

			${serialized_data.map(({url: url2, json}) => `<script type="svelte-data" url="${url2}">${json}</script>`).join("\n\n			")}
		`.replace(/^\t{2}/gm, "");
  const headers = {
    "content-type": "text/html"
  };
  if (maxage) {
    headers["cache-control"] = `${is_private ? "private" : "public"}, max-age=${maxage}`;
  }
  if (!options2.floc) {
    headers["permissions-policy"] = "interest-cohort=()";
  }
  return {
    status,
    headers,
    body: options2.template({head, body})
  };
}
function try_serialize(data, fail) {
  try {
    return devalue(data);
  } catch (err) {
    if (fail)
      fail(err);
    return null;
  }
}
function serialize_error(error2) {
  if (!error2)
    return null;
  let serialized = try_serialize(error2);
  if (!serialized) {
    const {name: name2, message, stack} = error2;
    serialized = try_serialize({name: name2, message, stack});
  }
  if (!serialized) {
    serialized = "{}";
  }
  return serialized;
}
function normalize(loaded) {
  if (loaded.error) {
    const error2 = typeof loaded.error === "string" ? new Error(loaded.error) : loaded.error;
    const status = loaded.status;
    if (!(error2 instanceof Error)) {
      return {
        status: 500,
        error: new Error(`"error" property returned from load() must be a string or instance of Error, received type "${typeof error2}"`)
      };
    }
    if (!status || status < 400 || status > 599) {
      console.warn('"error" returned from load() without a valid status code \u2014 defaulting to 500');
      return {status: 500, error: error2};
    }
    return {status, error: error2};
  }
  if (loaded.redirect) {
    if (!loaded.status || Math.floor(loaded.status / 100) !== 3) {
      return {
        status: 500,
        error: new Error('"redirect" property returned from load() must be accompanied by a 3xx status code')
      };
    }
    if (typeof loaded.redirect !== "string") {
      return {
        status: 500,
        error: new Error('"redirect" property returned from load() must be a string')
      };
    }
  }
  return loaded;
}
function resolve(base, path) {
  const baseparts = path[0] === "/" ? [] : base.slice(1).split("/");
  const pathparts = path[0] === "/" ? path.slice(1).split("/") : path.split("/");
  baseparts.pop();
  for (let i = 0; i < pathparts.length; i += 1) {
    const part = pathparts[i];
    if (part === ".")
      continue;
    else if (part === "..")
      baseparts.pop();
    else
      baseparts.push(part);
  }
  return `/${baseparts.join("/")}`;
}
var s = JSON.stringify;
async function load_node({
  request,
  options: options2,
  state,
  route,
  page,
  node,
  $session,
  context,
  is_leaf,
  is_error,
  status,
  error: error2
}) {
  const {module: module2} = node;
  let uses_credentials = false;
  const fetched = [];
  let loaded;
  if (module2.load) {
    const load_input = {
      page,
      get session() {
        uses_credentials = true;
        return $session;
      },
      fetch: async (resource, opts = {}) => {
        let url2;
        if (typeof resource === "string") {
          url2 = resource;
        } else {
          url2 = resource.url;
          opts = {
            method: resource.method,
            headers: resource.headers,
            body: resource.body,
            mode: resource.mode,
            credentials: resource.credentials,
            cache: resource.cache,
            redirect: resource.redirect,
            referrer: resource.referrer,
            integrity: resource.integrity,
            ...opts
          };
        }
        if (options2.read && url2.startsWith(options2.paths.assets)) {
          url2 = url2.replace(options2.paths.assets, "");
        }
        if (url2.startsWith("//")) {
          throw new Error(`Cannot request protocol-relative URL (${url2}) in server-side fetch`);
        }
        let response;
        if (/^[a-zA-Z]+:/.test(url2)) {
          response = await fetch(url2, opts);
        } else {
          const [path, search] = url2.split("?");
          const resolved = resolve(request.path, path);
          const filename = resolved.slice(1);
          const filename_html = `${filename}/index.html`;
          const asset = options2.manifest.assets.find((d) => d.file === filename || d.file === filename_html);
          if (asset) {
            if (options2.read) {
              response = new Response(options2.read(asset.file), {
                headers: {
                  "content-type": asset.type
                }
              });
            } else {
              response = await fetch(`http://${page.host}/${asset.file}`, opts);
            }
          }
          if (!response) {
            const headers = {...opts.headers};
            if (opts.credentials !== "omit") {
              uses_credentials = true;
              headers.cookie = request.headers.cookie;
              if (!headers.authorization) {
                headers.authorization = request.headers.authorization;
              }
            }
            const rendered = await respond({
              host: request.host,
              method: opts.method || "GET",
              headers,
              path: resolved,
              rawBody: opts.body,
              query: new URLSearchParams(search)
            }, options2, {
              fetched: url2,
              initiator: route
            });
            if (rendered) {
              if (state.prerender) {
                state.prerender.dependencies.set(resolved, rendered);
              }
              response = new Response(rendered.body, {
                status: rendered.status,
                headers: rendered.headers
              });
            }
          }
        }
        if (response) {
          const proxy = new Proxy(response, {
            get(response2, key, receiver) {
              async function text() {
                const body = await response2.text();
                const headers = {};
                for (const [key2, value] of response2.headers) {
                  if (key2 !== "etag" && key2 !== "set-cookie")
                    headers[key2] = value;
                }
                fetched.push({
                  url: url2,
                  json: `{"status":${response2.status},"statusText":${s(response2.statusText)},"headers":${s(headers)},"body":${escape(body)}}`
                });
                return body;
              }
              if (key === "text") {
                return text;
              }
              if (key === "json") {
                return async () => {
                  return JSON.parse(await text());
                };
              }
              return Reflect.get(response2, key, response2);
            }
          });
          return proxy;
        }
        return response || new Response("Not found", {
          status: 404
        });
      },
      context: {...context}
    };
    if (is_error) {
      load_input.status = status;
      load_input.error = error2;
    }
    loaded = await module2.load.call(null, load_input);
  } else {
    loaded = {};
  }
  if (!loaded && is_leaf && !is_error)
    return;
  return {
    node,
    loaded: normalize(loaded),
    context: loaded.context || context,
    fetched,
    uses_credentials
  };
}
var escaped = {
  "<": "\\u003C",
  ">": "\\u003E",
  "/": "\\u002F",
  "\\": "\\\\",
  "\b": "\\b",
  "\f": "\\f",
  "\n": "\\n",
  "\r": "\\r",
  "	": "\\t",
  "\0": "\\0",
  "\u2028": "\\u2028",
  "\u2029": "\\u2029"
};
function escape(str) {
  let result = '"';
  for (let i = 0; i < str.length; i += 1) {
    const char = str.charAt(i);
    const code = char.charCodeAt(0);
    if (char === '"') {
      result += '\\"';
    } else if (char in escaped) {
      result += escaped[char];
    } else if (code >= 55296 && code <= 57343) {
      const next = str.charCodeAt(i + 1);
      if (code <= 56319 && next >= 56320 && next <= 57343) {
        result += char + str[++i];
      } else {
        result += `\\u${code.toString(16).toUpperCase()}`;
      }
    } else {
      result += char;
    }
  }
  result += '"';
  return result;
}
async function respond_with_error({request, options: options2, state, $session, status, error: error2}) {
  const default_layout = await options2.load_component(options2.manifest.layout);
  const default_error = await options2.load_component(options2.manifest.error);
  const page = {
    host: request.host,
    path: request.path,
    query: request.query,
    params: {}
  };
  const loaded = await load_node({
    request,
    options: options2,
    state,
    route: null,
    page,
    node: default_layout,
    $session,
    context: {},
    is_leaf: false,
    is_error: false
  });
  const branch = [
    loaded,
    await load_node({
      request,
      options: options2,
      state,
      route: null,
      page,
      node: default_error,
      $session,
      context: loaded.context,
      is_leaf: false,
      is_error: true,
      status,
      error: error2
    })
  ];
  try {
    return await render_response({
      options: options2,
      $session,
      page_config: {
        hydrate: options2.hydrate,
        router: options2.router,
        ssr: options2.ssr
      },
      status,
      error: error2,
      branch,
      page
    });
  } catch (error3) {
    options2.handle_error(error3);
    return {
      status: 500,
      headers: {},
      body: error3.stack
    };
  }
}
async function respond$1({request, options: options2, state, $session, route}) {
  const match = route.pattern.exec(request.path);
  const params = route.params(match);
  const page = {
    host: request.host,
    path: request.path,
    query: request.query,
    params
  };
  let nodes;
  try {
    nodes = await Promise.all(route.a.map((id) => id && options2.load_component(id)));
  } catch (error3) {
    options2.handle_error(error3);
    return await respond_with_error({
      request,
      options: options2,
      state,
      $session,
      status: 500,
      error: error3
    });
  }
  const leaf = nodes[nodes.length - 1].module;
  const page_config = {
    ssr: "ssr" in leaf ? leaf.ssr : options2.ssr,
    router: "router" in leaf ? leaf.router : options2.router,
    hydrate: "hydrate" in leaf ? leaf.hydrate : options2.hydrate
  };
  if (!leaf.prerender && state.prerender && !state.prerender.all) {
    return {
      status: 204,
      headers: {},
      body: null
    };
  }
  let branch;
  let status = 200;
  let error2;
  ssr:
    if (page_config.ssr) {
      let context = {};
      branch = [];
      for (let i = 0; i < nodes.length; i += 1) {
        const node = nodes[i];
        let loaded;
        if (node) {
          try {
            loaded = await load_node({
              request,
              options: options2,
              state,
              route,
              page,
              node,
              $session,
              context,
              is_leaf: i === nodes.length - 1,
              is_error: false
            });
            if (!loaded)
              return;
            if (loaded.loaded.redirect) {
              return {
                status: loaded.loaded.status,
                headers: {
                  location: encodeURI(loaded.loaded.redirect)
                }
              };
            }
            if (loaded.loaded.error) {
              ({status, error: error2} = loaded.loaded);
            }
          } catch (e) {
            options2.handle_error(e);
            status = 500;
            error2 = e;
          }
          if (error2) {
            while (i--) {
              if (route.b[i]) {
                const error_node = await options2.load_component(route.b[i]);
                let error_loaded;
                let node_loaded;
                let j = i;
                while (!(node_loaded = branch[j])) {
                  j -= 1;
                }
                try {
                  error_loaded = await load_node({
                    request,
                    options: options2,
                    state,
                    route,
                    page,
                    node: error_node,
                    $session,
                    context: node_loaded.context,
                    is_leaf: false,
                    is_error: true,
                    status,
                    error: error2
                  });
                  if (error_loaded.loaded.error) {
                    continue;
                  }
                  branch = branch.slice(0, j + 1).concat(error_loaded);
                  break ssr;
                } catch (e) {
                  options2.handle_error(e);
                  continue;
                }
              }
            }
            return await respond_with_error({
              request,
              options: options2,
              state,
              $session,
              status,
              error: error2
            });
          }
        }
        branch.push(loaded);
        if (loaded && loaded.loaded.context) {
          context = {
            ...context,
            ...loaded.loaded.context
          };
        }
      }
    }
  try {
    return await render_response({
      options: options2,
      $session,
      page_config,
      status,
      error: error2,
      branch: branch && branch.filter(Boolean),
      page
    });
  } catch (error3) {
    options2.handle_error(error3);
    return await respond_with_error({
      request,
      options: options2,
      state,
      $session,
      status: 500,
      error: error3
    });
  }
}
async function render_page(request, route, options2, state) {
  if (state.initiator === route) {
    return {
      status: 404,
      headers: {},
      body: `Not found: ${request.path}`
    };
  }
  const $session = await options2.hooks.getSession(request);
  if (route) {
    const response = await respond$1({
      request,
      options: options2,
      state,
      $session,
      route
    });
    if (response) {
      return response;
    }
    if (state.fetched) {
      return {
        status: 500,
        headers: {},
        body: `Bad request in load function: failed to fetch ${state.fetched}`
      };
    }
  } else {
    return await respond_with_error({
      request,
      options: options2,
      state,
      $session,
      status: 404,
      error: new Error(`Not found: ${request.path}`)
    });
  }
}
function lowercase_keys(obj) {
  const clone2 = {};
  for (const key in obj) {
    clone2[key.toLowerCase()] = obj[key];
  }
  return clone2;
}
async function render_route(request, route) {
  const mod = await route.load();
  const handler = mod[request.method.toLowerCase().replace("delete", "del")];
  if (handler) {
    const match = route.pattern.exec(request.path);
    const params = route.params(match);
    const response = await handler({...request, params});
    if (response) {
      if (typeof response !== "object") {
        return {
          status: 500,
          body: `Invalid response from route ${request.path};
						 expected an object, got ${typeof response}`,
          headers: {}
        };
      }
      let {status = 200, body, headers = {}} = response;
      headers = lowercase_keys(headers);
      if (typeof body === "object" && (!("content-type" in headers) || headers["content-type"] === "application/json")) {
        headers = {...headers, "content-type": "application/json"};
        body = JSON.stringify(body);
      }
      return {status, body, headers};
    }
  }
}
function read_only_form_data() {
  const map = new Map();
  return {
    append(key, value) {
      if (map.has(key)) {
        map.get(key).push(value);
      } else {
        map.set(key, [value]);
      }
    },
    data: new ReadOnlyFormData(map)
  };
}
var ReadOnlyFormData = class {
  #map;
  constructor(map) {
    this.#map = map;
  }
  get(key) {
    const value = this.#map.get(key);
    return value && value[0];
  }
  getAll(key) {
    return this.#map.get(key);
  }
  has(key) {
    return this.#map.has(key);
  }
  *[Symbol.iterator]() {
    for (const [key, value] of this.#map) {
      for (let i = 0; i < value.length; i += 1) {
        yield [key, value[i]];
      }
    }
  }
  *entries() {
    for (const [key, value] of this.#map) {
      for (let i = 0; i < value.length; i += 1) {
        yield [key, value[i]];
      }
    }
  }
  *keys() {
    for (const [key, value] of this.#map) {
      for (let i = 0; i < value.length; i += 1) {
        yield key;
      }
    }
  }
  *values() {
    for (const [, value] of this.#map) {
      for (let i = 0; i < value.length; i += 1) {
        yield value;
      }
    }
  }
};
function parse_body(req) {
  const raw = req.rawBody;
  if (!raw)
    return raw;
  const [type, ...directives] = req.headers["content-type"].split(/;\s*/);
  if (typeof raw === "string") {
    switch (type) {
      case "text/plain":
        return raw;
      case "application/json":
        return JSON.parse(raw);
      case "application/x-www-form-urlencoded":
        return get_urlencoded(raw);
      case "multipart/form-data": {
        const boundary = directives.find((directive) => directive.startsWith("boundary="));
        if (!boundary)
          throw new Error("Missing boundary");
        return get_multipart(raw, boundary.slice("boundary=".length));
      }
      default:
        throw new Error(`Invalid Content-Type ${type}`);
    }
  }
  return raw;
}
function get_urlencoded(text) {
  const {data, append} = read_only_form_data();
  text.replace(/\+/g, " ").split("&").forEach((str) => {
    const [key, value] = str.split("=");
    append(decodeURIComponent(key), decodeURIComponent(value));
  });
  return data;
}
function get_multipart(text, boundary) {
  const parts = text.split(`--${boundary}`);
  const nope = () => {
    throw new Error("Malformed form data");
  };
  if (parts[0] !== "" || parts[parts.length - 1].trim() !== "--") {
    nope();
  }
  const {data, append} = read_only_form_data();
  parts.slice(1, -1).forEach((part) => {
    const match = /\s*([\s\S]+?)\r\n\r\n([\s\S]*)\s*/.exec(part);
    const raw_headers = match[1];
    const body = match[2].trim();
    let key;
    raw_headers.split("\r\n").forEach((str) => {
      const [raw_header, ...raw_directives] = str.split("; ");
      let [name2, value] = raw_header.split(": ");
      name2 = name2.toLowerCase();
      const directives = {};
      raw_directives.forEach((raw_directive) => {
        const [name3, value2] = raw_directive.split("=");
        directives[name3] = JSON.parse(value2);
      });
      if (name2 === "content-disposition") {
        if (value !== "form-data")
          nope();
        if (directives.filename) {
          throw new Error("File upload is not yet implemented");
        }
        if (directives.name) {
          key = directives.name;
        }
      }
    });
    if (!key)
      nope();
    append(key, body);
  });
  return data;
}
async function respond(incoming, options2, state = {}) {
  if (incoming.path.endsWith("/") && incoming.path !== "/") {
    const q = incoming.query.toString();
    return {
      status: 301,
      headers: {
        location: encodeURI(incoming.path.slice(0, -1) + (q ? `?${q}` : ""))
      }
    };
  }
  try {
    return await options2.hooks.handle({
      request: {
        ...incoming,
        headers: lowercase_keys(incoming.headers),
        body: parse_body(incoming),
        params: null,
        locals: {}
      },
      render: async (request) => {
        if (state.prerender && state.prerender.fallback) {
          return await render_response({
            options: options2,
            $session: await options2.hooks.getSession(request),
            page_config: {ssr: false, router: true, hydrate: true},
            status: 200,
            error: null,
            branch: [],
            page: null
          });
        }
        for (const route of options2.manifest.routes) {
          if (!route.pattern.test(request.path))
            continue;
          const response = route.type === "endpoint" ? await render_route(request, route) : await render_page(request, route, options2, state);
          if (response) {
            if (response.status === 200) {
              if (!/(no-store|immutable)/.test(response.headers["cache-control"])) {
                const etag = `"${hash(response.body)}"`;
                if (request.headers["if-none-match"] === etag) {
                  return {
                    status: 304,
                    headers: {},
                    body: null
                  };
                }
                response.headers["etag"] = etag;
              }
            }
            return response;
          }
        }
        return await render_page(request, null, options2, state);
      }
    });
  } catch (e) {
    options2.handle_error(e);
    return {
      status: 500,
      headers: {},
      body: options2.dev ? e.stack : e.message
    };
  }
}
function hash(str) {
  let hash2 = 5381, i = str.length;
  while (i)
    hash2 = hash2 * 33 ^ str.charCodeAt(--i);
  return (hash2 >>> 0).toString(36);
}

// node_modules/svelte/internal/index.mjs
function noop2() {
}
function run(fn) {
  return fn();
}
function blank_object() {
  return Object.create(null);
}
function run_all(fns) {
  fns.forEach(run);
}
function is_function(thing) {
  return typeof thing === "function";
}
function is_empty(obj) {
  return Object.keys(obj).length === 0;
}
var tasks = new Set();
var active_docs = new Set();
var current_component;
function set_current_component(component) {
  current_component = component;
}
function get_current_component() {
  if (!current_component)
    throw new Error("Function called outside component initialization");
  return current_component;
}
function onMount(fn) {
  get_current_component().$$.on_mount.push(fn);
}
function afterUpdate(fn) {
  get_current_component().$$.after_update.push(fn);
}
function setContext(key, context) {
  get_current_component().$$.context.set(key, context);
}
var resolved_promise = Promise.resolve();
var seen_callbacks = new Set();
var outroing = new Set();
var globals = typeof window !== "undefined" ? window : typeof globalThis !== "undefined" ? globalThis : global;
var boolean_attributes = new Set([
  "allowfullscreen",
  "allowpaymentrequest",
  "async",
  "autofocus",
  "autoplay",
  "checked",
  "controls",
  "default",
  "defer",
  "disabled",
  "formnovalidate",
  "hidden",
  "ismap",
  "loop",
  "multiple",
  "muted",
  "nomodule",
  "novalidate",
  "open",
  "playsinline",
  "readonly",
  "required",
  "reversed",
  "selected"
]);
var invalid_attribute_name_character = /[\s'">/=\u{FDD0}-\u{FDEF}\u{FFFE}\u{FFFF}\u{1FFFE}\u{1FFFF}\u{2FFFE}\u{2FFFF}\u{3FFFE}\u{3FFFF}\u{4FFFE}\u{4FFFF}\u{5FFFE}\u{5FFFF}\u{6FFFE}\u{6FFFF}\u{7FFFE}\u{7FFFF}\u{8FFFE}\u{8FFFF}\u{9FFFE}\u{9FFFF}\u{AFFFE}\u{AFFFF}\u{BFFFE}\u{BFFFF}\u{CFFFE}\u{CFFFF}\u{DFFFE}\u{DFFFF}\u{EFFFE}\u{EFFFF}\u{FFFFE}\u{FFFFF}\u{10FFFE}\u{10FFFF}]/u;
function spread(args, classes_to_add) {
  const attributes = Object.assign({}, ...args);
  if (classes_to_add) {
    if (attributes.class == null) {
      attributes.class = classes_to_add;
    } else {
      attributes.class += " " + classes_to_add;
    }
  }
  let str = "";
  Object.keys(attributes).forEach((name2) => {
    if (invalid_attribute_name_character.test(name2))
      return;
    const value = attributes[name2];
    if (value === true)
      str += " " + name2;
    else if (boolean_attributes.has(name2.toLowerCase())) {
      if (value)
        str += " " + name2;
    } else if (value != null) {
      str += ` ${name2}="${String(value).replace(/"/g, "&#34;").replace(/'/g, "&#39;")}"`;
    }
  });
  return str;
}
var escaped2 = {
  '"': "&quot;",
  "'": "&#39;",
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;"
};
function escape2(html) {
  return String(html).replace(/["'&<>]/g, (match) => escaped2[match]);
}
function each(items, fn) {
  let str = "";
  for (let i = 0; i < items.length; i += 1) {
    str += fn(items[i], i);
  }
  return str;
}
var missing_component = {
  $$render: () => ""
};
function validate_component(component, name2) {
  if (!component || !component.$$render) {
    if (name2 === "svelte:component")
      name2 += " this={...}";
    throw new Error(`<${name2}> is not a valid SSR component. You may need to review your build config to ensure that dependencies are compiled, rather than imported as pre-compiled modules`);
  }
  return component;
}
var on_destroy;
function create_ssr_component(fn) {
  function $$render(result, props, bindings, slots, context) {
    const parent_component = current_component;
    const $$ = {
      on_destroy,
      context: new Map(parent_component ? parent_component.$$.context : context || []),
      on_mount: [],
      before_update: [],
      after_update: [],
      callbacks: blank_object()
    };
    set_current_component({$$});
    const html = fn(result, props, bindings, slots);
    set_current_component(parent_component);
    return html;
  }
  return {
    render: (props = {}, {$$slots = {}, context = new Map()} = {}) => {
      on_destroy = [];
      const result = {title: "", head: "", css: new Set()};
      const html = $$render(result, props, {}, $$slots, context);
      run_all(on_destroy);
      return {
        html,
        css: {
          code: Array.from(result.css).map((css2) => css2.code).join("\n"),
          map: null
        },
        head: result.title + result.head
      };
    },
    $$render
  };
}
function add_attribute(name2, value, boolean) {
  if (value == null || boolean && !value)
    return "";
  return ` ${name2}${value === true ? "" : `=${typeof value === "string" ? JSON.stringify(escape2(value)) : `"${value}"`}`}`;
}
function destroy_component(component, detaching) {
  const $$ = component.$$;
  if ($$.fragment !== null) {
    run_all($$.on_destroy);
    $$.fragment && $$.fragment.d(detaching);
    $$.on_destroy = $$.fragment = null;
    $$.ctx = [];
  }
}
var SvelteElement;
if (typeof HTMLElement === "function") {
  SvelteElement = class extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({mode: "open"});
    }
    connectedCallback() {
      const {on_mount} = this.$$;
      this.$$.on_disconnect = on_mount.map(run).filter(is_function);
      for (const key in this.$$.slotted) {
        this.appendChild(this.$$.slotted[key]);
      }
    }
    attributeChangedCallback(attr, _oldValue, newValue) {
      this[attr] = newValue;
    }
    disconnectedCallback() {
      run_all(this.$$.on_disconnect);
    }
    $destroy() {
      destroy_component(this, 1);
      this.$destroy = noop2;
    }
    $on(type, callback) {
      const callbacks = this.$$.callbacks[type] || (this.$$.callbacks[type] = []);
      callbacks.push(callback);
      return () => {
        const index2 = callbacks.indexOf(callback);
        if (index2 !== -1)
          callbacks.splice(index2, 1);
      };
    }
    $set($$props) {
      if (this.$$set && !is_empty($$props)) {
        this.$$.skip_bound = true;
        this.$$set($$props);
        this.$$.skip_bound = false;
      }
    }
  };
}

// .svelte-kit/output/server/app.js
var css$3 = {
  code: "#svelte-announcer.svelte-1j55zn5{position:absolute;left:0;top:0;clip:rect(0 0 0 0);clip-path:inset(50%);overflow:hidden;white-space:nowrap;width:1px;height:1px}",
  map: `{"version":3,"file":"root.svelte","sources":["root.svelte"],"sourcesContent":["<!-- This file is generated by @sveltejs/kit \u2014 do not edit it! -->\\n<script>\\n\\timport { setContext, afterUpdate, onMount } from 'svelte';\\n\\n\\t// stores\\n\\texport let stores;\\n\\texport let page;\\n\\n\\texport let components;\\n\\texport let props_0 = null;\\n\\texport let props_1 = null;\\n\\texport let props_2 = null;\\n\\n\\tsetContext('__svelte__', stores);\\n\\n\\t$: stores.page.set(page);\\n\\tafterUpdate(stores.page.notify);\\n\\n\\tlet mounted = false;\\n\\tlet navigated = false;\\n\\tlet title = null;\\n\\n\\tonMount(() => {\\n\\t\\tconst unsubscribe = stores.page.subscribe(() => {\\n\\t\\t\\tif (mounted) {\\n\\t\\t\\t\\tnavigated = true;\\n\\t\\t\\t\\ttitle = document.title || 'untitled page';\\n\\t\\t\\t}\\n\\t\\t});\\n\\n\\t\\tmounted = true;\\n\\t\\treturn unsubscribe;\\n\\t});\\n</script>\\n\\n<svelte:component this={components[0]} {...(props_0 || {})}>\\n\\t{#if components[1]}\\n\\t\\t<svelte:component this={components[1]} {...(props_1 || {})}>\\n\\t\\t\\t{#if components[2]}\\n\\t\\t\\t\\t<svelte:component this={components[2]} {...(props_2 || {})}/>\\n\\t\\t\\t{/if}\\n\\t\\t</svelte:component>\\n\\t{/if}\\n</svelte:component>\\n\\n{#if mounted}\\n\\t<div id=\\"svelte-announcer\\" aria-live=\\"assertive\\" aria-atomic=\\"true\\">\\n\\t\\t{#if navigated}\\n\\t\\t\\t{title}\\n\\t\\t{/if}\\n\\t</div>\\n{/if}\\n\\n<style>\\n\\t#svelte-announcer {\\n\\t\\tposition: absolute;\\n\\t\\tleft: 0;\\n\\t\\ttop: 0;\\n\\t\\tclip: rect(0 0 0 0);\\n\\t\\tclip-path: inset(50%);\\n\\t\\toverflow: hidden;\\n\\t\\twhite-space: nowrap;\\n\\t\\twidth: 1px;\\n\\t\\theight: 1px;\\n\\t}\\n</style>"],"names":[],"mappings":"AAsDC,iBAAiB,eAAC,CAAC,AAClB,QAAQ,CAAE,QAAQ,CAClB,IAAI,CAAE,CAAC,CACP,GAAG,CAAE,CAAC,CACN,IAAI,CAAE,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CACnB,SAAS,CAAE,MAAM,GAAG,CAAC,CACrB,QAAQ,CAAE,MAAM,CAChB,WAAW,CAAE,MAAM,CACnB,KAAK,CAAE,GAAG,CACV,MAAM,CAAE,GAAG,AACZ,CAAC"}`
};
var Root = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let {stores} = $$props;
  let {page} = $$props;
  let {components} = $$props;
  let {props_0 = null} = $$props;
  let {props_1 = null} = $$props;
  let {props_2 = null} = $$props;
  setContext("__svelte__", stores);
  afterUpdate(stores.page.notify);
  let mounted = false;
  let navigated = false;
  let title = null;
  onMount(() => {
    const unsubscribe = stores.page.subscribe(() => {
      if (mounted) {
        navigated = true;
        title = document.title || "untitled page";
      }
    });
    mounted = true;
    return unsubscribe;
  });
  if ($$props.stores === void 0 && $$bindings.stores && stores !== void 0)
    $$bindings.stores(stores);
  if ($$props.page === void 0 && $$bindings.page && page !== void 0)
    $$bindings.page(page);
  if ($$props.components === void 0 && $$bindings.components && components !== void 0)
    $$bindings.components(components);
  if ($$props.props_0 === void 0 && $$bindings.props_0 && props_0 !== void 0)
    $$bindings.props_0(props_0);
  if ($$props.props_1 === void 0 && $$bindings.props_1 && props_1 !== void 0)
    $$bindings.props_1(props_1);
  if ($$props.props_2 === void 0 && $$bindings.props_2 && props_2 !== void 0)
    $$bindings.props_2(props_2);
  $$result.css.add(css$3);
  {
    stores.page.set(page);
  }
  return `


${validate_component(components[0] || missing_component, "svelte:component").$$render($$result, Object.assign(props_0 || {}), {}, {
    default: () => `${components[1] ? `${validate_component(components[1] || missing_component, "svelte:component").$$render($$result, Object.assign(props_1 || {}), {}, {
      default: () => `${components[2] ? `${validate_component(components[2] || missing_component, "svelte:component").$$render($$result, Object.assign(props_2 || {}), {}, {})}` : ``}`
    })}` : ``}`
  })}

${mounted ? `<div id="${"svelte-announcer"}" aria-live="${"assertive"}" aria-atomic="${"true"}" class="${"svelte-1j55zn5"}">${navigated ? `${escape2(title)}` : ``}</div>` : ``}`;
});
function set_paths(paths) {
}
function set_prerendering(value) {
}
var user_hooks = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module"
});
var template = ({head, body}) => '<!DOCTYPE html>\n<html lang="en">\n	<head>\n		<meta charset="utf-8" />\n		<link rel="icon" href="/favicon.ico" />\n		<meta name="viewport" content="width=device-width, initial-scale=1" />\n		' + head + '\n	</head>\n	<body>\n		<div id="svelte">' + body + "</div>\n	</body>\n</html>\n";
var options = null;
function init(settings) {
  set_paths(settings.paths);
  set_prerendering(settings.prerendering || false);
  options = {
    amp: false,
    dev: false,
    entry: {
      file: "/./_app/start-ff9eef0f.js",
      css: ["/./_app/assets/start-a8cd1609.css"],
      js: ["/./_app/start-ff9eef0f.js", "/./_app/chunks/vendor-d49af5a8.js"]
    },
    fetched: void 0,
    floc: false,
    get_component_path: (id) => "/./_app/" + entry_lookup[id],
    get_stack: (error2) => String(error2),
    handle_error: (error2) => {
      console.error(error2.stack);
      error2.stack = options.get_stack(error2);
    },
    hooks: get_hooks(user_hooks),
    hydrate: true,
    initiator: void 0,
    load_component,
    manifest,
    paths: settings.paths,
    read: settings.read,
    root: Root,
    router: true,
    ssr: true,
    target: "#svelte",
    template
  };
}
var empty = () => ({});
var manifest = {
  assets: [{file: "android-chrome-192x192.png", size: 44459, type: "image/png"}, {file: "android-chrome-512x512.png", size: 243884, type: "image/png"}, {file: "apple-touch-icon.png", size: 39511, type: "image/png"}, {file: "favicon-16x16.png", size: 643, type: "image/png"}, {file: "favicon-32x32.png", size: 1923, type: "image/png"}, {file: "favicon.ico", size: 15406, type: "image/vnd.microsoft.icon"}, {file: "fonts/amatic-sc-v16-latin-regular.woff", size: 31176, type: "font/woff"}, {file: "fonts/amatic-sc-v16-latin-regular.woff2", size: 26984, type: "font/woff2"}, {file: "fonts/josefin-slab-v13-latin-600.woff", size: 12712, type: "font/woff"}, {file: "fonts/josefin-slab-v13-latin-600.woff2", size: 10220, type: "font/woff2"}, {file: "fonts/josefin-slab-v13-latin-regular.woff", size: 12604, type: "font/woff"}, {file: "fonts/josefin-slab-v13-latin-regular.woff2", size: 10024, type: "font/woff2"}, {file: "images/gallerie/barnumBar.jpg", size: 898070, type: "image/jpeg"}, {file: "images/gallerie/barnumTable.jpg", size: 1207681, type: "image/jpeg"}, {file: "images/gallerie/champs.jpg", size: 1653916, type: "image/jpeg"}, {file: "images/gallerie/chats.jpg", size: 779981, type: "image/jpeg"}, {file: "images/gallerie/cuisine.jpg", size: 1428973, type: "image/jpeg"}, {file: "images/gallerie/entree.jpg", size: 1974803, type: "image/jpeg"}, {file: "images/gallerie/panneau.png", size: 1227642, type: "image/png"}, {file: "images/gallerie/paysage.jpg", size: 1922444, type: "image/jpeg"}, {file: "images/gallerie/repasSoir.jpg", size: 484122, type: "image/jpeg"}, {file: "images/gallerie/salleZen.jpg", size: 519812, type: "image/jpeg"}, {file: "images/gallerie/salon.jpg", size: 878905, type: "image/jpeg"}, {file: "images/logo.jpg", size: 57698, type: "image/jpeg"}, {file: "images/maisonVic.jpg", size: 1821865, type: "image/jpeg"}, {file: "robots.txt", size: 67, type: "text/plain"}, {file: "site.webmanifest", size: 263, type: "application/manifest+json"}],
  layout: "src/routes/__layout.svelte",
  error: ".svelte-kit/build/components/error.svelte",
  routes: [
    {
      type: "page",
      pattern: /^\/$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/index.svelte"],
      b: [".svelte-kit/build/components/error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/charte\/?$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/charte.md"],
      b: [".svelte-kit/build/components/error.svelte"]
    }
  ]
};
var get_hooks = (hooks) => ({
  getSession: hooks.getSession || (() => ({})),
  handle: hooks.handle || (({request, render: render2}) => render2(request))
});
var module_lookup = {
  "src/routes/__layout.svelte": () => Promise.resolve().then(function() {
    return __layout;
  }),
  ".svelte-kit/build/components/error.svelte": () => Promise.resolve().then(function() {
    return error;
  }),
  "src/routes/index.svelte": () => Promise.resolve().then(function() {
    return index;
  }),
  "src/routes/charte.md": () => Promise.resolve().then(function() {
    return charte;
  })
};
var metadata_lookup = {"src/routes/__layout.svelte": {entry: "/./_app/pages/__layout.svelte-aaffa7be.js", css: ["/./_app/assets/pages/__layout.svelte-c4de147c.css"], js: ["/./_app/pages/__layout.svelte-aaffa7be.js", "/./_app/chunks/vendor-d49af5a8.js"], styles: null}, ".svelte-kit/build/components/error.svelte": {entry: "/./_app/error.svelte-0f0af684.js", css: [], js: ["/./_app/error.svelte-0f0af684.js", "/./_app/chunks/vendor-d49af5a8.js"], styles: null}, "src/routes/index.svelte": {entry: "/./_app/pages/index.svelte-4650700d.js", css: ["/./_app/assets/pages/index.svelte-a600d1d2.css"], js: ["/./_app/pages/index.svelte-4650700d.js", "/./_app/chunks/vendor-d49af5a8.js"], styles: null}, "src/routes/charte.md": {entry: "/./_app/pages/charte.md-b8e1fb9c.js", css: [], js: ["/./_app/pages/charte.md-b8e1fb9c.js", "/./_app/chunks/vendor-d49af5a8.js"], styles: null}};
async function load_component(file) {
  return {
    module: await module_lookup[file](),
    ...metadata_lookup[file]
  };
}
init({paths: {base: "", assets: "/."}});
function render(request, {
  prerender
} = {}) {
  const host = request.headers["host"];
  return respond({...request, host}, options, {prerender});
}
var css$2 = {
  code: "div.svelte-u3z5rb{padding:1rem;margin:auto;max-width:var(--containerWidth)}@media(max-width: 600px){div.svelte-u3z5rb{padding:0 1rem}}",
  map: `{"version":3,"file":"__layout.svelte","sources":["__layout.svelte"],"sourcesContent":["<script>\\n\\timport '../app.css';\\n</script>\\n\\n<div>\\n\\t<slot />\\n</div>\\n\\n<style>\\n\\tdiv {\\n\\t\\tpadding: 1rem;\\n\\t\\tmargin: auto;\\n\\t\\tmax-width: var(--containerWidth);\\n\\t}\\n\\n\\t@media (max-width: 600px) {\\n\\t\\tdiv {\\n\\t\\t\\tpadding: 0 1rem;\\n\\t\\t}\\n\\t}\\n</style>\\n"],"names":[],"mappings":"AASC,GAAG,cAAC,CAAC,AACJ,OAAO,CAAE,IAAI,CACb,MAAM,CAAE,IAAI,CACZ,SAAS,CAAE,IAAI,gBAAgB,CAAC,AACjC,CAAC,AAED,MAAM,AAAC,YAAY,KAAK,CAAC,AAAC,CAAC,AAC1B,GAAG,cAAC,CAAC,AACJ,OAAO,CAAE,CAAC,CAAC,IAAI,AAChB,CAAC,AACF,CAAC"}`
};
var _layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css$2);
  return `<div class="${"svelte-u3z5rb"}">${slots.default ? slots.default({}) : ``}
</div>`;
});
var __layout = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  default: _layout
});
function load({error: error2, status}) {
  return {props: {error: error2, status}};
}
var Error2 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let {status} = $$props;
  let {error: error2} = $$props;
  if ($$props.status === void 0 && $$bindings.status && status !== void 0)
    $$bindings.status(status);
  if ($$props.error === void 0 && $$bindings.error && error2 !== void 0)
    $$bindings.error(error2);
  return `<h1>${escape2(status)}</h1>

<p>${escape2(error2.message)}</p>


${error2.stack ? `<pre>${escape2(error2.stack)}</pre>` : ``}`;
});
var error = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  default: Error2,
  load
});
var css$1 = {
  code: ".container.svelte-5gucwl.svelte-5gucwl{max-width:100vw;z-index:0;position:relative;background-color:white;margin:0 min(-1rem, calc((var(--containerWidth) - 100vw) / 2));position:relative;cursor:pointer}.next.svelte-5gucwl.svelte-5gucwl{height:100%;position:absolute;top:0;justify-content:center;width:1.5rem;padding:0rem;right:-0.5rem;display:flex;align-items:center;background:white;transition:all 0.2s;color:var(--lightColor)}.carrousel.svelte-5gucwl.svelte-5gucwl{display:flex;overflow:hidden}.container.svelte-5gucwl:hover .next.svelte-5gucwl{width:calc(1.5rem + 6px);color:var(--color)}.center.svelte-5gucwl.svelte-5gucwl{justify-content:center}.carrousel.svelte-5gucwl>img.svelte-5gucwl{max-height:500px;will-change:transform;max-width:100vw;padding:1rem}@media(max-width: 600px){.next.svelte-5gucwl.svelte-5gucwl{display:none}}",
  map: `{"version":3,"file":"Carrousel.svelte","sources":["Carrousel.svelte"],"sourcesContent":["<script>\\n\\timport { flip } from 'svelte/animate';\\n\\timport { cubicOut } from 'svelte/easing';\\n\\timport { onMount } from 'svelte/internal';\\n\\n\\texport let images;\\n\\n\\tlet carousel;\\n\\tlet isOverflowing = true;\\n\\tlet displayedImages = images.map((img, id) => ({ ...img, id }));\\n\\tonMount(() => {\\n\\t\\tisOverflowing = carousel.clientWidth < carousel.scrollWidth;\\n\\t});\\n\\tfunction handleNext() {\\n\\t\\tif (!isOverflowing) {\\n\\t\\t\\treturn;\\n\\t\\t}\\n\\t\\tconst [first, ...rest] = displayedImages;\\n\\t\\tdisplayedImages = [...rest, { ...first, id: rest[rest.length - 1].id + 1 }];\\n\\t}\\n\\n\\tfunction slide(_, params) {\\n\\t\\tconst direction = params.direction || 1;\\n\\t\\treturn {\\n\\t\\t\\tdelay: params.delay || 0,\\n\\t\\t\\tduration: params.duration || 400,\\n\\t\\t\\teasing: params.easing || cubicOut,\\n\\t\\t\\tcss: (t, u) => {\\n\\t\\t\\t\\treturn \`\\n\\t\\t\\t\\t\\ttransform: translateX(\${direction * u * 100}%);\\n\\t\\t\\t\\t\\topacity: \${t};\`;\\n\\t\\t\\t}\\n\\t\\t};\\n\\t}\\n</script>\\n\\n<div class=\\"container\\" on:click={handleNext} role=\\"button\\">\\n\\t<div bind:this={carousel} class=\\"carrousel\\" class:center={!isOverflowing}>\\n\\t\\t{#each displayedImages as { srcset, alt, id } (id)}\\n\\t\\t\\t<img in:slide out:slide={{ direction: -1 }} animate:flip={{ duration: 400 }} {srcset} {alt} />\\n\\t\\t{/each}\\n\\t</div>\\n\\t{#if isOverflowing}\\n\\t\\t<div class=\\"next\\">\u2794</div>\\n\\t{/if}\\n</div>\\n\\n<style>\\n\\t.container {\\n\\t\\tmax-width: 100vw;\\n\\t\\tz-index: 0;\\n\\t\\tposition: relative;\\n\\t\\tbackground-color: white;\\n\\t\\tmargin: 0 min(-1rem, calc((var(--containerWidth) - 100vw) / 2));\\n\\t\\tposition: relative;\\n\\t\\tcursor: pointer;\\n\\t}\\n\\t.next {\\n\\t\\theight: 100%;\\n\\t\\tposition: absolute;\\n\\t\\ttop: 0;\\n\\t\\tjustify-content: center;\\n\\t\\twidth: 1.5rem;\\n\\t\\tpadding: 0rem;\\n\\t\\tright: -0.5rem;\\n\\t\\tdisplay: flex;\\n\\t\\talign-items: center;\\n\\t\\tbackground: white;\\n\\t\\ttransition: all 0.2s;\\n\\t\\tcolor: var(--lightColor);\\n\\t}\\n\\t.carrousel {\\n\\t\\tdisplay: flex;\\n\\t\\toverflow: hidden;\\n\\t}\\n\\t.container:hover .next {\\n\\t\\twidth: calc(1.5rem + 6px);\\n\\t\\tcolor: var(--color);\\n\\t}\\n\\n\\t.center {\\n\\t\\tjustify-content: center;\\n\\t}\\n\\t.carrousel > img {\\n\\t\\tmax-height: 500px;\\n\\t\\twill-change: transform;\\n\\t\\tmax-width: 100vw;\\n\\t\\tpadding: 1rem;\\n\\t}\\n\\n\\t@media (max-width: 600px) {\\n\\t\\t.next {\\n\\t\\t\\tdisplay: none;\\n\\t\\t}\\n\\t}\\n</style>\\n"],"names":[],"mappings":"AAgDC,UAAU,4BAAC,CAAC,AACX,SAAS,CAAE,KAAK,CAChB,OAAO,CAAE,CAAC,CACV,QAAQ,CAAE,QAAQ,CAClB,gBAAgB,CAAE,KAAK,CACvB,MAAM,CAAE,CAAC,CAAC,IAAI,KAAK,CAAC,CAAC,KAAK,CAAC,IAAI,gBAAgB,CAAC,CAAC,CAAC,CAAC,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAC/D,QAAQ,CAAE,QAAQ,CAClB,MAAM,CAAE,OAAO,AAChB,CAAC,AACD,KAAK,4BAAC,CAAC,AACN,MAAM,CAAE,IAAI,CACZ,QAAQ,CAAE,QAAQ,CAClB,GAAG,CAAE,CAAC,CACN,eAAe,CAAE,MAAM,CACvB,KAAK,CAAE,MAAM,CACb,OAAO,CAAE,IAAI,CACb,KAAK,CAAE,OAAO,CACd,OAAO,CAAE,IAAI,CACb,WAAW,CAAE,MAAM,CACnB,UAAU,CAAE,KAAK,CACjB,UAAU,CAAE,GAAG,CAAC,IAAI,CACpB,KAAK,CAAE,IAAI,YAAY,CAAC,AACzB,CAAC,AACD,UAAU,4BAAC,CAAC,AACX,OAAO,CAAE,IAAI,CACb,QAAQ,CAAE,MAAM,AACjB,CAAC,AACD,wBAAU,MAAM,CAAC,KAAK,cAAC,CAAC,AACvB,KAAK,CAAE,KAAK,MAAM,CAAC,CAAC,CAAC,GAAG,CAAC,CACzB,KAAK,CAAE,IAAI,OAAO,CAAC,AACpB,CAAC,AAED,OAAO,4BAAC,CAAC,AACR,eAAe,CAAE,MAAM,AACxB,CAAC,AACD,wBAAU,CAAG,GAAG,cAAC,CAAC,AACjB,UAAU,CAAE,KAAK,CACjB,WAAW,CAAE,SAAS,CACtB,SAAS,CAAE,KAAK,CAChB,OAAO,CAAE,IAAI,AACd,CAAC,AAED,MAAM,AAAC,YAAY,KAAK,CAAC,AAAC,CAAC,AAC1B,KAAK,4BAAC,CAAC,AACN,OAAO,CAAE,IAAI,AACd,CAAC,AACF,CAAC"}`
};
var Carrousel = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let {images} = $$props;
  let carousel;
  let isOverflowing = true;
  let displayedImages = images.map((img, id) => ({...img, id}));
  onMount(() => {
    isOverflowing = carousel.clientWidth < carousel.scrollWidth;
  });
  if ($$props.images === void 0 && $$bindings.images && images !== void 0)
    $$bindings.images(images);
  $$result.css.add(css$1);
  return `<div class="${"container svelte-5gucwl"}" role="${"button"}"><div class="${["carrousel svelte-5gucwl", !isOverflowing ? "center" : ""].join(" ").trim()}"${add_attribute("this", carousel, 1)}>${each(displayedImages, ({srcset, alt, id}) => `<img${add_attribute("srcset", srcset, 0)}${add_attribute("alt", alt, 0)} class="${"svelte-5gucwl"}">`)}</div>
	${isOverflowing ? `<div class="${"next svelte-5gucwl"}">\u2794</div>` : ``}
</div>`;
});
var Accueil = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<span id="${"projet"}"></span>
<h2>Le projet associatif</h2>
<p>Le but de l&#39;association est d&#39;ouvrir et de faire vivre des <strong>espaces de rencontre, de cr\xE9ation, de r\xE9flexion et d&#39;organisation collective</strong> dans cette maison qui fut un lieu d&#39;activit\xE9s et d&#39;h\xE9bergement pendant de nombreuses ann\xE9es. Cela peut prendre de multiples formes : des r\xE9unions, des formations, des ateliers manuels, des projections, des repas partag\xE9s, des r\xE9sidences artistiques, des s\xE9jours et bien d&#39;autres choses encore.</p>
<p>Les activit\xE9s peuvent \xEAtre ponctuelles ou plus r\xE9guli\xE8res (comme les paniers locaux du jeudi). Il est possible de venir \xE0 la maison du Vic pour <strong>une journ\xE9e, plusieurs jours ou plusieurs semaines</strong> en fonction de vos projets !</p>
<p>Vous pouvez consulter la charte pour en savoir plus sur le projet et les activit\xE9s, groupes, collectifs, associations susceptibles d\u2019\xEAtre accueillies dans la maison !</p>
<p><a href="${"/charte"}">D\xE9couvrir la charte de l&#39;association</a></p>
${slots["photos asso"] ? slots["photos asso"]({}) : ``}
<h2>La maison</h2>
<p>Dans la maison, il y a :</p>
<ul><li><strong>Au rez-de-chauss\xE9e</strong> : une grande cuisine, un grand salon avec chemin\xE9e, une chambre (avec 2 lits une place) avec salle de bain et WC adapt\xE9s, un WC, une salle de bain.</li>
<li><strong>Au 1er \xE9tage</strong> : 2 chambres (dont une avec 2 grands lits et une avec un grand lit), une salle de bain, une salle d&#39;activit\xE9s qui peut \xEAtre convertie en chambre (canap\xE9 clic-clac), un WC.</li>
<li><strong>Au 2\xE8me \xE9tage</strong> : une grande salle d&#39;activit\xE9s modulable et un sleeping avec 5 lits une place (dont un superpos\xE9).</li>
<li><strong>Un jardin</strong> devant la maison et un autre grand jardin derri\xE8re sur 2 niveaux.</li></ul>
<p>La maison peut donc accueillir <strong>15 personnes au maximum pour dormir</strong>.</p>
${slots["photos maison"] ? slots["photos maison"]({}) : ``}
<span id="${"tarifs"}"></span>
<h2>Les tarifs</h2>
<p>Nous souhaitons que la Maison soit <strong>la plus accessible possible</strong>.</p>
<p>Apr\xE8s avoir \xE9tudi\xE9 les frais de gestion de la maison (eau, \xE9lectricit\xE9, gaz, assurances, mat\xE9riels de s\xE9curit\xE9, travaux, taxes, etc.), nous vous proposons les tarifs suivants pour l&#39;ann\xE9e 2021.</p>
<p>Ces tarifs sont valables pour toute la maison, ind\xE9pendamment du nombre de personnes.</p>
<h3>Hiver (du jj/mm au jj/mm)</h3>
<table><thead><tr><th align="${"right"}"></th>
<th align="${"right"}">Tarif de base</th>
<th align="${"right"}">Tarif soutien</th></tr></thead>
<tbody><tr><td align="${"right"}">Nuit\xE9e</td>
<td align="${"right"}">80 \u20AC</td>
<td align="${"right"}">100 \u20AC</td></tr>
<tr><td align="${"right"}">Journ\xE9e</td>
<td align="${"right"}">50 \u20AC</td>
<td align="${"right"}">60 \u20AC</td></tr>
<tr><td align="${"right"}">Demi-journ\xE9e</td>
<td align="${"right"}">30 \u20AC</td>
<td align="${"right"}">40 \u20AC</td></tr></tbody></table>
<h3>\xC9t\xE9 (du jj/mm au jj/mm)</h3>
<table><thead><tr><th align="${"right"}"></th>
<th align="${"right"}">Tarif de base</th>
<th align="${"right"}">Tarif soutien</th></tr></thead>
<tbody><tr><td align="${"right"}">Nuit\xE9e</td>
<td align="${"right"}">70 \u20AC</td>
<td align="${"right"}">90 \u20AC</td></tr>
<tr><td align="${"right"}">Journ\xE9e</td>
<td align="${"right"}">40 \u20AC</td>
<td align="${"right"}">50 \u20AC</td></tr>
<tr><td align="${"right"}">Demi-journ\xE9e</td>
<td align="${"right"}">20 \u20AC</td>
<td align="${"right"}">30 \u20AC</td></tr></tbody></table>
<p>Nous sommes disponibles pour vous donner plus d\u2019informations !</p>
<h2>Agenda</h2>
<p>Le planning des activit\xE9s et r\xE9servations de la maison</p>
<iframe src="${"https://calendar.google.com/calendar/embed?showTitle=0&showPrint=0&showTabs=0&showCalendars=0&showTz=0&height=400&wkst=1&bgcolor=%23ffffff&src=lamaisonduvic%40gmail.com&amp;ctz=Europe%2FParis&color=%230F4B38&"}" style="${"border-width:0"}" scrolling="${"no"}" width="${"100%"}" height="${"400"}" frameborder="${"0"}"></iframe>
<span id="${"lieu"}"></span>
<h2>Nous trouver</h2>
<div class="${"colonnes"}"><div><p>Adresse :</p>
<blockquote><p><strong>La Maison du Vic,
5 le Vic,
81640 Monesti\xE9s</strong></p></blockquote>
<p>Nous sommes situ\xE9s :</p>
<ul><li>\xC0 5 minutes de Carmaux (gare SNCF)</li>
<li>\xC0 30 minutes d&#39;Albi</li>
<li>\xC0 1 heure de Toulouse et Rodez</li></ul></div>
<div style="${"text-align: right"}" name><iframe width="${"100%"}" height="${"350"}" frameborder="${"0"}" scrolling="${"no"}" marginheight="${"0"}" marginwidth="${"0"}" src="${"https://www.openstreetmap.org/export/embed.html?bbox=1.5861511230468752%2C43.758200767075934%2C2.638092041015625%2C44.36116948697885&layer=mapnik&marker=44.06045271345171%2C2.11212158203125"}" style="${"border: 1px solid black"}"></iframe><small><a href="${"https://www.openstreetmap.org/?mlat=44.0605&mlon=2.1121#map=10/44.0605/2.1121"}">Voir la carte en grand</a></small></div></div>
<h2>Nous aider</h2>
<p>Notre projet vous parle et vous souhaitez le soutenir ? Vous pouvez adh\xE9rer \xE0 prix libre en suivant le lien ci-dessous.</p>
<p><a href="${"https://www.helloasso.com/associations/vic-et-vers-ca/adhesions/bulletin-d-adhesion-a-l-association-vic-et-vers-ca"}">Soutenir l&#39;association</a></p>`;
});
var barnumBar = "/_app/assets/barnumBar-78b8258c.webp 400w, /_app/assets/barnumBar-b3308dc0.webp 640w, /_app/assets/barnumBar-720f7214.webp 768w, /_app/assets/barnumBar-ace6a8af.webp 1024w";
var barnumTable = "/_app/assets/barnumTable-b83a20af.webp 400w, /_app/assets/barnumTable-94e542b3.webp 640w, /_app/assets/barnumTable-a2d6de68.webp 768w, /_app/assets/barnumTable-2ec03e6d.webp 1024w";
var chats = "/_app/assets/chats-2bacfcce.webp 400w, /_app/assets/chats-96a24397.webp 640w, /_app/assets/chats-117095e3.webp 768w, /_app/assets/chats-82237c3a.webp 1024w";
var cuisine = "/_app/assets/cuisine-4b79899b.webp 400w, /_app/assets/cuisine-5399c69f.webp 640w, /_app/assets/cuisine-ad3dd457.webp 768w, /_app/assets/cuisine-0f2210d9.webp 1024w";
var entree = "/_app/assets/entree-03cc674f.webp 400w, /_app/assets/entree-191360ff.webp 640w, /_app/assets/entree-7306414f.webp 768w, /_app/assets/entree-a8c8d165.webp 1024w";
var repasSoir = "/_app/assets/repasSoir-71e93a28.webp 400w, /_app/assets/repasSoir-b96e0a1d.webp 640w, /_app/assets/repasSoir-3cace4f2.webp 768w, /_app/assets/repasSoir-cfd79a2d.webp 1024w";
var salleZen = "/_app/assets/salleZen-028c8b09.webp 400w, /_app/assets/salleZen-d88d6094.webp 640w, /_app/assets/salleZen-45a6b513.webp 768w, /_app/assets/salleZen-53c6a85a.webp 1024w";
var salon = "/_app/assets/salon-af674888.webp 400w, /_app/assets/salon-6db5d6c0.webp 640w, /_app/assets/salon-e2ff294b.webp 768w, /_app/assets/salon-037d228e.webp 1024w";
var maisonVic = "/_app/assets/maisonVic-afb3ddec.webp 400w, /_app/assets/maisonVic-390acf84.webp 640w, /_app/assets/maisonVic-d398f0ea.webp 768w, /_app/assets/maisonVic-4f60b344.webp 1024w";
var photosAsso = [
  {
    srcset: barnumTable,
    alt: "Des personnes attabl\xE9es sous un barnum pendant une f\xEAte dans le jardin de la maison du Vic"
  },
  {
    srcset: repasSoir,
    alt: "Un repas du soir chaleureux dans la cuisine de la maison du Vic"
  },
  {
    srcset: barnumBar,
    alt: "Des personnes sous un barnum dans le jardin de la maison du vic, autour d'un bar artisanal"
  }
];
var photosMaison = [
  {
    srcset: entree,
    alt: "La facade principale de la maison du Vic, avec la porte d'entr\xE9e, un petit banc et une table et quatre chaise."
  },
  {
    srcset: cuisine,
    alt: "La cuisine de la maison du Vic, avec un four, un lave vaisselle et une fen\xEAtre au dessus de l'\xE9vier"
  },
  {
    srcset: salon,
    alt: "Le salon de la maison, avec une chemin\xE9e et un canap\xE9"
  },
  {
    srcset: salleZen,
    alt: "Trois personnes qui discutent dans la grande salle Zen, sit\xE9e au dernier \xE9tage de la maison du Vic"
  },
  {
    srcset: chats,
    alt: "Deux petits chats \xE0 c\xF4t\xE9 du puits dans le jardin de la maison"
  }
];
var photoMaisonVic = {
  srcset: maisonVic,
  alt: "Vue du hameau de la Maison du Vic"
};
var name = "La Maison du Vic";
var description = "G\xEEte associatif pour initiatives locales, populaires, solidaires et sociales";
var url = "https://lamaisonduvic.org";
var logo = "https://lamaisonduvic.org/images/logo.jpg";
var numberOfRooms = 8;
var numberOfBathroomsTotal = 3;
var numberOfBedrooms = 5;
var petsAllowed = true;
var address = {
  "@type": "PostalAddress",
  addressCountry: "FR",
  addressLocality: "Monesti\xE9s",
  postalCode: "81640",
  streetAddress: "5 Le Vic",
  email: "lamaisonduvic@lilo.org"
};
var latitude = "44.06051";
var longitude = "2.1121";
var image = "https://lamaisonduvic.org/images/maisonVic.jpg";
var maximumAttendeeCapacity = 15;
var makesOffer = {
  "@type": "Offer",
  acceptedPaymentMethod: [
    {
      "@type": "PaymentMethod",
      url: "http://purl.org/goodrelations/v1#Cash"
    },
    {
      "@type": "PaymentMethod",
      url: "http://purl.org/goodrelations/v1#ByBankTransferInAdvance"
    },
    {
      "@type": "PaymentMethod",
      url: "http://purl.org/goodrelations/v1#CheckInAdvance"
    }
  ]
};
var amenityFeature = [
  {
    "@type": "LocationFeatureSpecification",
    name: "Free Wi-Fi"
  },
  {
    "@type": "LocationFeatureSpecification",
    name: "Free parking"
  },
  {
    "@type": "LocationFeatureSpecification",
    name: "Accessible"
  },
  {
    "@type": "LocationFeatureSpecification",
    name: "Pet-friendly"
  },
  {
    "@type": "LocationFeatureSpecification",
    name: "Kid-friendly"
  }
];
var schema = {
  "@context": "http://schema.org",
  "@type": "House",
  name,
  description,
  url,
  logo,
  numberOfRooms,
  numberOfBathroomsTotal,
  numberOfBedrooms,
  petsAllowed,
  address,
  latitude,
  longitude,
  image,
  maximumAttendeeCapacity,
  makesOffer,
  amenityFeature
};
var css = {
  code: "header.svelte-1xfjeep.svelte-1xfjeep{z-index:1;position:relative}.lead.svelte-1xfjeep.svelte-1xfjeep{font-size:120%}.image.svelte-1xfjeep.svelte-1xfjeep{margin:-1rem;display:flex;align-items:center;max-height:50vh;height:calc(1rem + 100vw * 270 / 360);position:relative;overflow:hidden}@media(min-width: 600px){.image.svelte-1xfjeep.svelte-1xfjeep{margin-top:0}}.image.svelte-1xfjeep img.svelte-1xfjeep{width:100%;position:absolute;bottom:0}.svelte-1xfjeep>header{text-align:center}svg.svelte-1xfjeep.svelte-1xfjeep{width:300%;position:absolute;z-index:1;max-height:10rem;bottom:0;left:-100px;transform:rotate(180deg)}path.svelte-1xfjeep.svelte-1xfjeep{fill:white}nav.svelte-1xfjeep.svelte-1xfjeep{text-align:center;position:sticky;top:0;padding:0.6rem;margin:0 -1rem;z-index:1;background-color:var(--color);border-radius:0.1rem;color:#ffffffee}nav.svelte-1xfjeep a.svelte-1xfjeep{color:#ffffffee}",
  map: `{"version":3,"file":"index.svelte","sources":["index.svelte"],"sourcesContent":["<script>\\n\\timport Carrousel from '$lib/Carrousel.svelte';\\n\\timport Content from './_accueil.md';\\n\\timport { photoMaisonVic, photosAsso, photosMaison } from './_images';\\n\\timport schema from './_schema.json';\\n</script>\\n\\n<svelte:head>\\n\\t<title>La maison du Vic</title>\\n\\t{@html \`<script type=\\"application/ld+json\\" >\${JSON.stringify(schema)}<\\\\/script>\`}\\n\\t<meta\\n\\t\\tname=\\"description\\"\\n\\t\\tcontent=\\"G\xEEte associatif pour l'accueil des activit\xE9s et des projets collectifs\\"\\n\\t/>\\n\\t<meta property=\\"og:title\\" content=\\"La Maison du Vic\\" />\\n\\t<meta\\n\\t\\tname=\\"og:description\\"\\n\\t\\tcontent=\\"G\xEEte associatif pour initiatives locales, populaires, solidaires et sociales. \\"\\n\\t/>\\n</svelte:head>\\n\\n<main>\\n\\t<div class=\\"image\\">\\n\\t\\t<svg xmlns=\\"http://www.w3.org/2000/svg\\" viewBox=\\"0 0 1000 100\\" preserveAspectRatio=\\"none\\">\\n\\t\\t\\t<path\\n\\t\\t\\t\\topacity=\\"0.33\\"\\n\\t\\t\\t\\td=\\"M473,67.3c-203.9,88.3-263.1-34-320.3,0C66,119.1,0,59.7,0,59.7V0h1000v59.7 c0,0-62.1,26.1-94.9,29.3c-32.8,3.3-62.8-12.3-75.8-22.1C806,49.6,745.3,8.7,694.9,4.7S492.4,59,473,67.3z\\"\\n\\t\\t\\t/>\\n\\t\\t\\t<path\\n\\t\\t\\t\\topacity=\\"0.66\\"\\n\\t\\t\\t\\td=\\"M734,67.3c-45.5,0-77.2-23.2-129.1-39.1c-28.6-8.7-150.3-10.1-254,39.1 s-91.7-34.4-149.2,0C115.7,118.3,0,39.8,0,39.8V0h1000v36.5c0,0-28.2-18.5-92.1-18.5C810.2,18.1,775.7,67.3,734,67.3z\\"\\n\\t\\t\\t/>\\n\\t\\t\\t<path\\n\\t\\t\\t\\td=\\"M766.1,28.9c-200-57.5-266,65.5-395.1,19.5C242,1.8,242,5.4,184.8,20.6C128,35.8,132.3,44.9,89.9,52.5C28.6,63.7,0,0,0,0 h1000c0,0-9.9,40.9-83.6,48.1S829.6,47,766.1,28.9z\\"\\n\\t\\t\\t/>\\n\\t\\t</svg>\\n\\t\\t<img {...photoMaisonVic} type=\\"image/webp\\" />\\n\\t</div>\\n\\t<header>\\n\\t\\t<img\\n\\t\\t\\theight=\\"130\\"\\n\\t\\t\\tsrc=\\"/images/logo.jpg\\"\\n\\t\\t\\talt=\\"Logo de l'association de la maison du vic : Vic et Vers \xC7a\\"\\n\\t\\t/>\\n\\n\\t\\t<h1>Bienvenu \xE0 la Maison du Vic</h1>\\n\\t\\t<p class=\\"lead\\">G\xEEte associatif pour initiatives locales, populaires, solidaires et sociales</p>\\n\\t</header>\\n\\t<nav>\\n\\t\\t<a href=\\"/#projet\\">Le projet</a> \xB7\\n\\t\\t<a href=\\"/#tarifs\\">Tarifs</a> \xB7\\n\\t\\t<a href=\\"/#lieu\\">Nous trouver</a> \xB7\\n\\t\\t<a href=\\"mailto:lamaisonduvic@lilo.org\\">Nous \xE9crire</a>\\n\\t</nav>\\n\\t<Content>\\n\\t\\t<Carrousel slot=\\"photos asso\\" images={photosAsso} />\\n\\t\\t<Carrousel slot=\\"photos maison\\" images={photosMaison} />\\n\\t</Content>\\n</main>\\n\\n<style>\\n\\theader {\\n\\t\\tz-index: 1;\\n\\t\\tposition: relative;\\n\\t}\\n\\t.lead {\\n\\t\\tfont-size: 120%;\\n\\t}\\n\\t.image {\\n\\t\\tmargin: -1rem;\\n\\t\\tdisplay: flex;\\n\\t\\talign-items: center;\\n\\t\\tmax-height: 50vh;\\n\\t\\theight: calc(1rem + 100vw * 270 / 360);\\n\\t\\tposition: relative;\\n\\t\\toverflow: hidden;\\n\\t}\\n\\t@media (min-width: 600px) {\\n\\t\\t.image {\\n\\t\\t\\tmargin-top: 0;\\n\\t\\t}\\n\\t}\\n\\t.image img {\\n\\t\\twidth: 100%;\\n\\t\\tposition: absolute;\\n\\t\\tbottom: 0;\\n\\t}\\n\\t* > :global(header) {\\n\\t\\ttext-align: center;\\n\\t}\\n\\tsvg {\\n\\t\\twidth: 300%;\\n\\t\\tposition: absolute;\\n\\t\\tz-index: 1;\\n\\t\\tmax-height: 10rem;\\n\\t\\tbottom: 0;\\n\\t\\tleft: -100px;\\n\\t\\ttransform: rotate(180deg);\\n\\t}\\n\\tpath {\\n\\t\\tfill: white;\\n\\t}\\n\\tnav {\\n\\t\\ttext-align: center;\\n\\t\\tposition: sticky;\\n\\t\\ttop: 0;\\n\\t\\tpadding: 0.6rem;\\n\\t\\tmargin: 0 -1rem;\\n\\t\\tz-index: 1;\\n\\t\\tbackground-color: var(--color);\\n\\t\\tborder-radius: 0.1rem;\\n\\t\\tcolor: #ffffffee;\\n\\t}\\n\\tnav a {\\n\\t\\tcolor: #ffffffee;\\n\\t}\\n</style>\\n"],"names":[],"mappings":"AA6DC,MAAM,8BAAC,CAAC,AACP,OAAO,CAAE,CAAC,CACV,QAAQ,CAAE,QAAQ,AACnB,CAAC,AACD,KAAK,8BAAC,CAAC,AACN,SAAS,CAAE,IAAI,AAChB,CAAC,AACD,MAAM,8BAAC,CAAC,AACP,MAAM,CAAE,KAAK,CACb,OAAO,CAAE,IAAI,CACb,WAAW,CAAE,MAAM,CACnB,UAAU,CAAE,IAAI,CAChB,MAAM,CAAE,KAAK,IAAI,CAAC,CAAC,CAAC,KAAK,CAAC,CAAC,CAAC,GAAG,CAAC,CAAC,CAAC,GAAG,CAAC,CACtC,QAAQ,CAAE,QAAQ,CAClB,QAAQ,CAAE,MAAM,AACjB,CAAC,AACD,MAAM,AAAC,YAAY,KAAK,CAAC,AAAC,CAAC,AAC1B,MAAM,8BAAC,CAAC,AACP,UAAU,CAAE,CAAC,AACd,CAAC,AACF,CAAC,AACD,qBAAM,CAAC,GAAG,eAAC,CAAC,AACX,KAAK,CAAE,IAAI,CACX,QAAQ,CAAE,QAAQ,CAClB,MAAM,CAAE,CAAC,AACV,CAAC,AACD,eAAC,CAAW,MAAM,AAAE,CAAC,AACpB,UAAU,CAAE,MAAM,AACnB,CAAC,AACD,GAAG,8BAAC,CAAC,AACJ,KAAK,CAAE,IAAI,CACX,QAAQ,CAAE,QAAQ,CAClB,OAAO,CAAE,CAAC,CACV,UAAU,CAAE,KAAK,CACjB,MAAM,CAAE,CAAC,CACT,IAAI,CAAE,MAAM,CACZ,SAAS,CAAE,OAAO,MAAM,CAAC,AAC1B,CAAC,AACD,IAAI,8BAAC,CAAC,AACL,IAAI,CAAE,KAAK,AACZ,CAAC,AACD,GAAG,8BAAC,CAAC,AACJ,UAAU,CAAE,MAAM,CAClB,QAAQ,CAAE,MAAM,CAChB,GAAG,CAAE,CAAC,CACN,OAAO,CAAE,MAAM,CACf,MAAM,CAAE,CAAC,CAAC,KAAK,CACf,OAAO,CAAE,CAAC,CACV,gBAAgB,CAAE,IAAI,OAAO,CAAC,CAC9B,aAAa,CAAE,MAAM,CACrB,KAAK,CAAE,SAAS,AACjB,CAAC,AACD,kBAAG,CAAC,CAAC,eAAC,CAAC,AACN,KAAK,CAAE,SAAS,AACjB,CAAC"}`
};
var Routes = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css);
  return `${$$result.head += `${$$result.title = `<title>La maison du Vic</title>`, ""}${`<script type="application/ld+json" >${JSON.stringify(schema)}</script>`}<meta name="${"description"}" content="${"G\xEEte associatif pour l'accueil des activit\xE9s et des projets collectifs"}" class="${"svelte-1xfjeep"}" data-svelte="svelte-fa38he"><meta property="${"og:title"}" content="${"La Maison du Vic"}" class="${"svelte-1xfjeep"}" data-svelte="svelte-fa38he"><meta name="${"og:description"}" content="${"G\xEEte associatif pour initiatives locales, populaires, solidaires et sociales. "}" class="${"svelte-1xfjeep"}" data-svelte="svelte-fa38he">`, ""}

<main class="${"svelte-1xfjeep"}"><div class="${"image svelte-1xfjeep"}"><svg xmlns="${"http://www.w3.org/2000/svg"}" viewBox="${"0 0 1000 100"}" preserveAspectRatio="${"none"}" class="${"svelte-1xfjeep"}"><path opacity="${"0.33"}" d="${"M473,67.3c-203.9,88.3-263.1-34-320.3,0C66,119.1,0,59.7,0,59.7V0h1000v59.7 c0,0-62.1,26.1-94.9,29.3c-32.8,3.3-62.8-12.3-75.8-22.1C806,49.6,745.3,8.7,694.9,4.7S492.4,59,473,67.3z"}" class="${"svelte-1xfjeep"}"></path><path opacity="${"0.66"}" d="${"M734,67.3c-45.5,0-77.2-23.2-129.1-39.1c-28.6-8.7-150.3-10.1-254,39.1 s-91.7-34.4-149.2,0C115.7,118.3,0,39.8,0,39.8V0h1000v36.5c0,0-28.2-18.5-92.1-18.5C810.2,18.1,775.7,67.3,734,67.3z"}" class="${"svelte-1xfjeep"}"></path><path d="${"M766.1,28.9c-200-57.5-266,65.5-395.1,19.5C242,1.8,242,5.4,184.8,20.6C128,35.8,132.3,44.9,89.9,52.5C28.6,63.7,0,0,0,0 h1000c0,0-9.9,40.9-83.6,48.1S829.6,47,766.1,28.9z"}" class="${"svelte-1xfjeep"}"></path></svg>
		<img${spread([photoMaisonVic, {type: "image/webp"}], "svelte-1xfjeep")}></div>
	<header class="${"svelte-1xfjeep"}"><img height="${"130"}" src="${"/images/logo.jpg"}" alt="${"Logo de l'association de la maison du vic : Vic et Vers \xC7a"}" class="${"svelte-1xfjeep"}">

		<h1 class="${"svelte-1xfjeep"}">Bienvenu \xE0 la Maison du Vic</h1>
		<p class="${"lead svelte-1xfjeep"}">G\xEEte associatif pour initiatives locales, populaires, solidaires et sociales</p></header>
	<nav class="${"svelte-1xfjeep"}"><a href="${"/#projet"}" class="${"svelte-1xfjeep"}">Le projet</a> \xB7
		<a href="${"/#tarifs"}" class="${"svelte-1xfjeep"}">Tarifs</a> \xB7
		<a href="${"/#lieu"}" class="${"svelte-1xfjeep"}">Nous trouver</a> \xB7
		<a href="${"mailto:lamaisonduvic@lilo.org"}" class="${"svelte-1xfjeep"}">Nous \xE9crire</a></nav>
	${validate_component(Accueil, "Content").$$render($$result, {}, {}, {
    "photos maison": () => `${validate_component(Carrousel, "Carrousel").$$render($$result, {
      slot: "photos maison",
      images: photosMaison
    }, {}, {})}`,
    "photos asso": () => `${validate_component(Carrousel, "Carrousel").$$render($$result, {slot: "photos asso", images: photosAsso}, {}, {})}`
  })}
</main>`;
});
var index = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  default: Routes
});
var META = {};
var Charte = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `${$$result.head += `${$$result.title = `<title>Charte de l&#39;association</title>`, ""}<meta name="${"description"}" content="${"La charte de l'association"}" data-svelte="svelte-r3rsh6"><meta property="${"og:title"}" content="${"La Charte de l'association Vic et Vers \xC7a"}" data-svelte="svelte-r3rsh6"><meta property="${"og:description"}" content="${"L'association propose des espaces de rencontres, de cr\xE9ations, de r\xE9flexions et d'organisations collectives dans le but de promouvoir des initiatives locales, populaires, solidaires et sociales. Vous trouverez ici notre charte compl\xE8te."}" data-svelte="svelte-r3rsh6"><meta property="${"og:image"}" content="${"/images/logo.jpg"}" data-svelte="svelte-r3rsh6"><meta og:locale="${"fr_FR"}" data-svelte="svelte-r3rsh6">`, ""}
<p><a href="${"/"}">\u{1F868} Retour</a></p>
<h1>La charte de l&#39;association</h1>
<p>L&#39;association propose des espaces de rencontres, de cr\xE9ations, de r\xE9flexions et d&#39;organisations collectives dans le but de promouvoir des <strong>initiatives locales, populaires, solidaires et sociales</strong>.</p>
<p>C&#39;est en portant attention au fonctionnement, \xE0 l&#39;ancrage territorial, aux activit\xE9s qu&#39;elle organise et \xE0 l&#39;accessibilit\xE9 que l&#39;association souhaite s\u2019inscrire dans une <strong>d\xE9marche de transformation sociale et de lutte contre les oppressions</strong> en tant que personnes directement concern\xE9es ou solidaires de ces luttes.</p>
<h2>Le fonctionnement</h2>
<p>L&#39;association Vic et Vers \xC7a met \xE0 disposition un lieu de vie collectif, la Maison du Vic. Les personnes qui l&#39;utilisent s\u2019y organisent de <strong>mani\xE8re autonome</strong>, c&#39;est-\xE0-dire :</p>
<ul><li>qu&#39;elles inventent leur fonctionnement propre en respectant le cadre du fonctionnement g\xE9n\xE9ral de l&#39;association et de la Maison du Vic d\xE9fini dans le r\xE8glement int\xE9rieur et les statuts, transmis et disponibles sur place.</li>
<li>qu&#39;elles ne sont pas d\xE9pendant\xB7e\xB7s des administrateur\xB7trice\xB7s de l&#39;association au quotidien, notamment dans la gestion des t\xE2ches m\xE9nag\xE8res.</li></ul>
<p>Les personnes sont invit\xE9es \xE0 porter une attention aux ressources qu&#39;elles utilisent et \xE0 l&#39;environnement du lieu dans <strong>une d\xE9marche \xE9cologique</strong>.</p>
<h2>L&#39;ancrage territorial</h2>
<p>La maison du Vic se situe \xE0 la campagne, sur le hameau du Vic, o\xF9 se m\xEAlent habitations et activit\xE9s agricoles. Le Vic est, dans la commune de Monesti\xE9s et \xE0 quelques kilom\xE8tres de Carmaux, ville marqu\xE9e par son histoire mini\xE8re et ses luttes sociales.</p>
<p>L&#39;association Vic et Vers Ca, par le lieu qu&#39;elle met \xE0 disposition, participe au d\xE9sir d&#39;une campagne o\xF9 se c\xF4toient des gens de diff\xE9rents horizons, de diff\xE9rentes classes sociales, d&#39;une campagne o\xF9 on se parle, o\xF9 l&#39;on se rencontre, et o\xF9 l&#39;on puisse aussi se ressourcer, se retrouver au calme pour r\xE9fl\xE9chir, cr\xE9er, prendre le temps, construire nos \xE9mancipations, s&#39;organiser et se faire du bien.</p>
<p>Nous imaginons les rencontres de groupes locaux et d&#39;ailleurs comme moyen de participer aux dynamiques de ce territoire rural.</p>
<h2>Les activit\xE9s propos\xE9es</h2>
<p>La Maison du Vic est un espace d&#39;organisation collective pour les groupes, associations et collectifs locaux et d&#39;ailleurs qui m\xE8nent des activit\xE9s <strong>culturelles, sociales, politiques ou d&#39;\xE9ducation populaire</strong>.</p>
<p>Ces activit\xE9s peuvent \xEAtre ponctuelles ou r\xE9guli\xE8res.</p>
<h2>L&#39;accessibilit\xE9</h2>
<p>Nous souhaitons que ce lieu soit un outil et un moyen de cr\xE9er du lien et de la rencontre.</p>
<p>Nous voulons que toute personne qui le souhaite puisse avoir acc\xE8s et investir la maison du Vic quelles que soient ses conditions physiques, psychiques, \xE9conomiques, sociales et culturelles.</p>
<p>Nous souhaitons que ce lieu soit un endroit o\xF9 l&#39;on se sente bien, c&#39;est \xE0 dire un lieu accueillant, o\xF9 l&#39;on a envie de venir, o\xF9 l&#39;on ne vive pas d&#39;agression quelle qu&#39;elle soit, o\xF9 chacun\xB7e est attentif\xB7ve aux autres, o\xF9 les limites de chacun.e soient prises en comptes et o\xF9 l&#39;on ne se sente pas jug\xE9\xB7e pour ce que l&#39;on est.</p>
<p>Nous souhaitons donc que cet espace soit accueillant. Nous essaierons de rester \xE0 l&#39;\xE9coute des personnes et des groupes qui s\u2019organisent sur ce lieu, c&#39;est pourquoi le projet de l&#39;association n&#39;est pas fig\xE9 et est amen\xE9 \xE0 \xE9voluer. Toute personne est invit\xE9e \xE0 \xEAtre actrice du projet : en adh\xE9rant, en soutenant, en participant, en proposant, en faisant vivre le lieu.</p>`;
});
var charte = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  default: Charte,
  META
});

// .svelte-kit/vercel/entry.js
var entry_default = async (req, res) => {
  const {pathname, searchParams} = new URL(req.url || "", "http://localhost");
  const rendered = await render({
    method: req.method,
    headers: req.headers,
    path: pathname,
    query: searchParams,
    rawBody: await getRawBody(req)
  });
  if (rendered) {
    const {status, headers, body} = rendered;
    return res.writeHead(status, headers).end(body);
  }
  return res.writeHead(404).end();
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
