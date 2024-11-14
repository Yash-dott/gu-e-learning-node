const path = require('path')

const fileUpload = async (file, filepath) => {
    const fileName = file.md5 + +new Date + 1;
    const extension = path.extname(file.name);
    await file.mv(`assets/${filepath}/` + fileName + extension);
    return { fileName, extension };
}
module.exports = {
    fileUpload
}