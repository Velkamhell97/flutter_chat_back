import { model, Schema, Types } from "mongoose";

interface Product {
  name         : string,
  lower        : string,
  user         : Types.ObjectId,
  price        : number,
  img         ?: string,
  category     : Types.ObjectId,
  description  : string,
  available    : boolean,
  state        : boolean,
}

//-Recordar que en el backend no se deben realizar muchos formatos de fechas o de nombres o de numeros
//-esto es tarea del frontend, aunque se podrian crear otras propiedades que incluya alguna de las anteriores
const productSchema = new Schema<Product>({
  name        : { type: String, required: [true, 'The name is required'], unique: true },
  lower       : String,
  user        : { type: Schema.Types.ObjectId, ref: 'User', required: [true, 'The user is required'] },
  price       : { type: Number, required: [true, 'The price is required'] },
  img         : String,
  category    : { type: Schema.Types.ObjectId, ref: 'Category', required: [true, 'The category is required'] },
  description : { type: String, default: 'Sin descripcion' },
  available   : { type: Boolean, default: true },
  state       : { type: Boolean, default: true },
}, {
  timestamps: { createdAt: 'created', updatedAt: 'updated' },
  collation: { locale: 'en_US', strength: 1 }
})

productSchema.pre('save', function(this: Product, next) {
  const trim = this.name.split(' ').filter(i => i).join(' ');

  this.name  = trim.replace(/(^\w|\s\w)(\S*)/g, (_,m1,m2) => m1.toUpperCase()+m2.toLowerCase());
  this.lower = this.name.toLowerCase();

  next();
})

productSchema.pre('findOneAndUpdate', function(next) {
  let update = {...this.getUpdate()} as { name:string, lower:string };

  if(!update.name){
    return next()
  }

  const trim = update.name.split(' ').filter(i => i).join(' ');

  update.name  = trim.charAt(0).toUpperCase() + trim.substring(1).toLowerCase();
  // this.lower = this.name.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");
  update.lower = update.name.toLowerCase();

  this.setUpdate(update);

  next();
})

productSchema.methods.toJSON = function() {
  const { __v, state, ...product } = this.toObject();
  return product;
}

const productModel = model<Product>('Product', productSchema);

export default productModel;