export function handleApiError(res, error, publicMessage) {
  console.error('API Error:', error);
  res.status(500).json({ error: publicMessage || 'An unexpected error occurred' });
}