import { marked } from 'marked';

marked.setOptions({ breaks: true });

export function renderInlineMarkdown(text: string): string {
  return marked.parseInline(text);
}
