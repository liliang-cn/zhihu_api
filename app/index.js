const path = require("path");

const Koa = require("koa");
const logger = require("koa-logger");
const koaStatic = require("koa-static");
const koaBody = require("koa-body");
const error = require("koa-json-error");
const parameter = require("koa-parameter");
const mongoose = require("mongoose");

const routing = require("./routes");
const { connectionStr } = require("./config");

mongoose.connect(
  connectionStr,
  { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false },
  () => {
    console.log("MongoDB connected");
  }
);

mongoose.connection.on("error", console.error);

const app = new Koa();

// app.use(async (ctx, next) => {
//   try {
//     await next();
//   } catch (err) {
//     ctx.status = err.status || err.statusCode || 500;
//     ctx.body = {
//       message: err.message,
//     };
//   }
// });
app.use(koaStatic(path.join(__dirname, "public")));
app.use(
  error({
    postFormat: (e, { stack, ...rest }) =>
      process.env.NODE_ENV === "production" ? rest : { stack, ...rest },
  })
);
app.use(logger());
app.use(
  koaBody({
    multipart: true,
    formidable: {
      uploadDir: path.join(__dirname, "/public/uploads"),
      keepExtensions: true,
    },
  })
);
app.use(parameter(app));

routing(app);

app.listen(3000, () => {
  console.log("Started on 3000");
});
