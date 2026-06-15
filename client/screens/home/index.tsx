import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import { Screen } from '@/components/Screen';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Link } from 'expo-router';
import { Gift, Moon, Home, Sparkles, FolderHeart } from 'lucide-react-native';
import { getTemplates, GiftTemplate, TEMPLATE_CATEGORIES } from '@/utils/templatesApi';

// 屏幕宽度
const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const [templates, setTemplates] = useState<GiftTemplate[]>([]);
  const [loading, setLoading] = useState(true);

  // 从API获取模板数据
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const data = await getTemplates();
        setTemplates(data);
      } catch (error) {
        console.error('Failed to fetch templates:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTemplates();
  }, []);

  // 快捷入口数据
  const quickEntries = [
    { id: 'all', icon: 'smile', label: '表情礼物', gradient: ['#F472B6', '#FB7185'] },
    { id: 'expression', icon: 'wand', label: '动作特效', gradient: ['#A78BFA', '#8B5CF6'] },
    { id: 'festival', icon: 'calendar', label: '节日专题', gradient: ['#34D399', '#14B8A6'] },
    { id: 'custom', icon: 'pencil', label: '自定义', gradient: ['#FBBF24', '#F97316'] },
  ];

  // 热门创作者数据
  const creators = [
    { id: '1', name: '阿拉伯公主', char: '阿', gradient: ['#F472B6', '#FB7185'], works: '1.2k' },
    { id: '2', name: '沙漠商人', char: '沙', gradient: ['#FBBF24', '#F97316'], works: '956' },
    { id: '3', name: '星空旅者', char: '星', gradient: ['#A78BFA', '#8B5CF6'], works: '2.3k' },
    { id: '4', name: '骆驼商队', char: '骆', gradient: ['#34D399', '#14B8A6'], works: '888' },
  ];

  return (
    <Screen safeAreaEdges={['top', 'left', 'right']}>
      <View className="flex-1 bg-background">
        {/* 顶部 Logo 区 */}
        <View className="px-4 py-3 flex-row items-center justify-between">
          <View className="flex-row items-center gap-2">
            <View 
              className="w-10 h-10 rounded-xl items-center justify-center"
              style={{ backgroundColor: '#B8860B' }}
            >
              <Gift size={20} color="#FFFFFF" />
            </View>
            <View>
              <Text className="text-lg font-bold text-on-surface leading-tight">礼物工坊</Text>
              <Text className="text-[10px] text-on-surface-variant">Gift Workshop</Text>
            </View>
          </View>
          {/* 斋月徽章 */}
          <View className="flex-row items-center gap-1 px-3 py-1.5 rounded-full bg-primary/10">
            <Moon size={14} color="#B8860B" />
            <Text className="text-xs font-medium text-primary">Ramadan</Text>
          </View>
        </View>

        <ScrollView 
          className="flex-1"
          contentContainerStyle={{ paddingBottom: insets.bottom + 80 }}
          showsVerticalScrollIndicator={false}
        >
          {/* IP形象展示区 */}
          <View className="px-4 py-6 items-center">
            <View className="relative items-center">
              {/* 阿拉伯花纹装饰背景 */}
              <View className="absolute inset-0 -m-8 items-center justify-center opacity-30">
                <View className="w-48 h-48" />
              </View>
              
              {/* IP形象容器 - 金色边框 */}
              <View 
                className="w-40 h-40 rounded-full items-center justify-center relative"
                style={{
                  borderWidth: 3,
                  borderColor: '#D4AF37',
                  backgroundColor: '#FFF9F0',
                  shadowColor: '#B8860B',
                  shadowOffset: { width: 0, height: 0 },
                  shadowOpacity: 0.15,
                  shadowRadius: 20,
                  elevation: 8,
                }}
              >
                <View className="text-center">
                  <Text className="text-6xl mb-1">🐯</Text>
                  <Text className="text-xs font-semibold text-primary">软萌小老虎</Text>
                </View>
              </View>
              
              {/* 两侧星芒装饰 */}
              <View className="absolute top-1/2 -left-8 -translate-y-1/2 w-6 h-6">
                <View className="w-full h-full bg-primary/40 rounded-full" />
              </View>
              <View className="absolute top-1/2 -right-8 -translate-y-1/2 w-6 h-6">
                <View className="w-full h-full bg-primary/40 rounded-full" />
              </View>
            </View>
            
            {/* 欢迎语 */}
            <View className="mt-4 text-center">
              <Text className="text-sm text-on-surface-variant">مرحباً بك · 欢迎来到礼物王国</Text>
              <Text className="text-xs text-on-surface-variant/70 mt-1">创造独特的直播礼物，表达你的心意</Text>
            </View>
          </View>

          {/* 快捷入口区 */}
          <View className="px-4 py-4">
            <View className="flex-row justify-between">
              {quickEntries.map((entry) => (
                <Link key={entry.id} href="/create" asChild>
                  <TouchableOpacity className="items-center gap-2 p-3 rounded-2xl bg-surface active:scale-95" style={{ width: (SCREEN_WIDTH - 48) / 4 - 6 }}>
                    <View 
                      className="w-12 h-12 rounded-full items-center justify-center"
                      style={{ backgroundColor: entry.gradient[0] }}
                    >
                      <Text className="text-2xl">{entry.emoji}</Text>
                    </View>
                    <Text className="text-xs font-medium text-on-surface">{entry.label}</Text>
                  </TouchableOpacity>
                </Link>
              ))}
            </View>
          </View>

          {/* 精选模板区 */}
          <View className="py-4">
            <View className="px-4 flex-row items-center justify-between mb-3">
              <View className="flex-row items-center gap-2">
                <View className="w-1 h-5 rounded-full bg-gradient-to-b from-primary to-amber-400" />
                <Text className="text-base font-bold text-on-surface">精选模板</Text>
                <View className="px-2 py-0.5 rounded-full bg-primary/10">
                  <Text className="text-[10px] font-semibold text-primary">HOT</Text>
                </View>
              </View>
              <Link href="/create" asChild>
                <TouchableOpacity className="flex-row items-center gap-1">
                  <Text className="text-xs text-primary font-medium">查看全部</Text>
                </TouchableOpacity>
              </Link>
            </View>
            
            {/* 横向滚动模板卡片 */}
            {loading ? (
              <View className="h-40 items-center justify-center">
                <ActivityIndicator size="large" color="#B8860B" />
              </View>
            ) : (
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 16 }}
            >
              {templates.slice(0, 6).map((template) => (
                <Link key={template.id} href={`/template-detail?id=${template.id}`} asChild>
                  <TouchableOpacity 
                    className="flex-shrink-0 rounded-2xl overflow-hidden bg-surface mr-3 active:scale-95"
                    style={{ width: 144, shadowColor: '#2C2416', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 16, elevation: 4 }}
                  >
                    <View 
                      className="aspect-square items-center justify-center relative bg-surface-container"
                    >
                      {template.thumbnailUrl ? (
                        <View className="w-full h-full bg-surface-container" />
                      ) : (
                        <Text className="text-4xl">{template.name.charAt(0)}</Text>
                      )}
                      {/* 角落装饰 */}
                      <View className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-primary/20">
                        <Text className="text-[10px] font-medium text-primary">{template.category}</Text>
                      </View>
                    </View>
                    <View className="p-3">
                      <Text className="text-sm font-semibold text-on-surface">{template.name}</Text>
                      <Text className="text-[10px] text-on-surface-variant mt-0.5">{template.useCount.toLocaleString()} 使用</Text>
                    </View>
                  </TouchableOpacity>
                </Link>
              ))}
            </ScrollView>
            )}
          </View>

          {/* 热门创作者区 */}
          <View className="py-4 px-4">
            <View className="flex-row items-center justify-between mb-3">
              <View className="flex-row items-center gap-2">
                <View className="w-1 h-5 rounded-full bg-gradient-to-b from-primary to-amber-400" />
                <Text className="text-base font-bold text-on-surface">热门创作者</Text>
              </View>
            </View>
            
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {creators.map((creator) => (
                <View key={creator.id} className="flex-shrink-0 items-center gap-2 mr-4">
                  <View 
                    className="w-16 h-16 rounded-full items-center justify-center"
                    style={{ backgroundColor: creator.gradient[0] }}
                  >
                    <Text className="text-white font-bold text-lg">{creator.char}</Text>
                  </View>
                  <Text className="text-xs text-on-surface">{creator.name}</Text>
                  <Text className="text-[10px] text-on-surface-variant">{creator.works}作品</Text>
                </View>
              ))}
            </ScrollView>
          </View>
        </ScrollView>
      </View>
    </Screen>
  );
}
