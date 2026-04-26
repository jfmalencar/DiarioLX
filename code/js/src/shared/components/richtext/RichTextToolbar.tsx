import type { Editor } from '@tiptap/react';
import { useEditorState } from '@tiptap/react';

import { Undo, Redo, Bold, Italic, Underline, Link } from 'lucide-react';

type Props = {
    editor: Editor | null;
};

export function RichTextToolbar({ editor }: Props) {
    const editorState = useEditorState({
        editor,
        selector: ({ editor }) => ({
            isBold: editor?.isActive('bold'),
            isItalic: editor?.isActive('italic'),
            isUnderline: editor?.isActive('underline'),
            isLink: editor?.isActive('link'),
            canUndo: editor?.can().undo(),
            canRedo: editor?.can().redo(),
        }),
    });

    const handleSetLink = () => {
        if (!editor) return;

        const previousUrl = editor.getAttributes('link').href || '';
        const url = window.prompt('URL do link:', previousUrl);

        if (url === null) return;

        if (url.trim() === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }

        editor
            .chain()
            .focus()
            .extendMarkRange('link')
            .setLink({ href: url.trim() })
            .run();
    };

    const baseClass = 'btn btn-sm px-2 py-1 border-0 bg-transparent text-white';
    const activeClass = 'bg-white text-black font-weight-bold';
    const inactiveClass = 'text-white opacity-75';
    const disabledClass = 'opacity-25';

    return (
        <div id='richtext-toolbar' className='d-flex align-items-center gap-2'>
            <div className='border-start border-white opacity-75' style={{ height: 30 }}></div>
            <button type='button' className={`${baseClass} ${editorState?.canUndo ? '' : disabledClass}`} onClick={() => editor?.chain().focus().undo().run()} disabled={!editorState?.canUndo}>
                <Undo size={16} />
            </button>
            <button type='button' className={`${baseClass} ${editorState?.canRedo ? '' : disabledClass}`} onClick={() => editor?.chain().focus().redo().run()} disabled={!editorState?.canRedo}>
                <Redo size={16} />
            </button>
            <div className='border-start border-white opacity-75' style={{ height: 30 }}></div>
            <button
                type='button'
                className={`${baseClass} ${editorState?.isBold ? activeClass : inactiveClass} ${!editor ? disabledClass : ''}`}
                onClick={() => editor?.chain().focus().toggleBold().run()}
                disabled={!editor}
            >
                <Bold size={16} />
            </button>
            <button
                type='button'
                className={`${baseClass} ${editorState?.isItalic ? activeClass : inactiveClass} ${!editor ? disabledClass : ''}`}
                onClick={() => editor?.chain().focus().toggleItalic().run()}
                disabled={!editor}
            >
                <Italic size={16} />
            </button>
            <button
                type='button'
                className={`${baseClass} ${editorState?.isUnderline ? activeClass : inactiveClass} ${!editor ? disabledClass : ''}`}
                onClick={() => editor?.chain().focus().toggleUnderline().run()}
                disabled={!editor}
            >
                <Underline size={16} />
            </button>
            <button
                type='button'
                className={`${baseClass} ${editorState?.isLink ? activeClass : inactiveClass} ${!editor ? disabledClass : ''}`}
                onClick={handleSetLink}
                disabled={!editor}
            >
                <Link size={16} />
            </button>
            <div className='border-start border-white opacity-75' style={{ height: 30 }}></div>
        </div>
    );
}