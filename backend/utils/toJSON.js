// Shared toJSON options: expose `id` instead of `_id`/`__v`, hide secrets.
module.exports = {
  virtuals: false,
  versionKey: false,
  transform(doc, ret) {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.passwordHash;
    delete ret.passwordResetToken;
    delete ret.passwordResetExpires;
    return ret;
  },
};
