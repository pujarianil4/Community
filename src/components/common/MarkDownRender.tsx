import React from "react";
import ReactMarkdown from "react-markdown";

interface MarkdownRendererProps {
  markdownContent: string;
  limit?: number | undefined;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  markdownContent,
  limit,
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

  const truncateContent = (content: string, maxLength: number) => {
    if (content.length > maxLength) {
      return content.slice(0, maxLength) + "...";
    }
    return content;
  };

  const truncatedContent = limit
    ? truncateContent(markdownContent, limit)
    : markdownContent;

  return (
    <div className='markdown_container'>
      <ReactMarkdown
        // eslint-disable-next-line react/no-children-prop
        children={truncatedContent}
        components={renderers}
      />
    </div>
  );
};

export default MarkdownRenderer;

//linkTarget="_blank"
