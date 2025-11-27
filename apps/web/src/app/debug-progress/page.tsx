'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

interface SceneInfo {
  slug: string;
  name: string;
  order_number: number;
}

interface ProgressInfo {
  activity_slug: string;
  activity_name: string;
  scene_slug: string;
  scene_name: string;
  scene_order: number;
  status: string;
  completion_percentage: number;
  completed_at: string | null;
}

interface StudentInfo {
  id: number;
  name: string;
  user_id: number;
}

interface DebugData {
  current_user_id: string;
  current_student: StudentInfo | null;
  activities_count: number;
  scenes_count: number;
  scenes_for_actividad1: SceneInfo[];
  user_progress: ProgressInfo[];
}

export default function DebugProgressPage() {
  const { data: session } = useSession();
  const [debugData, setDebugData] = useState<DebugData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDebugData();
  }, []);

  const fetchDebugData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/debug/database');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setDebugData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-4">Debug: Student Progress</h1>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-4 text-red-600">Error</h1>
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-6">Debug: Student Progress</h1>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Session Info</h2>
          <div className="bg-gray-50 p-4 rounded">
            <p><strong>User ID:</strong> {session?.user?.id || 'Not logged in'}</p>
            <p><strong>Email:</strong> {session?.user?.email || 'N/A'}</p>
            <p><strong>Name:</strong> {session?.user?.name || 'N/A'}</p>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Student Record</h2>
          <div className="bg-gray-50 p-4 rounded">
            {debugData?.current_student ? (
              <div>
                <p><strong>Student ID:</strong> {debugData.current_student.id}</p>
                <p><strong>Name:</strong> {debugData.current_student.name}</p>
                <p><strong>User ID:</strong> {debugData.current_student.user_id}</p>
              </div>
            ) : (
              <p className="text-red-500">No student record found for this user!</p>
            )}
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Database Statistics</h2>
          <div className="bg-gray-50 p-4 rounded">
            <p><strong>Total Activities:</strong> {debugData?.activities_count}</p>
            <p><strong>Total Scenes:</strong> {debugData?.scenes_count}</p>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Actividad 1 Scenes</h2>
          <div className="bg-gray-50 p-4 rounded">
            <table className="min-w-full">
              <thead>
                <tr>
                  <th className="text-left">Order</th>
                  <th className="text-left">Slug</th>
                  <th className="text-left">Name</th>
                </tr>
              </thead>
              <tbody>
                {debugData?.scenes_for_actividad1?.map((scene: SceneInfo) => (
                  <tr key={scene.slug} className="border-t">
                    <td className="py-1">{scene.order_number}</td>
                    <td className="py-1">{scene.slug}</td>
                    <td className="py-1">{scene.name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Your Progress</h2>
          <div className="bg-gray-50 p-4 rounded">
            {debugData?.user_progress && debugData.user_progress.length > 0 ? (
              <table className="min-w-full">
                <thead>
                  <tr>
                    <th className="text-left">Activity</th>
                    <th className="text-left">Scene</th>
                    <th className="text-left">Order</th>
                    <th className="text-left">Status</th>
                    <th className="text-left">Completion %</th>
                    <th className="text-left">Completed At</th>
                  </tr>
                </thead>
                <tbody>
                  {debugData.user_progress.map((progress: ProgressInfo, idx: number) => (
                    <tr key={idx} className={`border-t ${progress.status === 'completed' ? 'bg-green-50' : ''}`}>
                      <td className="py-2">{progress.activity_slug}</td>
                      <td className="py-2">{progress.scene_slug}</td>
                      <td className="py-2">{progress.scene_order}</td>
                      <td className="py-2">
                        <span className={`px-2 py-1 rounded text-xs ${
                          progress.status === 'completed' ? 'bg-green-200 text-green-800' :
                          progress.status === 'in_progress' ? 'bg-yellow-200 text-yellow-800' :
                          'bg-gray-200 text-gray-800'
                        }`}>
                          {progress.status}
                        </span>
                      </td>
                      <td className="py-2">{progress.completion_percentage}%</td>
                      <td className="py-2">{progress.completed_at ? new Date(progress.completed_at).toLocaleString() : '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-orange-500">No progress records found!</p>
            )}
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={fetchDebugData}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Refresh Data
          </button>
        </div>

        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Raw JSON Data</h2>
          <pre className="bg-gray-900 text-green-400 p-4 rounded overflow-auto max-h-96 text-xs">
            {JSON.stringify(debugData, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}
