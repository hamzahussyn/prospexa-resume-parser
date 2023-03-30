const { Schema, default: mongoose, Types } = require('mongoose');

const tokenSchema = new Schema(
  {
    token: { type: String, required: true },
    userId: { type: Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

const Token = mongoose.model('Token', tokenSchema);
module.exports = {
  Token,
};
