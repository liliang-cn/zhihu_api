class HomeController {
  index(ctx) {
    ctx.body = "<h1>Home</h1>";
  }
}

module.exports = new HomeController();
