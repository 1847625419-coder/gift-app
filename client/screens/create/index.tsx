import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions, ActivityIndicator, Alert } from 'react-native';
import { Screen } from '@/components/Screen';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { ChevronLeft, Sparkles, Wand2, CalendarHeart, Heart, Star, PartyPopper, Zap, Crown } from 'lucide-react-native';
import { getTemplates, GiftTemplate, TEMPLATE_CATEGORIES } from '@/utils/templatesApi';
import { generateGift, GenerateParams } from '@/utils/worksApi';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DEVICE_ID_KEY = '@gift_workshop_device_id';

export default function CreateScreen() {
  const insets = useSafeAreaInsets();
  const router = useSafeRouter();

  const [templates, setTemplates] = useState<GiftTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [deviceId, setDeviceId] = useState<string>('');

  // 获取或生成设备ID
  useEffect(() => {
    const initDeviceId = async () => {
      try {
        let id = await AsyncStorage.getItem(DEVICE_ID_KEY);
        if (!id) {
          // 生成随机设备ID
          id = 'device_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
          await AsyncStorage.setItem(DEVICE_ID_KEY, id);
        }
        setDeviceId(id);
      } catch (error) {
        console.error('Failed to init device ID:', error);
        setDeviceId('anonymous_device');
      }
    };
    initDeviceId();
  }, []);

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

  // 模板分类
  const categories = TEMPLATE_CATEGORIES;

  // 风格选项
  const styleOptions = [
    { id: 'keep', label: '保持原IP风格' },
    { id: 'creative', label: '创意变形' },
  ];

  // 尺寸选项
  const sizeOptions = [
    { id: 'small', label: '小礼物', price: '100' },
    { id: 'medium', label: '中礼物', price: '200' },
    { id: 'large', label: '大礼物', price: '500' },
  ];

  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedTemplates, setSelectedTemplates] = useState<string[]>(['3']);
  const [activeStyle, setActiveStyle] = useState('keep');
  const [activeSize, setActiveSize] = useState('medium');
  const [quantity, setQuantity] = useState(1);

  const toggleTemplate = (id: string) => {
    setSelectedTemplates(prev => 
      prev.includes(id) 
        ? prev.filter(t => t !== id)
        : [...prev, id]
    );
  };

  const handleGenerate = async () => {
    if (selectedTemplates.length === 0) {
      Alert.alert('提示', '请至少选择一个模板');
      return;
    }

    if (!deviceId) {
      Alert.alert('错误', '设备ID无效');
      return;
    }

    setGenerating(true);
    try {
      // 获取第一个选中的模板
      const selectedTemplate = templates.find(t => t.id.toString() === selectedTemplates[0]);
      if (!selectedTemplate) {
        Alert.alert('错误', '未找到选中的模板');
        return;
      }

      const params: GenerateParams = {
        deviceId,
        templateId: selectedTemplate.id,
        templateName: selectedTemplate.name,
        category: selectedTemplate.category,
        style: activeStyle as 'original' | 'creative',
        quantity: quantity,
      };

      const result = await generateGift(params);
      
      if (result.success) {
        Alert.alert('成功', `已生成 ${result.works.length} 个礼物！`, [
          { text: '查看作品', onPress: () => router.push('/gallery') }
        ]);
      } else {
        Alert.alert('提示', result.message || '生成中，请稍后查看我的作品');
        router.push('/gallery');
      }
    } catch (error) {
      console.error('Generate error:', error);
      Alert.alert('错误', '生成失败，请重试');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <Screen safeAreaEdges={['top', 'left', 'right']}>
      <View className="flex-1 bg-background">
        {/* 顶部 Header */}
        <View 
          className="px-4 py-3 flex-row items-center justify-between"
          style={{ paddingTop: insets.top + 12 }}
        >
          <TouchableOpacity 
            className="w-10 h-10 items-center justify-center rounded-full"
            onPress={() => router.back()}
          >
            <ChevronLeft size={24} color="#2C2416" />
          </TouchableOpacity>
          <Text className="text-lg font-bold text-on-surface">创作礼物</Text>
          <TouchableOpacity className="w-10 h-10 items-center justify-center rounded-full">
            <Sparkles size={20} color="#2C2416" />
          </TouchableOpacity>
        </View>

        <ScrollView 
          className="flex-1"
          contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
          showsVerticalScrollIndicator={false}
        >
          {/* IP形象预览区 */}
          <View className="px-4 py-6 items-center">
            <View className="relative items-center">
              {/* 金色边框 */}
              <View 
                className="w-32 h-32 rounded-full items-center justify-center relative"
                style={{
                  borderWidth: 3,
                  borderColor: '#D4AF37',
                  backgroundColor: '#FFF9F0',
                }}
              >
                <Text className="text-5xl">🐯</Text>
              </View>
              
              {/* 角饰装饰 */}
              <View className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-primary" />
              <View className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-primary" />
            </View>
            
            <TouchableOpacity className="mt-3 px-4 py-1.5 rounded-full border border-primary/30">
              <Text className="text-xs text-primary font-medium">更换形象</Text>
            </TouchableOpacity>
          </View>

          {/* 模板选择区 */}
          <View className="px-4">
            <Text className="text-base font-bold text-on-surface mb-3">选择模板</Text>
            
            {/* 分类标签 */}
            <View className="mb-4">
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View className="flex-row gap-2">
                  {categories.map((cat) => (
                    <TouchableOpacity
                      key={cat.id}
                      className="px-4 py-2 rounded-full"
                      style={{
                        backgroundColor: activeCategory === cat.id ? '#B8860B' : '#F5F0E8',
                      }}
                      onPress={() => setActiveCategory(cat.id)}
                    >
                      <Text 
                        className="text-sm font-medium"
                        style={{ color: activeCategory === cat.id ? '#FFFFFF' : '#6B5D4D' }}
                      >
                        {cat.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>

            {/* 模板网格 */}
            <View className="flex-row flex-wrap gap-3">
              {templates.map((template) => {
                const IconComponent = template.icon;
                return (
                  <TouchableOpacity
                    key={template.id}
                    className="items-center p-3 rounded-2xl"
                    style={{
                      width: (SCREEN_WIDTH - 48) / 3 - 8,
                      backgroundColor: selectedTemplates.includes(template.id) ? '#F5E6C8' : '#FFFFFF',
                      borderWidth: selectedTemplates.includes(template.id) ? 2 : 0,
                      borderColor: '#B8860B',
                    }}
                    onPress={() => toggleTemplate(template.id)}
                  >
                    <View className="w-10 h-10 rounded-full bg-primary/10 items-center justify-center mb-1">
                      <IconComponent size={20} color="#B8860B" />
                    </View>
                    <Text className="text-xs text-on-surface">{template.name}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* 已选数量 */}
            <Text className="text-xs text-on-surface-variant mt-3 text-center">
              已选择 {selectedTemplates.length} 个模板
            </Text>
          </View>

          {/* 风格配置区 */}
          <View className="px-4 mt-6">
            <Text className="text-base font-bold text-on-surface mb-3">风格配置</Text>
            
            {/* 风格选择 */}
            <View className="flex-row gap-2 mb-4">
              {styleOptions.map((styleItem) => (
                <TouchableOpacity
                  key={styleItem.id}
                  className="flex-1 py-3 rounded-xl items-center"
                  style={{
                    backgroundColor: activeStyle === styleItem.id ? '#B8860B' : '#F5F0E8',
                  }}
                  onPress={() => setActiveStyle(styleItem.id)}
                >
                  <Text 
                    className="text-sm font-medium"
                    style={{ color: activeStyle === styleItem.id ? '#FFFFFF' : '#6B5D4D' }}
                  >
                    {styleItem.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* 尺寸选择 */}
            <Text className="text-sm font-medium text-on-surface mb-2">礼物尺寸</Text>
            <View className="flex-row gap-2 mb-4">
              {sizeOptions.map((sizeItem) => (
                <TouchableOpacity
                  key={sizeItem.id}
                  className="flex-1 py-3 rounded-xl items-center"
                  style={{
                    backgroundColor: activeSize === sizeItem.id ? '#B8860B' : '#F5F0E8',
                  }}
                  onPress={() => setActiveSize(sizeItem.id)}
                >
                  <Text 
                    className="text-sm font-medium"
                    style={{ color: activeSize === sizeItem.id ? '#FFFFFF' : '#6B5D4D' }}
                  >
                    {sizeItem.label}
                  </Text>
                  <Text 
                    className="text-xs mt-0.5"
                    style={{ color: activeSize === sizeItem.id ? '#FFFFFF' : '#6B5D4D', opacity: 0.7 }}
                  >
                    {sizeItem.price}金币
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* 数量调节 */}
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-sm font-medium text-on-surface">生成数量</Text>
              <View className="flex-row items-center gap-4">
                <TouchableOpacity 
                  className="w-8 h-8 rounded-full bg-surface items-center justify-center"
                  onPress={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <Text className="text-lg text-on-surface">−</Text>
                </TouchableOpacity>
                <Text className="text-xl font-bold text-on-surface w-8 text-center">{quantity}</Text>
                <TouchableOpacity 
                  className="w-8 h-8 rounded-full bg-surface items-center justify-center"
                  onPress={() => setQuantity(Math.min(9, quantity + 1))}
                >
                  <Text className="text-lg text-on-surface">+</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* 预计消耗 */}
          <View className="px-4 mt-4 py-4 mx-4 rounded-xl bg-primary/10">
            <View className="flex-row items-center justify-between">
              <Text className="text-sm text-on-surface-variant">预计消耗</Text>
              <Text className="text-base font-bold text-primary">
                {sizeOptions.find(s => s.id === activeSize)?.price} × {quantity} = {' '}
                {parseInt(sizeOptions.find(s => s.id === activeSize)?.price || '0') * quantity} 金币
              </Text>
            </View>
          </View>
        </ScrollView>

        {/* 底部生成按钮 */}
        <View 
          className="absolute bottom-0 left-0 right-0 px-4 py-4 bg-background"
          style={{ paddingBottom: insets.bottom + 16 }}
        >
          <TouchableOpacity 
            className="py-4 rounded-2xl items-center justify-center"
            style={{
              backgroundColor: '#B8860B',
              shadowColor: '#B8860B',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 8,
            }}
            onPress={handleGenerate}
          >
            <View className="flex-row items-center gap-2">
              <Sparkles size={20} color="#FFFFFF" />
              <Text className="text-base font-bold text-white">开始生成</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </Screen>
  );
}
