const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const bodyParser = require("body-parser");
const AdminRouter = require("./Routes/AdminRouters.js");
const VoterRoutes = require("./Routes/VoterRouters.js");
const candidateRoutes = require("./Routes/CandiateRouters.js");
require("./dbConnection.js");

app.use(bodyParser.json());

// all routes;
app.use("/admin", AdminRouter);
app.use("/voters", VoterRoutes);
app.use("/candidate", candidateRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
