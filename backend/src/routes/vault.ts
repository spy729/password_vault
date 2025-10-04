import { Router, Request, Response } from 'express';
import VaultItem from '../models/VaultItem';
import { authenticate, AuthRequest } from '../middleware/auth';
import { Types } from 'mongoose';

const router = Router();

router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const items = await VaultItem.find({ userId: new Types.ObjectId(userId) }).sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;
    if (!Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid item id' });

    const item = await VaultItem.findOne({ _id: id, userId: new Types.ObjectId(userId) });
    if (!item) return res.status(404).json({ message: 'Item not found or not owned by user' });
    res.json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { title, username, password, url, notes } = req.body;
    if (!title || !password) return res.status(400).json({ message: 'Title and password required' });

    // Basic validation: password must look like base64 (ciphertext produced by client)
    try {
      const decoded = Buffer.from(password, 'base64');
      // require at least 16 bytes iv + some payload
      if (decoded.length < 24) throw new Error('cipher too short');
    } catch (e) {
      return res.status(400).json({ message: 'Password must be client-encrypted ciphertext (base64)' });
    }

    const item = new VaultItem({ userId: new Types.ObjectId(userId), title, username, password, url, notes });
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;
    const updates = req.body || {};

    if (!Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid item id' });

  const allowed = ['title', 'username', 'password', 'url', 'notes'];
    const sanitized: any = {};
    for (const key of allowed) {
      if (Object.prototype.hasOwnProperty.call(updates, key)) sanitized[key] = updates[key];
    }

    if (Object.keys(sanitized).length === 0) return res.status(400).json({ message: 'No updatable fields provided' });

    // If password is present, validate it's ciphertext from client (base64 + min length)
    if (sanitized.password) {
      try {
        const decoded = Buffer.from(sanitized.password, 'base64');
        if (decoded.length < 24) throw new Error('cipher too short');
      } catch (e) {
        return res.status(400).json({ message: 'Password must be client-encrypted ciphertext (base64)' });
      }
    }

    const item = await VaultItem.findOneAndUpdate(
      { _id: id, userId: new Types.ObjectId(userId) },
      { $set: sanitized },
      { new: true }
    );

    if (!item) return res.status(404).json({ message: 'Item not found or not owned by user' });
    res.json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;
    if (!Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid item id' });

    const item = await VaultItem.findOneAndDelete({ _id: id, userId: new Types.ObjectId(userId) });
    if (!item) return res.status(404).json({ message: 'Item not found or not owned by user' });
    res.json({ message: 'Item deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
