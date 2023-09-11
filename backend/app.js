const express = require("express");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const cors = require("cors");

const app = express();
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

app.set("view engine", "ejs");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const corsOptions = { origin: "*" };

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Access-Control-Allow-Origin,Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers,Authorization"
  );
  next();
});

app.use(cors(corsOptions));

app.use(
  methodOverride(function (req) {
    if (req.body && typeof req.body === "object" && "_method" in req.body) {
      var method = req.body._method;
      delete req.body._method;
      return method;
    }
  })
);

const db = {};
db.mongoose = mongoose;

const url = `mongodb://localhost:27017/node_crud_bd`;
const connectionParams = { useNewUrlParser: true, useUnifiedTopology: true };

db.mongoose.set("strictQuery", true);
db.mongoose
  .connect(url, connectionParams)
  .then()
  .catch(() => process.exit());

const Folder = mongoose.model(
  "Folder",
  new mongoose.Schema({
    id: String,
    name: String,
    date: String,
    nbr_files: Number,
  })
);

const File = mongoose.model(
  "File",
  new mongoose.Schema({
    id: String,
    name: String,
    date: String,
    id_ref: String,
  })
);

// FOLDER
app.get("/api/folders", async (req, res) => {
  try {
    Folder.find()
      .sort({ date: "desc" })
      .then((folders) => {
        res.status(200).send(folders);
      });
  } catch (err) {
    res.status(500).send({ message: err });
  }
});

app.post("/api/addFolder", async (req, res) => {
  const folder = new Folder({
    name: req.body.name,
    nbr_files: req.body.nbr_files,
    date: req.body.date,
    id: req.body.id,
  });

  try {
    folder.save().then(() => {
      res.status(200).send(folder);
    });
  } catch (err) {
    res.status(500).send({ message: err });
  }
});

app.put("/api/editFolder", (req, res) => {
  try {
    Folder.findOne({ _id: req.body.id }).then((fldr) => {
      fldr
        .updateOne({
          name: req.body.newName,
        })
        .then(() => {
          res.status(200).send(req.body.newName);
        });
    });
  } catch (err) {
    res.status(500).send({ message: err });
  }
});

app.delete("/api/deleteFolder/:id", async (req, res) => {
  try {
    Folder.deleteOne({ _id: req.params.id }).then(() => {
      File.deleteMany({ id_ref: req.params.id }).then(() => {
        res.status(200).send(true);
      });
    });
  } catch (err) {
    res.status(500).send({ message: err });
  }
});

// FOLDER

// FILES
app.get("/api/filesFolder/:id", async (req, res) => {
  try {
    File.find({ id_ref: req.params.id })
      .sort({ date: "desc" })
      .then((files) => {
        res.status(200).send(files);
      });
  } catch (err) {
    res.status(500).send({ message: err });
  }
});

app.post("/api/addFileInfolder/:id", (req, res) => {
  const file = new File({
    name: req.body.name,
    date: req.body.date,
    id_ref: req.body.id_ref,
  });

  try {
    file.save().then((fl) => {
      Folder.findOne({ _id: req.body.id_ref }).then((fldr) => {
        fldr
          .updateOne({
            nbr_files: fldr.nbr_files + 1,
          })
          .then(() => {
            res.status(200).send(fl);
          });
      });
    });
  } catch (err) {
    res.status(500).send({ message: err });
  }
});

app.put("/api/editFileInfolder", (req, res) => {
  try {
    File.findOne({ _id: req.body.idFile }).then((file) => {
      file
        .updateOne({
          name: req.body.newName,
        })
        .then(() => {
          res.status(200).send(req.body.newName);
        });
    });
  } catch (err) {
    res.status(500).send({ message: err });
  }
});

app.delete("/api/delFileInfolder/:id", async (req, res) => {
  try {
    Folder.findOne({ _id: req.params.id }).then((fldr) => {
      fldr
        .updateOne({
          nbr_files: fldr.nbr_files - 1,
        })
        .then(() => {
          File.deleteOne({ id_ref: req.params.id }).then(() => {
            res.status(200).send(true);
          });
        });
    });
  } catch (err) {
    res.status(500).send({ message: err });
  }
});

// FILES

app.listen(5000, () => {
  console.log("server is listening on port 5000");
});
