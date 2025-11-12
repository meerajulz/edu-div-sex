import {
  ACTIVITY_1_CONFIG,
  ACTIVITY_2_CONFIG,
  ACTIVITY_3_CONFIG,
  ACTIVITY_4_CONFIG,
  ACTIVITY_5_CONFIG,
  ACTIVITY_6_CONFIG,
  type ActivityConfig
} from '../components/ActivityMenu/activityConfig';

/**
 * Get the proper scene title from activityConfig based on activity and scene slugs
 */
export function getSceneTitle(activitySlug: string, sceneSlug: string): string {
  const config = getActivityConfigBySlug(activitySlug);
  if (!config) return sceneSlug;

  // Find the section that contains this scene
  for (const section of config.sections) {
    const scenePath = `/${activitySlug}/${sceneSlug}`;
    if (section.scenes.includes(scenePath)) {
      return section.title;
    }
  }

  return sceneSlug;
}

/**
 * Get activity config by slug
 */
function getActivityConfigBySlug(slug: string): ActivityConfig | null {
  switch (slug) {
    case 'actividad-1':
      return ACTIVITY_1_CONFIG;
    case 'actividad-2':
      return ACTIVITY_2_CONFIG;
    case 'actividad-3':
      return ACTIVITY_3_CONFIG;
    case 'actividad-4':
      return ACTIVITY_4_CONFIG;
    case 'actividad-5':
      return ACTIVITY_5_CONFIG;
    case 'actividad-6':
      return ACTIVITY_6_CONFIG;
    default:
      return null;
  }
}

/**
 * Get the proper activity title from activityConfig based on activity slug
 */
export function getActivityTitle(activitySlug: string): string {
  const config = getActivityConfigBySlug(activitySlug);
  return config ? config.title : activitySlug;
}

/**
 * Get all scene titles for an activity grouped by section
 */
export function getActivitySceneTitles(activitySlug: string): { [sceneSlug: string]: string } {
  const config = getActivityConfigBySlug(activitySlug);
  if (!config) return {};

  const sceneTitles: { [sceneSlug: string]: string } = {};

  for (const section of config.sections) {
    for (const scenePath of section.scenes) {
      // Extract scene slug from path (e.g., "/actividad-1/scene1" -> "scene1")
      const sceneSlug = scenePath.split('/').pop() || '';
      sceneTitles[sceneSlug] = section.title;
    }
  }

  return sceneTitles;
}
