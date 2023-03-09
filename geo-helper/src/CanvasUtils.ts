function drawLine(ctx, p1: IPoint2D, p2: IPoint2D, fillColor: string) {
  ctx.beginPath();
  ctx.moveTo(p1.x, p1.y);
  ctx.lineTo(p2.x, p2.y);
  ctx.strokeStyle = fillColor;
  ctx.stroke();

}

function interP(p1:IPoint2D, p2:IPoint2D, r):IPoint2D{
  return {
    x:p1.x*(1-r)+p2.x*r,
    y:p1.y*(1-r)+p2.y*r,
  }
}

function drawPoint(ctx: any, x: number, y: number, fillStyle: string, size: any) {
  ctx.beginPath();
  ctx.arc(x, y, size, 0, 2 * Math.PI);
  ctx.fillStyle = fillStyle;
  ctx.fill();
}

function  drawImage(ctx, image, x: number, y: number, width: number, height: number) {
  ctx.drawImage(image, x,y,width,height);
}

function clearRect(ctx, rect:IRect) {
  const {x,y,width,height} = rect;
  void ctx.clearRect(x, y, width, height);
}

export default {
  drawLine,
  interP,
  drawPoint,
  drawImage,
  clearRect,
}
