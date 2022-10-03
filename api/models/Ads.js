/**
 * Ads.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    name: { type: "string" },
    image_link: { type: "string" },
    link_to: { type: "string" },
    deletedAt: { type: "number", allowNull: true },
  },

};

