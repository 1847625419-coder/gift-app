import { Router } from 'express';
import { getUserWorks, getWorkById, deleteWork } from '../services/workService';

const router = Router();

// 获取用户作品列表
router.get('/', async (req, res) => {
  try {
    const { deviceId, category } = req.query;
    if (!deviceId) {
      return res.status(400).json({ success: false, message: 'deviceId is required' });
    }
    const works = await getUserWorks(deviceId as string, category as string | undefined);
    res.status(200).json({ success: true, data: works });
  } catch (error) {
    console.error('Error fetching works:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch works' });
  }
});

// 获取单个作品
router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: 'Invalid work ID' });
    }
    const work = await getWorkById(id);
    res.status(200).json({ success: true, data: work });
  } catch (error) {
    console.error('Error fetching work:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch work' });
  }
});

// 删除作品
router.delete('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: 'Invalid work ID' });
    }
    await deleteWork(id);
    res.status(200).json({ success: true, message: 'Work deleted successfully' });
  } catch (error) {
    console.error('Error deleting work:', error);
    res.status(500).json({ success: false, message: 'Failed to delete work' });
  }
});

export default router;
