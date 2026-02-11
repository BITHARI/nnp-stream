import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Youtube from "@tiptap/extension-youtube";
import { EditorContent, useEditor, } from "@tiptap/react";
import { memo } from "react";

export function JSONToString(str: string) {
    try {
        return JSON.parse(str);
    } catch (e) {
        return `<p>${str}</p>`;
    }
}

function HtmlViewer({ json }: { json: JSON }) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            TextAlign.configure({ types: ['heading', 'paragraph'] }),
            Image.configure({
                HTMLAttributes: {
                    class: 'w-full mx-auto max-w-3xl rounded-lg'
                }
            }),
            Link.configure({
                openOnClick: false,
                autolink: true,
                linkOnPaste: true,
                HTMLAttributes: {
                    class: 'text-blue-600 hover:text-blue-800 underline cursor-pointer',
                    target: '_blank',
                    rel: 'noopener noreferrer',
                },
            }),
            Youtube.configure({
                HTMLAttributes: {
                    class: 'w-full aspect-video'
                },
                controls: false,
                nocookie: true
            })
        ],
        editorProps: {
            attributes: {
                class: 'min-h-[300px] focus:outline-none prose prose-sm sm:prose dark:prose-invert !w-full !max-w-none',
            }
        },
        editable: false,
        content: JSONToString(json as unknown as string),
        immediatelyRender: false
    })
    return <EditorContent editor={editor} />
}

export default memo(HtmlViewer)
