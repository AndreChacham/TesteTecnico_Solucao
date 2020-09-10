const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const accountSchema = new Schema(
  {
    value: {
      type: Number,
      required: true
    },
    lastRechargeDate: {
      type: String,
      required: true
    },
    initialValue: {
      type: Number,
      required: true
    }
  },
  { timestamps: false }
);

module.exports = mongoose.model('Account', accountSchema);
