/**
 * Comment.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  primaryKey: "id",
  attributes: {
    user_id: { model: "user" },
    material_id: { model: "material" },
    content: { type: "string" },
    in_reply_to: { type: "string" },
  },

};

