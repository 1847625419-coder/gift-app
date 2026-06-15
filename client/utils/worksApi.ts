import { get, post, del } from './api';

// 作品类型
export interface UserWork {
  id: number;
  deviceId: string;
  templateId: number;
  templateName: string;
  category: string;
  imageUrl: string;
  thumbnailUrl: string;
  createdAt: string;
}

// 获取用户作品列表
export async function getUserWorks(deviceId: string, category?: string): Promise<UserWork[]> {
  const endpoint = `/works?deviceId=${deviceId}${category ? `&category=${category}` : ''}`;
  const response = await get<{ success: boolean; data: UserWork[] }>(endpoint);
  return response.data;
}

// 获取单个作品
export async function getWorkById(id: number): Promise<UserWork> {
  const response = await get<{ success: boolean; data: UserWork }>(`/works/${id}`);
  return response.data;
}

// 删除作品
export async function deleteWork(id: number): Promise<void> {
  await del(`/works/${id}`);
}

// 生成参数类型
export interface GenerateParams {
  deviceId: string;
  templateId: number;
  templateName: string;
  category: string;
  style: 'original' | 'creative';
  quantity: number;
}

// 生成结果类型
export interface GenerateResult {
  success: boolean;
  works: UserWork[];
  message: string;
}

// 生成礼物
export async function generateGift(params: GenerateParams): Promise<GenerateResult> {
  const response = await post<GenerateResult>('/generate', params);
  return response;
}
