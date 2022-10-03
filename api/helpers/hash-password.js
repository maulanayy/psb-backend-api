const bcrypt = require("bcrypt");

module.exports = {
  friendlyName: "Hash password",
  description: "Hash Password for User",
  inputs: {
    password: {
      friendlyName: "Password Of Users",
      description: "password for verification user.",
      type: "string",
    },
  },
  exits: {
    success: {
      description: "All done.",
    },
  },

  fn: async function (inputs, exits) {
    const hash = inputs.password != "" ? await bcrypt.hash(inputs.password, 10) : null
    return exits.success(hash);
  },
};
