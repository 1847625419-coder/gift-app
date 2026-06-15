import { Router } from 'express';
import { getTemplates, getTemplateById } from '../services/templateService';

const router = Router();

// 获取所有模板（支持分类筛选）
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    const templates = await getTemplates(category as string | undefined);
    res.status(200).json({ success: true, data: templates });
  } catch (error) {
    console.error('Error fetching templates:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch templates' });
  }
});

// 获取单个模板
router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: 'Invalid template ID' });
    }
    const template = await getTemplateById(id);
    res.status(200).json({ success: true, data: template });
  } catch (error) {
    console.error('Error fetching template:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch template' });
  }
});

export default router;
