const Comment = require("../models/comments");

class CommentController {
  async find(ctx) {
    let { page = 1, page_size = 10, q, rootCommentId } = ctx.query;
    page = Math.max(page * 1, 1) - 1;
    page_size = Math.max(page_size * 1, 1);
    const query = new RegExp(q);
    const { questionId, answerId } = ctx.params;
    ctx.body = await Comment.find({
      content: query,
      questionId,
      answerId,
      rootCommentId,
    })
      .limit(page_size)
      .skip(page * page_size)
      .populate("commentator replyTo");
  }

  async checkCommentExist(ctx, next) {
    try {
      const comment = await Comment.findById(ctx.params.id).select(
        "+commentator"
      );
      if (!comment) {
        ctx.throw(404, "评论不存在!");
      }
      if (
        ctx.params.questionId &&
        comment.questionId !== ctx.params.questionId
      ) {
        ctx.throw(404, "该问题下没有此评论!");
      }
      if (ctx.params.answerId && comment.answerId !== ctx.params.answerId) {
        ctx.throw(404, "该答案下没有此评论!");
      }
      ctx.state.comment = comment;
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
    const comment = await Comment.findById(ctx.params.id)
      .select(selectedFields)
      .populate("commentator");
    ctx.body = comment;
  }

  async create(ctx) {
    ctx.verifyParams({
      content: { type: "string", required: true },
      rootCommentId: { type: "string", required: false },
      replyTo: { type: "string", required: false },
    });

    const comment = await new Comment({
      ...ctx.request.body,
      commentator: ctx.state.user._id,
      questionId: ctx.params.questionId,
      answerId: ctx.params.answerId,
    }).save();
    ctx.body = comment;
  }

  async checkCommentator(ctx, next) {
    const { comment } = ctx.state;
    if (comment.commentator.toString() !== ctx.state.user._id) {
      ctx.throw(403, "没有权限");
    }
    await next();
  }

  async update(ctx) {
    ctx.verifyParams({
      content: { type: "string", required: true },
    });

    const { content } = ctx.request.body;

    await ctx.state.comment.updateOne({ content });

    ctx.body = ctx.state.comment;
  }
  async delete(ctx) {
    await Comment.findByIdAndRemove(ctx.params.id);
    ctx.status = 204;
  }
}

module.exports = new CommentController();
