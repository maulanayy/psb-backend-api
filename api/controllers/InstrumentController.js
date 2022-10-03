/**
 * InstrumentController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  create: async (req, res) => {
    const { body } = req;
    try {
      const valueStart = body.value_start ? body.value_start : null;
      const valueEnd = body.value_end ? body.value_end : null;
      const textStart = body.text_start ? body.text_start : null;
      const textEnd = body.text_end ? body.text_end : null;

      const instrument = await Instrument.create({
        question: body.question,
        type: body.type,
        value_start: valueStart,
        value_end: valueEnd,
        text_start: textStart,
        text_end: textEnd,
      }).fetch();

      res.ok(instrument);
    } catch (err) {
      console.log(err);
      res.status(401).send(err.message);
    }
  },
  getAll: async (req, res) => {
    const perPage = req.query.per_page;
    const currentPage = req.query.page;
    let query = { deletedAt: null };
    try {
      let instrument = [];
      const pagination = {
        page: parseInt(currentPage) - 1 || 0,
        limit: parseInt(perPage) || 20,
      };

      const count = await Instrument.count(query);
      if (count > 0) {
        instrument = await Instrument.find({ where: query })
          .skip(pagination.page * pagination.limit)
          .limit(pagination.limit);
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
        data: instrument,
        meta: meta,
      };

      res.ok(response);
    } catch (err) {
      console.log(err);
      res.status(401).send(err.message);
    }
  },
  getById: async (req, res) => {
    const { id } = req.params;
    try {
      const instrument = await Instrument.findOne({
        where: {
          id: id,
        },
      });

      res.ok(instrument);
    } catch (err) {
      console.log(err);
      res.status(401).send(err.message);
    }
  },
  update: async (req, res) => {
    const { id } = req.params;
    const { body } = req;
    try {
      const newInstrument = await Instrument.update({
        id: id,
        deletedAt: null,
      })
        .set(body)
        .fetch();

      res.ok(newInstrument);
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
      const newInstrument = await Instrument.update({
        id: id,
      })
        .set({
          deletedAt: getTime,
        })
        .fetch();

      res.ok(newInstrument);
    } catch (err) {
      console.log(err);
      res.status(401).send(err.message);
    }
  },
};
