/**
 * Upload.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    types: { type: "string" },
    name: { type: "string" },
    path: { type: "string" },
    is_deleted: { type: "boolean", defaultsTo: false },
  },

};

