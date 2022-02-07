import { model, Schema, Types } from "mongoose";
import { Category } from "../../models";

interface Category {
  name       : string,
  name_lower : string,
  state      : boolean,
  user       : Types.ObjectId
}

const categorySchema = new Schema<Category>({
  name       : { 
    type: String,
    // index: true, //Crea un indice sobre esta propiedad por lo que las busquedas hacia esta son mas rapidas (leer abajo)
    required: [true, 'The name is required'], 
    unique: true, 
    trim: true, 
    //-Los settersson muy similares a los getters, pero estas transformaciones si se aplican directamente a los documentos
    //-antes de ser guardadaos o antes de ser devueltos por una query, lo que indica que tanto en la base de datos
    //-como al imprimir la propiedad .name como al devolverlos en forma de objeto se ejecutara este setter sobre 
    //-la propiedad, la desventaja es que se ejecute en cada query, probablemente para estos casos funcionaria
    //-mejor el pre-save que cambia la propiedad permanenetemene antes de grabarse.
    // set: capitalizeFirstLetter, 

    //-Los getters sirven para aplicar una transformacion sobre la propiedad al hacer un query, es decir, esta trasnfor
    //-macion no afecta a el registro en la base de datos sino que afecta unicamente al objeto que retorna el query
    //-es decir al devolver o crear un objeto tipo documento y llamar el .name activiara este setter y mostrara
    //-la primera letra capitalizada, no es propiedad del documento, es decir, si devolvemos una lista de los
    //-resultados de un query directamente, la primera letra no saldra capitalizada porque es un get cuando se accede
    //-con el ., si se quiere aplicar al devolver el objeto directo de una query se establece despues del 
    //-schema el toJSON y toObject, aunque se vean con la capitalizacion, en la base de datos estaran sin ella
    // get: capitalizeFirstLetter
  },
  name_lower : { type: String },
  state      : { type: Boolean, default: true },
  user       : { type: Schema.Types.ObjectId, ref: 'User', required: [true, 'The user is required'] }
}, 
  //-Aqui tambien se pueden definir propiedades de los schemas (los que iriran en el set)
   
  //-Permite ejecutar los setter al devolver directamente el documento de un query (deben haber getters)
  // { toJSON: { getters: true,  }, toObject: { getters: true } }

  //-Permite omitir las mayusculas, minusculas y acentos en las comparaciones de texto
  // { collation: { locale: 'en_US', strength: 1 } }

  //-Al parecer es como un tipo de transaction que se encarga que no se pueden realizar modificaciones
  //-entre un find o findOne y un save, es decir, evita una manupulacion que no sea tipo update
  // { optimisticConcurrency: true }
)

// categorySchema.pre('save', function(this: Category, next) {
//   this.name = this.name.charAt(0).toUpperCase() + this.name.substring(1).toLowerCase();
  
//   //-Si se quiere guardar sin diracts, el collate tambien cumple esta funcion
//   // this.name_lower = this.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")

//   next();
// })

//-Los metodos de instancia como su nombre lo dice solo estan disponibles a la instancia de un modelo o documento
//-solo pueden ser usados despues de instanciados, por ejemplo aqui se utiliza para que un objeto categoria
//-que corra este metodo con el . acceda al modelo general y traiga el resto de elementos que tengan esa
//-caracteristica
categorySchema.methods.findSimilarTypes = function(callback: Function) {
  return model('Category').find({ type: this.type }, callback);
  // Category.findSimilarTypes((err, categories) => {
  //   console.log(categories); // woof
  // });
};

//-Estos metodos estaticos estan disponibles en la clase no en la instancia de un modelo, por lo que pueden ser usados
//-igual de como se usa el find, findOne, que no necesitan una instancia, ya que estos devuelven eso apoyados
//-en los metodos ya definidos claro esta
categorySchema.statics.findByName = function(name:string) {
  return this.find({ name: new RegExp(name, 'i') });
  //let categories = await Category.findByName('Terror');
};

//-Los metodos query, son similares a los metodos de instancia pero especificamente para trabajar en cadena con unos
//-metodos de clase, es decir estan disponibles en la instancia resumir o customizar busquedas en cadena
categorySchema.query.byName = function(name: string) {
  //-El where casi siempre se utiliza para querys en cadena, despues de find o findone  
  return this.where({ name: new RegExp(name, 'i') })
  
  // Category.find().byName('Terror').exec((err, animals) => { //el exect ejecuta la query (como el await)
  //   console.log(categories);
  // });
};

//-El path vendria siendo como un getter a una propiedad del schema trae todas sus opciones definidas en la creacion
// categorySchema.path('name');

//-Los indices o la indexacion es un proceso que ocupa memoria ram del dispositivo para pre-ejecutar operaciones
//-que mantengan organizados los datos o campos indexados, haciendo que la lectura de estos sea mucho mas rapida
//-ya que no tiene que buscarse en todos los documentos sino en los que ya estan organizados, sin embargo el 
//-indexar muchos campos puede tener consecuencias ya que cada insercion que se haga a la base de datos provocara
//-que los indices se actualicen (lo cual es un proceso costoso) y consuma mas memoria, esto provoca que las escrituras
//-en la base de datos se vuelva mas lenta, se debe buscar un equilibrio, generalmente solo se indexan los campos
//-por los que se busca y se ordena

//-En este caso seteamos el index por fuera del esquema, el valor de 1 o -1 indica si el indice se ordena 
//-de forma ascendente o descendente, en cuanto al tipo, no se tiene muy claro
categorySchema.index({ 
  name:1,
  // type: -1,
  //-Al parecer un index sparce solo contiene entradas de los documentos que tienen el campo indexado
  //-por ejemplo con el sparse en false si el nombre fuera opcional el index se ejecuta sobre el registro
  //-asi no se tenga esta propiedad, encambio con el parse los documentos que no contienen el campo
  //-son skipeados y solo se guarda un registro de los elementos indexados que contienen el campo en cuestion
  // { sparse: true } 
})

//-Se recomienda que para produccion esta variable este en falso, ya que esto provoca que los indices se disparen
//-y pueda causar un impacto en el rendimiento
// categorySchema.set('autoIndex', false);

categorySchema.methods.toJSON = function() {
  const { __v, state, ...category } = this.toObject();
  return category;
}

const categoryModel = model<Category>('Category', categorySchema);

//-Capturar errores, en este caso del indice
// categoryModel.on('index', error => {
//   console.log(error);
// })

//-El populate tambien permite hacer un filtro de elementos
// populate({
//   path: 'fans',
//   match: { age: { $gte: 21 } },
//   // Explicitly exclude `_id`, see http://bit.ly/2aEfTdB
//   select: 'name -_id'
// })

export default categoryModel;