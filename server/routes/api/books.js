const express = require("express");
const router = express.Router();
const Book = require("../../models/Book");

router.use((req, res, next) => {
  if (req.user) {
    return next();
  }
  return res
    .status(400)
    .json({ status: "error", message: "please login first" });
});

//get all books
// ----> api/books/
router.get("/popularnow", async (req, res) => {
  const books = await Book.find({ isPopularNow: true });
  return res.status(200).json({ status: "success", message: books });
});
router.get("/", async (req, res) => {
  try {
    const books = await Book.find();
    return res.status(200).json({ status: "success", message: books });
  } catch (error) {
    return res.status(200).json({ status: "error", message: error });
  }
});

//get book by id
router.get("/:bookId", async (req, res) => {
  const id = req.params.bookId;
  const book = await Book.findById(id).populate("reviews.userId", "name email");
  return res.status(200).json({ status: "success", message: book });
});

//get book by category
router.get("/category/:category", async (req, res) => {
  const category = req.params.category;
  const books = await Book.find({ category });
  return res.status(200).json({ status: "success", message: books });
});

module.exports = router;
