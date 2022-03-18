# Select con Bananin
Custom select con Bootstrap 5 y Vue 3

# Instalación

Simplemente descarga los [Archivos](https://github.com/mizunie/bananin/releases/download/Select/m-select.rar) e incluye el js m-select.min.js y el css m-select.css en tu proyecto

# Configuración

```HTML
<!-- html -->
<div class="mb-3" id="app">
    <m-select :items="itemsCompleto" ref="bSelect" :multiple="true" :max="20" id="bSel" name="bSel" @input="cambia()"></m-select>
    <p class="mb-0 mt-2" v-html="picados"></p>
</div>
```

```JavaScript
//Javascript
const app = Vue.createApp({
    components: {
        "m-select": mSelect
    },
    data() {
        return {
            itemsCompleto:[
                {v:"1",t:"Opción 1"},
                {v:"2",t:"Opción 2",st:"Con Subtitulo"},
                {v:"3",t:"Opción 3",st:"Con Imagen",a:"....png"},
                {v:"4",t:"Seleccionada",st:"Subtitulo",s:true},
                {v:"5",t:"Disabled",st:"Subtitulo",d:true}
            ]
        };
    },
    methods:{
        cambia(){
            this.picados=JSON.stringify(this.$refs.bSelect.values);
        }
    }
}).mount("#app");
```

Ejemplo en [Select con Bananin](https://bananin.pw/cajita/select)