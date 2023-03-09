function dist(p1: IPoint2D, p2: IPoint2D):number {
  const dx = p1.x - p2.x;
  const dy = p1.y - p2.y;
  return Math.sqrt(dx*dx + dy*dy);
}


function diff(from: IPoint2D, to: IPoint2D):IPoint2D {
  return  {
   x:to.x-from.x,
   y:to.y-from.y
  }
}


function limitTo(inImgPt: IPoint2D, width: any, height: any) {

  let x = inImgPt.x;
  let y = inImgPt.y;
  x=x<0?0:x;
  y=y<0?0:y;
  x=x<width?x:width-1;
  y=y<height?y:height-1;

  return {
    x,y
  }

}
function inRange(p1: IPoint2D, p2: IPoint2D, maxDist: number):boolean {
  const value = dist(p1,p2);
  return value < maxDist;
}

function fitInto(sourceSize: ISize2D, targetSize: ISize2D) {

  const {width:wi,height:hi} = sourceSize;
  const {width:wb,height:hb} = targetSize;

  try{
    const ratio = Math.min(wb / wi, hb / hi);
    const newWidth = wi * ratio;
    const newHeight = hi * ratio;
    const x = (wb - newWidth) / 2;
    const y = 0;
    return { x, y, width: newWidth, height: newHeight };
  }catch (e){
    return undefined;
  }
}

function moveRectInBoundary(current: IRect, limit: IBoundary2D, offset: IPoint2D) {
  const result:IRect = {
    ...current
  };
  result.x += offset.x;
  result.y += offset.y;

  if(result.x<limit.minX){
    result.x=limit.minX
  }

  if(result.y<limit.minY){
    result.y=limit.minY
  }

  if(result.x+result.width>limit.maxX){
    result.x=limit.maxX -result.width;
  }

  if(result.y+result.height>limit.maxY){
    result.y=limit.maxY -result.height;
  }
  return result;

}
function calSimple2DTransformParams(originSize: ISize2D, targetSize: ISize2D, border: number) {
  const {width:Wi,height:Hi} =originSize;
  const {width:Wb,height:Hb} =targetSize;

  const Ri = Hi / Wi;
  const Rb = Hb / Wb;

  const Wmax = Wb - border;
  const Hmax = (Hb *2/3);

  let Wt:number=0;
  let Ht:number=0;

  let R:number=0;
  if(Ri <= Rb) {
    if(Wi > Wmax){
      Wt = Wmax;
    }else{
      Wt = Wi;
    }
    R = Wt/Wi;
  }else {
    if(Hi > Hmax){
      Ht = Hmax;
    }else {
      Ht = Hi;
    }
    R= Ht/Hi;
  }

  return {
    scale:R,
    offsetX: (Wb-Wi*R)/2,
    offsetY:0
  }

  return undefined;
}

function reverseProject(pt: IPoint2D, param: ISimpleTrans2D) {
  const {scale,offsetX,offsetY} = param;
  return {
    x:(pt.x-offsetX)/scale,
    y:(pt.y-offsetY)/scale,
  }
}

function project(pt: IPoint2D, projParam: ISimpleTrans2D) {
  return  {
    x: pt.x * projParam.scale+projParam.offsetX,
    y: pt.y * projParam.scale+projParam.offsetY
  }
}
function projectFrame(src: IRect, projParams: ISimpleTrans2D) {
  const {
    x,
    y,
    width,
    height
  } = src;

  const LT=project({x,y},projParams);
  const RT=project({x:x+width,y},projParams);
  const LB=project({x,y:y+height},projParams);
  const RB=project({x:x+width,y:y+height},projParams);
  return  {
    minX:LT.x,
    maxX:RT.x,
    minY:LT.y,
    maxY:RB.y,
    LT,
    RT,
    LB,
    RB
  }


}
function toFrame(crop: IRect) {
  const {x,y,width,height} = crop;

  const left = x;
  const right = x +width;
  const top = y;
  const bottom = y+height;
  return  {
    minX:left,
    maxX:right,
    minY:top,
    maxY:bottom,
    LT:{
      x:left,
      y:top
    },
    LB:{
      x:left,
      y:bottom
    },
    RT:{
      x:right,
      y:top
    },
    RB:{
      x:right,
      y:bottom
    },
  }
}

function checkFrameClick(pt: IPoint2D, frame: IFrameCorners2D, dist: number):TFrameClickResult {
  const kk = ["LT","LB","RT","RB"];
  for(const k of kk){
    if(inRange(pt,frame[k],dist)){
      return k as TFrameClickResult;
    }
  }
  if((pt.x>frame.minX) &&(pt.x<frame.maxX)&&
    (pt.y>frame.minY) &&(pt.y<frame.maxY)){
    return "BODY";
  }
  return "NONE";

}

function calRectWithRatioFitInto(ratio: number[]|null, targetSize: ISize2D) {
  const { width,height } = targetSize;
  const result:IRect = {
    x:0,
    y:0,
    width:width,
    height:height,
  }

  if(!ratio){
    return result;
  }

  const r1 = height / width;
  const r2 = ratio[1]/ratio[0];

  if(r1>= r2){
    result.height = Math.floor(r2 * width);
    result.y = Math.floor((height-result.height)/2);
  }else {
    result.width = height / r2;
    result.x = Math.floor((width- result.width)/2);
  }
  return result;


}

export default {
  dist,
  diff,
  limitTo,
  inRange,
  fitInto,
  moveRectInBoundary,
  calSimple2DTransformParams,
  reverseProject,
  project,
  projectFrame,
  toFrame,
  checkFrameClick,
  calRectWithRatioFitInto,
}
