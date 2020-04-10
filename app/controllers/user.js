const jwt = require("jsonwebtoken");

const User = require("../models/users");
const { secret } = require("../config");

class UserController {
  async find(ctx) {
    ctx.body = await User.find();
  }
  async findById(ctx) {
    // TODO: /users/5e9074ea3c847d13a799a841?fields=
    const { fields } = ctx.query;
    const selectFields = fields
      .split(";")
      .filter((f) => f)
      .map((f) => " +" + f)
      .join("");
    const user = await User.findById(ctx.params.id).select(selectFields);
    if (!user) {
      ctx.throw(404, "用户不存在");
    }
    ctx.body = user;
  }
  async create(ctx) {
    ctx.verifyParams({
      name: {
        type: "string",
        required: true,
      },
      password: { type: "string", required: true },
    });

    const { name } = ctx.request.body;
    const repeatedUser = await User.findOne({
      name,
    });

    if (repeatedUser) {
      ctx.throw(409, "用户名已经被占用");
    }

    const user = await new User(ctx.request.body).save();

    ctx.body = user;
  }
  async update(ctx) {
    ctx.verifyParams({
      name: {
        type: "string",
        required: false,
      },
      password: { type: "string", required: false },
      avatar_url: { type: "string", required: false },
      gender: {
        type: "string",
        required: false,
      },
      headline: {
        type: "string",
        required: false,
      },
      locations: {
        type: "array",
        itemType: "string",
        required: false,
      },
      business: { type: "string", required: false },
      employments: {
        type: "array",
        itemType: "object",
        required: false,
      },
      educations: {
        type: "array",
        itemType: "object",
        required: false,
      },
    });
    const user = await User.findByIdAndUpdate(ctx.params.id, ctx.request.body);
    if (!user) {
      ctx.throw(404, "用户不存在");
    }
    ctx.body = user;
  }
  async delete(ctx) {
    const user = await User.findByIdAndRemove(ctx.params.id);
    if (!user) {
      ctx.throw(404, "用户不存在");
    }
    ctx.status = 204;
  }

  async login(ctx) {
    ctx.verifyParams({
      name: {
        type: "string",
        required: true,
      },
      password: { type: "string", required: true },
    });
    const user = await User.findOne(ctx.request.body);

    if (!user) {
      ctx.throw(401, "用户名或者密码不正确");
    }

    const { _id, name } = user;

    const token = jwt.sign(
      {
        _id,
        name,
      },
      secret,
      {
        expiresIn: "1d",
      }
    );

    ctx.body = { token, name };
  }

  async listFollowing(ctx) {
    const user = await User.findById(ctx.params.id)
      .select("+following")
      .populate("following");
    if (!user) {
      ctx.throw(404, "用户不存在");
    }
    ctx.body = user.following;
  }

  async checkUserExist(ctx, next) {
    try {
      const user = await User.findById(ctx.params.id);
      if (user) {
        await next();
      }
    } catch (err) {
      ctx.throw(404, "用户不存在!");
    }
  }

  async follow(ctx) {
    const me = await User.findById(ctx.state.user._id).select("+following");

    if (!me.following.map((id) => id.toString()).includes(ctx.params.id)) {
      me.following.push(ctx.params.id);
      me.save();
    }

    ctx.status = 204;
  }

  async unfollow(ctx) {
    const me = await User.findById(ctx.state.user._id).select("+following");
    const index = me.following
      .map((id) => id.toString())
      .indexOf(ctx.params.id);
    if (index > -1) {
      me.following.splice(index, 1);
      me.save();
    }

    ctx.status = 204;
  }

  async listFollower(ctx) {
    const users = await User.find({ following: ctx.params.id });
    ctx.body = users;
  }
}

module.exports = new UserController();
