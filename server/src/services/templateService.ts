import { createClient } from '@supabase/supabase-js';

// 使用环境变量或默认值
const supabaseUrl = process.env.SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-key';

const supabase = createClient(supabaseUrl, supabaseKey);

// 预设模板数据
const PRESET_TEMPLATES = [
  {
    id: 1,
    name: '皇室星月夜',
    nameEn: 'Royal Starlit Night',
    category: 'festival',
    prompt: 'A cute cartoon tiger wearing Arabic headdress, royal starlit night background, gold and purple gradients, celebration confetti, festive Middle Eastern style, animated gift card',
    thumbnailUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=200&h=200&fit=crop',
    previewUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&h=400&fit=crop',
    tags: ['限时特供', '生日礼物', '皇室风格'],
    description: '融合阿拉伯几何花纹与皇室奢华元素的精美卡片，适合庆祝特殊时刻',
    useCount: 2847,
    rating: 4.9,
    isPremium: true,
  },
  {
    id: 2,
    name: '爱心发射',
    nameEn: 'Heart Burst',
    category: 'expression',
    prompt: 'Cute cartoon tiger throwing hearts, pink and red hearts bursting, playful animation, love and affection theme, Middle Eastern decorative patterns',
    thumbnailUrl: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=200&h=200&fit=crop',
    previewUrl: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=400&h=400&fit=crop',
    tags: ['表情', '爱心'],
    description: '表达爱意的心形礼物特效',
    useCount: 1523,
    rating: 4.8,
    isPremium: false,
  },
  {
    id: 3,
    name: '沙漠玫瑰',
    nameEn: 'Desert Rose',
    category: 'festival',
    prompt: 'Cute cartoon tiger in desert oasis, golden sand dunes, rose flowers, Arabian architecture silhouette, sunset colors, magical atmosphere',
    thumbnailUrl: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=200&h=200&fit=crop',
    previewUrl: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=400&h=400&fit=crop',
    tags: ['节日', '沙漠'],
    description: '沙漠绿洲主题的浪漫礼物',
    useCount: 987,
    rating: 4.7,
    isPremium: false,
  },
  {
    id: 4,
    name: '金币雨',
    nameEn: 'Gold Rain',
    category: 'action',
    prompt: 'Cute cartoon tiger celebrating, golden coins raining down, wealth and fortune theme, Arabic gold patterns, festive confetti, prosperity celebration',
    thumbnailUrl: 'https://images.unsplash.com/photo-160Atomic8c2e-4a6b5e7a5e7a?w=200&h=200&fit=crop',
    previewUrl: 'https://images.unsplash.com/photo-160Atomic8c2e-4a6b5e7a5e7a?w=400&h=400&fit=crop',
    tags: ['动作', '财富'],
    description: '金币雨特效庆祝礼物',
    useCount: 2104,
    rating: 4.9,
    isPremium: true,
  },
  {
    id: 5,
    name: '星星雨',
    nameEn: 'Star Shower',
    category: 'festival',
    prompt: 'Cute cartoon tiger under starry sky, shooting stars, twinkling stars, magical night theme, Arabic geometric stars, dreamy atmosphere',
    thumbnailUrl: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=200&h=200&fit=crop',
    previewUrl: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=400&h=400&fit=crop',
    tags: ['节日', '星空'],
    description: '浪漫星空主题特效',
    useCount: 1654,
    rating: 4.8,
    isPremium: false,
  },
  {
    id: 6,
    name: '阿拉伯花纹',
    nameEn: 'Arabic Pattern',
    category: 'custom',
    prompt: 'Cute cartoon tiger decorated with intricate Arabic geometric patterns, ornate borders, traditional Middle Eastern art, vibrant colors',
    thumbnailUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop',
    previewUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
    tags: ['自定义', '花纹'],
    description: '精致阿拉伯花纹装饰礼物',
    useCount: 876,
    rating: 4.6,
    isPremium: false,
  },
  {
    id: 7,
    name: '眨眼俏皮',
    nameEn: 'Wink',
    category: 'expression',
    prompt: 'Cute cartoon tiger winking, playful expression, charming pose, pink and gold background, adorable animated sticker',
    thumbnailUrl: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=200&h=200&fit=crop',
    previewUrl: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400&h=400&fit=crop',
    tags: ['表情', '俏皮'],
    description: '俏皮眨眼表情包',
    useCount: 2341,
    rating: 4.9,
    isPremium: false,
  },
  {
    id: 8,
    name: '害羞脸红',
    nameEn: 'Blush',
    category: 'expression',
    prompt: 'Cute cartoon tiger blushing, shy expression, pink cheeks, adorable embarrassed look, soft pastel colors',
    thumbnailUrl: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=200&h=200&fit=crop',
    previewUrl: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400&h=400&fit=crop',
    tags: ['表情', '害羞'],
    description: '害羞脸红表情包',
    useCount: 1876,
    rating: 4.8,
    isPremium: false,
  },
  {
    id: 9,
    name: '开斋节快乐',
    nameEn: 'Eid Mubarak',
    category: 'festival',
    prompt: 'Cute cartoon tiger celebrating Eid, crescent moon, lanterns, festive decorations, Islamic geometric patterns, gold and green colors',
    thumbnailUrl: 'https://images.unsplash.com/photo-1531306728370-e2ebd9d7bb99?w=200&h=200&fit=crop',
    previewUrl: 'https://images.unsplash.com/photo-1531306728370-e2ebd9d7bb99?w=400&h=400&fit=crop',
    tags: ['节日', '开斋节'],
    description: '开斋节祝福礼物',
    useCount: 3210,
    rating: 4.9,
    isPremium: true,
  },
];

export async function getTemplates(category?: string) {
  try {
    // 尝试从数据库获取
    let query = supabase.from('gift_templates').select('*');
    if (category && category !== 'all') {
      query = query.eq('category', category);
    }
    const { data, error } = await query.order('use_count', { ascending: false });
    
    if (error) {
      console.log('Database query failed, using preset templates');
      // 使用预设模板
      if (category && category !== 'all') {
        return PRESET_TEMPLATES.filter(t => t.category === category);
      }
      return PRESET_TEMPLATES;
    }
    
    return data || PRESET_TEMPLATES;
  } catch (error) {
    console.log('Using preset templates');
    // 使用预设模板
    if (category && category !== 'all') {
      return PRESET_TEMPLATES.filter(t => t.category === category);
    }
    return PRESET_TEMPLATES;
  }
}

export async function getTemplateById(id: number) {
  try {
    const { data, error } = await supabase
      .from('gift_templates')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error || !data) {
      const template = PRESET_TEMPLATES.find(t => t.id === id);
      if (!template) {
        throw new Error('Template not found');
      }
      return template;
    }
    
    return data;
  } catch (error) {
    const template = PRESET_TEMPLATES.find(t => t.id === id);
    if (!template) {
      throw new Error('Template not found');
    }
    return template;
  }
}
