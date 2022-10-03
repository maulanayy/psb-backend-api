/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your actions.
 *
 * For more information on configuring policies, check out:
 * https://sailsjs.com/docs/concepts/policies
 */

module.exports.policies = {

  /***************************************************************************
  *                                                                          *
  * Default policy for all controllers and actions, unless overridden.       *
  * (`true` allows public access)                                            *
  *                                                                          *
  ***************************************************************************/

  '*': true,
  FileController: {
    "*": true,
  },
  SitesettingController: {
    "*": true,
  },
  MaterialController: {
    "*": "isAuthenticated",
    getAll: true,
    getBySlug: true,
    addView: true,
  },
  AdsController: {
    "*": "isAuthenticated",
    getAll: true,
  },
  BannersController: {
    "*": "isAuthenticated",
    getAll: true,
  },
  CommentController: {
    "*": "isAuthenticated",
    getByMaterial: true,
  },
  UserController: {
    "*": true,
    update: "isAuthenticated",
    register: "isAuthenticated",
    getProfile: "isAuthenticated",
    updateProfile: "isAuthenticated",
    updatePassword: "isAuthenticated",
    checkAuth : "isAuthenticated"
  },
  InstrumentController: {
    "*": true,
  },
  NotificationController: {
    "*": "isAuthenticated",
  },
};
