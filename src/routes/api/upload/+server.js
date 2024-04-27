import { writeFile } from 'fs/promises';
import { join } from 'path';

export async function POST({ request }) {

  const body = await request.formData();

  const files = body.getAll('files');

  if (!files || files.length === 0) {
    let response = new Response(JSON.stringify({status: 400,  message: 'No files were uploaded' }), {
      headers: { 'Content-Type': 'application/json' }
    });
    return response;
  }

  const uploadDir = 'static/test/products/'
  const fileInfos = [];

  for (const file of files) {
    const filename = `${Date.now()}-${file.name}`;
    const filePath = join(uploadDir, filename);

    try {
      // Read file content as ArrayBuffer
      const arrayBuffer = await file.arrayBuffer();
      // Convert ArrayBuffer to Buffer
      const buffer = Buffer.from(arrayBuffer);
      // Write Buffer to file
      await writeFile(filePath, buffer);
      fileInfos.push({ filename, filePath });
    } catch (error) {
      console.error('Error saving file:', error);
      let response = new Response(JSON.stringify({status: 500,  message: 'Failed to save file' }), {
        headers: { 'Content-Type': 'application/json' }
      });
      return response;
    }
  }

  let response = new Response(JSON.stringify({status: 200,  message: 'Files uploaded successfully', files: fileInfos }), {
    headers: { 'Content-Type': 'application/json' }
  });

  return response;
}
