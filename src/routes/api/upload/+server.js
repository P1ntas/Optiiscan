import { writeFile } from 'fs/promises';
import { join } from 'path';

export async function POST({ request }) {

  const body = await request.formData();

  const files = body.get('files');

  console.log('Files:', files);

  if (!files) {
    return {
      status: 400,
      body: { error: 'No files were uploaded' }
    };
  }

  const filesArray = Array.from(files);

  console.log('Uploading files:', filesArray);

  const uploadDir = 'static/test/products/'
  const fileInfos = [];

  for (const file of filesArray) {
    const filename = `${Date.now()}-${file.name}`;
    const filePath = join(uploadDir, filename);

    try {
      await writeFile(filePath, file.data);
      fileInfos.push({ filename, filePath });
    } catch (error) {
      console.error('Error saving file:', error);
      return {
        status: 500,
        body: { error: 'Failed to save file' }
      };
    }
  }

  // Process uploaded files here (e.g., save to database, move to permanent storage, etc.)

  console.log('Files uploaded:', fileInfos);

  return {
    status: 200,
    body: { message: 'Files uploaded successfully', files: fileInfos }
  };
}
