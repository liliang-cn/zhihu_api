const Router = require("@koa/router");
const jwt = require("koa-jwt");

const {
  find,
  findById,
  create,
  update,
  delete: destroy,
  checkCommentExist,
  checkCommentator,
} = require("../controllers/comment");
const { secret } = require("../config");

const router = new Router({
  prefix: "/questions/:questionId/answers/:answerId/comments",
});

const auth = jwt({
  secret,
});

router.get("/", find);
router.get("/:id", checkCommentExist, findById);
router.post("/", auth, create);
router.patch("/:id", auth, checkCommentExist, checkCommentator, update);
router.delete("/:id", auth, checkCommentExist, checkCommentator, destroy);

module.exports = router;
