/**
 * SiteSetting.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    logo_link: { type: "string" },
    favicon_link: { type: "string" },
    site_name: { type: "string" },
    footer_text: { type: "string" },
    meta_description: { type: "string" },
    meta_keyword: { type: "string" },
    ga: { type: "string" },
  },

};

