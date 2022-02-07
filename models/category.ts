import { model, Schema, Types } from "mongoose";

interface Category {
  name  : string,
  lower : string,
  user  : Types.ObjectId
  state : boolean,
}

const categorySchema = new Schema<Category>({
  name  : { type: String, required: [true, 'The name is required'], unique: true },
  lower : String,
  user  : { type: Schema.Types.ObjectId, ref: 'User', required: [true, 'The user is required'] },
  state : { type: Boolean, default: true },
  //- indx: true --> Se podria hacer un index para que busque mas rapido las categorias por usuario
}, 
  { 
    // toJSON: { virtuals: true },
    // toObject: { virtuals: true },
    timestamps: { createdAt: 'created', updatedAt: 'updated' },
    collation: { locale: 'en_US', strength: 1 } //--> case insensitive para el nombre,
  }
)

categorySchema.pre('save', function(this: Category, next) {
  const trim = this.name.split(' ').filter(i => i).join(' ');

  this.name  = trim.charAt(0).toUpperCase() + trim.substring(1).toLowerCase();
  // this.lower = this.name.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, ""); --> Quitar acentos
  this.lower = this.name.toLowerCase();

  next();
})

//-Recordar que al final que algo quede mal escrito es problema del cliente si el desea dejarlo asi o cambiarlo
categorySchema.pre('findOneAndUpdate', function(next) {
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

categorySchema.methods.toJSON = function() {
  const { __v, state, ...category } = this.toObject();
  return category;
}

categorySchema.virtual('products', {
  ref:'Product',
  localField:'_id',
  foreignField: 'category'
})

const categoryModel = model<Category>('Category', categorySchema);

export default categoryModel;