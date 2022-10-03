/**
 * Instrument.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  primaryKey: "id",
  attributes: {
    question: { type: "string", allowNull: true },
    type: { type: "string", allowNull: true },
    value_start: { type: "number", allowNull: true },
    value_end: { type: "number", allowNull: true },
    text_start: { type: "string", allowNull: true },
    text_end: { type: "string", allowNull: true },
    deletedAt: { type: "number", allowNull: true },
  },

};

