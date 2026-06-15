import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions, Modal, TouchableWithoutFeedback, Alert, ActivityIndicator, RefreshControl } from 'react-native';
import { Screen } from '@/components/Screen';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FolderHeart, SlidersHorizontal, Download, Trash2, X, Check, Star, Sparkles } from 'lucide-react-native';
import { useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserWorks, deleteWork, UserWork } from '@/utils/worksApi';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const COLUMN_GAP = 12;
const ITEM_WIDTH = (SCREEN_WIDTH - 48 - COLUMN_GAP) / 2;
const DEVICE_ID_KEY = '@gift_workshop_device_id';

// 筛选类别
const CATEGORIES = ['全部', '礼物卡', '邀请函', '纪念品'];

export default function GalleryScreen() {
  const insets = useSafeAreaInsets();
  const [works, setWorks] = useState<UserWork[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState('全部');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);

  // 加载作品数据
  const fetchWorks = useCallback(async () => {
    try {
      const deviceId = await AsyncStorage.getItem(DEVICE_ID_KEY);
      if (deviceId) {
        const data = await getUserWorks(deviceId);
        setWorks(data);
      }
    } catch (error) {
      console.error('Failed to fetch works:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // 使用 useFocusEffect 在页面获得焦点时刷新数据
  useFocusEffect(
    useCallback(() => {
      fetchWorks();
    }, [fetchWorks])
  );

  const filteredWorks = activeFilter === '全部' 
    ? works 
    : works.filter(w => w.category === activeFilter);

  const handleDownload = (work: UserWork) => {
    Alert.alert('下载成功', `"${work.templateName}" 已保存到相册`);
  };

  const handleDelete = (id: number) => {
    setDeleteTarget(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (deleteTarget) {
      try {
        await deleteWork(deleteTarget);
        setWorks(prev => prev.filter(w => w.id !== deleteTarget));
        Alert.alert('删除成功', '作品已删除');
      } catch (error) {
        console.error('Delete error:', error);
        Alert.alert('错误', '删除失败，请重试');
      }
    }
    setShowDeleteModal(false);
    setDeleteTarget(null);
  };

  return (
    <Screen safeAreaEdges={['top', 'left', 'right']}>
      <View className="flex-1 bg-background">
        {/* 顶部 Header */}
        <View 
          className="px-4 py-3 flex-row items-center justify-between"
          style={{ paddingTop: insets.top + 12 }}
        >
          <View className="w-10" />
          <Text className="text-lg font-bold text-on-surface">我的作品</Text>
          <TouchableOpacity 
            className="w-10 h-10 items-center justify-center rounded-full"
            onPress={() => setShowFilterModal(true)}
          >
            <SlidersHorizontal size={20} color="#2C2416" />
          </TouchableOpacity>
        </View>

        {/* 统计卡片 */}
        <View className="px-4 py-3 flex-row gap-3">
          <View className="flex-1 py-4 px-4 rounded-2xl bg-surface items-center">
            <Text className="text-2xl font-bold text-primary">12</Text>
            <Text className="text-xs text-on-surface-variant mt-1">已生成礼物</Text>
          </View>
          <View className="flex-1 py-4 px-4 rounded-2xl bg-surface items-center">
            <Text className="text-2xl font-bold text-primary">3</Text>
            <Text className="text-xs text-on-surface-variant mt-1">收藏作品</Text>
          </View>
        </View>

        {/* 筛选标签 */}
        <View className="px-4 py-2">
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row gap-2">
              {CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  className="px-4 py-2 rounded-full"
                  style={{
                    backgroundColor: activeFilter === cat ? '#B8860B' : '#F5F0E8',
                  }}
                  onPress={() => setActiveFilter(cat)}
                >
                  <Text 
                    className="text-sm font-medium"
                    style={{ color: activeFilter === cat ? '#FFFFFF' : '#6B5D4D' }}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* 瀑布流作品列表 */}
        <ScrollView 
          className="flex-1 px-4"
          contentContainerStyle={{ paddingTop: 16, paddingBottom: insets.bottom + 100 }}
          showsVerticalScrollIndicator={false}
        >
          {filteredWorks.length === 0 ? (
            <View className="flex-1 items-center justify-center py-20">
              <FolderHeart size={64} color="#D4C5B5" />
              <Text className="text-base text-on-surface-variant mt-4">暂无作品</Text>
              <Text className="text-sm text-on-surface-variant/70 mt-1">开始创作你的第一个礼物吧</Text>
            </View>
          ) : (
            <View className="flex-row gap-3">
              {/* 左列 */}
              <View className="flex-1" style={{ gap: 12 }}>
                {filteredWorks
                  .filter((_, i) => i % 2 === 0)
                  .map((work) => (
                    <TouchableOpacity
                      key={work.id}
                      className="rounded-2xl overflow-hidden bg-surface"
                      style={{ 
                        shadowColor: '#2C2416',
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.08,
                        shadowRadius: 16,
                        elevation: 4,
                      }}
                    >
                      <View 
                        className="items-center justify-center relative"
                        style={{ height: work.height, backgroundColor: '#FEF3C7' }}
                      >
                        <Text className="text-5xl">{work.emoji}</Text>
                        {/* 类别标签 */}
                        <View className="absolute top-2 right-2 px-2 py-1 rounded-full bg-primary/90">
                          <Text className="text-[10px] font-medium text-white">{work.category}</Text>
                        </View>
                      </View>
                      <View className="p-3">
                        <Text className="text-sm font-semibold text-on-surface">{work.name}</Text>
                        <Text className="text-xs text-on-surface-variant mt-0.5">{work.date}</Text>
                        {/* 操作按钮 */}
                        <View className="flex-row gap-2 mt-2">
                          <TouchableOpacity 
                            className="flex-1 py-2 rounded-lg bg-primary/10 items-center"
                            onPress={() => handleDownload(work.id)}
                          >
                            <Download size={16} color="#B8860B" />
                          </TouchableOpacity>
                          <TouchableOpacity 
                            className="flex-1 py-2 rounded-lg bg-red-50 items-center"
                            onPress={() => handleDelete(work.id)}
                          >
                            <Trash2 size={16} color="#ef4444" />
                          </TouchableOpacity>
                        </View>
                      </View>
                    </TouchableOpacity>
                  ))}
              </View>

              {/* 右列 */}
              <View className="flex-1" style={{ gap: 12 }}>
                {filteredWorks
                  .filter((_, i) => i % 2 === 1)
                  .map((work) => (
                    <TouchableOpacity
                      key={work.id}
                      className="rounded-2xl overflow-hidden bg-surface"
                      style={{ 
                        shadowColor: '#2C2416',
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.08,
                        shadowRadius: 16,
                        elevation: 4,
                      }}
                    >
                      <View 
                        className="items-center justify-center relative"
                        style={{ height: work.height, backgroundColor: '#FDE68A' }}
                      >
                        <Text className="text-5xl">{work.emoji}</Text>
                        {/* 类别标签 */}
                        <View className="absolute top-2 right-2 px-2 py-1 rounded-full bg-primary/90">
                          <Text className="text-[10px] font-medium text-white">{work.category}</Text>
                        </View>
                      </View>
                      <View className="p-3">
                        <Text className="text-sm font-semibold text-on-surface">{work.name}</Text>
                        <Text className="text-xs text-on-surface-variant mt-0.5">{work.date}</Text>
                        {/* 操作按钮 */}
                        <View className="flex-row gap-2 mt-2">
                          <TouchableOpacity 
                            className="flex-1 py-2 rounded-lg bg-primary/10 items-center"
                            onPress={() => handleDownload(work.id)}
                          >
                            <Download size={16} color="#B8860B" />
                          </TouchableOpacity>
                          <TouchableOpacity 
                            className="flex-1 py-2 rounded-lg bg-red-50 items-center"
                            onPress={() => handleDelete(work.id)}
                          >
                            <Trash2 size={16} color="#ef4444" />
                          </TouchableOpacity>
                        </View>
                      </View>
                    </TouchableOpacity>
                  ))}
              </View>
            </View>
          )}
        </ScrollView>

        {/* 筛选弹窗 */}
        <Modal visible={showFilterModal} transparent animationType="slide">
          <TouchableWithoutFeedback onPress={() => setShowFilterModal(false)}>
            <View className="flex-1 bg-black/50 justify-end">
              <TouchableWithoutFeedback>
                <View 
                  className="bg-surface rounded-t-3xl p-6"
                  style={{ paddingBottom: insets.bottom + 16 }}
                >
                  <View className="flex-row items-center justify-between mb-4">
                    <Text className="text-lg font-bold text-on-surface">筛选</Text>
                    <TouchableOpacity onPress={() => setShowFilterModal(false)}>
                      <X size={24} color="#6B5D4D" />
                    </TouchableOpacity>
                  </View>
                  <Text className="text-sm font-medium text-on-surface mb-3">类型</Text>
                  <View className="flex-row flex-wrap gap-2">
                    {CATEGORIES.map((cat) => (
                      <TouchableOpacity
                        key={cat}
                        className="px-4 py-2 rounded-full"
                        style={{
                          backgroundColor: activeFilter === cat ? '#B8860B' : '#F5F0E8',
                        }}
                        onPress={() => {
                          setActiveFilter(cat);
                          setShowFilterModal(false);
                        }}
                      >
                        <Text 
                          className="text-sm font-medium"
                          style={{ color: activeFilter === cat ? '#FFFFFF' : '#6B5D4D' }}
                        >
                          {cat}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

        {/* 删除确认弹窗 */}
        <Modal visible={showDeleteModal} transparent animationType="fade">
          <View className="flex-1 bg-black/50 items-center justify-center px-6">
            <View className="bg-surface rounded-2xl p-6 w-full max-w-xs">
              <Text className="text-lg font-bold text-on-surface text-center mb-2">确认删除</Text>
              <Text className="text-sm text-on-surface-variant text-center mb-6">
                删除后将无法恢复，确定要删除这个作品吗？
              </Text>
              <View className="flex-row gap-3">
                <TouchableOpacity 
                  className="flex-1 py-3 rounded-xl bg-surface-container items-center"
                  onPress={() => setShowDeleteModal(false)}
                >
                  <Text className="text-sm font-medium text-on-surface">取消</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  className="flex-1 py-3 rounded-xl bg-red-500 items-center"
                  onPress={confirmDelete}
                >
                  <Text className="text-sm font-medium text-white">删除</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </Screen>
  );
}
