const Topic = require("../models/topics");

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
}

module.exports = new TopicController();
