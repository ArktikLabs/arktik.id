import { documentToReactComponents } from '@contentful/rich-text-react-renderer'
import { BLOCKS, INLINES, Document } from '@contentful/rich-text-types'
import { ReactNode } from 'react'

interface RichTextRendererProps {
  content: Document
}

const options = {
  renderNode: {
    [BLOCKS.HEADING_1]: (node: any, children: ReactNode) => (
      <h1 className="font-heading text-3xl font-bold mb-6 mt-10 first:mt-0">{children}</h1>
    ),
    [BLOCKS.HEADING_2]: (node: any, children: ReactNode) => (
      <h2 className="font-heading text-2xl font-bold mb-4 mt-10">{children}</h2>
    ),
    [BLOCKS.HEADING_3]: (node: any, children: ReactNode) => (
      <h3 className="font-heading text-xl font-bold mb-3 mt-8">{children}</h3>
    ),
    [BLOCKS.HEADING_4]: (node: any, children: ReactNode) => (
      <h4 className="font-heading text-lg font-bold mb-3 mt-6">{children}</h4>
    ),
    [BLOCKS.PARAGRAPH]: (node: any, children: ReactNode) => (
      <p className="mb-5 leading-relaxed text-ink-2">{children}</p>
    ),
    [BLOCKS.UL_LIST]: (node: any, children: ReactNode) => (
      <ul className="mb-5 ml-6 list-outside list-disc space-y-2 text-ink-2 marker:text-lime-green">{children}</ul>
    ),
    [BLOCKS.OL_LIST]: (node: any, children: ReactNode) => (
      <ol className="mb-5 ml-6 list-outside list-decimal space-y-2 text-ink-2 marker:text-lime-green">{children}</ol>
    ),
    [BLOCKS.LIST_ITEM]: (node: any, children: ReactNode) => (
      <li className="pl-2">{children}</li>
    ),
    [BLOCKS.QUOTE]: (node: any, children: ReactNode) => (
      <blockquote className="my-8 border-l-2 border-lime-green pl-5 italic text-ink">
        {children}
      </blockquote>
    ),
    [BLOCKS.HR]: () => <hr className="my-8 border-rule" />,
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
        className="text-lime-green underline underline-offset-4 transition-colors duration-200 hover:text-lime-green/80"
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