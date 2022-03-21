const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");


//change the origin
ctx.translate(0, canvas.height);
ctx.scale(1, -1);

var n_cadera = 60;
var n_ancho =  72;
var n_largo = 120;
var n_espalda = 80;

var center_x  = 200;
var center_y = 200;

let graficarCamiseta = (n_cadera,n_ancho,n_largo,n_espalda,center_x,center_y) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.beginPath();

    //espalda 
    var y = n_largo * 11/12;
    y = center_y + y;
    var x = (n_espalda - n_espalda)/2;
    x = center_x + x;
    var espalda = {
        'izq': [x,y],
        'der': [(x + n_espalda), y]
    }

    //ancho
    x = (n_espalda - n_ancho)/2;
    x = center_x + x;
    y = n_largo * 2/3;
    y = center_y + y;
    var ancho = {
        'izq': [x,y],
        'der': [(x + n_ancho), y]
    }

    //cadera
    x = (n_espalda - n_cadera)/2;
    x = center_x + x;
    y = n_largo * 0;
    y = center_y + y;
    var cadera = {
        'izq': [x,y],
        'der': [(x + n_cadera), y]
    }


    //manga izquierda
    largo_manga = n_espalda * 1/3;

    manga_izq = {
        'x_externa': espalda.izq[0] - largo_manga,
        'y_externa': espalda.izq[1] - largo_manga,
        'x_interna': ancho.izq[0] - largo_manga/2,
        'y_interna': ancho.izq[1] - largo_manga
    }

    //manga derecha
    manga_der = {
        'x_externa': espalda.der[0] + largo_manga,
        'y_externa': espalda.der[1] - largo_manga,
        'x_interna': ancho.der[0] + largo_manga/2,
        'y_interna': ancho.der[1] - largo_manga
    }

    //cuello
    x = cadera.izq[0] + n_cadera*1/4;
    cuello = {   
        'izq': [x,center_y + n_largo],
        'der': [x + n_cadera*2/4,center_y + n_largo]
    }
    n_cuello = cuello.der[0] - cuello.izq[0]
    x_cuello = [cuello.izq[0], cuello.izq[0]+n_cuello*1/4,cuello.der[0]-n_cuello*1/4, cuello.der[0]]
    y_cuello = [cuello.izq[1], cuello.izq[1]-n_cuello*1/4,cuello.der[1]-n_cuello*1/4, cuello.der[1]]

    //graficar cuello
    puntos_cuello = calculatePoints(x_cuello,y_cuello)

    for(var i = 0; i<puntos_cuello.length  - 1 ; i++){
        ctx.moveTo(puntos_cuello[i][0],puntos_cuello[i][1]);
        ctx.lineTo(puntos_cuello[i+1][0],puntos_cuello[i+1][1]);
    }


    //graficar cadera
    ctx.moveTo(cadera.izq[0], cadera.izq[1]);
    ctx.lineTo(cadera.der[0], cadera.der[1]);


    //graficar lineas verticales desde axila hasta cadera
    var lineas_horizontales = [espalda,ancho,cadera];
    for(var i = 1; i < lineas_horizontales.length - 1; i++){
        //primero izquierdo
        ctx.moveTo(lineas_horizontales[i].izq[0],lineas_horizontales[i].izq[1]);
        ctx.lineTo(lineas_horizontales[i+1].izq[0],lineas_horizontales[i+1].izq[1]);

        //luego derecho
        ctx.moveTo(lineas_horizontales[i].der[0],lineas_horizontales[i].der[1]);
        ctx.lineTo(lineas_horizontales[i+1].der[0],lineas_horizontales[i+1].der[1]);
    }


    //graficar manga izquierda
    ctx.moveTo(espalda.izq[0],espalda.izq[1]);
    ctx.lineTo(manga_izq.x_externa, manga_izq.y_externa);

    ctx.moveTo(ancho.izq[0],ancho.izq[1]);
    ctx.lineTo(manga_izq.x_interna, manga_izq.y_interna);

    ctx.moveTo(manga_izq.x_interna, manga_izq.y_interna);
    ctx.lineTo(manga_izq.x_externa, manga_izq.y_externa);


    //graficar manga derecha
    ctx.moveTo(espalda.der[0],espalda.der[1]);
    ctx.lineTo(manga_der.x_externa, manga_der.y_externa);

    ctx.moveTo(ancho.der[0],ancho.der[1]);
    ctx.lineTo(manga_der.x_interna, manga_der.y_interna);

    ctx.moveTo(manga_der.x_interna, manga_der.y_interna);
    ctx.lineTo(manga_der.x_externa, manga_der.y_externa);


    //graficar hombros
    ctx.moveTo(espalda.izq[0],espalda.izq[1]);
    ctx.lineTo(cuello.izq[0], cuello.izq[1]);

    ctx.moveTo(espalda.der[0],espalda.der[1]);
    ctx.lineTo(cuello.der[0], cuello.der[1]);

    ctx.stroke();
}


//---------------------------------------------------------------------------------------De Casteljau's algorithm --------------------------------------------------------------

// Example: lerp(0.5, 0.0, 1.0) == 0.5
let lerp = (t, p1, p2) => (1 - t) * p1 + t * p2;

// Example: reduce(0.5, ...[0.0, 1.0, 2.0, 3.0]) == [0.5, 1.5, 2.5]
let reduce = (t, p1, p2, ...ps) => ps.length > 0
    ? [lerp(t, p1, p2), ...reduce(t, p2, ...ps)]
    : [lerp(t, p1, p2)];

// Example: deCasteljau(0.5, [0.0, 1.0, 2.0, 3.0]) == 1.5
let deCasteljau = (t, ps) => ps.length > 1
    ? deCasteljau(t, reduce(t, ...ps))
    : ps[0];

let doubleDeCasteljau = (x_parameters,y_parameters) => {
    point_x = deCasteljau(x_parameters[0],x_parameters[1])
    point_y = deCasteljau(y_parameters[0],y_parameters[1])
    return [point_x,point_y]
}

let calculatePoints = (X,Y) => {
    puntos = []
    ratio = 0.001
    for(var i=0;i<1000;i++){
        puntos.push(doubleDeCasteljau([ratio,X],[ratio,Y]))
        ratio = ratio + 0.001
    }
    return puntos
}



//---------------------------------------------------------------------------------------------------------Transformaciones----------------------------------------------------------------------
//como a cada componente ya le sume X y Y que al principio son 0 teoricamente, por lo tanto trasladar solo es cambiar los valores de X y Y iniciales
let trasladar = (x,y) => {
    center_x = center_x + parseInt(x)
    center_y = center_y + parseInt(y)
}

let escalar = (x) => {
    n_cadera = n_cadera*x;
    n_ancho =  n_ancho*x;
    n_largo = n_largo*x;
    n_espalda = n_espalda*x;
}


//----------------------------------------------------------------------------------------------------Menu principal-----------------------------------------------------------

graficarCamiseta(n_cadera,n_ancho,n_largo,n_espalda,center_x,center_y);

function menu_principal(){
    var menu = `
    Hola usuario, Ingrese el numero de la opcion que desea elegir.

    Qué operación quieres realizar?

    1. trasladar
    2. escalar
    `

    eleccion = prompt(menu);

    if(eleccion == 1){
        let x = prompt('escalar para el eje x?');
        let y = prompt('escalar para el eje y?');
        trasladar(x,y);
        graficarCamiseta(n_cadera,n_ancho,n_largo,n_espalda,center_x,center_y);
    }else if(eleccion == 2){
        let num = prompt('Numero por el que desea escalar la camiseta');
        escalar(num)
        graficarCamiseta(n_cadera,n_ancho,n_largo,n_espalda,center_x,center_y);
    }

}












