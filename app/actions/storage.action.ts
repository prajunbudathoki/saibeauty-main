import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"; // ES Modules import
const client = new S3Client({
  region: "auto",
  endpoint: process.env.URL_END_POINT,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID || "",
    secretAccessKey: process.env.SECRET_ACCESS_KEY || "",
  },
});

export async function uploadFileToS3(file: File, parentDirectory: string) {
  const extension = file.name.split(".").pop();
  const uid = crypto.randomUUID();
  const fileName = `${uid}.${extension}`;
  const filePath = `${parentDirectory}/${fileName}`;

  const contentType = file.type;

  const bytes = await file.bytes();

  const putCommand = new PutObjectCommand({
    Bucket: process.env.BUCKET_NAME || "",
    Key: filePath,
    Body: bytes,
    ContentType: contentType,
  });

  try {
    await client.send(putCommand);
    return filePath; // Return the path where the file is stored in S3
  } catch (error) {
    console.error("Error uploading file to S3:", error);
    throw new Error("Failed to upload file to S3");
  }
}
