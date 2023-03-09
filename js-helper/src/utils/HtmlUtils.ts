import StringUtils from "./StringUtils";

function copyTextToClipboard(text){
  navigator.clipboard.writeText(text);
}

function fallbackCopyTextToClipboard(text) {

  const textArea = document.createElement('textarea');
  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    const successful = document.execCommand('copy');
    const msg = successful ? 'successful' : 'unsuccessful';
    console.log(`Fallback: Copying text command was ${msg}`);
  } catch (err) {
    console.error('Fallback: Oops, unable to copy', err);
  }

  document.body.removeChild(textArea);
}

type TJSON = any;

function tryGetLastPartOfUrl(url:string,filename?:string):string|undefined{
  if(filename){
    return filename;
  }
  const ss1=url.split("?")[0];
  const ss2=ss1.split("/");
  if(ss2.length<=1){
    return undefined;
  }
  const ss3 =ss2[ss2.length-1];
  if(StringUtils.isBlank(ss3)){
    return undefined;
  }
  return ss3;
}

function downloadUrl(url, fileName) {
  const fn = tryGetLastPartOfUrl(url,fileName) || 'file';
  const a = document.createElement('a');
  document.body.appendChild(a);
  a.target = '_blank';
  a.setAttribute('style','display: none');
  a.href = url;
  a.download = fn;
  a.click();
}

function saveStringToFile(srcContent, fileName) {
  if (!srcContent) {
    return;
  }
  let content = srcContent;

  if (typeof (content) !== 'string') {
    content = JSON.stringify(srcContent, null, 2);
  }

  const a = document.createElement('a');
  document.body.appendChild(a);
  a.setAttribute('style','display: none');

  const blob = new Blob([content], { type: 'application/json' });
  const url = window.URL.createObjectURL(blob);

  a.href = url;
  a.download = fileName;
  a.click();
  window.URL.revokeObjectURL(url);
}



function readText(file: File,encode?:string): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const text: string = event.target.result as string;
      resolve(text);
    };
    reader.onerror = (error) => {
      reject(error);
    }
    if(encode){
      reader.readAsText(file, encode);
    }else {
      reader.readAsText(file,'UTF-8');
    }
  });
}

//TODO: types
function readBinaryString(file: File): Promise<any> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const data = event.target.result;
      resolve(data);
    };
    reader.onerror = (error) => {
      reject(error);
    }
    reader.readAsBinaryString(file);
  });
}

/*
* TODO:
* */
function readAsArrayBuffer(file: File) {
  const promise = new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = ((_, event) => {
      const rr = event.target.result;
      resolve(rr);
    }).bind({}, file);
    reader.onerror = (error) => {
      reject(error);
    }
    reader.readAsArrayBuffer(file);
  });
  return promise;
}

async function readJSON(file: File): Promise<TJSON> {
  const text: string = await readText(file);
  const obj = JSON.parse(text);
  return obj;
}

async function readBase64Buffer(file: File): Promise<Buffer> {
  const data = await readAsArrayBuffer(file);
  //TODO: types
  // @ts-ignore
  const result = new Buffer(data, 'base64');
  return result;

}




const HtmlHelper = {
  copyTextToClipboard,
  fallbackCopyTextToClipboard,
  readText,
  readBinaryString,
  readJSON,
  readBase64Buffer,
  saveStringToFile,
  downloadUrl
}

export default HtmlHelper;
