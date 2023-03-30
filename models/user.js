const { Schema, default: mongoose } = require('mongoose');
const { RolesEnum } = require('../constants/roles');
const { hashPassword } = require('../utils/security');

const userSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, require: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, enum: Object.values(RolesEnum), default: RolesEnum.USER },
    salt: { type: String, required: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

userSchema.pre('save', function (next) {
  const User = this;
  if (User.isModified('password')) {
    const { salt, hash } = hashPassword(User.password);
    User.password = hash;
    User.salt = salt;
  }
  next();
});

const User = mongoose.model('User', userSchema);
module.exports = {
  User,
};
