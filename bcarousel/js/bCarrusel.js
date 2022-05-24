class mCarrusel {
    constructor(options = {}) {
        this.iniVars();
        Object.assign(this, options);
        this.puede = true;
        this.veriDatos();
    }

    iniVars() {
        this.iniItems = "";
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
    }

    veriDatos() {
        this.check("debug", "debug", "boolean", false);
        this.check("id", "id", "string");
        this.check("items", "items", "number", 1);
        this.check("filas", "filas", "number", 1);
        this.check("margin", "margen", "number", 0);
        this.check("auto", "autoplay", "number", 0);
        this.check("cercano", "ancho más cercano", "object", null, [{n: "w", o: true, t: "number"}, {n: "h", o: true, t: "number"}]);
        this.check("vert", "vertical", "boolean", false);
        this.check("puntos", "puntos", "boolean", false);
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
        if (this.debug) {
            console.log(this);
        }
    }

    check(id, text, tipo, defecto = undefined, objeto = null) {
        if ((this[id] === undefined || typeof this[id] !== tipo) && this.puede) {
            if (defecto !== undefined) {
                this[id] = defecto;
            } else {
                if (this.debug) {
                    alert("Se requiere el campo " + text + " (" + id + ") de tipo " + tipo + " para continuar");
                }
                this.puede = false;
            }
        }
        if (tipo === "object" && this[id] !== null) {
            for (var i of objeto) {
                if (this[id] instanceof Array) {
                    for (var c of this[id]) {
                        if (i.o && typeof c[i.n] !== i.t) {
                            if (this.debug) {
                                alert("Se requiere que el campo " + text + " (" + id + ") posea el atributo " + i.n + " de tipo " + i.t + " para continuar"); }
                            this.puede = false;
                        }
                    }
                } else {
                    if (i.o && typeof this[id][i.n] !== i.t) {
                        if (this.debug) {
                            alert("Se requiere que el campo " + text + " (" + id + ") posea el atributo " + i.n + " de tipo " + i.t + " para continuar");
                        }
                        this.puede = false;
                    }
                }
            }
        }
        if (this.debug) {
            console.log(text + " tipo " + typeof this[id] + " = " + this[id]);
        }
    }

    udatePos(x) {
        if (x !== this.pos) {
            this.pos = x;
            
            if(this.change!==null){
                this.change(this.pos*this.filas);
            }

            this.enpa = Math.ceil(this.pos / this.items);

            let colRes = document.getElementById(this.id + "_full").getElementsByClassName('resePuntos');
            for (let i = 0; i < colRes.length; i++) {
                colRes[i].classList.remove("activa");
                if (this.enpa === i) {
                    colRes[i].classList.add("activa");
                }
            }
        }
    }

    vertical(bol) {
        document.getElementById(this.id + "_full").innerHTML = "<itenes>" + this.iniItems + "</itenes>";

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
        }

        this.calcPuntos();
        this.acercar();
        document.getElementById(this.id + "_interno").classList.add("anima");
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
    }

    goto(x, bloq = false) {
        this.tick = 0;
        if (bloq) {
            x = x * this.items;
            if (x > this.countItems - this.items) {
                x = this.countItems - this.items;
            }
        }
        if (x > this.countItems - this.items) {
            x = 0;
        }
        if (x < 0) {
            x = this.countItems - this.items;
        }
        this.udatePos(x);
        let empuja = 0;
        for (let i = 0; i < x; i++) {
            let r = document.getElementById(this.id + "_full").getElementsByClassName('item')[i].getBoundingClientRect();
            empuja += (this.vert ? r.height : r.width) + this.margin;
        }

        document.getElementById(this.id + "_interno").style.transform = this.traslate + "(-" + empuja + "px)";
    }

    acercar() {
        this.tick = 0;
        let empuja = 0, i;
        let filas = (this.filas > 1 && !this.vert) ? this.filas : 1;
        for (i = 0; i < this.colItem.length - (this.items * filas); i += filas) {
            let r = document.getElementById(this.id + "_full").getElementsByClassName('item')[i].getBoundingClientRect();
            let compara = this.vert ? r.y : r.x;
            if (compara < 0) {
                empuja += (this.vert ? r.height : r.width) + this.margin;
            } else {
                break;
            }
        }
        this.udatePos(i);

        document.getElementById(this.id + "_interno").style.transform = this.traslate + "(-" + empuja + "px)";
    }

    calculoHorizontal() {
        if (this.countItems < 1) {
            return;
        }

        let porItem = Math.round(this.espacioTotal / this.items);
        let ajuste = Math.round((this.margin / this.items) * 100) / 100;
        porItem += ajuste - (this.filas > 1 ? this.margin : 0) - 1;

        document.getElementById(this.id + "_interno").style.height = "";
        document.getElementById(this.id + "_interno").style.width = ((porItem * this.countItems) - ajuste + (this.filas > 1 ? this.margin * this.countItems : 0)) + "px";
        for (let i = 0; i < this.colItem.length; i++) {
            this.colItem[i].style.width = porItem + "px";
            this.colItem[i].style.height = "";
            this.colItem[i].style.marginRight = this.margin + "px";
            this.colItem[i].style.marginBottom = "";
        }
    }

    calculoVertical() {
        if (this.countItems < 1) {
            return;
        }

        let porItem = Math.round(this.espacioTotal / this.items);
        let ajuste = Math.round((this.margin / this.items) * 100) / 100;
        porItem += ajuste - 1;

        document.getElementById(this.id + "_interno").style.width = "";
        document.getElementById(this.id + "_interno").style.height = ((porItem * this.countItems) - ajuste) + "px";
        for (let i = 0; i < this.colItem.length; i++) {
            this.colItem[i].style.width = "";
            this.colItem[i].style.height = porItem + "px";
            this.colItem[i].style.marginBottom = this.margin + "px";
            this.colItem[i].style.marginRight = "";
        }
    }

    pulsa(event) {
        document.getElementById(this.id + "_interno").classList.remove("anima");
        if (!this.grabando) {
            if (this.vert) {
                this.mx = this.getY(event);
                this.ot = new WebKitCSSMatrix(window.getComputedStyle(document.getElementById(this.id + "_interno")).transform).m42;
            } else {
                this.mx = this.getX(event);
                this.ot = new WebKitCSSMatrix(window.getComputedStyle(document.getElementById(this.id + "_interno")).transform).m41;
            }
        }
        this.grabando = true;
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

    grag(event) {
        if (this.grabando) {
            let dif;
            if (this.vert) {
                dif = (this.mx - this.getY(event)) * -1;
            } else {
                dif = (this.mx - this.getX(event)) * -1;
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
        let actuPos = this.pos;
        if (this.monta) {
            document.getElementById(this.id).class = "";
            document.getElementById(this.id + "_full").remove();
            if (this.debug) {
                console.log("reset");
            }
        }
        this.monta = true;

        var bananin = document.createElement('div');
        bananin.id = this.id + "_full";
        document.getElementById(this.id).appendChild(bananin);

        this.iniItems = this.limpiarHTML(document.getElementById(this.id).getElementsByTagName("itenes")[0]);
        this.template();

        this.calcularSizes();
        this.eventos();

        document.getElementById(this.id + "_interno").classList.remove("anima");
        this.goto(actuPos);
        setTimeout(() => {
            document.getElementById(this.id + "_interno").classList.add("anima");
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
        document.getElementById(this.id + "_ant").removeEventListener('click', this.anterior.bind(this), false);
        document.getElementById(this.id + "_sig").removeEventListener('click', this.siguiente.bind(this), false);
        document.getElementById(this.id + "_interno").removeEventListener('mousedown', this.pulsa.bind(this), false);
        document.getElementById(this.id + "_interno").removeEventListener('touchstart', this.pulsa.bind(this), false);
        document.getElementById(this.id + "_interno").removeEventListener('mouseover', this.pausame.bind(this), false);
        document.getElementById(this.id + "_interno").removeEventListener('mouseleave', this.resume.bind(this), false);
        document.getElementById(this.id + "_interno").removeEventListener('mousemove', this.grag.bind(this), false);
        document.getElementById(this.id + "_interno").removeEventListener('wheel', this.scroll.bind(this), false);
        document.getElementById(this.id + "_interno").removeEventListener('touchmove', this.grag.bind(this), false);

        document.getElementById(this.id).removeEventListener('mouseup', this.suelta.bind(this), false);
        document.getElementById(this.id).removeEventListener('touchend', this.suelta.bind(this), false);
        document.getElementById(this.id).removeEventListener('resize', this.resize.bind(this), false);

        document.getElementById(this.id + "_ant").addEventListener('click', this.anterior.bind(this), false);
        document.getElementById(this.id + "_sig").addEventListener('click', this.siguiente.bind(this), false);
        document.getElementById(this.id + "_interno").addEventListener('mousedown', this.pulsa.bind(this), false);
        document.getElementById(this.id + "_interno").addEventListener('touchstart', this.pulsa.bind(this), false);
        document.getElementById(this.id + "_interno").addEventListener('mouseover', this.pausame.bind(this), false);
        document.getElementById(this.id + "_interno").addEventListener('mouseleave', this.resume.bind(this), false);
        document.getElementById(this.id + "_interno").addEventListener('mousemove', this.grag.bind(this), false);
        document.getElementById(this.id + "_interno").addEventListener('wheel', this.scroll.bind(this), false);
        document.getElementById(this.id + "_interno").addEventListener('touchmove', this.grag.bind(this), false);

        document.getElementById(this.id).addEventListener('mouseup', this.suelta.bind(this), false);
        document.getElementById(this.id).addEventListener('touchend', this.suelta.bind(this), false);
        window.addEventListener('resize', this.resize.bind(this), false);
    }

    template() {
        let puntos = this.puntos ? '' : 'style="display:none"';
        let nav = this.nav ? '' : 'style="display:none"';

        let templa = `<div class="b-carrusel">
              <div id="${this.id}_cuerpo" class="cuerpo"><div id="${this.id}_interno" class="interno anima">${this.iniItems}</div></div>
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
                    if (this.filas > 1 && i === 0) {
                        add = '<div class="wrap">';
                    }
                    if (this.filas > 1 && i % this.filas === 0 && i > 0) {
                        add = '</div><div class="wrap">';
                    }
                }
                ret = ret + add + elems[i].outerHTML.trim();
            }
        }
        if (this.filas > 1 && i === 0 && !this.vert) {
            ret = ret + "<div>";
        }

        return ret;
    }

    calcPuntos() {
        let pone = Math.ceil(this.countItems / this.items);
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
}