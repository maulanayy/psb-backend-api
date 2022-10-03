/**
 * User.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  primaryKey: "id",
  attributes: {
    name: { type: "string" },
    picture: { type: "string" },
    email: { type: "string", isEmail: true, unique: true },
    sex: { type: "string", allowNull: true },
    job: { type: "string", allowNull: true },
    password: { type: "string", allowNull: true },
    social_login: { type: "string", allowNull: true },
    social_id: { type: "string", allowNull: true },
    role: { type: "string" },
    metadata: { type: "string", allowNull: true },
    materials: {
      collection: "material",
      via: "created_by",
    },
    rating_histories: {
      collection: "ratingHistory",
      via: "user_id",
    },
    comments: {
      collection: "comment",
      via: "user_id",
    },
    is_active: { type: "boolean", defaultsTo: true },
  },

  beforeCreate: function (valuesToSet, proceed) {
    // Hash password

    const password = valuesToSet.password ? valuesToSet.password : "" 
    sails.helpers
      .hashPassword(password)
      .exec((err, hashedPassword) => {
        if (err) {
          return proceed(err);
        }
        valuesToSet.password = hashedPassword;
        return proceed();
      }); 
  },
};

