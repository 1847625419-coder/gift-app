import { Router } from 'express';
import { generateGift } from '../services/generateService';
import { getTemplateById } from '../services/templateService';

const router = Router();

router.post('/', async (req, res) => {
  try {
    const { deviceId, templateId, templateName, category, style, quantity } = req.body;

    if (!deviceId || !templateId) {
      return res.status(400).json({ 
        success: false, 
        message: 'deviceId and templateId are required' 
      });
    }

    // 获取模板信息
    let template;
    try {
      template = await getTemplateById(templateId);
    } catch (e) {
      // 如果模板不存在，使用传入的模板名称
      template = { name: templateName || 'Custom Gift', prompt: '' };
    }

    const result = await generateGift({
      deviceId,
      templateId,
      templateName: template.name,
      category: category || template.category,
      style: style || 'original',
      quantity: quantity || 1,
    });

    res.status(200).json(result);
  } catch (error) {
    console.error('Error generating gift:', error);
    res.status(500).json({ success: false, message: 'Failed to generate gift' });
  }
});

export default router;
