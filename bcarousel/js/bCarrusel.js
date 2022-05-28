/**
 * Carousel de Bananin
 * Copyright 2022-2022 Jhoan Velasquez
 * Licensed under: MIT
 */
class mCarrusel {
    constructor(options = {}) {
        this.iniVars();
        Object.assign(this, options);
        this.puede = true;
        this.veriDatos();
    }

    iniVars() {
        this.iniItems = "";
        this.priItems = "";
        this.ultItems = "";
        this.countItems = 1;
        this.grabando = false;
        this.mx = 0;
        this.ot = 0;
        this.enpa = 0;
        this.tick = 0;
        this.pausa = false;
        this.pos = 0;
        this.espacioTotal = 0;
        this.resizefin = null;
        this.traslate = 'translateX';
        this.vert = false;
        this.monta = false;
        this.dura = 0;
        this.timerFoco = 0;
        this.max=0;
        this.reales=0;
        this.evento=true;
    }

    veriDatos() {
        this.check("debug", "debug", "boolean", false);
        this.check("id", "id", "string");
        this.check("items", "items", "number", 1);
        this.check("filas", "filas", "number", 1);
        if (this.filas>15) {
            this.filas=15;
            this.debugShow("No se puede renderizar más de 15 filas");
        }
        this.check("margin", "margen", "number", 0);
        this.check("auto", "autoplay", "number", 0);
        this.check("cercano", "ancho más cercano", "object", null, [{n: "w", o: true, t: "number"}, {n: "h", o: true, t: "number"}]);
        this.check("vert", "vertical", "boolean", false);
        this.check("puntos", "puntos", "boolean", false);
        this.check("loop", "ciclico (loop,no,rewind)", "string", "no");
        if (this.loop !== "loop" && this.loop !== "no" && this.loop !== "rewind") {
            this.loop = "no";
        }
        this.check("wheel", "evento rueda del mouse", "boolean", false);
        this.check("nav", "botones de navegación", "boolean", false);
        this.check("navcentro", "botones de navegación flotantes", "boolean", false);
        this.check("responsive", "opciones responsive", "object", null, [{n: "m", o: true, t: "number"}, {n: "i", o: true, t: "number"}]);

        /* callbacks */
        this.check("change", "evento/callback cuando cambia la posición", "function", null);

        if (!this.puede) {
            return;
        }
        document.getElementById(this.id).classList.add("b-carrucont");
        if (this.navcentro) {
            document.getElementById(this.id).classList.add("centroNav");
        }
        window[this.id + "_mizBcarrusel"] = this;
        this.debugShow(this);
    }

    check(id, text, tipo, defecto = undefined, objeto = null) {
        if ((this[id] === undefined || typeof this[id] !== tipo) && this.puede) {
            if (defecto !== undefined) {
                this[id] = defecto;
            } else {
                this.debugShow("Se requiere el campo " + text + " (" + id + ") de tipo " + tipo + " para continuar", true);
                this.puede = false;
            }
        }
        if (tipo === "object" && this[id] !== null) {
            for (var i of objeto) {
                if (this[id] instanceof Array) {
                    for (var c of this[id]) {
                        if (i.o && typeof c[i.n] !== i.t) {
                            this.debugShow("Se requiere que el campo " + text + " (" + id + ") posea el atributo " + i.n + " de tipo " + i.t + " para continuar", true);
                            this.puede = false;
                        }
                    }
                } else {
                    if (i.o && typeof this[id][i.n] !== i.t) {
                        this.debugShow("Se requiere que el campo " + text + " (" + id + ") posea el atributo " + i.n + " de tipo " + i.t + " para continuar", true);
                        this.puede = false;
                    }
                }
            }
        }
        this.debugShow(text + " tipo " + typeof this[id] + " = " + this[id]);
    }

    vertical(bol) {
        let itenes = this.loop === "loop" ? this.ultItems + this.iniItems + this.priItems : this.iniItems;
        document.getElementById(this.id + "_full").innerHTML = "<itenes>" + itenes + "</itenes>";

        this.vert = bol;
        this.refrescar();
    }

    calcularSizes() {
        this.colItem = document.getElementById(this.id + "_full").getElementsByClassName('item');
        this.countItems = Math.ceil(this.colItem.length);

        if (this.vert) {
            document.getElementById(this.id + "_interno").classList.add("vertical");
            document.getElementById(this.id).classList.add("vertical");
            this.traslate = 'translateY';

            let pie = document.getElementById(this.id + "_pie").offsetHeight + 1;

            this.espacioTotal = document.getElementById(this.id).offsetHeight - pie;
            document.getElementById(this.id + "_cuerpo").style.height = this.espacioTotal + "px";
            this.corrigeItems();

            this.calculoVertical();
            this.espacioI=document.getElementById(this.id + "_interno").offsetHeight;
        } else {
            this.countItems = Math.ceil(this.colItem.length / this.filas);
            this.traslate = 'translateX';
            document.getElementById(this.id).classList.remove("vertical");
            document.getElementById(this.id + "_interno").classList.remove("vertical");

            this.espacioTotal = document.getElementById(this.id).offsetWidth;
            document.getElementById(this.id + "_cuerpo").style.height = "";
            this.corrigeItems();

            this.calculoHorizontal();
            this.calcAlto();
        
            this.espacioI=document.getElementById(this.id + "_interno").offsetWidth;
        }

        this.calcPuntos();
        if(this.loop==="loop"){
            this.goto(this.items);
        }else{
            this.acercar();
        }
        document.getElementById(this.id + "_interno").classList.add("anima");
        
        this.max=Math.ceil((this.reales+(4*this.filas))/this.filas);
    }

    calcAlto() {
        if (this.filas > 1 && !this.vert) {
            let mayo = 0;
            for (let i = 0; i < this.colItem.length; i++) {
                let r = document.getElementById(this.id + "_full").getElementsByClassName('item')[i].getBoundingClientRect();
                if (r.height > mayo) {
                    mayo = r.height;
                }
            }
            for (let i = 0; i < this.colItem.length; i++) {
                document.getElementById(this.id + "_full").getElementsByClassName('item')[i].style.height = mayo + "px";
                document.getElementById(this.id + "_full").getElementsByClassName('item')[i].style.marginBottom = this.margin + "px";
            }
        } else {
            for (let i = 0; i < this.colItem.length; i++) {
                document.getElementById(this.id + "_full").getElementsByClassName('item')[i].style.height = "";
                document.getElementById(this.id + "_full").getElementsByClassName('item')[i].style.marginBottom = "";
            }
        }
    }

    corrigeItems() {
        let ant=this.items;
        if (this.responsive !== null && this.cercano === null) {
            for (var i of this.responsive) {
                if (i.m <= this.espacioTotal) {
                    this.items = i.i;
                }
            }
        }
        if (this.cercano !== null) {
            let caben = this.espacioTotal / (this.vert ? this.cercano.h : this.cercano.w);
            this.items = Math.floor(caben);
        }
        if(this.loop==="loop" && ant!==this.items){
            this.refrescar();
        }
    }

    goto(x, bloq = false) {
        this.tick = 0;
        let ultimo = this.items;
        if (bloq) {
            x = x * this.items;
            if (x > this.countItems - this.items) {
                x = this.countItems - this.items;
            }
        }
        if(x<0){
            this.debugShow("no puede retroceder a "+x);
            if(this.loop==="rewind"){
                this.goto(this.countItems - ultimo);
            }
            return;
        }
        let esta;
        if (this.vert) {
            esta = new WebKitCSSMatrix(window.getComputedStyle(document.getElementById(this.id + "_interno")).transform).m42;
        } else {
            esta = new WebKitCSSMatrix(window.getComputedStyle(document.getElementById(this.id + "_interno")).transform).m41;
        }
        if((esta*-1>(this.espacioI-this.espacioTotal-this.porItem) && x>this.pos)){
            this.debugShow("no puede avanzar a "+x);
            if(this.loop==="rewind"){
                this.goto(0);
            }
            if(this.loop==="no" && this.vert){
                document.getElementById(this.id + "_interno").classList.remove("anima");
                document.getElementById(this.id + "_interno").style.transform = this.traslate + "(" + 0 + "px)";
                this.goto(this.reales-this.items);
            }
            return;
        }
        this.udatePos(x);
        let empuja = 0;
        for (let i = 0; i < x; i++) {
            let r = document.getElementById(this.id + "_full").getElementsByClassName('item')[i].getBoundingClientRect();
            empuja += (this.vert ? r.height : r.width) + this.margin;
        }

        document.getElementById(this.id + "_interno").style.transform = this.traslate + "(-" + empuja + "px)";

        if (!document.getElementById(this.id + "_interno").classList.contains("anima")){
            setTimeout(() => {
                document.getElementById(this.id + "_interno").classList.add("anima");
            }, 20);
        }
    }
    
    udatePos(x) {
        let pos = x;
        this.enpa = Math.ceil(pos / this.items);
        
        while (pos >= this.items + 1) {
            pos -= this.items + 1;
        }
        if (x !== this.pos) {
            this.pos = x;
            let colRes = document.getElementById(this.id + "_full").getElementsByClassName('resePuntos');

            if (this.change !== null) {
                this.change(this.pos * this.filas);
            }

            let quen=this.loop==="loop"?1:0;
            for (let i = 0; i < colRes.length; i++) {
                colRes[i].classList.remove("activa");
                if (this.enpa-quen === i) {
                    colRes[i].classList.add("activa");
                }
            }
        }
        
        if (this.loop === "loop") {
            if (this.pos < 1) {
                let debe=this.countItems-this.items*2;

                this.debugShow("debajo de foco debe estar en " + debe);
                clearTimeout(this.timerFoco);
                this.timerFoco=setTimeout(()=>{
                    document.getElementById(this.id + "_interno").classList.remove("anima");
                    this.goto(debe);
                },this.dura);
                return;
            }
            if(this.pos>this.countItems-this.items-1){
                let debe=this.items;

                this.debugShow("encima de foco debe estar en " + debe);
                clearTimeout(this.timerFoco);
                this.timerFoco=setTimeout(()=>{
                    document.getElementById(this.id + "_interno").classList.remove("anima");
                    this.goto(debe);
                },this.dura);
                return;
            }
        }
    }

    acercar() {
        this.tick = 0;
        let i;

        let origen = document.getElementById(this.id).getBoundingClientRect();

        let filas = (this.filas > 1 && !this.vert && this.loop!=="loop") ? this.filas : 1;
        for (i = 0; i < this.colItem.length - (this.items * filas); i += filas) {
            let r = document.getElementById(this.id + "_full").getElementsByClassName('item')[i].getBoundingClientRect();
            let compara = this.vert ? r.y - origen.y : r.x - origen.x;
            let medio = this.vert ? r.height * -1 / 2 : r.width * -1 / 2;
            if (compara >= medio) {
                break;
            }
        }
        
        this.goto((i/(this.vert?1:this.filas)));
    }

    calculoHorizontal() {
        if (this.countItems < 1) {
            return;
        }
        
        if(this.vert || this.filas===1){
            this.countItems=document.getElementById(this.id + "_interno").getElementsByClassName('item').length;
        }else{
            this.countItems=document.getElementById(this.id + "_interno").getElementsByClassName('wrap').length;
        }

        this.porItem = Math.round(this.espacioTotal / this.items);
        let ajuste = Math.round((this.margin / this.items) * 100) / 100;
        this.porItem += ajuste - (this.filas > 1 ? this.margin : 0) - 1;

        document.getElementById(this.id + "_interno").style.height = "";
        document.getElementById(this.id + "_interno").style.width = ((this.porItem * this.countItems) - ajuste + (this.filas > 1 ? this.margin * this.countItems : 0)) + "px";
        for (let i = 0; i < this.colItem.length; i++) {
            this.colItem[i].style.width = this.porItem + "px";
            this.colItem[i].style.height = "";
            this.colItem[i].style.marginRight = this.margin + "px";
            this.colItem[i].style.marginBottom = "";
        }
    }

    calculoVertical() {
        if (this.countItems < 1) {
            return;
        }

        this.porItem = Math.round(this.espacioTotal / this.items);
        let ajuste = Math.round((this.margin / this.items) * 100) / 100;
        this.porItem += ajuste - 1;

        document.getElementById(this.id + "_interno").style.width = "";
        document.getElementById(this.id + "_interno").style.height = ((this.porItem * this.countItems) - ajuste) + "px";
        for (let i = 0; i < this.colItem.length; i++) {
            this.colItem[i].style.width = "";
            this.colItem[i].style.height = this.porItem + "px";
            this.colItem[i].style.marginBottom = this.margin + "px";
            this.colItem[i].style.marginRight = "";
        }
    }

    pulsa(event) {
        document.getElementById(this.id + "_interno").classList.remove("anima");
        
        if (!this.grabando) {
            this.mxOt(event);
        }
        this.grabando = true;
    }
    
    mxOt(event){
        if (this.vert) {
            this.mx = this.getY(event);
            this.ot = new WebKitCSSMatrix(window.getComputedStyle(document.getElementById(this.id + "_interno")).transform).m42;
        } else {
            this.mx = this.getX(event);
            this.ot = new WebKitCSSMatrix(window.getComputedStyle(document.getElementById(this.id + "_interno")).transform).m41;
        }
    }

    getX(event) {
        switch (event.type) {
            case 'mousemove':
            case 'mousedown':
                return event.clientX;
            case 'touchmove':
            case 'touchstart':
                return event.touches[0].clientX;
        }
    }

    getY(event) {
        switch (event.type) {
            case 'mousemove':
            case 'mousedown':
                return event.clientY;
            case 'touchmove':
            case 'touchstart':
                return event.touches[0].clientY;
        }
    }

    suelta() {
        if (this.grabando) {
            document.getElementById(this.id + "_interno").classList.add("anima");
            this.grabando = false;
            this.acercar();
        }
    }

    grab(event) {
        event.preventDefault();
        event.stopPropagation();
        
        if (this.grabando) {
            let dif;
            if (this.vert) {
                dif = (this.mx - this.getY(event)) * -1;
            } else {
                dif = (this.mx - this.getX(event)) * -1;
            }
            if(this.loop==="loop"){
                let esta;
                
                if (this.vert) {
                    esta = new WebKitCSSMatrix(window.getComputedStyle(document.getElementById(this.id + "_interno")).transform).m42;
                } else {
                    esta = new WebKitCSSMatrix(window.getComputedStyle(document.getElementById(this.id + "_interno")).transform).m41;
                }
                
                if (esta>0) {
                    let debe=document.getElementById(this.id+"_pri")[this.vert?'offsetTop':'offsetLeft']-(this.espacioI-document.getElementById(this.id+"_pri")[this.vert?'offsetTop':'offsetLeft']);
                    
                    this.debugShow("debajo de foco en grab debe estar en " + debe);
                    document.getElementById(this.id + "_interno").style.transform = this.traslate + "(-" + debe + "px)";
                    this.mxOt(event);
                    return;
                }

                if(esta<(this.espacioI-this.espacioTotal)*-1){
                    let debe=(this.espacioI-document.getElementById(this.id+"_pri")[this.vert?'offsetTop':'offsetLeft']);
                            
                    this.debugShow("encima de foco en grab debe estar en " + debe);
                    document.getElementById(this.id + "_interno").style.transform = this.traslate + "(-" + debe + "px)";
                    this.mxOt(event);
                    return;
                }
            }
            document.getElementById(this.id + "_interno").style.transform = this.traslate + "(" + (this.ot + dif) + "px)";
        }
    }

    resize() {
        document.getElementById(this.id + "_interno").classList.remove("anima");
        clearTimeout(this.resizefin);
        this.resizefin = setTimeout(() => {
            this.calcularSizes();
        }, 300);
    }

    refrescar() {
        this.evento=true;
        let actuPos = this.pos;
        if (this.monta) {
            document.getElementById(this.id).class = "";
            document.getElementById(this.id + "_full").remove();
            this.debugShow("reset");
        }
        this.monta = true;

        var bananin = document.createElement('div');
        bananin.id = this.id + "_full";
        document.getElementById(this.id).appendChild(bananin);

        this.iniItems = this.limpiarHTML(document.getElementById(this.id).getElementsByTagName("itenes")[0]);
        this.reales=document.getElementById(this.id).getElementsByTagName("itenes")[0].getElementsByClassName('item').length;
        if (this.loop === "loop" && this.reales<=this.items*this.filas) {
            this.loop = "rewind";
            this.debugShow("No hay elementos suficientes para hacer un efecto de bucle se cambiará a rewind");
        }
        this.template();

        this.calcularSizes();
        this.eventos();

        document.getElementById(this.id + "_interno").classList.remove("anima");
        //this.goto(actuPos);
        setTimeout(() => {
            document.getElementById(this.id + "_interno").classList.add("anima");

            let demora = getComputedStyle(document.getElementById(this.id + "_interno"))['transitionDuration'];
            let digito = demora.replace(/[^0-9.]/g, '');
            if (demora.indexOf("ms") > -1) {
                this.dura = digito;
            } else {
                this.dura = digito * 1000;
            }
        }, 50);

        clearInterval(this.interval);
        this.interval = setInterval(() => {
            if (!this.pausa && this.auto > 1 && !this.grabando) {
                this.tick++;
                if (this.tick > this.auto) {
                    this.tick = 0;
                    this.goto(this.pos + 1);
                }
            }
        }, 1000);

        return this;
    }

    anterior() {
        this.goto(this.pos - 1);
    }

    siguiente() {
        this.goto(this.pos + 1);
    }

    pausame() {
        this.pausa = true;
    }

    resume() {
        this.pausa = false;
        this.suelta();
    }

    scroll(event) {
        event.preventDefault();
        event.stopPropagation();

        if (this.wheel) {
            if (event.deltaY > 0) {
                this.siguiente();
            } else {
                this.anterior();
            }
        }
    }

    eventos() {
        if(this.evento){
            this.evento=false;
            document.getElementById(this.id + "_ant").addEventListener('click', this.anterior.bind(this), false);
            document.getElementById(this.id + "_sig").addEventListener('click', this.siguiente.bind(this), false);
            document.getElementById(this.id + "_interno").addEventListener('mousedown', this.pulsa.bind(this), false);
            document.getElementById(this.id + "_interno").addEventListener('touchstart', this.pulsa.bind(this), false);
            document.getElementById(this.id + "_interno").addEventListener('mouseover', this.pausame.bind(this), false);
            document.getElementById(this.id + "_interno").addEventListener('mouseleave', this.resume.bind(this), false);
            document.getElementById(this.id + "_interno").addEventListener('mousemove', this.grab.bind(this), false);
            document.getElementById(this.id + "_interno").addEventListener('wheel', this.scroll.bind(this), false);
            document.getElementById(this.id + "_interno").addEventListener('touchmove', this.grab.bind(this), false);

            document.getElementById(this.id).addEventListener('mouseup', this.suelta.bind(this), false);
            document.getElementById(this.id).addEventListener('touchend', this.suelta.bind(this), false);
            window.addEventListener('resize', this.resize.bind(this), false);
        }
    }

    template() {
        let puntos = this.puntos ? '' : 'style="display:none"';
        let nav = this.nav ? '' : 'style="display:none"';

        let itenes = this.loop === "loop" ? this.ultItems + this.iniItems + this.priItems : this.iniItems;

        let templa = `<div class="b-carrusel">
              <div id="${this.id}_cuerpo" class="cuerpo"><div id="${this.id}_interno" class="interno anima">${itenes}</div></div>
              <div id="${this.id}_pie" class="pie">
                <div id="${this.id}_puntos" class="puntos" ${puntos}><div></div></div>
                <div id="${this.id}_navega" class="navega" ${nav}>
                  <button id="${this.id}_ant"><svg class="svg-icon" viewBox="0 0 20 20"><path fill="none" d="M8.388,10.049l4.76-4.873c0.303-0.31,0.297-0.804-0.012-1.105c-0.309-0.304-0.803-0.293-1.105,0.012L6.726,9.516c-0.303,0.31-0.296,0.805,0.012,1.105l5.433,5.307c0.152,0.148,0.35,0.223,0.547,0.223c0.203,0,0.406-0.08,0.559-0.236c0.303-0.309,0.295-0.803-0.012-1.104L8.388,10.049z"></path></svg></button>
                  <button id="${this.id}_sig"><svg class="svg-icon" viewBox="0 0 20 20"><path fill="none" d="M11.611,10.049l-4.76-4.873c-0.303-0.31-0.297-0.804,0.012-1.105c0.309-0.304,0.803-0.293,1.105,0.012l5.306,5.433c0.304,0.31,0.296,0.805-0.012,1.105L7.83,15.928c-0.152,0.148-0.35,0.223-0.547,0.223c-0.203,0-0.406-0.08-0.559-0.236c-0.303-0.309-0.295-0.803,0.012-1.104L11.611,10.049z"></path></svg></button>
                </div>
              </div>
            </div>`;

        document.getElementById(this.id + "_full").innerHTML = templa;
    }

    limpiarHTML(content) {
        let ret = "";
        var elems = content.getElementsByClassName('item');
        for (var i = 0; i < elems.length; i++) {
            if (elems[i].outerHTML) {
                let add = "";
                if (!this.vert) {
                    if (this.filas > 1 && i % this.filas === 0 && i > 0) {
                        add = '</div><div class="wrap">';
                    }
                }
                ret = ret + add + elems[i].outerHTML.trim();
            }
        }
        
        if (this.filas > 1 && !this.vert) {
            ret = '<div class="wrap">'+ ret + "</div>";
        }
        
        //priItems ultItems
        if(this.loop==="loop"){
            let ele=document.createElement("div");
            ele.innerHTML=ret;
            
            let eleC;
            if(this.vert || this.filas===1){
                eleC=ele.getElementsByClassName('item');
            }else{
                eleC=ele.getElementsByClassName('wrap');
            }
            this.priItems='<div id="'+this.id+'_pri"></div>';
            this.ultItems="";
            if(eleC.length>this.items){
                for (var i = 0; i < this.items; i++) {
                    this.priItems+=eleC[i].outerHTML;
                    this.ultItems=eleC[eleC.length-i-1].outerHTML+this.ultItems;
                }
            }
            this.ultItems+='<div id="'+this.id+'_ult"></div>';
        }

        return ret;
    }

    calcPuntos() {
        let pone = Math.ceil(this.reales / this.filas / this.items);
        let pina = "";

        if (pone === Infinity) {
            setTimeout(() => {
                this.refrescar();
            }, 100);
            return;
        }

        for (var i = 0; i < pone; i++) {
            pina += '<div class="resePuntos' + (i === 0 ? ' activa' : '') + '" id="' + this.id + '_punto_' + i + '" onclick="window[\'' + this.id + '_mizBcarrusel\'].goto(' + i + ',true)"></div>';
        }

        document.getElementById(this.id + "_puntos").innerHTML = pina;
    }

    debugShow(text, alert = false) {
        if (this.debug) {
            if (alert) {
                alert(text);
            } else {
                console.log(text);
            }
        }
    }
}