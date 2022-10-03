/**
 * NotificationController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  getAll: async (req, res) => {
    try {
      const notifications = await Notification.find({
        user_id: req.user.id,
      });

      res.ok(notifications);
    } catch (err) {
      console.log(err);
      res.status(401).send(err.message);
    }
  },
  getById: async (req, res) => {
    const { id } = req.params;
    try {
      const notification = await Notification.findOne({
        id: id,
      });

      res.ok(notification);
    } catch (err) {
      console.log(err);
      res.status(401).send(err.message);
    }
  },
  read: async (req, res) => {
    const { id } = req.params;
    try {
      await Notification.update({
        id: {
          "<=": id,
        },
        user_id: req.user.id,
      }).set({
        hasRead: true,
      });

      res.ok("Update Successfull");
    } catch (err) {
      console.log(err);
      res.status(401).send(err.message);
    }
  },
  count: async (req, res) => {
    try {
      const amountNotification = await Notification.count({
        user_id: req.user.id,
        hasRead: false,
      });

      const result = {
        amount_notification: amountNotification,
      };
      res.ok(result);
    } catch (err) {
      console.log(err);
      res.status(401).send(err.message);
    }
  },
};
