import { documentToReactComponents } from '@contentful/rich-text-react-renderer'
import { BLOCKS, INLINES, Document } from '@contentful/rich-text-types'
import { ReactNode } from 'react'

interface RichTextRendererProps {
  content: Document
}

const options = {
  renderNode: {
    [BLOCKS.HEADING_1]: (node: any, children: ReactNode) => (
      <h1 className="text-3xl font-bold mb-6 mt-8 first:mt-0">{children}</h1>
    ),
    [BLOCKS.HEADING_2]: (node: any, children: ReactNode) => (
      <h2 className="text-2xl font-bold mb-4 mt-6">{children}</h2>
    ),
    [BLOCKS.HEADING_3]: (node: any, children: ReactNode) => (
      <h3 className="text-xl font-bold mb-3 mt-5">{children}</h3>
    ),
    [BLOCKS.HEADING_4]: (node: any, children: ReactNode) => (
      <h4 className="text-lg font-bold mb-3 mt-4">{children}</h4>
    ),
    [BLOCKS.PARAGRAPH]: (node: any, children: ReactNode) => (
      <p className="mb-4 leading-relaxed">{children}</p>
    ),
    [BLOCKS.UL_LIST]: (node: any, children: ReactNode) => (
      <ul className="list-disc list-outside ml-6 mb-4 space-y-1">{children}</ul>
    ),
    [BLOCKS.OL_LIST]: (node: any, children: ReactNode) => (
      <ol className="list-decimal list-outside ml-6 mb-4 space-y-1">{children}</ol>
    ),
    [BLOCKS.LIST_ITEM]: (node: any, children: ReactNode) => (
      <li className="pl-2">{children}</li>
    ),
    [BLOCKS.QUOTE]: (node: any, children: ReactNode) => (
      <blockquote className="border-l-4 border-blue-500 pl-4 italic my-6 text-gray-300">
        {children}
      </blockquote>
    ),
    [BLOCKS.HR]: () => <hr className="my-8 border-gray-700" />,
    [BLOCKS.EMBEDDED_ASSET]: (node: any) => {
      const { file, title } = node.data.target.fields
      if (file?.contentType?.startsWith('image/')) {
        return (
          <img
            src={file.url}
            alt={title || ''}
            className="w-full h-auto rounded-lg my-6"
          />
        )
      }
      return null
    },
    [INLINES.HYPERLINK]: (node: any, children: ReactNode) => (
      <a
        href={node.data.uri}
        className="text-blue-400 hover:text-blue-300 underline transition-colors"
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    ),
  },
}

export function RichTextRenderer({ content }: RichTextRendererProps) {
  return <div>{documentToReactComponents(content, options)}</div>
}