/**
 * SiteSettingController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  create: async (req, res) => {
    const { body } = req;
    try {
      const settings = await Sitesetting.find();
      let newSetting;
      let msg = "";
      if (settings.length > 0) {
        const setting = settings[0];

        newSetting = await Sitesetting.update({
          logo_link: setting.logo_link,
        })
          .set(body)
          .fetch();
        msg = "udpate setting success..";
      } else {
        newSetting = await Sitesetting.create({
          logo_link: body.logo_link,
          favicon_link: body.favicon_link,
          site_name: body.site_name,
          footer_text: body.footer_text,
          meta_description: body.meta_description,
          meta_keyword: body.meta_keyword,
          ga: body.ga,
        });

        msg = "create setting success";
      }
      // const setting = await Sitesetting.find();

      res.status(200).json({
        status: "true",
        message: msg,
        data: newSetting,
      });
    } catch (err) {
      res.status(401).send(err.message);
    }
  },
  get: async (req, res) => {
    try {
      let result = {
        createdAt: null,
        updatedAt: null,
        id: null,
        logo_link: null,
        favicon_link: null,
        site_name: null,
        footer_text: null,
        meta_description: null,
        meta_keyword: null,
        ga: null,
      };

      const setting = await Sitesetting.find();

      result.createdAt = setting[0].createdAt;
      result.updatedAt = setting[0].createdAt;
      result.id = setting[0].id;
      result.logo_link = setting[0].logo_link;
      result.favicon_link = setting[0].favicon_link;
      result.site_name = setting[0].site_name;
      result.footer_text = setting[0].footer_text;
      result.meta_description = setting[0].meta_description;
      result.meta_keyword = setting[0].meta_keyword;
      result.ga = setting[0].ga;

      res.ok(result);
    } catch (err) {
      res.status(401);
      res.send(err.message);
    }
  },
};
