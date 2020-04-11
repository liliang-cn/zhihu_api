const Topic = require("../models/topics");
const User = require("../models/users");
const Question = require("../models/questions");

class TopicController {
  async find(ctx) {
    let { page = 1, page_size = 10, q } = ctx.query;
    page = Math.max(page * 1, 1) - 1;
    page_size = Math.max(page_size * 1, 1);
    ctx.body = await Topic.find({
      name: new RegExp(q),
    })
      .limit(page_size)
      .skip(page * page_size);
  }

  async findById(ctx) {
    const { fields = "" } = ctx.query;
    const selectedFields = fields
      .split(";")
      .filter((f) => f)
      .map((f) => " +" + f)
      .join("");
    const topic = await Topic.findById(ctx.params.id).select(selectedFields);
    ctx.body = topic;
  }

  async create(ctx) {
    ctx.verifyParams({
      name: { type: "string", required: true },
      avatar_url: { type: "string", required: false },
      introduction: { type: "string", required: false },
    });

    const topic = await new Topic(ctx.request.body).save();
    ctx.body = topic;
  }
  async update(ctx) {
    ctx.verifyParams({
      name: { type: "string", required: false },
      avatar_url: { type: "string", required: false },
      introduction: { type: "string", required: false },
    });

    const topic = await Topic.findByIdAndUpdate(
      ctx.params.id,
      ctx.request.body
    );

    ctx.body = topic;
  }
  async listFollower(ctx) {
    const users = await User.find({ followingTopics: ctx.params.id });
    ctx.body = users;
  }
  async checkTopicExist(ctx, next) {
    try {
      const topic = await Topic.findById(ctx.params.id);
      if (topic) {
        await next();
      }
    } catch (err) {
      ctx.throw(404, "话题不存在!");
    }
  }
  async listQuestions(ctx) {
    const questions = await Question.find({ topics: ctx.params.id });
    ctx.body = questions;
  }
}

module.exports = new TopicController();
