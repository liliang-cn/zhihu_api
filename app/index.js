const path = require("path");

const Koa = require("koa");
const logger = require("koa-logger");
const koaStatic = require("koa-static");
const koaBody = require("koa-body");
const error = require("koa-json-error");
const parameter = require("koa-parameter");

const routing = require("./routes");
const initDB = require("./libs/db");

const app = new Koa();

initDB();

app.use(koaStatic(path.join(__dirname, "public")));
app.use(
  error({
    postFormat: (e, { stack, ...rest }) =>
      process.env.NODE_ENV === "production" ? rest : { stack, ...rest },
  })
);
if (process.env.NODE_ENV === "prodction") {
  app.use(logger());
}
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
