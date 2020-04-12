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
  likeAnswer,
  unlikeAnswer,
  listLikingAnswers,
  dislikeAnswer,
  undislikeAnswer,
  listDisLikingAnswers,
  collectAnswer,
  uncollectAnswer,
  listCollectingAnswers,
} = require("../controllers/user");

const { checkTopicExist } = require("../controllers/topic");
const { checkAnswerExist } = require("../controllers/answer");

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
router.get("/:id/likingAnswers", listLikingAnswers);
router.put(
  "/likingAnswers/:id",
  auth,
  checkAnswerExist,
  likeAnswer,
  undislikeAnswer
);
router.delete("/likingAnswers/:id", auth, checkAnswerExist, unlikeAnswer);
router.get("/:id/dislikingAnswers", listDisLikingAnswers);
router.put(
  "/dislikingAnswers/:id",
  auth,
  checkAnswerExist,
  dislikeAnswer,
  unlikeAnswer
);
router.delete("/dislikingAnswers/:id", auth, checkAnswerExist, undislikeAnswer);

router.get("/:id/collecingAnswers", listCollectingAnswers);
router.put("/collecingAnswers/:id", auth, checkAnswerExist, collectAnswer);
router.delete("/collecingAnswers/:id", auth, checkAnswerExist, uncollectAnswer);

module.exports = router;
