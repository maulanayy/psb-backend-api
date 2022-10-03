/**
 * Notification.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    content : {type : "string"},
    types : {type : "string"},
    types_id : {type : "string"},
    user_id : {
      model : "user",
    },
    material_id : {type : "string"},
    material_slug : {type : "string"},
    hasRead : {type : "boolean",defaultsTo: false, }
  },

};

