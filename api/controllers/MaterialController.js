/**
 * MaterialController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const slugs = require("slug");

module.exports = {
  create: async (req, res) => {
    const { body } = req;
    let newGuid = "";
    for (var i = 0; i < 5; i++) {
      newGuid += Math.floor(Math.random() * 0xf).toString(0xf);
    }
    try {
      let slug = slugs(body.title, "-");
      const foundMaterial = await Material.findOne({
        where: {
          slug: slug,
        },
      });
      if (foundMaterial) {
        slug = slug + newGuid;
      }

      const status = req.user.role == "admin" ? "posted" : "pending";

      const material = await Material.create({
        slug: slug,
        title: body.title,
        cover_link: body.cover_link,
        status: status,
        type: body.type,
        content: body.content,
        overview: body.overview,
        keywords: body.keywords,
        created_by: req.user.id,
      }).fetch();
      res.ok(material);
    } catch (err) {
      console.log(err);
      res.status(401).send(err.message);
    }
  },
  getAll: async (req, res) => {
    const perPage = req.query.per_page;
    const currentPage = req.query.page;
    let conditions = req.query.where;
    let query = { deletedAt: null };
    const sort = req.query.sort ? req.query.sort : "createdAt DESC";
    try {
      let material = [];
      const pagination = {
        page: parseInt(currentPage) - 1 || 0,
        limit: parseInt(perPage) || 20,
      };

      if (conditions) {
        conditions = JSON.parse(conditions);
        query = { ...query, ...conditions };
      }
      const count = await Material.count(query);
      if (count > 0) {
        material = await Material.find({ where: query })
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
        data: material,
        meta: meta,
      };

      res.ok(response);
    } catch (err) {
      res.status(401).send(err.message);
    }
  },
  getById: async (req, res) => {
    const { id } = req.params;
    try {
      let material = await Material.findOne({
        where: {
          id: id,
        },
      }).populate("created_by");

      const countQuery =
        "SELECT COUNT(*) as groupCount,(SUM(rating) / COUNT(rating))as groupRating FROM MATERIAL WHERE created_by = $1 and id =$2 LIMIT 1";
      const rateUser =
        "SELECT rate FROM RATING_HISTORY WHERE user_id=$1 AND material_id=$2 LIMIT 1";

      const queryMaterialCount = await sails.sendNativeQuery(countQuery, [
        material.created_by.id,
        id,
      ]);
      const queryRate = await sails.sendNativeQuery(rateUser, [
        material.created_by.id,
        id,
      ]);

      material.material_count = queryMaterialCount.rows[0].groupcount;
      material.rating_count = queryMaterialCount.rows[0].grouprating;
      material.user_rate = queryRate.rows[0].rate;

      res.ok(material);
    } catch (err) {
      res.status(401).send(err.message);
    }
  },
  update: async (req, res) => {
    const { id } = req.params;
    const { body } = req;
    try {
      const material = await Material.update({
        id: id,
      })
        .set(body)
        .fetch();

      if (body.validation_result && body.status) {
        const status =
          body.status === "posted" ? "telah menyetujui" : "tidak menyetujui";
        await Notification.create({
          user_id: material[0].created_by,
          material_id: id,
          types: "validation",
          types_id: id,
          material_slug: material[0].slug,
          content: `Validator ${status} material ${material[0].title}`,
        });
      }

      res.ok(material[0]);
    } catch (err) {
      console.log(err);
      res.status(401).send(res.message);
    }
  },
  getBySlug: async (req, res) => {
    const { slug } = req.params;
    try {
      const material = await Material.findOne({
        where: {
          slug: slug,
        },
      }).populate("created_by");

      const groupCount = await Material.count({
        created_by: material.created_by.id,
      });
      material.material_count = groupCount;
      res.ok(material);
    } catch (err) {
      console.log(err);
      res.status(401).send(err.message);
    }
  },
  countByType: async (req, res) => {
    try {
      Material.query(
        "SELECT material.type, COUNT(*) from material GROUP BY type",
        (err, rawresult) => {
          if (err) {
            res.status(401).send(err.message);
          }

          res.ok(rawresult.rows);
        }
      );
    } catch (err) {
      console.log(err);
      res.status(401).send(res.message);
    }
  },
  addRating: async (req, res) => {
    const { id } = req.params;
    const { body } = req;
    let ratingId = "";
    try {
      const memberId = req.user.id;
      const rating = parseInt(body.rating);
      let newRate = 0;
      let amountRate = 0;

      if (rating > 5) {
        res.status(401).send("Rating More Than 5");
      }
      let historyRating = await Rating_history.findOne({
        user_id: req.user.id,
        material_id: id,
      });

      let rateMaterial = await Material.findOne({
        where: { id: id },
        select: ["rating_summary"],
      });

      const rateSummary = rateMaterial.rating_summary;

      if (historyRating) {
        const rate = historyRating.rate;

        if (rateSummary[rate.toString()] > 0) {
          rateSummary[rate.toString()] -= 1;
        }

        rateSummary[rating] += 1;
        ratingId = historyRating.id;
        await Rating_history.update({ id: historyRating.id })
          .set({
            rate: rating,
          })
          .fetch();
      } else {
        rateSummary[rating] += 1;

        const newRateHistory = await Rating_history.create({
          user_id: memberId,
          material_id: id,
          rate: rating,
        }).fetch();

        ratingId = newRateHistory.id;
      }

      for (const key in rateSummary) {
        newRate = newRate + key * rateSummary[key];
        amountRate += rateSummary[key];
      }

      const material = await Material.update({ id: id })
        .set({
          rating_summary: rateSummary,
          rating: newRate / amountRate,
        })
        .fetch();

      await Notification.create({
        user_id: material[0].created_by,
        material_id: id,
        types: "rating",
        types_id: ratingId,
        material_slug: material[0].slug,
        content: `${req.user.name} memberikan rating ${body.rating}`,
      });
      res.ok(material[0]);
    } catch (err) {
      res.status(401).send(err.message);
    }
  },
  addView: async (req, res) => {
    const { id } = req.params;
    try {
      const material = await Material.findOne({
        where: { id: id },
        select: ["view_count"],
      });

      const NewMaterial = await Material.update({ id: id })
        .set({
          view_count: material.view_count + 1,
        })
        .fetch();

      res.ok(NewMaterial);
    } catch (err) {
      res.status(401).send(err.message);
    }
  },
  getAllByRating: async (req, res) => {
    const perPage = req.query.per_page | 5;
    const currentPage = req.query.page | 1;
    const from = req.query.from;
    const to = req.query.to;
    const sort = req.query.sort ? req.query.sort : "createdAt DESC";
    try {
      const pagination = {
        page: parseInt(currentPage) - 1 || 0,
        limit: parseInt(perPage) || 20,
      };

      if (parseInt(from) > parseInt(to)) {
        res.status(401).send(err.message)("From Greater than To for Rating.");
      }

      let query = {
        status: "active",
        rating: { ">=": parseInt(from), "<=": parseInt(to) },
      };

      const count = await Material.count(query);
      const material = await Material.find(query)
        .skip(pagination.page * pagination.limit)
        .limit(pagination.limit)
        .sort(sort);

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
        data: material,
        meta: meta,
      };

      res.ok(response);
    } catch (err) {
      res.status(401).send(err.message);
    }
  },
  reject: async (req, res) => {
    const { id } = req.params;
    try {
      const material = await Material.update({
        id: id,
      })
        .set({
          status: "reject",
        })
        .fetch();

      res.ok(material);
    } catch (err) {
      console.log(err);
      res.status(401).send(err.message);
    }
  },
  delete: async (req, res) => {
    const { id } = req.params;
    try {
      const date = new Date();
      const getTime = date.getTime();
      const material = await Material.update({ id: id })
        .set({
          deletedAt: getTime,
        })
        .fetch();

      res.ok(material);
    } catch (err) {
      res.status(401).send(err.message);
    }
  },
};
