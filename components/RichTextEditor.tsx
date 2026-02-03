import React, { useEffect, useRef } from 'react';
import { Bold, Italic, Underline, List, ListOrdered, Link as LinkIcon, Heading2, Quote, Undo, Redo, Image as ImageIcon, BookOpen } from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  className?: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange, className }) => {
  const editorRef = useRef<HTMLDivElement>(null);

  // Initialize content once when the component mounts or value changes externally (e.g. switching posts)
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || '';
    }
  }, [value]);

  const execCommand = (command: string, value: string | undefined = undefined) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const addLink = () => {
    const url = prompt('Enter URL:');
    if (url) execCommand('createLink', url);
  };

  const addImage = () => {
    const url = prompt('Enter Image URL:');
    if (url) {
        execCommand('insertImage', url);
    }
  };

  const addMustRead = () => {
      const text = prompt('Enter "Must Read" Text/Title:');
      const url = prompt('Enter URL for the article:');
      
      if (text && url) {
          const html = `
            <div class="my-6 p-4 bg-brand-50 border-l-4 border-brand-600 rounded-r-lg">
                <span class="text-xs font-bold text-brand-600 uppercase tracking-wide block mb-1">Must Read</span>
                <a href="${url}" class="text-lg font-bold text-gray-900 hover:text-brand-700 hover:underline leading-tight">
                    ${text}
                </a>
            </div>
            <p><br></p>
          `;
          document.execCommand('insertHTML', false, html);
          if (editorRef.current) onChange(editorRef.current.innerHTML);
      }
  };

  const ToolbarButton = ({ icon: Icon, command, onClick, arg, title }: any) => (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        if (onClick) onClick();
        else command === 'createLink' ? addLink() : execCommand(command, arg);
      }}
      className="p-2 text-gray-600 hover:bg-gray-200 rounded transition"
      title={title}
    >
      <Icon className="h-4 w-4" />
    </button>
  );

  return (
    <div className={`border border-gray-300 rounded-lg overflow-hidden bg-white ${className}`}>
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 p-2 bg-gray-50 border-b border-gray-200">
        <ToolbarButton icon={Bold} command="bold" title="Bold" />
        <ToolbarButton icon={Italic} command="italic" title="Italic" />
        <ToolbarButton icon={Underline} command="underline" title="Underline" />
        <div className="w-px h-6 bg-gray-300 mx-1 self-center"></div>
        <ToolbarButton icon={Heading2} command="formatBlock" arg="H3" title="Heading" />
        <ToolbarButton icon={Quote} command="formatBlock" arg="BLOCKQUOTE" title="Quote" />
        <div className="w-px h-6 bg-gray-300 mx-1 self-center"></div>
        <ToolbarButton icon={List} command="insertUnorderedList" title="Bullet List" />
        <ToolbarButton icon={ListOrdered} command="insertOrderedList" title="Numbered List" />
        <div className="w-px h-6 bg-gray-300 mx-1 self-center"></div>
        <ToolbarButton icon={LinkIcon} command="createLink" title="Link" />
        <ToolbarButton icon={ImageIcon} onClick={addImage} title="Insert Image" />
        <ToolbarButton icon={BookOpen} onClick={addMustRead} title="Insert 'Must Read' Box" />
        <div className="flex-grow"></div>
        <ToolbarButton icon={Undo} command="undo" title="Undo" />
        <ToolbarButton icon={Redo} command="redo" title="Redo" />
      </div>

      {/* Editable Area */}
      <div
        ref={editorRef}
        className="p-4 min-h-[300px] outline-none prose max-w-none prose-img:rounded-xl prose-img:shadow-sm"
        contentEditable
        onInput={handleInput}
        style={{ minHeight: '300px' }}
      ></div>
      
      {/* Helper text */}
      <div className="bg-gray-50 px-4 py-2 text-xs text-gray-400 border-t flex justify-between">
        <span>Tip: Highlight text to apply styles.</span>
        <span>Use 'Must Read' icon to insert callouts.</span>
      </div>
    </div>
  );
};