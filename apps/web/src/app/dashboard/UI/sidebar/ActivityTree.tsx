'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronRight, Play } from 'lucide-react';

interface Scene {
  id: string;
  name: string;
  path: string;
}

interface Activity {
  id: string;
  name: string;
  path: string;
  scenes: Scene[];
}

const ACTIVITIES_DATA: Activity[] = [
  {
    id: 'actividad-1',
    name: 'Actividad 1',
    path: '/actividad-1',
    scenes: [
      { id: 'scene1', name: 'Escena 1 - Juego Uno', path: '/actividad-1/scene1' },
      { id: 'scene2', name: 'Escena 2', path: '/actividad-1/scene2' },
      { id: 'scene3', name: 'Escena 3', path: '/actividad-1/scene3' },
      { id: 'scene4', name: 'Escena 4 - Juego Dos', path: '/actividad-1/scene4' },
      { id: 'scene5', name: 'Escena 5', path: '/actividad-1/scene5' },
      { id: 'scene6', name: 'Escena 6 - Juego Tres', path: '/actividad-1/scene6' },
      { id: 'scene7', name: 'Escena 7', path: '/actividad-1/scene7' },
    ]
  },
  {
    id: 'actividad-2',
    name: 'Actividad 2',
    path: '/actividad-2',
    scenes: [
      { id: 'scene1', name: 'Escena 1 - Juego Uno', path: '/actividad-2/scene1' },
      { id: 'scene2', name: 'Escena 2 - Juego Dos', path: '/actividad-2/scene2' },
      { id: 'scene3', name: 'Escena 3 - Juego Tres', path: '/actividad-2/scene3' },
      { id: 'scene4', name: 'Escena 4 - Juegos Cuatro y Cinco', path: '/actividad-2/scene4' },
    ]
  },
  {
    id: 'actividad-3',
    name: 'Actividad 3',
    path: '/actividad-3',
    scenes: [
      { id: 'scene1', name: 'Escena 1 - Juegos Uno y Dos', path: '/actividad-3/scene1' },
      { id: 'scene2', name: 'Escena 2 - Juego Tres', path: '/actividad-3/scene2' },
    ]
  }
];

const ActivityTree: React.FC = () => {
  const [expandedActivities, setExpandedActivities] = useState<Set<string>>(new Set());

  const toggleActivity = (activityId: string) => {
    const newExpanded = new Set(expandedActivities);
    if (newExpanded.has(activityId)) {
      newExpanded.delete(activityId);
    } else {
      newExpanded.add(activityId);
    }
    setExpandedActivities(newExpanded);
  };

  return (
    <div className="mt-4">
      <div className="text-pink-600 font-medium text-sm uppercase block mb-2">
        Actividades Educativas
      </div>
      
      <div className="space-y-1">
        {ACTIVITIES_DATA.map((activity) => (
          <div key={activity.id}>
            {/* Activity Header */}
            <div className="flex items-center">
              <button
                onClick={() => toggleActivity(activity.id)}
                className="flex items-center w-full text-left text-gray-600 hover:text-gray-800 text-sm py-1"
              >
                {expandedActivities.has(activity.id) ? (
                  <ChevronDown className="h-3 w-3 mr-1 flex-shrink-0" />
                ) : (
                  <ChevronRight className="h-3 w-3 mr-1 flex-shrink-0" />
                )}
                <Play className="h-3 w-3 mr-2 flex-shrink-0 text-pink-500" />
                <span className="truncate">{activity.name}</span>
              </button>
            </div>

            {/* Activity Link */}
            <div className="ml-4 mb-1">
              <Link 
                href={activity.path} 
                className="text-gray-500 hover:text-pink-600 text-xs block py-1 pl-4 border-l border-gray-200 hover:border-pink-300"
              >
                Ver Actividad Completa
              </Link>
            </div>

            {/* Scenes */}
            {expandedActivities.has(activity.id) && (
              <div className="ml-6 space-y-1 border-l border-gray-200 pl-2">
                {activity.scenes.map((scene) => (
                  <Link
                    key={scene.id}
                    href={scene.path}
                    className="text-gray-500 hover:text-pink-600 text-xs block py-1 pl-2 hover:bg-pink-50 rounded transition-colors"
                  >
                    {scene.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityTree;