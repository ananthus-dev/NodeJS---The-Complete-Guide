const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const orderSchema = new Schema({
  // Now type object by the way is a bit of a shortcut, 
  //  of course we could define the full nested product with all the properties there,  
  //  feel free to do that,  I'll just say well this is any object
  products: [
    {
      product: { type: Object, required: true },
      quantity: { type: Number, required: true }
    }
  ],
  user: {
    name: {
      type: String,
      required: true
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    }
  }
});

module.exports = mongoose.model('Order', orderSchema);
