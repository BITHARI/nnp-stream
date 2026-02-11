import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import { generateHTML } from "@tiptap/react";
import { useMemo } from "react";

export function useHtml(json: JSON) {
    const output = useMemo(() => {
        if (!json) return null;
        return generateHTML(json, [
            StarterKit,
            TextAlign.configure({
                types: ["heading", "paragraph"],
            })
        ]);
    }, [json]);
    return output;
}