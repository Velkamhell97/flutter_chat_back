import { model, Schema, Types } from "mongoose";

export interface Product {
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

const productSchema = new Schema<Product>({
  name        : { type: String, required: [true, 'The name is required'], unique: true },
  lower       : String,
  user        : { type: Schema.Types.ObjectId, ref: 'User', required: [true, 'The user is required'] },
  price       : { type: Number, required: [true, 'The price is required'], default: 0.0 },
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

  this.name  = trim.charAt(0).toUpperCase() + trim.substring(1).toLowerCase();
  // this.lower = this.name.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, ""); --> Quitar acentos
  this.lower = this.name.toLowerCase();

  next();
})

productSchema.pre('findOneAndUpdate', function(next) {
  let update = this.getUpdate() as Product;

  if(!update.name){
    return next()
  }

  const trim = update.name.split(' ').filter(i => i).join(' ');

  update.name  = trim.charAt(0).toUpperCase() + trim.substring(1).toLowerCase();
  update.lower = update.name.toLowerCase();

  next();
})

//->Eliminacion de campos en el toJson
productSchema.methods.toJSON = function() {
  const { __v, state, ...product } = this.toObject();
  return product;
}

const productModel = model<Product>('Product', productSchema);

export default productModel;