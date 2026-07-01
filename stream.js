const nonLockingClone = (() => {
  try {
    const stream = new ReadableStream({
      start(controller) { controller.enqueue(new Uint8Array([1])); controller.close(); }
    });
    new Response(stream).clone().body;
    return !stream.locked;
  } catch {
    return false;
  }
})();

function cloneStream(stream) {
  if (nonLockingClone) {
    return new Response(stream).clone().body;
  }
  const [$this, $clone] = stream.tee();
  const proxy = new Proxy({}, {
    get(_, prop) {
      const value = $this[prop];
      return typeof value === 'function' ? value.bind($this) : value;
    }
  });
  Object.setPrototypeOf(stream, proxy);
  return $clone;
}

(()=>{
  const _getReader = ReadableStream.prototype.getReader;
  ReadableStream.prototype.getReader = Object.setPrototypeOf(function getReader(...args){
    return _getReader.apply(cloneStream(this),args)
  },_getReader);
})();

(()=>{

for(const record of [Request,Response]){
  const proto = record.prototype;
  const desc = Object.getOwnPropertyDescriptor(proto, 'body');
  if (!desc?.get) return;
  const _body = desc.get;
  Object.defineProperty(proto, 'body', {
    get:function body() {
        return _body.call(this.clone());
      },
    configurable: true
  });
}
  
})();


(() => {
  const _stream = Blob.prototype.stream;
  Blob.prototype.stream = Object.setPrototypeOf(function stream(...args) {
    return _stream.apply(this.slice(), args);
  },_stream);
})();
