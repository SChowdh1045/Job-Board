import ReactMarkdown from "react-markdown";

type MarkdownProps = {
    children: string;
}

export default function Markdown({ children }: MarkdownProps) {
    return (
        <ReactMarkdown
        className="space-y-3"
        components={{
            // props render children as well for the elements
            ul: (props) => <ul className="list-inside list-disc" {...props} />,
            a: (props) => <a className="text-green-500 underline" target="_blank" {...props} />,
        }}
        >
            {children}
        </ReactMarkdown>
    );
}