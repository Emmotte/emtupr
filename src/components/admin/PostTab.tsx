import React, { useState } from 'react';
import { collection, addDoc, deleteDoc, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';

interface PostTabProps {
  category: 'physical' | 'digital';
}

export default function PostTab({ category }: PostTabProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleAddPost = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'posts'), {
        title,
        description,
        category,
        createdAt: new Date()
      });
      setTitle('');
      setDescription('');
      alert('Post created successfully!');
    } catch (error) {
      console.error(error);
    }
  };

  const handleBulkDelete = async () => {
    if (!window.confirm('Are you sure you want to delete all posts in this category?')) return;
    try {
      const postsSnapshot = await getDocs(collection(db, 'posts'));
      postsSnapshot.forEach(async (doc) => {
        if (doc.data().category === category) {
          await deleteDoc(doc.ref);
        }
      });
      alert('Posts deleted successfully!');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleAddPost} className="p-6 border rounded shadow">
        <input className="w-full mb-4 p-2 border" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
        <textarea className="w-full mb-4 p-2 border" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Create Post</button>
      </form>
      <button onClick={handleBulkDelete} className="bg-red-500 text-white px-4 py-2 rounded">Delete All {category} Posts</button>
    </div>
  );
}
