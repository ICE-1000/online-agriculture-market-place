const fs = require('fs');
const path = require('path');
const supabase = require('../config/supabase');
const { config } = require('../config/config');

function ensureDirectoryExists(directory) {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }
}

async function uploadFile(bucketName, folder, fileBuffer, mimeType, fileName = '') {
  const fileExt = path.extname(fileName) || '.jpg';
  const uniqueName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${fileExt}`;
  const filePath = `${folder}/${uniqueName}`;

  if (supabase) {
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(filePath, fileBuffer, {
        contentType: mimeType,
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error('Supabase upload error:', error);
      throw new Error('Failed to upload file');
    }

    const { data: publicUrlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath);

    return publicUrlData.publicUrl;
  }

  const uploadRoot = path.join(__dirname, '..', '..', 'uploads', folder);
  ensureDirectoryExists(uploadRoot);
  const localFilePath = path.join(uploadRoot, uniqueName);
  fs.writeFileSync(localFilePath, fileBuffer);

  const publicUrl = `${config.apiUrl.replace(/\/$/, '')}/uploads/${folder}/${uniqueName}`;
  return publicUrl;
}

async function deleteFile(bucketName, filePath) {
  if (!supabase) return;
  const { error } = await supabase.storage
    .from(bucketName)
    .remove([filePath]);

  if (error) {
    console.error('Supabase delete error:', error);
  }
}

function parsePublicUrl(url) {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    const pathParts = parsed.pathname.split('/');
    const bucketIndex = pathParts.indexOf('public') + 1;
    if (bucketIndex === 0) return null;
    const bucket = pathParts[bucketIndex];
    const path = pathParts.slice(bucketIndex + 1).join('/');
    return { bucket, path };
  } catch {
    return null;
  }
}

module.exports = { uploadFile, deleteFile, parsePublicUrl };