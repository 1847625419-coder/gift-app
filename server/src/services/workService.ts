import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-key';

const supabase = createClient(supabaseUrl, supabaseKey);

// 内存存储（用于开发阶段）
const inMemoryWorks: Map<string, any[]> = new Map();

export async function getUserWorks(deviceId: string, category?: string) {
  try {
    let query = supabase.from('user_works').select('*').eq('device_id', deviceId);
    if (category) {
      query = query.eq('category', category);
    }
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) {
      console.log('Database query failed, using in-memory storage');
      const works = inMemoryWorks.get(deviceId) || [];
      return category ? works.filter(w => w.category === category) : works;
    }
    
    return data || inMemoryWorks.get(deviceId) || [];
  } catch (error) {
    console.log('Using in-memory storage');
    const works = inMemoryWorks.get(deviceId) || [];
    return category ? works.filter(w => w.category === category) : works;
  }
}

export async function getWorkById(id: number) {
  try {
    const { data, error } = await supabase
      .from('user_works')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error || !data) {
      // 从内存中查找
      for (const works of inMemoryWorks.values()) {
        const work = works.find(w => w.id === id);
        if (work) return work;
      }
      throw new Error('Work not found');
    }
    
    return data;
  } catch (error) {
    for (const works of inMemoryWorks.values()) {
      const work = works.find(w => w.id === id);
      if (work) return work;
    }
    throw new Error('Work not found');
  }
}

export async function deleteWork(id: number) {
  try {
    const { error } = await supabase.from('user_works').delete().eq('id', id);
    
    if (error) {
      console.log('Database delete failed, deleting from in-memory storage');
      for (const [deviceId, works] of inMemoryWorks.entries()) {
        const index = works.findIndex(w => w.id === id);
        if (index !== -1) {
          works.splice(index, 1);
          inMemoryWorks.set(deviceId, works);
          break;
        }
      }
    }
  } catch (error) {
    console.log('Deleting from in-memory storage');
    for (const [deviceId, works] of inMemoryWorks.entries()) {
      const index = works.findIndex(w => w.id === id);
      if (index !== -1) {
        works.splice(index, 1);
        inMemoryWorks.set(deviceId, works);
        break;
      }
    }
  }
}

export function addWork(work: any) {
  const works = inMemoryWorks.get(work.deviceId) || [];
  works.unshift(work);
  inMemoryWorks.set(work.deviceId, works);
}
