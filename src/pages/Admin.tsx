import React, { useState } from 'react';
import { motion } from 'motion/react';
import PostTab from '../components/admin/PostTab';

export default function Admin() {
  const [activeTab, setActiveTab] = useState<'physical' | 'digital'>('physical');

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab('physical')}
          className={`px-4 py-2 rounded ${activeTab === 'physical' ? 'bg-black text-white' : 'bg-neutral-200'}`}
        >
          Physical Posts
        </button>
        <button
          onClick={() => setActiveTab('digital')}
          className={`px-4 py-2 rounded ${activeTab === 'digital' ? 'bg-black text-white' : 'bg-neutral-200'}`}
        >
          Digital Posts
        </button>
      </div>
      <PostTab category={activeTab} />
    </div>
  );
}
