const port = 3008;
const http = require("http");
const fs = require("fs");
const url = require("url");
const { MongoClient, ObjectId } = require("mongodb");
const queryString = require("querystring");

const client = new MongoClient("mongodb://127.0.0.1:27017/");

const app = http.createServer(async (req, res) => {
  const db = client.db("TASK_MANAGER");
  const collection = db.collection("Tasks");
  const path = url.parse(req.url);

  
  if (path.pathname === "/") {
    res.writeHead(200, { "content-type": "text/html" });
    res.end(fs.readFileSync("../clientside/html/index.html"));
  } else if (path.pathname === "/clientside/js/custom.js") {
    res.writeHead(200, { "content-type": "text/javascript" });
    res.end(fs.readFileSync("../clientside/js/custom.js"));
  } else if (path.pathname === "/clientside/css/style.css") {
    res.writeHead(200, { "content-type": "text/css" });
    res.end(fs.readFileSync("../clientside/css/style.css"));
  } else if (path.pathname === "/clientside/html/add.html") {
    res.writeHead(200, { "content-type": "text/html" });
    res.end(fs.readFileSync("../clientside/html/add.html"));
  }  else if (path.pathname === "/clientside/css/add.css") {
    res.writeHead(200, { "content-type": "text/css" });
    res.end(fs.readFileSync("../clientside/css/add.css"));
  } 

  
  if (path.pathname === "/addTask" && req.method === "POST") {
    let body = "";
    req.on("data", (chunks) => (body += chunks.toString()));
    req.on("end", async () => {
      const formdata = queryString.parse(body);
      await collection.insertOne(formdata);
      res.writeHead(302, { location: "/" });
      res.end();
    });
  }

 
  if (path.pathname === "/getTasks" && req.method === "GET") {
    const data = await collection.find().toArray();
    res.writeHead(200, { "content-type": "application/json" });
    res.end(JSON.stringify(data));
  }

  
  if (path.pathname === "/deleteTask" && req.method === "DELETE") {
    let body = "";
    req.on("data", (chunks) => (body += chunks.toString()));
    req.on("end", async () => {
      let _id = new ObjectId(body);
      try {
        await collection.deleteOne({ _id });
        res.writeHead(200, { "content-type": "text/plain" });
        res.end("success");
      } catch {
        res.writeHead(200, { "content-type": "text/plain" });
        res.end("fail");
      }
    });
  }

  
  if (path.pathname === "/updateTask" && req.method === "PUT") {
    let body = "";
    req.on("data", (chunks) => (body += chunks.toString()));
    req.on("end", async () => {
      let data = JSON.parse(body);
      let _id = new ObjectId(data.id);
      let updatedData = {
        title: data.title,
        description: data.description,
        dueDate: data.dueDate,
        status: data.status,
      };
      try {
        await collection.updateOne({ _id }, { $set: updatedData });
        res.writeHead(200, { "content-type": "text/plain" });
        res.end("success");
      } catch {
        res.writeHead(200, { "content-type": "text/plain" });
        res.end("fail");
      }
    });
  }
});

client.connect().then(() => {
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
  });
});


