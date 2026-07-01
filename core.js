function cloneMap(map){
  try{
    return structuredClone(map);
  }catch{
    return new Map(map);
  }
}

function cloneSet(set){
  try{
    return structuredClone(set);
  }catch{
    return new Set(set);
  }
}

function cloneArray(arr){
  try{
    return structuredClone(arr);
  }catch{
    return [...arr];
  }
}

function cloneObject(obj){
  try{
    return structuredClone(obj);
  }catch{
    return {...obj};
  }
}
