import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const _log = req.body;
    // Process individual log
    // Send to your Cursor integration
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to process log' });
  }
} 