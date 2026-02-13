import { type Editor } from '@tiptap/react'
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from '../ui/tooltip'
import { Toggle } from '../ui/toggle'
import { AlignCenter, AlignJustify, AlignLeft, AlignRight, Bold, Heading1, Heading2, Heading3, ImageIcon, Italic, LinkIcon, ListIcon, ListOrderedIcon, Redo, Strikethrough, Undo, Unlink, Upload, Youtube } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '../ui/button'
import { useRef } from 'react'

interface iAppProps {
    editor: Editor | null,
    extendedOptions?: boolean
}

export default function MenuBar({ editor, extendedOptions = false }: iAppProps) {
    const fileInputRef = useRef<HTMLInputElement>(null)
    if (!editor) return null

    const addImageFromFile = () => {
        fileInputRef.current?.click()
    }

    const addYouTubeVideo = () => {
        const url = window.prompt('URL de la vidéo YouTube:')
        if (url) {
            editor.chain().focus().setYoutubeVideo({ src: url }).run()
        }
    }

    const handleSetLink = () => {
        const previousUrl = editor.getAttributes('link').href
        const url = window.prompt('URL du lien:', previousUrl)

        // cancelled
        if (url === null) {
            return
        }

        // empty
        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run()
            return
        }

        // update link
        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
    }

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader()
            reader.onload = (e) => {
                const src = e.target?.result as string
                editor.chain().focus().setImage({ src }).run()
            }
            reader.readAsDataURL(file)
        }
        // Reset input value to allow selecting the same file again
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }
    return (
        <div className='border border-input border-t-0 border-x-0 rounded-t-lg bg-card flex flex-wrap gap-1 items-center'>
            <TooltipProvider>
                <div className='flex flex-wrap gap-1'>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle
                                size={"sm"}
                                pressed={editor.isActive('bold')}
                                onPressedChange={() => editor.chain().focus().toggleBold().run()}
                                className={cn(editor.isActive('bold') && 'bg-muted text-primary-foreground')}
                            >
                                <Bold />
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent>Gras</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle
                                size={"sm"}
                                pressed={editor.isActive('italic')}
                                onPressedChange={() => editor.chain().focus().toggleItalic().run()}
                                className={cn(editor.isActive('italic') && 'bg-muted text-primary-foreground')}
                            >
                                <Italic />
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent>Italique</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle
                                size={"sm"}
                                pressed={editor.isActive('strike')}
                                onPressedChange={() => editor.chain().focus().toggleStrike().run()}
                                className={cn(editor.isActive('strike') && 'bg-muted text-primary-foreground')}
                            >
                                <Strikethrough />
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent>Barré</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle
                                size={"sm"}
                                pressed={editor.isActive('heading', { level: 1 })}
                                onPressedChange={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                                className={cn(editor.isActive('heading', { level: 1 }) && 'bg-muted text-primary-foreground')}
                            >
                                <Heading1 />
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent>Titre 1</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle
                                size={"sm"}
                                pressed={editor.isActive('heading', { level: 2 })}
                                onPressedChange={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                                className={cn(editor.isActive('heading', { level: 2 }) && 'bg-muted text-primary-foreground')}
                            >
                                <Heading2 />
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent>Titre 2</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle
                                size={"sm"}
                                pressed={editor.isActive('heading', { level: 3 })}
                                onPressedChange={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                                className={cn(editor.isActive('heading', { level: 3 }) && 'bg-muted text-primary-foreground')}
                            >
                                <Heading3 />
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent>Titre 3</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle
                                size={"sm"}
                                pressed={editor.isActive('bulletList')}
                                onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
                                className={cn(editor.isActive('bulletList') && 'bg-muted text-primary-foreground')}
                            >
                                <ListIcon />
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent>Liste à puce</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle
                                size={"sm"}
                                pressed={editor.isActive('orderedList')}
                                onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
                                className={cn(editor.isActive('orderedList') && 'bg-muted text-primary-foreground')}
                            >
                                <ListOrderedIcon />
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent>Liste numérotée</TooltipContent>
                    </Tooltip>
                </div>
                {extendedOptions && <>
                    <div className="w-px h-6 bg-border mx-2" />
                    <div className="flex flex-wrap gap-1">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    size={"sm"}
                                    variant={"ghost"}
                                    type='button'
                                    onClick={handleSetLink}
                                    className={cn(editor.isActive('link') && 'bg-muted')}
                                >
                                    <LinkIcon />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>Ajouter/modifier un lien</TooltipContent>
                        </Tooltip>

                        {editor.isActive('link') && (
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        size={"sm"}
                                        variant={"ghost"}
                                        type='button'
                                        onClick={() => editor.chain().focus().unsetLink().run()}
                                    >
                                        <Unlink />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>Supprimer le lien</TooltipContent>
                            </Tooltip>
                        )}
                    </div>
                </>}
                <div className="w-px h-6 bg-border mx-2" />
                <div className="flex flex-wrap gap-1">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle
                                size={"sm"}
                                pressed={editor.isActive({ textAlign: 'left' })}
                                onPressedChange={() => editor.chain().focus().setTextAlign('left').run()}
                                className={cn(editor.isActive({ textAlign: 'left' }) && 'bg-muted text-primary-foreground')}
                            >
                                <AlignLeft />
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent>Aligner à gauche</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle
                                size={"sm"}
                                pressed={editor.isActive({ textAlign: 'center' })}
                                onPressedChange={() => editor.chain().focus().setTextAlign('center').run()}
                                className={cn(editor.isActive({ textAlign: 'center' }) && 'bg-muted text-primary-foreground')}
                            >
                                <AlignCenter />
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent>Centrer</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle
                                size={"sm"}
                                pressed={editor.isActive({ textAlign: 'right' })}
                                onPressedChange={() => editor.chain().focus().setTextAlign('right').run()}
                                className={cn(editor.isActive({ textAlign: 'right' }) && 'bg-muted text-primary-foreground')}
                            >
                                <AlignRight />
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent>Aligner à droite</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle
                                size={"sm"}
                                pressed={editor.isActive({ textAlign: 'justify' })}
                                onPressedChange={() => editor.chain().focus().setTextAlign('justify').run()}
                                className={cn(editor.isActive({ textAlign: 'justify' }) && 'bg-muted text-primary-foreground')}
                            >
                                <AlignJustify />
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent>Justifier</TooltipContent>
                    </Tooltip>
                </div>
                {extendedOptions && <>
                    <div className="w-px h-6 bg-border mx-2" />
                    <div className="flex flex-wrap gap-1">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    size={"sm"}
                                    variant={"ghost"}
                                    type='button'
                                    onClick={addImageFromFile}
                                >
                                    <ImageIcon />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>Ajouter une image</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    size={"sm"}
                                    variant={"ghost"}
                                    type='button'
                                    onClick={addYouTubeVideo}
                                >
                                    <Youtube />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>Insérer vidéo YouTube</TooltipContent>
                        </Tooltip>
                    </div>
                </>}
                <div className="w-px h-6 bg-border mx-2" />
                <div className="flex flex-wrap gap-1">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                size={"sm"}
                                variant={"ghost"}
                                type='button'
                                onClick={() => editor.chain().focus().undo().run()}
                                disabled={!editor.can().undo()}
                            >
                                <Undo />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Annuler</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                size={"sm"}
                                variant={"ghost"}
                                type='button'
                                onClick={() => editor.chain().focus().redo().run()}
                                disabled={!editor.can().redo()}
                            >
                                <Redo />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Restaurer</TooltipContent>
                    </Tooltip>
                </div>
            </TooltipProvider>
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
            />
        </div>
    )
}
