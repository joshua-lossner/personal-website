export default function handler(req, res) {
  res.status(200).json({ S3_BASE_URL_ALBUMS: process.env.S3_BASE_URL_ALBUMS });
}