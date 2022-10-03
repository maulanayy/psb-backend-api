/**
 * FileController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
var client = require("scp2");
const path = require("path");
const fs = require("fs");
const extract = require("extract-zip");
const host = "asset.psbfip.upi.edu";
const username = "assetpsb";
const password = "6OxTNonaFc";
module.exports = {
  upload: async (req, res) => {
    const dirAssetMedia = sails.config.assets.dirImage;
    const pathSeparate = req.query.filename.split("/");
    try {
      let dir = __dirname + "/../../assets/images";

      for (const key in pathSeparate) {
        if (key < pathSeparate.length - 1 && pathSeparate[key] != "") {
          dir = [dir, pathSeparate[key]].join("/");
          console.log(dir);
          if (!fs.existsSync(dir)) {
            console.log("BUAT FOLDER");
            fs.mkdirSync(dir);
          } else {
            console.log("UDAH ADA FOLDER");
          }
        }
      }

      let uploadLocation =
        pathSeparate.length > 1 ? dir + "/" : "../../assets/images/";
      console.log(this.uploadLocation);
      req.file("file").upload(
        {
          dirname: uploadLocation,
        },
        function done(err, uploadFiles) {
          if (err) {
            res.status(401).send(err.message);
          }
          if (uploadFiles.length === 0) {
            return res.badRequest("No file was uploaded");
          }

          const url =
            username +
            ":" +
            password +
            "@" +
            host +
            ":" +
            dirAssetMedia +
            req.query.filename;
          console.log(uploadFiles[0].fd);
          const result = sails.config.assets.urlImage + req.query.filename;

          client.scp(uploadFiles[0].fd, url, function (err) {
            if (err) {
              console.error(err);
              res.status(401).send("Gagal upload file");
            }

            if (pathSeparate.length == 1) {
              fs.unlink(uploadFiles[0].fd, (err) => {
                if (err) {
                  console.error(err);
                  res.status(401).send(err.message);
                }
              });
            } else {
              fs.rmdir(
                dir,
                {
                  recursive: true,
                },
                (err) => {
                  if (err) {
                    console.error(err);
                    res.status(401).send(err.message);
                  }
                }
              );
            }

            Upload.create({
              types: uploadFiles[0].type,
              name: req.query.filename,
              path: result,
            })
              .then(() => {
                res.ok({
                  url: result,
                });
              })
              .catch((err) => {
                console.error(err);
                res.status(401).send("Gagal upload file");
              });
          });
        }
      );
    } catch (err) {
      console.log(err);
      res.status(401).send(err.message);
    }
  },

  uploadHtml: async (req, res) => {
    const { query } = req;
    const dir = sails.config.assets.dirHtml;
    const returnData = sails.config.assets.urlHtml + req.query.filename;
    try {
      req.file("file").upload(
        {
          dirname: "../../assets/zip/",
          saveAs: query.filename,
          maxBytes: 300000000,
        },
        function done(err, uploadFile) {
          if (err) {
            res.status(401).send(err.message);
          }
          if (uploadFile.length === 0) {
            res.status(401).send("No file was uploaded");
          }
          async function extracts() {
            await extract(uploadFile[0].fd, {
              dir: dir,
            });
          }

          extracts()
            .then(() => {
              fs.unlink(uploadFile[0].fd, (err) => {
                if (err) {
                  console.error(err);
                  res.status(401).send("Gagal hapus file");
                }
                Upload.create({
                  types: uploadFile[0].type,
                  name: req.query.filename,
                  path: returnData,
                })
                  .then(() => {
                    res.ok(returnData);
                  })
                  .catch((err) => {
                    console.error(err);
                    res.status(401).send("Gagal upload file");
                  });
              });
            })
            .catch((err) => {
              console.error(err);
              res.status(401).send("Gagal extract file");
            });
        }
      );
    } catch (err) {
      res.status(401).send(err.message);
    }
  },
};
