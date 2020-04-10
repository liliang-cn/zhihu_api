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
} = require("../controllers/user");

const router = new Router({
  prefix: "/users",
});

// const auth = async (ctx, next) => {
//   const { authorization = "" } = ctx.request.header;
//   const token = authorization.replace("Bearer ", "");
//   try {
//     const user = jwt.verify(token, secret);
//     ctx.state.user = user;
//     await next();
//   } catch (err) {
//     ctx.throw(401, err.message);
//   }
// };

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

module.exports = router;
