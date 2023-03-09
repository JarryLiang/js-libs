import _S from 'underscore.string';
function isNullOrUndefined(value:any){
  if (value === null) {
    return true;
  }
  if (value === undefined) {
    return true;
  }
  return false;
}

function isEmpty(s) {
  if (!s) {
    return true;
  }
  if (typeof s === 'string') {
    if (s.length === 0) {
      return true;
    }
    return false;
  }
  try {
    console.log('isEmpy get invalid type');
    console.log(JSON.stringify(s, null, 2));
  } catch (e) {
    console.log(JSON.stringify(e, null, 2));
  }

  return false;
}

function isBlank(str):boolean {
  return (!str || /^\s*$/.test(str));
}


function isNumber(value:any):boolean{
  return  (typeof value === 'number');
  //null -> object
  //undefined ->undefined
}

function isSafeContains(a:string|null,b:string|null):boolean {
  if(isBlank(b)){
    return false;
  }
  if(isBlank(a)){
    return false;
  }
  const a1=a.toLowerCase();
  const b1=b.toLowerCase();

  if(a1.indexOf(b1)>=0){
    return true;
  }
  return false;
}
function compareString(a, b) {
  return (a || '').localeCompare(b || '');
}


function sortStrings(list) {
  if (list) {
    list.sort((a, b) => {
      return compareString(a, b);
    });
  }
}




function splitWord(str) {
  const len = str.length;
  let result=[];
  for(let i=0;i<len;i++){
    result.push(str.charAt(i));
  }
  return result;
}

function isCapital(text) {
  const lt =text.toLowerCase();
  if(text == lt){
    return false;
  }
  return true;

}

function safeTrim(str:any):string{
  if (typeof str === 'string') {
    const s1 = str.trim();
    if (s1.length === str.length) {
      return str;
    }
    return s1;
  }
  return str;
}

function toHtmlFriendly(source):string {
  if (source) {
    return source.replace(/_/g, '').replace(/-/g, '').replace(/\+/g, '').replace(/\//g, '')
      .replace(/\=+$/, '');
  }
  return source;
}

function getByteSize(a:string):number {
  if (a) {
    return new Blob([a]).size;
  }
  return 0;
}

function prefixZero(value, n) {
  const text = `0000000${value}`;
  return text.slice(text.length - n);
}

function prefixZeroMax(value, max) {
  const text = `00000${value}`;
  const n = Math.ceil(Math.log10(max));
  return prefixZero(value, n);
}

function trimLines(lines:string[]):string[]{
    const result = [];
    lines.forEach((l) => {
      if (l) {
        const l2 = l.trim();
        if (isBlank(l2) === false) {
          result.push(l2);
        }
      }
    });
    return result;
}

function toNonBlankLines(text){
  const lines = _S.lines(text);
  const result = [];
  lines.forEach((l) => {
    if (!isBlank(l)) {
      result.push(l.trim());
    }
  });
  return result;
}

function utf8ArrayToStr(array) {
  let out,
    i,
    c;
  let char2,
    char3;

  out = '';
  const len = array.length;
  i = 0;
  while (i < len) {
    c = array[i++];
    switch (c >> 4) {
      case 0:
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
      case 6:
      case 7:
        // 0xxxxxxx
        out += String.fromCharCode(c);
        break;
      case 12:
      case 13:
        // 110x xxxx   10xx xxxx
        char2 = array[i++];
        out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
        break;
      case 14:
        // 1110 xxxx  10xx xxxx  10xx xxxx
        char2 = array[i++];
        char3 = array[i++];
        out += String.fromCharCode(((c & 0x0F) << 12)
          | ((char2 & 0x3F) << 6)
          | ((char3 & 0x3F) << 0));
        break;
    }
  }

  return out;
}

function toPrettyJson(o,skipNull){
  return JSON.stringify(o, (key, value) => {
    if(skipNull){
      if (value !== null) return value
    }else {
      return value;
    }
  },2);
}


const StringUtils = {
  isNullOrUndefined,
  isBlank,
  isCapital,
  isNumber,
  isEmpty,
  isSafeContains,
  getByteSize,
  compareString,
  sortStrings,
  splitWord,
  safeTrim,
  toHtmlFriendly,
  prefixZero,
  prefixZeroMax,
  utf8ArrayToStr,
  toPrettyJson
}

export default StringUtils;
