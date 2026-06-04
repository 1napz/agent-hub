'use client';

import { useEffect, useState } from 'react';
import { PluginDefinition } from '@/types';

export default function PluginsPage() {
  const [plugins, setPlugins] = useState<PluginDefinition[]>([]);

  useEffect(() => {
    fetch('/api/plugins')
      .then(res => res.json())
      .then(setPlugins);
  }, []);

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">🧩 Available Plugins</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {plugins.map((plugin) => (
          <div key={plugin.id} className="border rounded-lg p-6 bg-white shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold text-blue-600">{plugin.name}</h3>
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Active</span>
            </div>
            
            <p className="text-gray-600 mb-4">{plugin.description}</p>
            
            <div className="bg-gray-50 p-3 rounded text-sm">
              <p className="font-medium mb-2">Parameters:</p>
              <ul className="list-disc pl-5 text-gray-500">
                {Object.entries(plugin.parameters.properties).map(([key, val]) => (
                  <li key={key}>
                    <span className="font-mono text-gray-800">{key}</span> ({val.type})
                    {plugin.parameters.required.includes(key) && <span className="text-red-500">*</span>}
                    : {val.description}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}