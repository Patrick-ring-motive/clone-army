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

function patchBodyGetter(record, cloneMethod = 'clone') {
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

patchBodyGetter(Request);
patchBodyGetter(Response);


(() => {
  const _stream = Blob.prototype.stream;
  Blob.prototype.stream = function stream(...args) {
    return _stream.apply(this.slice(), args);
  };
})();
