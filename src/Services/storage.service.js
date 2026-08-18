const {ImageKit} = require("@imagekit/nodejs");

const imageKitClient = new ImageKit({
    privateKey:process.env.PRIVATE_KEY
})

async function uploadFile(file){
    const result = await imageKitClient.files.upload({
        file,
        fileName: "music" + Date.now(),
        folder: "spotify-clone/music"
    
    })
    return result;
}

module.exports = {uploadFile};
