/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` your home page.            *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/

  '/': { view: 'pages/homepage' },


  /***************************************************************************
  *                                                                          *
  * More custom routes here...                                               *
  * (See https://sailsjs.com/config/routes for examples.)                    *
  *                                                                          *
  * If a request to a URL doesn't match any of the routes in this file, it   *
  * is matched against "shadow routes" (e.g. blueprint routes).  If it does  *
  * not match any of those, it is matched against static assets.             *
  *                                                                          *
  ***************************************************************************/
   "post /material": "MaterialController.create",
   "get /material": "MaterialController.getAll",
   "get /material/:id": "MaterialController.getById",
   "get /material/:slug/slug": "MaterialController.getBySlug",
   "get /material/rating": "MaterialController.getAllByRating",
   "get /material/count": "MaterialController.countByType",
   "put /material/:id" : "MaterialController.update",
   "put /material/:id/view": "materialController.addView",
   "put /material/:id/rating": "MaterialController.addRating",
   "delete /material/reject/:id": "MaterialController.reject",
   "delete /material/:id": "MaterialController.delete",
 
   "get /banners": "BannersController.getAll",
   "delete /banners/:id": "BannersController.delete",
 
   "get /user": "UserController.getAll",
   "get /user/profile": "UserController.getProfile",
   "post /user": "UserController.register",
   "post /user/regis-by-google": "UserController.registerByGoogle",
   "post /user/login": "UserController.login",
   "post /user/profile": "UserController.updateProfile",
   "post /user/password": "UserController.updatePassword",
   "put /user/:id": "UserController.update",
   "put /user/restore/:id": "UserController.restore",
   "delete /user/:id": "UserController.deActive",
   "get /user/check-auth" : "UserController.checkAuth",
 
   "post /setting/create": "SiteSettingController.create",
   "get /setting/": "SiteSettingController.get",
 
   "post /file/upload": "FileController.upload",
   "post /file/upload-html": "FileController.uploadHtml",
 
   "get /ads": "AdsController.getAll",
   "delete /ads/:id": "AdsController.delete",
 
   "post /comment": "CommentController.add",
   "get /comment/:material_id": "CommentController.getByMaterial",
   "put /comment/:id": "CommentController.update",
 
   "get /instrument": "InstrumentController.getAll",
   "get /instrument/:id": "InstrumentController.getById",
   "post /instrument": "InstrumentController.create",
   "put /instrument/:id": "InstrumentController.update",
   "delete /instrument/:id": "InstrumentController.delete",
 
   "get /notifications": "NotificationController.getAll",
   "get /notifications/count" : "NotificationController.count",
   "post /notifications/read-notif/:id" : "NotificationController.read",
   "get /notifications/:id": "NotificationController.getById",

};
