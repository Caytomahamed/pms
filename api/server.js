require("dotenv").config()

// Import the server
const server = require("./app.js")

const port = process.env.PORT || 5000;

server.listen(port, () => console.log(`server run on **${port}***`));
