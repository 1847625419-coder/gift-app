import { getTemplateById } from './templateService';
import { addWork } from './workService';

// 模拟的图片URL（实际项目中应该调用AI生成服务）
const SAMPLE_IMAGES = [
  'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=512&h=512&fit=crop',
  'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=512&h=512&fit=crop',
  'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=512&h=512&fit=crop',
  'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=512&h=512&fit=crop',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=512&h=512&fit=crop',
  'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=512&h=512&fit=crop',
  'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=512&h=512&fit=crop',
  'https://images.unsplash.com/photo-1531306728370-e2ebd9d7bb99?w=512&h=512&fit=crop',
];

interface GenerateParams {
  deviceId: string;
  templateId: number;
  templateName: string;
  category: string;
  style: 'original' | 'creative';
  quantity: number;
}

export async function generateGift(params: GenerateParams): Promise<{
  success: boolean;
  works: any[];
  message: string;
}> {
  const { deviceId, templateId, templateName, category, quantity } = params;

  try {
    // 获取模板信息
    let template;
    try {
      template = await getTemplateById(templateId);
    } catch (e) {
      template = { name: templateName, category };
    }

    // 生成作品
    const works = [];
    for (let i = 0; i < quantity; i++) {
      const work = {
        id: Date.now() + i,
        deviceId,
        templateId,
        templateName: template.name,
        category: template.category,
        imageUrl: SAMPLE_IMAGES[templateId % SAMPLE_IMAGES.length],
        thumbnailUrl: SAMPLE_IMAGES[templateId % SAMPLE_IMAGES.length],
        createdAt: new Date().toISOString(),
      };
      
      // 保存到存储
      addWork(work);
      works.push(work);
    }

    return {
      success: true,
      works,
      message: `成功生成 ${works.length} 个礼物`,
    };
  } catch (error) {
    console.error('Generate gift error:', error);
    return {
      success: false,
      works: [],
      message: '生成失败，请稍后重试',
    };
  }
}
