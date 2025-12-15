'use client';

import React, { useState, useEffect } from 'react';
import { getLocalErrors, clearLocalErrors, exportLogs } from '../../utils/errorLogger';

interface ErrorLogPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const ErrorLogPanel: React.FC<ErrorLogPanelProps> = ({ isOpen, onClose }) => {
  const [logs, setLogs] = useState(getLocalErrors());
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    if (isOpen) {
      setLogs(getLocalErrors());
    }
  }, [isOpen]);

  const handleClear = () => {
    if (confirm('¿Estás seguro de que quieres borrar todos los registros de errores?')) {
      clearLocalErrors();
      setLogs([]);
    }
  };

  const handleExport = () => {
    exportLogs();
  };

  const handleRefresh = () => {
    setLogs(getLocalErrors());
  };

  const filteredLogs = logs.filter((log) => {
    if (filter === 'all') return true;
    return log.type === filter;
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gray-50 rounded-t-lg">
          <h2 className="text-xl font-bold text-gray-800">Registros de Errores</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Controls */}
        <div className="p-4 border-b border-gray-200 flex flex-wrap gap-2 items-center">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded text-sm"
          >
            <option value="all">Todos ({logs.length})</option>
            <option value="video_error">
              Errores de Video ({logs.filter((l) => l.type === 'video_error').length})
            </option>
            <option value="network_error">
              Errores de Red ({logs.filter((l) => l.type === 'network_error').length})
            </option>
            <option value="component_error">
              Errores de Componente ({logs.filter((l) => l.type === 'component_error').length})
            </option>
            <option value="performance_warning">
              Advertencias de Rendimiento (
              {logs.filter((l) => l.type === 'performance_warning').length})
            </option>
          </select>

          <div className="flex-1"></div>

          <button
            onClick={handleRefresh}
            className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
          >
            Actualizar
          </button>
          <button
            onClick={handleExport}
            className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
          >
            Exportar
          </button>
          <button
            onClick={handleClear}
            className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
          >
            Limpiar
          </button>
        </div>

        {/* Logs list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredLogs.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              No hay registros de errores
            </div>
          ) : (
            filteredLogs
              .slice()
              .reverse()
              .map((log, index) => (
                <div
                  key={index}
                  className={`border rounded p-3 ${
                    log.type === 'video_error'
                      ? 'border-red-300 bg-red-50'
                      : log.type === 'network_error'
                      ? 'border-orange-300 bg-orange-50'
                      : log.type === 'performance_warning'
                      ? 'border-yellow-300 bg-yellow-50'
                      : 'border-gray-300 bg-gray-50'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          log.type === 'video_error'
                            ? 'bg-red-500 text-white'
                            : log.type === 'network_error'
                            ? 'bg-orange-500 text-white'
                            : log.type === 'performance_warning'
                            ? 'bg-yellow-500 text-white'
                            : 'bg-gray-500 text-white'
                        }`}
                      >
                        {log.type}
                      </span>
                      <span className="text-xs text-gray-600">
                        {new Date(log.timestamp).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <p className="font-semibold text-gray-800 mb-2">{log.message}</p>

                  {log.details && Object.keys(log.details).length > 0 && (
                    <details className="text-sm">
                      <summary className="cursor-pointer text-blue-600 hover:text-blue-800">
                        Ver detalles
                      </summary>
                      <pre className="mt-2 p-2 bg-white rounded border border-gray-200 overflow-x-auto text-xs">
                        {JSON.stringify(log.details, null, 2)}
                      </pre>
                    </details>
                  )}

                  <div className="mt-2 text-xs text-gray-600">
                    <div className="truncate">
                      <strong>URL:</strong> {log.url}
                    </div>
                    {log.deviceInfo && (
                      <div>
                        <strong>Dispositivo:</strong> {log.deviceInfo.platform}
                        {log.deviceInfo.memory && ` | RAM: ${log.deviceInfo.memory}GB`}
                        {log.deviceInfo.connection && ` | Red: ${log.deviceInfo.connection}`}
                      </div>
                    )}
                  </div>
                </div>
              ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-gray-200 bg-gray-50 rounded-b-lg text-xs text-gray-600">
          💡 Los registros se guardan localmente en tu dispositivo. Usa &quot;Exportar&quot; para
          compartirlos con soporte técnico.
        </div>
      </div>
    </div>
  );
};

export default ErrorLogPanel;
