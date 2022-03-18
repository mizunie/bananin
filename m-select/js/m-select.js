const mSelect = {
    data() {
        return {
            picados:[],values:[],busca:""
        }
    },
    props: {
        id:{type: String,default: "select"},
        name:{type: String,default: "select"},
        placeholder:{type: String,default: "Seleccione un Item"},
        items:{type: JSON,default: []},
        multiple:{type: Boolean,default: false},
        max:{type: Number,default: 20}
    },
    computed:{
        place(){
            if(this.picados.length<1){
                return this.placeholder;
            }else{
                let conte=this.picados.join(", ");
                
                if(this.multiple && conte.length>this.max){
                    return this.picados.length+" items seleccionados";
                }else{
                    return conte;
                }
            }
        }
    },
    methods: {
        actualizar(items){
            this.items=items;
        },
        pica(i){
            let setea;
            this.picados=[];
            this.values=[];
            if(this.multiple){
                if(i.s!==undefined && i.s){
                    i.s=false;
                }else{
                    i.s=true;
                }
                setea=[];
                for (var it of this.items) {
                    if(it.s){
                        setea.push(it.v);
                        this.picados.push(it.t);
                        this.values.push(it);
                    }
                }
            }else{
                for (var it of this.items) {
                    it.s=false;
                }
                i.s=true;
                this.picados.push(i.t);
                this.values.push(i);
                setea=i.v;
            }
            
            $('#'+this.id).val(setea);
            this.$emit('input');
        },
        revisaPicados(){
            let setea=[];
            this.picados=[];
            this.values=[];
            for (var it of this.items) {
                if(it.s){
                    this.picados.push(it.t);
                    this.values.push(it);
                    if(this.multiple){
                        setea.push(it.v);
                    }else{
                        setea=it.v;
                        break;
                    }
                }
            }
            
            $('#'+this.id).val(setea);
        }
    },
    watch:{
        busca(newV){
            let usa=newV.toLowerCase();
            for (var it of this.items) {
                if(it.t.toLowerCase().indexOf(usa)>-1){
                    it.o=true;
                }else{
                    it.o=false;
                }
            }
        }
    },
    mounted(){
        if(this.multiple==="true"){
            this.multiple=true;
        }
        this.revisaPicados();
        this.$emit('input');
    },
    template: `
    <div class="btn-select">
      <div class="dropdown">
        <button class="btn btn-select-in" type="button" data-bs-toggle="dropdown" :data-bs-auto-close="multiple?'outside':'true'">
          {{ place }}
        </button>
        <ul class="dropdown-menu">
          <li class="px-3 mb-2"><input type="text" class="form-control" placeholder="Buscar" v-model="busca"></li>
          <li v-for="i in items" v-show="i.o===undefined || i.o"><button :disabled="i.d" @click="pica(i)" :class="'dropdown-item'+(i.s!==undefined && i.s?' active':'')" type="button"><img v-if="i.a!==undefined" :src="i.a">{{ i.t }} <span>{{ i.st }}</span></button></li>
        </ul>
      </div>
      <select class="d-none" :multiple="multiple" :id="id" :name="multiple?name+'[]':name">
        <option></option>
        <option v-for="i in items" :value="i.v">{{ i.t }}</option>
      </select>
    </div>
`
};