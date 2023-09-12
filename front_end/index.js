const express = require("express");
const serveStatic = require("serve-static");

const hostname = "localhost";
const port = 3001;

const app = express();

app.use((req, res, next) => {
  console.log(req.url);
  console.log(req.method);
  console.log(req.path);
  console.log(req.query.id);

  if (req.method !== "GET") {
    res.type(".html");
    const msg = "<html><body>This server only serves web pages with GET!</body></html>";
    res.end(msg);
  } else {
    next();
  }
});

app.use(serveStatic(`${__dirname}/public`));

app.get("/", (req, res) => {
  res.sendFile("/public/index.html", { root: __dirname });
});

//for category
app.get("/shop/:id", (req, res) => {
  res.sendFile("/public/shop.html", { root: __dirname });
});

//for detail page
app.get("/detail/:id", (req, res) => {
  res.sendFile("/public/detail.html", { root: __dirname });
});


app.get("/shop", (req, res) => {
  res.sendFile("/public/shop.html", { root: __dirname });
});

app.get("/login", (req, res) => {
  res.sendFile("/public/login.html", { root: __dirname });
});

app.get("/admin", (req, res) => {
  res.sendFile("/public/admin.html", { root: __dirname });
});

app.get('/customer', (req, res) => {
  res.sendFile('/public/customer.html', {root: __dirname})
})

app.listen(port, hostname, () => {
  console.log(`Server hosted at http://${hostname}:${port}`);
});