/**
 * Banners.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    title: { type: "string" },
    subtitle: { type: "string" },
    cta_text: { type: "string" },
    cta_link: { type: "string" },
    cta_new_page: { type: "string" },
    image_link: { type: "string" },
    text_colot: { type: "string" },
    deletedAt: { type: "number",allowNull: true },
  },

};

