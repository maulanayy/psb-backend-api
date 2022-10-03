/**
 * BannersController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  getAll: async (req, res) => {
    const perPage = req.query.per_page;
    const currentPage = req.query.page;
    const sort = req.query.sort ? req.query.sort : "createdAt DESC";
    let query = { deletedAt: null };

    try {
      let banners = [];
      const pagination = {
        page: parseInt(currentPage) - 1 || 0,
        limit: parseInt(perPage) || 20,
      };

      const count = await Banners.count(query);
      if (count > 0) {
        banners = await Banners.find({
          where: query,
        })
          .skip(pagination.page * pagination.limit)
          .limit(pagination.limit)
          .sort(sort);
      }

      const numberOfPages = Math.ceil(count / pagination.limit);
      const nextPage = parseInt(currentPage) + 1;
      const meta = {
        page: parseInt(currentPage),
        perPage: pagination.limit,
        previousPage:
          parseInt(currentPage) > 1 ? parseInt(currentPage) - 1 : false,
        nextPage: numberOfPages >= nextPage ? nextPage : false,
        pageCount: numberOfPages,
        total: count,
      };

      const response = {
        data: banners,
        meta: meta,
      };

      res.ok(response);
    } catch (err) {
      res.status(401).send(err.message);
    }
  },
  delete: async (req, res) => {
    const { id } = req.params;
    try {
      const date = new Date();
      const getTime = date.getTime();
      const banners = await Banners.update({ id: id })
        .set({
          deletedAt: getTime,
        })
        .fetch();

      res.ok(banners);
    } catch (err) {
      res.status(401).send(err.message);
    }
  },
};
