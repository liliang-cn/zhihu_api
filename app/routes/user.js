const jwt = require("koa-jwt");

const { secret } = require("../config");

const Router = require("@koa/router");

const {
  find,
  findById,
  create,
  delete: destroy,
  update,
  login,
  checkUserExist,
  follow,
  listFollowing,
  listFollower,
  unfollow,
  followTopic,
  unfollowTopic,
  listFollowingTopics,
  listQuestions,
} = require("../controllers/user");

const { checkTopicExist } = require("../controllers/topic");

const router = new Router({
  prefix: "/users",
});

const auth = jwt({
  secret,
});

const checkOwner = async (ctx, next) => {
  if (ctx.params.id !== ctx.state.user._id) {
    ctx.throw(403, "没有权限");
  }
  await next();
};

router.get("/", find);
router.get("/:id", findById);
router.post("/", create);
router.post("/login", login);
router.patch("/:id", auth, checkOwner, update);
router.delete("/:id", auth, checkOwner, destroy);
router.get("/:id/following", listFollowing);
router.get("/:id/follower", listFollower);
router.put("/following/:id", auth, checkUserExist, follow);
router.delete("/following/:id", auth, checkUserExist, unfollow);
router.get("/:id/followingTopics", listFollowingTopics);
router.put("/followingTopics/:id", auth, checkTopicExist, followTopic);
router.delete("/followingTopics/:id", auth, checkTopicExist, unfollowTopic);
router.get("/:id/questions", listQuestions);

module.exports = router;
