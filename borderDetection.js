const cv = require('opencv4nodejs');
const math = require('mathjs')

let image = cv.imread('pinzas_gray.png');
let imagePadded = imagePadding(image, 1)
let kernelX = [
    [1, 0, -1],
    [1, 0, -1],
    [1, 0, -1]
];
let kernelY = [
    [1, 1, 1],
    [0, 0, 0],
    [-1, -1, -1]
];

let derivadaX = imageDerivative(imagePadded, kernelX)
let derivadaY = imageDerivative(imagePadded, kernelY)

cv.imwrite('derivadaX.png', derivadaX);
cv.imwrite('derivadaY.png', derivadaY);

function imagePadding(image, padSize) {
    //si la imagen es RGB la pasamos a escala de grises primero
    if (image.channels === 3)
        image = image.cvtColor(cv.COLOR_RGB2GRAY)
    //conseguimos las dimensiones de la imagen
    let [sizeX, sizeY] = image.sizes;
    //generamos una nueva imagen con los bordes añadidos
    let output = new cv.Mat(sizeX + 2 * padSize, sizeY + 2 * padSize, cv.CV_8UC1);
    //ahora copiamos la imagen original dentro de los bordes sin modificarla
    for (let i = padSize; i < sizeX + padSize; i++) {
        for (let j = padSize; j < sizeY + padSize; j++) {
            let pixel = image.atRaw(i - padSize, j - padSize);
            output.set(i, j, pixel);
        }
    }
    return output;
}

function imageDerivative(image, kernel) {
    //obtenemos las dimensiones de la imagen
    let [sizeX, sizeY] = image.sizes;
    //obtenemos el tamaño del relleno basandonos en el tamaño del kernel
    let padSize = 2 * math.floor((kernel.length / 2));
    //generamos una nueva imagen sin los bordes que le asignemos
    let output = new cv.Mat(sizeX - padSize, sizeY - padSize, cv.CV_8UC1);

    //ahora recorremos la imagen con relleno pero sin pasarnos de los limites,
    for (let i = 0; i < (sizeX - padSize); i++) {
        for (let j = 0; j < (sizeY - padSize); j++) {
            //la subregion empieza desde el punto i,j hasta i+padSize+1,j+padSize+1
            let subRegion = image.getRegion(new cv.Rect(j, i, padSize + 1, padSize + 1)).getDataAsArray()
            //ahora multiplicamos con el kernel,sumamos todos los elementos y dividimos entre 3
            let sum = math.sum(math.dotMultiply(subRegion, kernel)) / 3
            //asignamos en la imagen de salida
            output.set(i, j, math.abs(sum))
        }
    }
    return output
}

