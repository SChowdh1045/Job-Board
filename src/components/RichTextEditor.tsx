"use client";

import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";
import { forwardRef } from "react";
import { EditorProps } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";


// Importing 'Editor' like this because NextJS is trying to render it on the server, but it's a client-side only component
const Editor = dynamic(
  () => import("react-draft-wysiwyg").then((mod) => mod.Editor),
  { ssr: false },
);


// ABOUT editorRef: The `editorRef` prop in this code is being used to forward a ref from a parent component to the `Editor` component. The function I'm passing to `editorRef` is handling two possible types of refs that could be passed in: callback refs and object refs.
// 1. Callback Refs: If `ref` is a function, it's a callback ref. Callback refs are a more flexible way to use refs because they give you direct access to the DOM element or component instance. When the ref is attached, the function is called with the DOM element or component instance, and you can use it immediately.
// 2. Object Refs: If `ref` is an object, it's an object ref created by `React.createRef()` or `React.useRef()`. These refs have a `current` property that holds the ref's value (the DOM element or component instance).
// So, editorRef's code is checking if `ref` is a function (a callback ref) or an object (an object ref), and setting the ref's value accordingly. This makes it compatible with both types of refs.
export default forwardRef<Object, EditorProps>(
  function RichTextEditor(props, ref) {
    
    return (
      <Editor
        editorClassName={cn(
          "border rounded-md px-3 min-h-[150px] cursor-text ring-offset-background focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
          props.editorClassName,
        )}

        toolbar={{
          options: ["inline", "list", "link", "history"],
          inline: {
            options: ["bold", "italic", "underline"],
          },
        }}

        editorRef={(r) => {
          if (typeof ref === "function") {
            ref(r);
          } else if (ref) {
            ref.current = r;
          }
        }}
        
        {...props}
      />
    );
  },
);