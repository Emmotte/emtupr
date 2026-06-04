import { useEffect, useRef } from 'react';
import { useCreateBlockNote } from '@blocknote/react';
import { BlockNoteView } from '@blocknote/mantine';
import { MantineProvider } from '@mantine/core';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../firebase';
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
    const cleanProjectId = projectId.trim() || 'temp';
    const storageRef = ref(storage, `project-images/${cleanProjectId}/${Date.now()}-${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    return getDownloadURL(snapshot.ref);
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
