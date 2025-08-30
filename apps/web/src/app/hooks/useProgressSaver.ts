'use client';

import { useSession } from 'next-auth/react';
import { useCallback } from 'react';

interface GameData {
  [key: string]: string | number | boolean;
}

interface UseProgressSaverReturn {
  saveProgress: (
    activitySlug: string,
    sceneSlug: string,
    status?: 'completed' | 'in_progress',
    completionPercentage?: number,
    gameData?: GameData
  ) => Promise<boolean>;
}

/**
 * Custom hook for saving student progress
 * Provides a reusable function to save progress for any game
 */
export function useProgressSaver(): UseProgressSaverReturn {
  const { data: session } = useSession();

  const saveProgress = useCallback(async (
    activitySlug: string,
    sceneSlug: string,
    status: 'completed' | 'in_progress' = 'completed',
    completionPercentage: number = 100,
    gameData: GameData = {}
  ): Promise<boolean> => {
    if (!session?.user?.id) {
      console.error('❌ No user session, skipping progress save');
      console.log('Session data:', session);
      return false;
    }

    console.log('🚀 Starting progress save for user:', session.user.id);

    try {
      console.log(`💾 Saving progress: ${activitySlug}/${sceneSlug} - ${status} (${completionPercentage}%)`);
      
      // Get student ID from user ID
      const studentResponse = await fetch('/api/students', {
        method: 'GET',
      });
      
      if (!studentResponse.ok) {
        console.error('Failed to get student data');
        return false;
      }

      const studentData = await studentResponse.json();
      const currentStudent = studentData.students?.find((s: { id: number; user_id: number; first_name: string }) => s.user_id === parseInt(session.user.id));
      
      console.log('🔍 Student lookup:', {
        user_id: session.user.id,
        students_found: studentData.students?.length,
        current_student: currentStudent
      });
      
      if (!currentStudent) {
        console.log('❌ No student record found for user ID:', session.user.id);
        console.log('Available students:', studentData.students?.map((s: { id: number; user_id: number; first_name: string }) => ({ id: s.id, user_id: s.user_id, name: s.first_name })));
        return false;
      }

      // Prepare game data with metadata
      const enhancedGameData = {
        ...gameData,
        saved_at: new Date().toISOString(),
        user_agent: navigator.userAgent,
      };

      // Save progress
      const progressResponse = await fetch('/api/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          student_id: currentStudent.id,
          activity_slug: activitySlug,
          scene_slug: sceneSlug,
          status: status,
          completion_percentage: Math.min(100, Math.max(0, completionPercentage)),
          game_data: enhancedGameData
        }),
      });

      if (progressResponse.ok) {
        const result = await progressResponse.json();
        console.log('✅ Progress saved successfully:', result.progress);
        
        // Small delay to ensure the database write is complete
        await new Promise(resolve => setTimeout(resolve, 200));
        
        return true;
      } else {
        const error = await progressResponse.text();
        console.error('❌ Failed to save progress:', {
          status: progressResponse.status,
          error: error
        });
        return false;
      }
    } catch (error) {
      console.error('Error saving progress:', error);
      return false;
    }
  }, [session]);

  return { saveProgress };
}