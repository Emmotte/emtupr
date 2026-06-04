import { useEffect, useRef } from 'react';
import { useCreateBlockNote } from '@blocknote/react';
import { BlockNoteView } from '@blocknote/mantine';
import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import '@blocknote/core/fonts/inter.css';
import '@blocknote/mantine/style.css';

interface NotionEditorProps {
  markdown: string;
  onChange: (markdown: string) => void;
  projectId: string;
  theme: 'light' | 'dark';
}

export default function NotionEditor({ markdown, onChange, projectId, theme }: NotionEditorProps) {
  const lastProjectIdRef = useRef<string>('');

  const uploadFile = async (file: File): Promise<string> => {
    const token = import.meta.env.VITE_GITHUB_TOKEN;
    if (!token) {
      throw new Error('GitHub token not configured (VITE_GITHUB_TOKEN). Deploy with CONTENTS_API_TOKEN secret set.');
    }

    // Encode file to base64
    const buffer = await file.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    const base64 = btoa(binary);

    const ext = file.name.split('.').pop() || 'jpg';
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}.${ext}`;

    const response = await fetch(
      `https://api.github.com/repos/Emmotte/emtupr/contents/public/uploads/${filename}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: `Upload ${filename}`,
          content: base64,
          branch: 'main',
        }),
      }
    );

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || 'GitHub upload failed');
    }

    return `https://raw.githubusercontent.com/Emmotte/emtupr/main/public/uploads/${filename}`;
  };

  const editor = useCreateBlockNote({
    uploadFile,
  });

  // Handle loading initial markdown blocks when switching projects or starting a new one
  useEffect(() => {
    async function loadMarkdown() {
      if (lastProjectIdRef.current !== projectId) {
        lastProjectIdRef.current = projectId;
        if (markdown) {
          try {
            const blocks = await editor.tryParseMarkdownToBlocks(markdown);
            editor.replaceBlocks(editor.document, blocks);
          } catch (e) {
            console.error("Failed to parse markdown to blocks", e);
          }
        } else {
          // Reset document
          editor.replaceBlocks(editor.document, [
            {
              id: 'init-block',
              type: 'paragraph',
              content: []
            }
          ]);
        }
      }
    }
    loadMarkdown();
  }, [projectId, markdown, editor]);

  const handleEditorChange = async () => {
    // Generate Markdown representation
    try {
      const markdownString = await editor.blocksToMarkdownLossy(editor.document);
      onChange(markdownString);
    } catch (e) {
      console.error("Failed to generate markdown from blocks", e);
    }
  };

  return (
    <MantineProvider>
      <div className={`border rounded min-h-[350px] p-2 ${
        theme === 'dark'
          ? 'border-neutral-800 bg-[#0d0d0d] text-white'
          : 'border-black bg-white text-black shadow-[inset_1px_1px_0_#808080]'
      }`}>
        <BlockNoteView
          editor={editor}
          onChange={handleEditorChange}
          theme={theme === 'dark' ? 'dark' : 'light'}
        />
      </div>
    </MantineProvider>
  );
}
