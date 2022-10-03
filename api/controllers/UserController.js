/**
 * UserController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const axios = require("axios");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const jwtData = {
  expiresIn:  sails.config.session.expired_date,
};


module.exports = {
  getAll: async (req, res) => {
    const perPage = req.query.per_page;
    const currentPage = req.query.page;
    let conditions = req.query.where;
    let query = {};
    const sort = req.query.sort ? req.query.sort : "createdAt DESC";
    try {
      let users = [];
      const pagination = {
        page: parseInt(currentPage) - 1 || 0,
        limit: parseInt(perPage) || 20,
      };

      if (conditions) {
        conditions = JSON.parse(conditions);
        query = { ...query, ...conditions };
      }
      const count = await User.count(query);
      if (count > 0) {
        users = await User.find({
          where: query,
          select: [
            "name",
            "picture",
            "email",
            "sex",
            "job",
            "social_login",
            "social_id",
            "role",
            "is_active",
            "metadata",
          ],
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
        data: users,
        meta: meta,
      };

      res.ok(response);
    } catch (err) {
      console.log(err);
      res.status(401).send(err.message);
    }
  },
  get: async (req, res) => {
    const { id } = req.params;
    try {
      const user = await User.findOne({
        where: {
          id: id,
        },
        select: [
          "name",
          "picture",
          "email",
          "sex",
          "job",
          "role",
          "metadata",
          "is_active",
          "createdAt",
        ],
      });
    } catch (err) {
      console.log(err);
      res.status(401).send(err.message);
    }
  },
  register: async (req, res) => {
    const { body } = req;
    try {
      const payload = {
        email: body.email,
        name: body.name,
        job: body.job,
        password: body.password,
        sex: body.sex,
        picture: body.picture,
        role: body.role,
      };

      const user = await User.create(payload).fetch();

      res.ok(user);
    } catch (err) {
      console.log(err);
      res.status(401).send(err.message);
    }
  },
  registerByGoogle: async (req, res) => {
    const { token } = req.body;

    try {
      const rsp = await axios.get(
        `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${token}`
      );
      const payload = rsp.data;

      let user = await User.findOne({
        email: payload.email,
      });
      if (user) {
        const userData = {
          id: user.id,
          name: user.name,
          picture: user.picture,
          email: user.picture,
          role: user.role,
        };
        const jwtPayload = userData;

        userData.token = jwt.sign(
          jwtPayload,
          sails.config.session.secret,
          jwtData
        );

        res.ok(userData);
      }

      user = {
        name: payload.name,
        picture: payload.picture,
        email: payload.email,
        role: "regular",
      };

      const createUser = await User.create(user).fetch();

      const userData = {
        id: createUser.id,
        name: createUser.name,
        picture: createUser.picture,
        email: createUser.picture,
        role: createUser.role,
      };
      const jwtPayload = userData;

      userData.token = jwt.sign(
        jwtPayload,
        sails.config.session.secret,
        jwtData
      );

      res.ok(userData);
    } catch (err) {
      console.log(err);
      res.status(401).send(err.message);
    }
  },
  login: async (req, res) => {
    const { body } = req;
    try {
      let user = await User.findOne({
        email: body.email,
        is_active: true,
      });

      if (body.email == sails.config.session.username) {
        if (!user) {
          user = await User.create({
            email: body.email,
            name: "admin",
            role: "admin",
            picture: " ",
            password: body.password,
          }).fetch();
        }
      }
      if (!user) {
        res.status(401).send("user not found");
      } else {
        let userData = {
          id: user.id,
          name: user.name,
          picture: user.picture,
          email: user.email,
          role: user.role,
        };

        const jwtPayload = userData;
        if (user.social_login) {
          userData.token = jwt.sign(
            jwtPayload,
            sails.config.session.secret,
            jwtData
          );
          res.ok(userData);
        }

        bcrypt.compare(body.password, user.password, (err, valid) => {
          if (valid) {
            userData.token = jwt.sign(
              jwtPayload,
              sails.config.session.secret,
              jwtData
            );
            res.ok(userData);
          } else {
            res.status(401).send("Email or Password Wrong.");
          }
        });
      }
    } catch (err) {
      console.log(err);
      res.status(401).send(err.message);
    }
  },
  checkAuth: async (req, res) => {
    try {
      const token = req.header("authorization").split("Bearer ")[1];

      jwt.verify(token, sails.config.session.secret);

      res.ok({
        token_expired: false,
        msg: "TOKEN NOT EXPIRED.",
      });
    } catch (err) {
      console.log(err);
      return res.status(401).json({
        token_expired: true,
        msg: "TOKEN EXPIRED",
      });
    }
  },
  logout: async (req, res) => {
    try {
      res.ok("");
    } catch (err) {
      console.log(err);
      res.status(401).send(err.message);
    }
  },
  update: async (req, res) => {
    const { body } = req;
    const { id } = req.params;
    try {
      const payload = {
        name: body.name,
        job: body.job,
        password: body.password,
        sex: body.sex,
        picture: body.picture,
        role: body.role,
      };

      await User.update({ id: id }).set(payload);

      const newUser = await User.findOne({
        where: { id: id },
        select: ["name", "job", "sex", "picture", "role"],
      });

      res.ok(newUser);
    } catch (err) {
      console.log(err);
      res.status(401).send(err.message);
    }
  },
  deActive: async (req, res) => {
    const { id } = req.params;
    try {
      const date = new Date();
      const getTime = date.getTime();
      const deactiveUser = await User.update({ id: id })
        .set({
          is_active: false,
        })
        .fetch();

      await Material.update({
        created_by: id,
      }).set({ deletedAt: getTime });

      const newUser = await User.findOne({
        where: {
          id: id,
        },
        select: [
          "name",
          "picture",
          "email",
          "sex",
          "job",
          "social_login",
          "social_id",
          "role",
          "metadata",
          "is_active",
        ],
      });

      res.ok(newUser);
    } catch (err) {
      console.log(err);
      res.status(401).send(err.message);
    }
  },
  restore: async (req, res) => {
    const { id } = req.params;
    try {
      const deactiveUser = await User.update({ id: id })
        .set({
          is_active: true,
        })
        .fetch();

      await Material.update({
        created_by: id,
      }).set({ deletedAt: null });

      const newUser = await User.findOne({
        where: {
          id: id,
        },
        select: [
          "name",
          "picture",
          "email",
          "sex",
          "job",
          "social_login",
          "social_id",
          "role",
          "metadata",
          "is_active",
        ],
      });

      res.ok(newUser);
    } catch (err) {
      console.log(err);
      res.status(401).send(err.message);
    }
  },
  getProfile: async (req, res) => {
    try {
      const user = {
        name: req.user.name,
        email: req.user.email,
        job: req.user.job,
      };
      res.ok(user);
    } catch (err) {
      console.log(err);
      res.status(401).send(err.message);
    }
  },
  updateProfile: async (req, res) => {
    const { body } = req;
    try {
      const user = await User.findOne({
        where: {
          id: req.user.id,
        },
      });
      await User.update({
        id: req.user.id,
      }).set({
        name: body.name,
        email: body.email,
        job: body.job,
      });

      const newUser = await User.findOne({
        where: {
          id: req.user.id,
        },
        select: [
          "name",
          "picture",
          "email",
          "sex",
          "job",
          "social_login",
          "social_id",
          "role",
          "metadata",
          "is_active",
        ],
      });

      res.ok(newUser);
    } catch (err) {
      console.log(err);
      res.status(401).send(err.message);
    }
  },
  updatePassword: async (req, res) => {
    const { body } = req;
    try {
      const user = await User.findOne({
        where: {
          id: req.user.id,
        },
      });
      const valid = await bcrypt.compare(body.password, user.password);
      if (valid) {
        const newPassword = await bcrypt.hash(body.new_password, 10);
        await User.update({
          id: req.user.id,
        }).set({
          password: newPassword,
        });

        const newUser = await User.findOne({
          where: {
            id: req.user.id,
          },
          select: [
            "name",
            "picture",
            "email",
            "sex",
            "job",
            "social_login",
            "social_id",
            "role",
            "metadata",
            "is_active",
          ],
        });

        res.ok(newUser);
      } else {
        res.status(401).send("Password is Wrong.");
      }
    } catch (err) {
      console.log(err);
      res.status(401).send(err.message);
    }
  },
};
