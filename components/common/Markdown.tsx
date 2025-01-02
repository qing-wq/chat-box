import React, { memo } from "react"
import ReactMarkdown, { Options } from "react-markdown"
import gfm from "remark-gfm"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism"
import rehypeKatex from "rehype-katex"
import remarkMath from "remark-math"
import "katex/dist/katex.min.css" // `rehype-katex` does not import the CSS for you

function Markdown({ children, className = "", ...props }: Options) {
	return (
		<ReactMarkdown
			className={`markdown prose dark:prose-invert ${className}`}
			{...props}
			remarkPlugins={[gfm, remarkMath]}
			rehypePlugins={[rehypeKatex]}
			components={{
				code(props) {
					const { children, className, node, ...rest } = props
					const match = /language-(\w+)/.exec(className || "")
					return match ? (
						<SyntaxHighlighter
							{...rest}
							PreTag="div"
							language={match[1]}
							style={tomorrow}
						>
							{String(children).replace(/\n$/, "")}
						</SyntaxHighlighter>
					) : (
						<code {...rest} className={className}>
							{children}
						</code>
					)
				},
			}}
		>
			{children}
		</ReactMarkdown>
	)
}

export default memo(Markdown)
