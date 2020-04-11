const Router = require("@koa/router");
const jwt = require("koa-jwt");

const {
  find,
  findById,
  create,
  update,
  listFollower,
  checkTopicExist,
  listQuestions,
} = require("../controllers/topic");
const { secret } = require("../config");

const router = new Router({
  prefix: "/topics",
});

const auth = jwt({
  secret,
});

router.get("/", find);
router.get("/:id", checkTopicExist, findById);
router.post("/", auth, create);
router.patch("/:id", auth, checkTopicExist, update);
router.get("/:id/follower", checkTopicExist, listFollower);
router.get("/:id/questions", checkTopicExist, listQuestions);

module.exports = router;
