import { useEffect } from 'react';
import { EditorContent, useEditor, type Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';

type Props = {
    value: string;
    disabled?: boolean;
    placeholder?: string;
    onChange: (html: string) => void;
    onFocusEditor: (editor: Editor) => void;
    onBlurEditor: (event: FocusEvent) => void;
};

export function RichTextBlock({
    value,
    disabled,
    onChange,
    onFocusEditor,
    onBlurEditor,
    placeholder = 'Começa a escrever',
}: Props) {
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
                class: 'outline-none font-noticia',
            },
            handlePaste(view, event) {
                event.preventDefault();
                const text = event.clipboardData?.getData('text/plain') ?? '';
                view.dispatch(view.state.tr.insertText(text));
                return true;
            },
        },
        onFocus: ({ editor }) => {
            onFocusEditor(editor);
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        onBlur: ({ event }) => {
            onBlurEditor(event);
        }
    });

    useEffect(() => {
        if (!editor) return;

        const current = editor.getHTML();
        if (current !== value) {
            editor.commands.setContent(value, { emitUpdate: false });
        }
    }, [editor, value]);

    if (!editor) return null;

    const isEmpty = editor.getText().trim().length === 0;

    return (
        <div className='position-relative py-2'>
            {isEmpty && (
                <span
                    className='position-absolute text-muted'
                    style={{ top: 8, left: 0, pointerEvents: 'none' }}
                >
                    {placeholder}
                </span>
            )}
            <EditorContent disabled={disabled} editor={editor} />
        </div>
    );
}
