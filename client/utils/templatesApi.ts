import { get } from './api';

// 模板类型
export interface GiftTemplate {
  id: number;
  name: string;
  nameEn: string;
  category: string;
  prompt: string;
  thumbnailUrl: string;
  previewUrl: string;
  tags: string[];
  description: string;
  useCount: number;
  rating: number;
  isPremium: boolean;
}

// 获取所有模板
export async function getTemplates(category?: string): Promise<GiftTemplate[]> {
  const endpoint = category ? `/templates?category=${category}` : '/templates';
  const response = await get<{ success: boolean; data: GiftTemplate[] }>(endpoint);
  return response.data;
}

// 获取单个模板
export async function getTemplateById(id: number): Promise<GiftTemplate> {
  const response = await get<{ success: boolean; data: GiftTemplate }>(`/templates/${id}`);
  return response.data;
}

// 模板分类
export const TEMPLATE_CATEGORIES = [
  { id: 'all', name: '全部', nameEn: 'All' },
  { id: 'expression', name: '表情', nameEn: 'Expression' },
  { id: 'action', name: '动作', nameEn: 'Action' },
  { id: 'festival', name: '节日', nameEn: 'Festival' },
  { id: 'custom', name: '自定义', nameEn: 'Custom' },
];
