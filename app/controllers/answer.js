const Answer = require("../models/answers");

class AnswerController {
  async find(ctx) {
    let { page = 1, page_size = 10, q } = ctx.query;
    page = Math.max(page * 1, 1) - 1;
    page_size = Math.max(page_size * 1, 1);
    const query = new RegExp(q);
    ctx.body = await Answer.find({
      content: query,
      questionId: ctx.params.questionId,
    })
      .limit(page_size)
      .skip(page * page_size);
  }

  async checkAnswerExist(ctx, next) {
    try {
      const answer = await Answer.findById(ctx.params.id).select("+answerer");
      if (!answer) {
        ctx.throw(404, "答案不存在!");
      }
      // 删改查答案时检查，赞和踩不检查
      if (
        ctx.params.questionId &&
        answer.questionId !== ctx.params.questionId
      ) {
        ctx.throw(404, "该问题下没有此答案!");
      }
      ctx.state.answer = answer;
      await next();
    } catch (error) {
      ctx.throw(404, "答案不存在!");
    }
  }

  async findById(ctx) {
    const { fields = "" } = ctx.query;
    const selectedFields = fields
      .split(";")
      .filter((f) => f)
      .map((f) => " +" + f)
      .join("");
    const answer = await Answer.findById(ctx.params.id)
      .select(selectedFields)
      .populate("answerer");
    ctx.body = answer;
  }

  async create(ctx) {
    ctx.verifyParams({
      content: { type: "string", required: true },
    });

    const answer = await new Answer({
      ...ctx.request.body,
      answerer: ctx.state.user._id,
      questionId: ctx.params.questionId,
    }).save();
    ctx.body = answer;
  }

  async checkAnswerer(ctx, next) {
    const { answer } = ctx.state;
    if (answer.answerer.toString() !== ctx.state.user._id) {
      ctx.throw(403, "没有权限");
    }
    await next();
  }

  async update(ctx) {
    ctx.verifyParams({
      content: { type: "string", required: true },
    });

    await ctx.state.answer.updateOne(ctx.request.body);

    ctx.body = ctx.state.answer;
  }
  async delete(ctx) {
    await Answer.findByIdAndRemove(ctx.params.id);
    ctx.status = 204;
  }
}

module.exports = new AnswerController();
