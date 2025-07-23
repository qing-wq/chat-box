import React from 'react';
import { User, Bot, Copy, Check } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import remarkBreaks from 'remark-breaks';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Message } from '../../types';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import 'katex/dist/katex.min.css';

interface MessageItemProps {
  message: Message;
  isStreaming?: boolean;
}

const MessageItem: React.FC<MessageItemProps> = ({
  message,
  isStreaming = false,
}) => {
  const isUser = message.role === 'user';
  const [copied, setCopied] = React.useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div
      className={cn(
        'py-6 px-4 sm:px-6 transition-all duration-200 border-b border-border/50 last:border-b-0',
        !isUser && 'bg-muted/20'
      )}
    >
      <div className="max-w-4xl mx-auto">
        <div
          className={cn('flex items-start gap-4', isUser && 'flex-row-reverse')}
        >
          {/* Avatar */}
          {/* 仅AI消息显示头像 */}
          {!isUser && (
            <div className="flex-shrink-0">
              <Avatar
                className={cn(
                  'h-8 w-8 transition-all duration-200',
                  'bg-primary hover:bg-primary/90'
                )}
              >
                <AvatarFallback className="text-white">
                  <Bot className="w-4 h-4" />
                </AvatarFallback>
              </Avatar>
            </div>
          )}

          {/* Message content */}
          <div className={cn('flex-1 min-w-0', isUser && 'text-right')}>
            {/* 仅AI消息显示昵称和复制按钮 */}
            {!isUser ? (
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-primary">
                  AI助手
                </span>
                {/* Copy button */}
                {!isStreaming && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={copyToClipboard}
                    className={cn(
                      'h-6 w-6 p-0 transition-all duration-200',
                      copied
                        ? 'text-green-500'
                        : 'text-muted-foreground hover:text-primary'
                    )}
                  >
                    {copied ? (
                      <Check className="w-3 h-3" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </Button>
                )}
              </div>
            ) : null}

            {/* Message content */}
            <div
              className={cn(
                isUser
                  ? 'inline-block bg-blue-50 dark:bg-blue-900/20 rounded-xl px-4 py-3 border border-blue-200 dark:border-blue-800 prose prose-sm sm:prose dark:prose-invert max-w-[70%] prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground prose-code:text-foreground ml-auto'
                  : 'max-w-none'
              )}
            >
              {isStreaming && !isUser && !message.content && (
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-primary rounded-full animate-bounce"
                      style={{ animationDelay: '0.1s' }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-primary rounded-full animate-bounce"
                      style={{ animationDelay: '0.2s' }}
                    ></div>
                  </div>
                  <span className="text-muted-foreground text-sm">
                    正在思考...
                  </span>
                </div>
              )}

              {/* Streaming content with Markdown */}
              {isStreaming && !isUser && message.content && (
                <div className="relative">
                  <ReactMarkdown
                    remarkPlugins={[remarkMath, remarkBreaks, remarkGfm]}
                    rehypePlugins={[rehypeKatex]}
                    skipHtml={false}
                    components={{
                      code({ inline, className, children, ...props }: any) {
                        const match = /language-(\w+)/.exec(className || '');
                        const codeContent = String(children).replace(/\n$/, '');

                        return !inline && match ? (
                          <div className="my-4 group">
                            <div className="flex items-center justify-between bg-muted rounded-t-lg px-4 py-2 border border-b-0">
                              <span className="text-xs text-muted-foreground font-mono font-medium">
                                {match[1].toUpperCase()}
                              </span>
                            </div>
                            <div className="rounded-t-none border border-t-0">
                              <SyntaxHighlighter
                                style={vscDarkPlus}
                                language={match[1]}
                                PreTag="div"
                                className="text-sm"
                                customStyle={{
                                  margin: 0,
                                  borderRadius: 0,
                                  background: 'hsl(var(--muted))',
                                }}
                              >
                                {codeContent}
                              </SyntaxHighlighter>
                            </div>
                          </div>
                        ) : (
                          <code
                            className={cn(
                              className,
                              'bg-muted px-1.5 py-0.5 rounded text-sm font-mono'
                            )}
                            {...props}
                          >
                            {children}
                          </code>
                        );
                      },
                      p({ children }) {
                        return (
                          <p className="mb-4 last:mb-0 leading-relaxed text-foreground">
                            {children}
                          </p>
                        );
                      },
                      table({ children }) {
                        return (
                          <div className="my-6 overflow-x-auto rounded-lg border border-border shadow-sm">
                            <table className="min-w-full divide-y divide-border">
                              {children}
                            </table>
                          </div>
                        );
                      },
                      thead({ children }) {
                        return (
                          <thead className="bg-muted/50">{children}</thead>
                        );
                      },
                      tbody({ children }) {
                        return (
                          <tbody className="divide-y divide-border bg-background">
                            {children}
                          </tbody>
                        );
                      },
                      tr({ children }) {
                        return (
                          <tr className="hover:bg-muted/30 transition-colors">
                            {children}
                          </tr>
                        );
                      },
                      th({ children }) {
                        return (
                          <th className="px-4 py-3 text-left text-sm font-semibold text-foreground border-b border-border bg-muted/80">
                            {children}
                          </th>
                        );
                      },
                      td({ children }) {
                        return (
                          <td className="px-4 py-3 text-sm text-foreground whitespace-nowrap">
                            {children}
                          </td>
                        );
                      },
                    }}
                  >
                    {message.content}
                  </ReactMarkdown>
                  {/* Streaming cursor */}
                  <span className="inline-block w-2 h-5 bg-primary animate-pulse ml-1"></span>
                </div>
              )}

              {/* Regular content */}
              {message.content && (!isStreaming || isUser) && (
                <ReactMarkdown
                  remarkPlugins={[remarkMath, remarkBreaks, remarkGfm]}
                  rehypePlugins={[rehypeKatex]}
                  skipHtml={false}
                  components={{
                    code({ inline, className, children, ...props }: any) {
                      const match = /language-(\w+)/.exec(className || '');
                      const codeContent = String(children).replace(/\n$/, '');

                      return !inline && match ? (
                        <div className="my-4 group">
                          <div className="flex items-center justify-between bg-muted rounded-t-lg px-4 py-2 border border-b-0">
                            <span className="text-xs text-muted-foreground font-mono font-medium">
                              {match[1].toUpperCase()}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() =>
                                navigator.clipboard.writeText(codeContent)
                              }
                            >
                              <Copy className="w-3 h-3" />
                            </Button>
                          </div>
                          <div className="rounded-t-none border border-t-0 overflow-hidden">
                            <SyntaxHighlighter
                              style={vscDarkPlus}
                              language={match[1]}
                              PreTag="div"
                              className="text-sm"
                              customStyle={{
                                margin: 0,
                                borderRadius: 0,
                                background: 'hsl(var(--muted))',
                              }}
                            >
                              {codeContent}
                            </SyntaxHighlighter>
                          </div>
                        </div>
                      ) : (
                        <code
                          className={cn(
                            className,
                            'bg-muted px-1.5 py-0.5 rounded text-sm font-mono'
                          )}
                          {...props}
                        >
                          {children}
                        </code>
                      );
                    },
                    p({ children }) {
                      return (
                        <p className="mb-4 last:mb-0 leading-relaxed text-foreground">
                          {children}
                        </p>
                      );
                    },
                    h1({ children }) {
                      return (
                        <h1 className="text-2xl font-bold mb-4 mt-6 first:mt-0 text-foreground border-b pb-2">
                          {children}
                        </h1>
                      );
                    },
                    h2({ children }) {
                      return (
                        <h2 className="text-xl font-semibold mb-3 mt-5 first:mt-0 text-foreground">
                          {children}
                        </h2>
                      );
                    },
                    h3({ children }) {
                      return (
                        <h3 className="text-lg font-medium mb-2 mt-4 first:mt-0 text-foreground">
                          {children}
                        </h3>
                      );
                    },
                    h4({ children }) {
                      return (
                        <h4 className="text-base font-medium mb-2 mt-3 first:mt-0 text-foreground">
                          {children}
                        </h4>
                      );
                    },
                    blockquote({ children }) {
                      return (
                        <blockquote className="border-l-4 border-primary pl-4 my-4 italic bg-muted/50 py-3 rounded-r-lg">
                          <div className="text-muted-foreground">
                            {children}
                          </div>
                        </blockquote>
                      );
                    },
                    ul({ children }) {
                      return (
                        <ul className="list-disc list-inside mb-4 space-y-1 text-foreground">
                          {children}
                        </ul>
                      );
                    },
                    ol({ children }) {
                      return (
                        <ol className="list-decimal list-inside mb-4 space-y-1 text-foreground">
                          {children}
                        </ol>
                      );
                    },
                    li({ children }) {
                      return <li className="leading-relaxed">{children}</li>;
                    },
                    table({ children }) {
                      return (
                        <div className="my-6 overflow-x-auto rounded-lg border border-border shadow-sm">
                          <table className="min-w-full divide-y divide-border">
                            {children}
                          </table>
                        </div>
                      );
                    },
                    thead({ children }) {
                      return <thead className="bg-muted/50">{children}</thead>;
                    },
                    tbody({ children }) {
                      return (
                        <tbody className="divide-y divide-border bg-background">
                          {children}
                        </tbody>
                      );
                    },
                    tr({ children }) {
                      return (
                        <tr className="hover:bg-muted/30 transition-colors">
                          {children}
                        </tr>
                      );
                    },
                    th({ children }) {
                      return (
                        <th className="px-4 py-3 text-left text-sm font-semibold text-foreground border-b border-border bg-muted/80">
                          {children}
                        </th>
                      );
                    },
                    td({ children }) {
                      return (
                        <td className="px-4 py-3 text-sm text-foreground whitespace-nowrap">
                          {children}
                        </td>
                      );
                    },
                    a({ href, children }) {
                      return (
                        <a
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:text-primary/80 underline underline-offset-2 transition-colors"
                        >
                          {children}
                        </a>
                      );
                    },
                    strong({ children }) {
                      return (
                        <strong className="font-semibold text-foreground">
                          {children}
                        </strong>
                      );
                    },
                    em({ children }) {
                      return (
                        <em className="italic text-foreground">{children}</em>
                      );
                    },
                  }}
                >
                  {message.content}
                </ReactMarkdown>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageItem;
