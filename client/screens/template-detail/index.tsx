import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions, Modal, ActivityIndicator } from 'react-native';
import { Screen } from '@/components/Screen';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { useSafeSearchParams } from '@/hooks/useSafeRouter';
import { ChevronLeft, MoreHorizontal, Heart, Play, Star, Moon, Sparkles, Wand2, Zap } from 'lucide-react-native';
import { getTemplateById, GiftTemplate } from '@/utils/templatesApi';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// 预生成星空位置
const STARS = [
  { top: 50, left: 80, opacity: 0.8 },
  { top: 120, left: 200, opacity: 0.6 },
  { top: 180, left: 50, opacity: 0.9 },
  { top: 250, left: 150, opacity: 0.7 },
  { top: 80, left: 280, opacity: 0.5 },
  { top: 300, left: 100, opacity: 0.8 },
  { top: 150, left: 320, opacity: 0.6 },
  { top: 350, left: 250, opacity: 0.9 },
  { top: 220, left: 80, opacity: 0.7 },
  { top: 380, left: 180, opacity: 0.5 },
  { top: 100, left: 400, opacity: 0.8 },
  { top: 280, left: 350, opacity: 0.6 },
  { top: 420, left: 50, opacity: 0.9 },
  { top: 320, left: 420, opacity: 0.7 },
  { top: 450, left: 300, opacity: 0.5 },
  { top: 50, left: 180, opacity: 0.6 },
  { top: 200, left: 250, opacity: 0.8 },
  { top: 400, left: 150, opacity: 0.7 },
  { top: 150, left: 120, opacity: 0.5 },
  { top: 350, left: 380, opacity: 0.9 },
];

export default function TemplateDetailScreen() {
  const insets = useSafeAreaInsets();
  const router = useSafeRouter();
  const params = useSafeSearchParams<{ id?: string }>();
  const [isCollected, setIsCollected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [template, setTemplate] = useState<GiftTemplate | null>(null);

  // 从API获取模板详情
  useEffect(() => {
    const fetchTemplate = async () => {
      if (!params.id) {
        setLoading(false);
        return;
      }
      try {
        const data = await getTemplateById(parseInt(params.id, 10));
        setTemplate(data);
      } catch (error) {
        console.error('Failed to fetch template:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTemplate();
  }, [params.id]);

  const features = [
    { icon: Moon, title: '星月主题', desc: '神秘星空元素' },
    { icon: Sparkles, title: '金色点缀', desc: '沙漠奢华质感' },
    { icon: Zap, title: '多层动画', desc: '8秒循环效果' },
  ];

  return (
    <Screen safeAreaEdges={['top', 'left', 'right']}>
      <View className="flex-1 bg-background">
        {/* 顶部 Header */}
        <View 
          className="px-4 py-3 flex-row items-center justify-between absolute top-0 left-0 right-0 z-10"
          style={{ paddingTop: insets.top + 12 }}
        >
          <TouchableOpacity 
            className="w-10 h-10 items-center justify-center rounded-full bg-black/30"
            onPress={() => router.back()}
          >
            <ChevronLeft size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text className="text-base font-bold text-white">礼物模板</Text>
          <TouchableOpacity className="w-10 h-10 items-center justify-center rounded-full bg-black/30">
            <MoreHorizontal size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <ScrollView 
          className="flex-1"
          contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
          showsVerticalScrollIndicator={false}
        >
          {/* 模板预览区 */}
          <View className="relative">
            <View 
              className="w-full items-center justify-center"
              style={{ height: SCREEN_WIDTH * 1.2, backgroundColor: '#1a1a2e' }}
            >
              {/* 背景星空装饰 */}
              <View className="absolute inset-0">
                {STARS.map((star, i) => (
                  <View
                    key={i}
                    className="absolute w-1 h-1 rounded-full bg-white"
                    style={{
                      top: star.top,
                      left: star.left,
                      opacity: star.opacity,
                    }}
                  />
                ))}
              </View>
              
              {/* 中央图案 */}
              <View className="items-center">
                <View className="w-20 h-20 rounded-full bg-primary/20 items-center justify-center mb-4">
                  <Moon size={48} color="#D4AF37" />
                </View>
                <View className="flex-row items-center gap-2">
                  <Sparkles size={20} color="#D4AF37" />
                  <Text className="text-xl font-bold text-primary">皇室星月夜</Text>
                  <Sparkles size={20} color="#D4AF37" />
                </View>
              </View>
            </View>

            {/* 金色边框 */}
            <View className="absolute inset-4 border-2 border-primary/50 rounded-3xl" />
            
            {/* 角饰装饰 */}
            <View className="absolute top-8 left-8 w-8 h-8 border-l-2 border-t-2 border-primary rounded-tl-lg" />
            <View className="absolute top-8 right-8 w-8 h-8 border-r-2 border-t-2 border-primary rounded-tr-lg" />
            <View className="absolute bottom-8 left-8 w-8 h-8 border-l-2 border-b-2 border-primary rounded-bl-lg" />
            <View className="absolute bottom-8 right-8 w-8 h-8 border-r-2 border-b-2 border-primary rounded-br-lg" />
          </View>

          {/* 模板信息 */}
          <View className="px-4 py-6">
            {/* 加载状态 */}
            {loading ? (
              <View className="items-center py-8">
                <ActivityIndicator size="large" color="#B8860B" />
              </View>
            ) : template ? (
              <>
                {/* 标签 */}
                <View className="flex-row gap-2 mb-3">
                  {template.tags.slice(0, 2).map((tag, index) => (
                    <View key={index} className="px-3 py-1 rounded-full bg-primary/20">
                      <Text className="text-xs font-medium text-primary">{tag}</Text>
                    </View>
                  ))}
                </View>

                {/* 名称 */}
                <Text className="text-2xl font-bold text-on-surface">{template.name}</Text>
                <Text className="text-sm text-on-surface-variant mt-1">{template.nameEn}</Text>

                {/* 说明 */}
                <Text className="text-sm text-on-surface-variant mt-4 leading-relaxed">
                  {template.description}
                </Text>

                {/* 特色 */}
                <View className="flex-row gap-3 mt-6">
                  {features.map((feature, index) => {
                    const IconComponent = feature.icon;
                    return (
                      <View 
                        key={index}
                        className="flex-1 py-4 px-3 rounded-2xl bg-surface items-center"
                      >
                        <View className="w-10 h-10 rounded-full bg-primary/10 items-center justify-center mb-2">
                          <IconComponent size={20} color="#B8860B" />
                        </View>
                        <Text className="text-xs font-semibold text-on-surface">{feature.title}</Text>
                        <Text className="text-[10px] text-on-surface-variant mt-0.5 text-center">{feature.desc}</Text>
                      </View>
                    );
                  })}
                </View>

                {/* 使用统计 */}
                <View className="flex-row items-center gap-4 mt-6">
                  <View className="flex-row items-center gap-1">
                    <Star size={16} color="#B8860B" fill="#B8860B" />
                    <Text className="text-sm font-semibold text-on-surface">{template.rating}</Text>
                  </View>
                  <View className="h-4 w-px bg-on-surface-variant/20" />
                  <Text className="text-sm text-on-surface-variant">{template.useCount.toLocaleString()} 使用</Text>
                </View>
              </>
            ) : (
              <Text className="text-center text-on-surface-variant">模板不存在</Text>
            )}
          </View>

          {/* 动画预览区 */}
            <View className="mt-6 py-4 px-4 rounded-2xl bg-surface">
              <View className="flex-row items-center justify-between mb-3">
                <Text className="text-sm font-semibold text-on-surface">动画预览</Text>
                <View className="flex-row items-center gap-2">
                  <View className="px-2 py-1 rounded bg-primary/10">
                    <Text className="text-[10px] text-primary">约8秒</Text>
                  </View>
                  <View className="px-2 py-1 rounded bg-primary/10">
                    <Text className="text-[10px] text-primary">无限循环</Text>
                  </View>
                </View>
              </View>
              <TouchableOpacity 
                className="h-32 rounded-xl items-center justify-center"
                style={{ backgroundColor: '#1a1a2e' }}
              >
                <View className="w-14 h-14 rounded-full bg-primary items-center justify-center">
                  <Play size={28} color="#FFFFFF" />
                </View>
              </TouchableOpacity>
            </View>

            {/* 使用统计 */}
            <View className="flex-row items-center gap-6 mt-6 py-4 px-4 rounded-2xl bg-surface">
              <View className="items-center">
                <Text className="text-lg font-bold text-on-surface">{templateData.stats.usedCount.toLocaleString()}</Text>
                <Text className="text-xs text-on-surface-variant">使用次数</Text>
              </View>
              <View className="w-px h-8 bg-outline-variant" />
              <View className="items-center">
                <View className="flex-row items-center gap-1">
                  <Text className="text-lg font-bold text-on-surface">{templateData.stats.rating}</Text>
                  <Star size={14} color="#F59E0B" fill="#F59E0B" />
                </View>
                <Text className="text-xs text-on-surface-variant">评分</Text>
              </View>
              <View className="w-px h-8 bg-outline-variant" />
              <View className="items-center">
                <Text className="text-lg font-bold text-on-surface">{templateData.stats.reviews}</Text>
                <Text className="text-xs text-on-surface-variant">评价数</Text>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* 底部操作栏 */}
        <View 
          className="px-4 py-4 bg-background border-t border-outline-variant"
          style={{ paddingBottom: insets.bottom + 16 }}
        >
          <View className="flex-row items-center gap-3">
            {/* 收藏按钮 */}
            <TouchableOpacity 
              className="w-12 h-12 rounded-full items-center justify-center"
              style={{
                backgroundColor: isCollected ? '#FEE2E2' : '#F5F0E8',
                borderWidth: 1,
                borderColor: isCollected ? '#ef4444' : '#E5DED4',
              }}
              onPress={() => setIsCollected(!isCollected)}
            >
              <Heart 
                size={24} 
                color={isCollected ? '#ef4444' : '#6B5D4D'} 
                fill={isCollected ? '#ef4444' : 'none'} 
              />
            </TouchableOpacity>

            {/* 开始创作按钮 */}
            <TouchableOpacity 
              className="flex-1 py-4 rounded-2xl items-center justify-center"
              style={{
                backgroundColor: '#B8860B',
                shadowColor: '#B8860B',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 8,
              }}
              onPress={() => router.push('/create')}
            >
              <View className="flex-row items-center gap-2">
                <Wand2 size={20} color="#FFFFFF" />
                <Text className="text-base font-bold text-white">开始创作</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Screen>
  );
}
