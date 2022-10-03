/**
 * CommentController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  add: async (req, res) => {
    const { body } = req;
    try {
      const memberId = req.user.id;

      const material = await Material.findOne({
        where: { id: body.material_id },
        select: ["comment_count", "created_by"],
      });

      const comment = await Comment.create({
        user_id: memberId,
        material_id: body.material_id,
        content: body.content,
        in_reply_to: body.in_reply_to,
      }).fetch();

      await Material.update({
        id: body.material_id,
      })
        .set({
          comment_count: material.comment_count + 1,
        })
        .fetch();

      await Notification.create({
        user_id: material.created_by,
        material_id: body.material_id,
        types: "comment",
        types_id: comment.id,
        material_slug: material.slug,
        content: `${req.user.name} memberikan komentar`,
      });
      res.ok(comment);
    } catch (err) {
      res.status(401).send(err.message);
    }
  },
  update: async (req, res) => {
    const { id } = req.params;
    const { body } = req;
    try {
      const newComment = await Comment.update({
        id: id,
      })
        .set({
          content: body.content,
        })
        .fetch();

      res.ok(newComment);
    } catch (err) {
      console.log(err);
      res.status(401).send(err.message);
    }
  },
  getByMaterial: async (req, res) => {
    const { material_id } = req.params;
    try {
      const comments = await Comment.find({
        where: {
          material_id: material_id,
        },
        select: [
          "user_id",
          "content",
          "material_id",
          "in_reply_to",
          "createdAt",
        ],
      }).populate("user_id");

      res.ok(comments);
    } catch (err) {
      res.status(401).send(err.message);
    }
  },
};
