'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

export interface ActivityProgress {
  activityId: number;
  isCompleted: boolean;
  isUnlocked: boolean;
  completedAt?: string;
}

export function useActivityProgress() {
  const { data: session, status } = useSession();
  const [activityProgress, setActivityProgress] = useState<ActivityProgress[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      fetchUserProgress();
    } else if (status === 'unauthenticated') {
      setIsLoading(false);
      // For unauthenticated users, only activity 1 is unlocked
      setActivityProgress([
        { activityId: 1, isCompleted: false, isUnlocked: true },
        { activityId: 2, isCompleted: false, isUnlocked: false },
        { activityId: 3, isCompleted: false, isUnlocked: false },
        { activityId: 4, isCompleted: false, isUnlocked: false },
        { activityId: 5, isCompleted: false, isUnlocked: false },
        { activityId: 6, isCompleted: false, isUnlocked: false },
      ]);
    }
  }, [session, status]);

  const fetchUserProgress = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/user/activity-progress');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch progress: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('📊 User activity progress:', data);
      
      // Process the progress data to determine unlock status
      const processedProgress = processProgressData(data);
      setActivityProgress(processedProgress);
      
    } catch (error) {
      console.error('❌ Failed to fetch user progress:', error);
      // Fallback: only activity 1 unlocked
      setActivityProgress([
        { activityId: 1, isCompleted: false, isUnlocked: true },
        { activityId: 2, isCompleted: false, isUnlocked: false },
        { activityId: 3, isCompleted: false, isUnlocked: false },
        { activityId: 4, isCompleted: false, isUnlocked: false },
        { activityId: 5, isCompleted: false, isUnlocked: false },
        { activityId: 6, isCompleted: false, isUnlocked: false },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  interface ApiResponse {
    activityCompletion?: Record<number, {
      isCompleted: boolean;
      lastUpdated?: string;
    }>;
  }

  const processProgressData = (apiResponse: ApiResponse): ActivityProgress[] => {
    const progress: ActivityProgress[] = [];
    const activityCompletion = apiResponse.activityCompletion || {};
    
    console.log('📊 Processing activity completion data:', activityCompletion);
    
    // Activity 1 is always unlocked
    let lastCompletedActivity = 0;
    
    // Process activities 1-6
    for (let i = 1; i <= 6; i++) {
      // Check if this activity is completed based on activityCompletion data
      const activityData = activityCompletion[i];
      const isCompleted = activityData ? activityData.isCompleted : false;
      
      if (isCompleted) {
        lastCompletedActivity = i;
      }
      
      // Activity is unlocked if:
      // 1. It's activity 1 (always unlocked)
      // 2. The previous activity is completed
      const isUnlocked = i === 1 || i <= lastCompletedActivity + 1;
      
      progress.push({
        activityId: i,
        isCompleted,
        isUnlocked,
        completedAt: activityData?.lastUpdated
      });
    }
    
    console.log('🔓 Processed activity unlock status:', progress);
    return progress;
  };

  const isActivityUnlocked = (activityId: number): boolean => {
    const activity = activityProgress.find(a => a.activityId === activityId);
    return activity?.isUnlocked || false;
  };

  const isActivityCompleted = (activityId: number): boolean => {
    const activity = activityProgress.find(a => a.activityId === activityId);
    return activity?.isCompleted || false;
  };

  const getNextUnlockedActivity = (): number | null => {
    const nextActivity = activityProgress.find(a => a.isUnlocked && !a.isCompleted);
    return nextActivity?.activityId || null;
  };

  return {
    activityProgress,
    isLoading,
    isActivityUnlocked,
    isActivityCompleted,
    getNextUnlockedActivity,
    refetchProgress: fetchUserProgress
  };
}