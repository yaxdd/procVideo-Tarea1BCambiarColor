const cv = require('opencv4nodejs');

let image = cv.imread('pinzas.png');
let output=replaceColor(image)
cv.imwrite("pinzasRojo.png",output)
function replaceColor(image){
  let [sizeX, sizeY] = image.sizes;
  let output = new cv.Mat(sizeX, sizeY, cv.CV_8UC3);
  for (let i = 0; i < sizeX; i++) {
    for (let j = 0; j < sizeY; j++) {
      let [b, g, r] = image.atRaw(i, j);
      //aplicamos un umbral para el color amarillo
      if (b<40 && r>160 && g>160)
        output.set(i,j,[0,0,255])
      else
        output.set(i,j,[b,g,r])
    }
  }
  return output
}

