const Question = require("../models/questions");

class QuestionController {
  async find(ctx) {
    let { page = 1, page_size = 10, q } = ctx.query;
    page = Math.max(page * 1, 1) - 1;
    page_size = Math.max(page_size * 1, 1);
    const query = new RegExp(q);
    ctx.body = await Question.find({
      $or: [
        {
          title: query,
        },
        {
          description: query,
        },
      ],
    })
      .limit(page_size)
      .skip(page * page_size);
  }

  async checkQuestionExist(ctx, next) {
    try {
      const question = await Question.findById(ctx.params.id).select(
        "+questioner"
      );
      if (question) {
        ctx.state.question = question;
        await next();
      }
    } catch (err) {
      ctx.throw(404, "问题不存在!");
    }
  }

  async findById(ctx) {
    const { fields = "" } = ctx.query;
    const selectedFields = fields
      .split(";")
      .filter((f) => f)
      .map((f) => " +" + f)
      .join("");
    const question = await Question.findById(ctx.params.id)
      .select(selectedFields)
      .populate("questioner topics");
    ctx.body = question;
  }

  async create(ctx) {
    ctx.verifyParams({
      title: { type: "string", required: true },
      description: { type: "string", required: false },
    });

    const question = await new Question({
      ...ctx.request.body,
      questioner: ctx.state.user._id,
    }).save();
    ctx.body = question;
  }

  async checkQuestioner(ctx, next) {
    const { question } = ctx.state;
    if (question.questioner.toString() !== ctx.state.user._id) {
      ctx.throw(403, "没有权限");
    }
    await next();
  }

  async update(ctx) {
    ctx.verifyParams({
      title: { type: "string", required: true },
      description: { type: "string", required: false },
    });

    await ctx.state.question.updateOne(ctx.request.body);

    ctx.body = ctx.state.question;
  }
  async delete(ctx) {
    await Question.findByIdAndRemove(ctx.params.id);
    ctx.status = 204;
  }
}

module.exports = new QuestionController();
