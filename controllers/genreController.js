const Genre = require("../models/genre");
const Book = require("../models/book");
const async = require("async");
const { body, validationResult } = require("express-validator");
const mongoose = require("mongoose");

exports.genre_list = (req, res, next) => {
  Genre.find()
    .sort({ name: 1 })
    .exec(function (err, list_genre) {
      if (err) {
        next(err);
      }

      res.render("genre_list", {
        title: "Genre List",
        genre_list: list_genre,
      });
    });
};

exports.genre_detail = (req, res, next) => {
  const id = mongoose.Types.ObjectId(req.params.id);
  async.parallel(
    {
      genre(callback) {
        Genre.findById(id).exec(callback);
      },

      genre_books(callback) {
        Book.find({ genre: id }).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        next(err);
      }

      if (results.genre == null) {
        const err = new Error("Genre not found");
        err.status = 404;
        return next(err);
      }

      res.render("genre_detail", {
        title: "Genre Detail",
        genre: results.genre,
        genre_books: results.genre_books,
      });
    }
  );
};

exports.genre_create_get = (req, res) => {
  res.render("genre_form", { title: "Create Genre" });
};

exports.genre_create_post = [
  body("name", "Genre name required").trim().isLength({ min: 1 }).escape(),

  (req, res, next) => {
    const errors = validationResult(req);

    const genre = new Genre({ name: req.body.name });

    if (!errors.isEmpty()) {
      res.render("genre_form", {
        title: "Create Genre",
        genre,
        errors: errors.array(),
      });
      return;
    } else {
      Genre.findOne({ name: req.body.name }).exec((err, found_genre) => {
        if (err) {
          return next(err);
        }

        if (found_genre) {
          res.redirect(found_genre.url);
        } else {
          genre.save((err) => {
            if (err) {
              return next(err);
            }

            res.redirect(genre.url);
          });
        }
      });
    }
  },
];

exports.genre_delete_get = (req, res) => {
  res.send("NOT IMPLEMENTED: Genre delete GET");
};

exports.genre_delete_post = (req, res) => {
  res.send("NOT IMPLEMENTED: Genre delete POST");
};

exports.genre_update_get = (req, res) => {
  res.send("NOT IMPLEMENTED: Genre update GET");
};

exports.genre_update_post = (req, res) => {
  res.send("NOT IMPLEMENTED: Genre update POST");
};
