/**
 * Material.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  primaryKey: "id",
  attributes: {
    slug: { type: "string", unique: true },
    title: { type: "string", allowNull: true, columnType: "citext" },
    cover_link: { type: "string", allowNull: true },
    rating: {
      type: "number",
      columnType: "float",
      defaultsTo: 0,
      allowNull: true,
    },
    rating_summary: { type: "json" },
    status: { type: "string", allowNull: true },
    comment_count: { type: "number", defaultsTo: 0, allowNull: true },
    view_count: { type: "number", defaultsTo: 0, allowNull: true },
    type: { type: "string", allowNull: true },
    content: { type: "string", allowNull: true },
    overview: { type: "string", allowNull: true },
    keywords: { type: "string", allowNull: true, columnType: "citext" },
    validation_result: { type: "json" },
    created_by: {
      model: "user",
    },
    rating_histories: {
      collection: "ratingHistory",
      via: "material_id",
    },
    comments: {
      collection: "comment",
      via: "material_id",
    },
    deletedAt: { type: "number", allowNull: true },
  },

  beforeCreate: function (valueToSet, proceed) {
    valueToSet.rating_summary = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    };

    return proceed();
  },
};

