const Router = require("@koa/router");
const jwt = require("koa-jwt");

const {
  find,
  findById,
  create,
  update,
  delete: destroy,
  checkQuestionExist,
  checkQuestioner,
} = require("../controllers/question");
const { secret } = require("../config");

const router = new Router({
  prefix: "/questions",
});

const auth = jwt({
  secret,
});

router.get("/", find);
router.get("/:id", checkQuestionExist, findById);
router.post("/", auth, create);
router.patch("/:id", auth, checkQuestionExist, checkQuestioner, update);
router.delete("/:id", auth, checkQuestionExist, checkQuestioner, destroy);

module.exports = router;
