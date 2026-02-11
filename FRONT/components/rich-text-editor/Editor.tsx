'use client'

import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TextAlign from '@tiptap/extension-text-align'
import Image from '@tiptap/extension-image'
import Youtube from '@tiptap/extension-youtube'
import Link from '@tiptap/extension-link'
import MenuBar from './MenuBar'
import { JSONToString } from './HtmlViewer'

export default function RichTextEditor({ field, placeholder, extendedOptions = false, minh = "300px" }: { field: any, placeholder?: string, extendedOptions?: boolean, minh?: string }) {
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
                class: `min-h-[${minh}] p-4 focus:outline-none prose prose-sm sm:prose dark:prose-invert !w-full !max-w-none`,
            },
            handleDrop: (view, event, slice, moved) => {
                if (!moved && event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files[0]) {
                    const file = event.dataTransfer.files[0]
                    if (file.type.includes('image/')) {
                        const reader = new FileReader()
                        reader.onload = (readerEvent) => {
                            const src = readerEvent.target?.result as string
                            editor?.chain().focus().setImage({ src }).run()
                        }
                        reader.readAsDataURL(file)
                        return true
                    }
                }
                return false
            },
            handlePaste: (view, event, slice) => {
                const items = Array.from(event.clipboardData?.items || [])
                const imageItem = items.find(item => item.type.startsWith('image/'))

                if (imageItem) {
                    const file = imageItem.getAsFile()
                    if (file) {
                        const reader = new FileReader()
                        reader.onload = (readerEvent) => {
                            const src = readerEvent.target?.result as string
                            editor?.chain().focus().setImage({ src }).run()
                        }
                        reader.readAsDataURL(file)
                        return true
                    }
                }
                return false
            }
        },
        content: field.value ? JSONToString(field.value) : `<p>${placeholder || "Saisissez votre texte..."}</p>`,
        onUpdate: ({ editor }) => {
            const json = editor.getJSON()
            field.onChange(JSON.stringify(json))
        },
        immediatelyRender: false
    })
    return (
        <div className='w-full border border-input rounded-lg overflow-hidden dark:bg-input/30'>
            <MenuBar editor={editor} extendedOptions={extendedOptions} />
            <EditorContent editor={editor} />
        </div>
    )
}
