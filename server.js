require('dotenv').config();
const app = require("./src/app");

async function createServer() {
    await require("./src/Db/db")();

    app.listen(3000,()=>{

        console.log("Server is running on Port 3000");

    })
    
}
createServer();
