
interface ISimpleTrans2D {
  scale:number;
  offsetX:number;
  offsetY:number;
}

interface IPoint2D {
  x:number;
  y:number;
}

interface ISize2D {
  width:number;
  height:number;
}

interface IRect extends IPoint2D,ISize2D{

}

interface IBoundary2D {
  minY: number;
  minX: number;
  maxY: number;
  maxX: number
}


interface IFrameCorners2D extends IBoundary2D{
  LT:IPoint2D;
  RT:IPoint2D;
  LB:IPoint2D;
  RB:IPoint2D;
}


type TFrameClickResult =
  |"NONE"
  |"LT"
  |"LB"
  |"RT"
  |"RB"
  |"BODY";