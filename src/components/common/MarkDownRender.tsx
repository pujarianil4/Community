import React from "react";
import ReactMarkdown from "react-markdown";

interface MarkdownRendererProps {
  markdownContent: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  markdownContent,
}) => {
  // Custom renderer for links to prevent nested <a> tags
  const renderers = {
    link: (props: any) => {
      return (
        <a href={props.href} target='_blank' rel='noreferrer'>
          {props.children}
        </a>
      );
    },
  };

  return (
    <div className='markdown_container'>
      <ReactMarkdown
        // eslint-disable-next-line react/no-children-prop
        children={markdownContent}
        components={renderers}
      />
    </div>
  );
};

export default MarkdownRenderer;

//linkTarget="_blank"
