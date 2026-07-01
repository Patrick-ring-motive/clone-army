function cloneHeaders(headers){
  try{
    return structuredClone(headers);
  }catch{
    const clone = new Headers();
    for(const [key,value] of headers){
      try{
        if(!/^set-cookie$/i.test(key)){
          clone.append(key,value);
        }
      }catch{
        continue;
      }
    }
    if(headers.has('set-cookie')){
      if(Headers.prototype.getSetCookie){
        const cookies = headers.getSetCookie();
        for(const cookie of cookies){
          clone.append('set-cookie',cookie);
        }
      }else{
        clone.append('set-cookie',headers.get('set-cookie'));
      }
    }
    return clone;
  }
}
