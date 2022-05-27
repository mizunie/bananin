# Carousel con Bananin
Carousel vanilla de Bananin

# Instalación

Incluye estas etiquetas en el head

```HTML
<script src="https://unpkg.com/@bananin/bcarousel@latest/js/bCarrusel.min.js"></script>
<link type="text/css" rel="stylesheet" href="https://unpkg.com/@bananin/bcarousel@latest/css/b-carrusel.css" />
```


# Configuración

La estructura en el html es la siguiente:

```HTML
<!-- html -->
<div id="bCar">               <!-- div padre con un id -->
    <itenes>                       <!-- tag itenes que va a contener los items del carrusel -->
        <div class="item">   <!-- div con clase item y dentro de este lo que quieras que se muestre -->
            <div>1</div>
        </div>
        <div class="item"><div>2</div></div>
        <div class="item"><div>3</div></div>
        <div class="item"><div>4</div></div>
        <div class="item"><div>5</div></div>
        <div class="item"><div>6</div></div>
        <div class="item"><div>7</div></div>
        <div class="item"><div>8</div></div>
        <div class="item"><div>9</div></div>
        <div class="item"><div>n</div></div>
    </itenes>
</div>
```

La estructura en el js es la siguiente:

```JavaScript
//Javascript
var mCar=new mCarrusel({
    //obligatorio
    id:"bCar",              //id que se utilizó en el div padre

    //opcionales
    margin:10,              //espacio que tendrá entre items por defecto 0 (tanto horizontal como vertical)
    auto:0,                 //tiempo en segundos para pasar automáticamente al siguiente item por defecto 0 (0 no se reproduce automáticamente)
    vert:false,             //Si el carrusel se renderiza de forma verticar por defecto false
    puntos:true,            //los puntos que tiene en la parte de abajo como paginación por defecto false
    nav:true,               //botones de anterior y siguiente de abajo por defecto false
    navcentro:false,        //mostrar los botones de navegación centrados verticalmente por defecto false
    wheel:true,             //si se puede manipular el carrusel con la rueda del mouse por defecto false
    items:2,                //items que se muestran por defecto en el espacio asignado
    filas:2,                //filas que tendrá el carrusel por defecto 1 (solo se aplica si se muestra el carrusel horizontal)
    cercano:{w:300,h:100},  //si desea que se calculen automáticamente los tamaños de los items en ancho (w) y alto (h), para que funcione no debe especificar nada en responsive
    responsive:[{m:0,i:2},{m:400,i:2},{m:1400,i:3}],//cambia de acuerdo al espacio que tenga el carrusel cuando está en forma horizontal (no la pantalla completa) [{m:px minimo del container,i:items a mostrar}] por defecto null
    loop:"rewind",          //efecto de bucle, "no"=al llegar al final se debe regresar manualmente, "rewind": luego del último elemento vuelve al inicio, "loop": crea un ciclo infinito (BETA)
    change:cambia           //callback para cuando cambie el item actual por defecto null
}).refrescar();

function cambia(x){
    console.log("slide "+x);
}

//para actualizar el carrusel
mCar.refrescar();
```

Metodos:

```JavaScript
//para actualizar el carrusel
mCar.refrescar();

//para cambiarlo a vertical
mCar.vertical(true);
```

Ejemplo en [Carousel con Bananin](https://bananin.pw/cajita/carousel)

## License
[MIT](https://choosealicense.com/licenses/mit/)

## Patrocinar 
[Con tu ayuda puedo seguir pagando el servidor <3](https://www.buymeacoffee.com/mizunie)