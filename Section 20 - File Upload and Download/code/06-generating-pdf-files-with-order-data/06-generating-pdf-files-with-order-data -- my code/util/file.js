const fs = require('fs');

const deleteFile = (filePath)=>{
    //unlink funciton deletes the file
    //if there is error , an error will be thrown , which will bubble up and cause the express error middleware to handle it.
    fs.unlink(filePath,(err)=>{
        if(err){
            throw (err);
        }
    })
}

exports.deleteFile = deleteFile;