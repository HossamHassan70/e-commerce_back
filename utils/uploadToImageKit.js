const imagekit = require("./imagekit");

async function uploadImages(files, folder) {
  if (!files || files.length === 0) return [];

  const uploadedUrls = [];

  for (const file of files) {
    const uploaded = await imagekit.upload({
      file: file.buffer,
      fileName: `${Date.now()}-${file.originalname}`,
      folder: folder,
    });

    uploadedUrls.push(uploaded.url);
  }

  return uploadedUrls;
}

module.exports = uploadImages;
