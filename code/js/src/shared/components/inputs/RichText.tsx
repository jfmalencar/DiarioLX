import { useEffect } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';

type RichTextFieldProps = {
    value?: string;
    onChange?: (html: string) => void;
    placeholder?: string;
};

export default function RichTextField({
    value = '<p></p>',
    onChange,
    placeholder = 'Digite aqui...',
}: RichTextFieldProps) {
    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit.configure({
                heading: false,
                bulletList: false,
                orderedList: false,
                listItem: false,
                blockquote: false,
                code: false,
                codeBlock: false,
                horizontalRule: false,
            }),
            Underline,
            Link.configure({
                openOnClick: false,
                autolink: false,
                linkOnPaste: false,
                HTMLAttributes: {
                    rel: 'noopener noreferrer nofollow',
                    target: '_blank',
                },
            }),
        ],
        content: value,
        editorProps: {
            attributes: {
                class:
                    'min-h-[140px] rounded-b-xl border border-t-0 border-gray-300 p-4 outline-none',
            },
            handlePaste(view, event) {
                // Cola apenas texto puro para manter o HTML controlado
                event.preventDefault();
                const text = event.clipboardData?.getData('text/plain') ?? '';
                view.dispatch(view.state.tr.insertText(text));
                return true;
            },
        },
        onUpdate: ({ editor }) => {
            onChange?.(editor.getHTML());
        },
    });

    useEffect(() => {
        if (!editor) return;

        const current = editor.getHTML();
        if (value !== current) {
            editor.commands.setContent(value, { emitUpdate: false });
        }
    }, [value, editor]);

    if (!editor) return null;

    const setLink = () => {
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

    return (
        <div className="w-full">
            <div className="flex items-center gap-2 rounded-t-xl border border-gray-300 border-b-0 bg-gray-50 p-2">
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={`rounded px-3 py-1 text-sm border ${editor.isActive('bold') ? 'bg-gray-200' : 'bg-white'
                        }`}
                >
                    Bold
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={`rounded px-3 py-1 text-sm border ${editor.isActive('italic') ? 'bg-gray-200' : 'bg-white'
                        }`}
                >
                    Italic
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    className={`rounded px-3 py-1 text-sm border ${editor.isActive('underline') ? 'bg-gray-200' : 'bg-white'
                        }`}
                >
                    Underline
                </button>
                <button
                    type="button"
                    onClick={setLink}
                    className={`rounded px-3 py-1 text-sm border ${editor.isActive('link') ? 'bg-gray-200' : 'bg-white'
                        }`}
                >
                    Link
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().unsetLink().run()}
                    className="rounded px-3 py-1 text-sm border bg-white"
                >
                    Remover link
                </button>
            </div>
            <div className="relative">
                {!editor.getText().length && (
                    <span className="pointer-events-none absolute left-4 top-4 text-sm text-gray-400">
                        {placeholder}
                    </span>
                )}

                <EditorContent editor={editor} />
            </div>
        </div>
    );
}