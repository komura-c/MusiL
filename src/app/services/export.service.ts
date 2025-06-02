import { Injectable } from '@angular/core';
import { Article } from '@interfaces/article';
import { ArticleWithAuthor } from '@interfaces/article-with-author';

export type ExportFormat = 'markdown' | 'html' | 'text';

@Injectable({
  providedIn: 'root',
})
export class ExportService {
  exportArticle(article: Article | ArticleWithAuthor, format: ExportFormat): void {
    const content = this.convertArticleToFormat(article, format);
    const filename = this.generateFilename(article, format);
    
    this.downloadFile(content, filename, this.getContentType(format));
  }

  private convertArticleToFormat(article: Article | ArticleWithAuthor, format: ExportFormat): string {
    switch (format) {
      case 'markdown':
        return this.convertToMarkdown(article);
      case 'html':
        return this.convertToHtml(article);
      case 'text':
        return this.convertToText(article);
      default:
        throw new Error(`Unsupported format: ${format}`);
    }
  }

  private convertToMarkdown(article: Article | ArticleWithAuthor): string {
    const title = `# ${article.title}\n\n`;
    const date = `*投稿日: ${article.createdAt.toDate().toLocaleDateString('ja-JP')}*\n\n`;
    const tags = article.tags?.length 
      ? `**タグ:** ${article.tags.map(tag => `#${tag}`).join(', ')}\n\n` 
      : '';
    
    // Convert HTML to Markdown-like format
    let content = article.text;
    
    // Convert HTML headings to Markdown
    content = content.replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1\n\n');
    content = content.replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n\n');
    content = content.replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n\n');
    content = content.replace(/<h4[^>]*>(.*?)<\/h4>/gi, '#### $1\n\n');
    
    // Convert HTML paragraphs
    content = content.replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n\n');
    
    // Convert HTML breaks
    content = content.replace(/<br\s*\/?>/gi, '\n');
    
    // Convert HTML links
    content = content.replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, '[$2]($1)');
    
    // Convert HTML images
    content = content.replace(/<img[^>]*src="([^"]*)"[^>]*alt="([^"]*)"[^>]*>/gi, '![$2]($1)');
    
    // Convert HTML bold and italic
    content = content.replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**');
    content = content.replace(/<b[^>]*>(.*?)<\/b>/gi, '**$1**');
    content = content.replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*');
    content = content.replace(/<i[^>]*>(.*?)<\/i>/gi, '*$1*');
    
    // Convert HTML lists
    content = content.replace(/<ul[^>]*>(.*?)<\/ul>/gis, (match, listContent) => {
      return listContent.replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1\n') + '\n';
    });
    
    content = content.replace(/<ol[^>]*>(.*?)<\/ol>/gis, (match, listContent) => {
      let counter = 1;
      return listContent.replace(/<li[^>]*>(.*?)<\/li>/gi, () => {
        return `${counter++}. $1\n`;
      }) + '\n';
    });
    
    // Convert HTML code blocks
    content = content.replace(/<pre[^>]*><code[^>]*>(.*?)<\/code><\/pre>/gis, '```\n$1\n```\n\n');
    content = content.replace(/<code[^>]*>(.*?)<\/code>/gi, '`$1`');
    
    // Convert HTML blockquotes
    content = content.replace(/<blockquote[^>]*>(.*?)<\/blockquote>/gis, (match, quote) => {
      return quote.split('\n').map(line => `> ${line}`).join('\n') + '\n\n';
    });
    
    // Remove remaining HTML tags
    content = content.replace(/<[^>]*>/g, '');
    
    // Clean up multiple newlines
    content = content.replace(/\n{3,}/g, '\n\n');
    
    return title + date + tags + content.trim();
  }

  private convertToHtml(article: Article | ArticleWithAuthor): string {
    const title = article.title;
    const date = article.createdAt.toDate().toLocaleDateString('ja-JP');
    const tags = article.tags?.length 
      ? article.tags.map(tag => `<span class="tag">#${tag}</span>`).join(' ')
      : '';
    
    return `<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            color: #333;
        }
        h1 {
            color: #2c3e50;
            border-bottom: 2px solid #3498db;
            padding-bottom: 10px;
        }
        .meta {
            color: #666;
            font-size: 0.9em;
            margin-bottom: 20px;
        }
        .tag {
            background: #3498db;
            color: white;
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 0.8em;
            margin-right: 5px;
        }
        .content {
            margin-top: 20px;
        }
        img {
            max-width: 100%;
            height: auto;
        }
        blockquote {
            border-left: 4px solid #3498db;
            margin-left: 0;
            padding-left: 20px;
            font-style: italic;
        }
        code {
            background: #f4f4f4;
            padding: 2px 4px;
            border-radius: 3px;
            font-family: 'Courier New', monospace;
        }
        pre {
            background: #f4f4f4;
            padding: 15px;
            border-radius: 5px;
            overflow-x: auto;
        }
        pre code {
            background: none;
            padding: 0;
        }
    </style>
</head>
<body>
    <h1>${title}</h1>
    <div class="meta">
        <div>投稿日: ${date}</div>
        ${tags ? `<div style="margin-top: 10px;">タグ: ${tags}</div>` : ''}
    </div>
    <div class="content">
        ${article.text}
    </div>
</body>
</html>`;
  }

  private convertToText(article: Article | ArticleWithAuthor): string {
    const title = `${article.title}\n${'='.repeat(article.title.length)}\n\n`;
    const date = `投稿日: ${article.createdAt.toDate().toLocaleDateString('ja-JP')}\n\n`;
    const tags = article.tags?.length 
      ? `タグ: ${article.tags.map(tag => `#${tag}`).join(', ')}\n\n` 
      : '';
    
    // Remove HTML tags and convert to plain text
    let content = article.text;
    
    // Convert headings
    content = content.replace(/<h([1-6])[^>]*>(.*?)<\/h[1-6]>/gi, (match, level, text) => {
      const marker = '#'.repeat(parseInt(level));
      return `\n${marker} ${text}\n\n`;
    });
    
    // Convert paragraphs
    content = content.replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n\n');
    
    // Convert breaks
    content = content.replace(/<br\s*\/?>/gi, '\n');
    
    // Convert links (show URL)
    content = content.replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, '$2 ($1)');
    
    // Convert images (show alt text and URL)
    content = content.replace(/<img[^>]*src="([^"]*)"[^>]*alt="([^"]*)"[^>]*>/gi, '[画像: $2] ($1)');
    
    // Convert lists
    content = content.replace(/<ul[^>]*>(.*?)<\/ul>/gis, (match, listContent) => {
      return listContent.replace(/<li[^>]*>(.*?)<\/li>/gi, '• $1\n') + '\n';
    });
    
    content = content.replace(/<ol[^>]*>(.*?)<\/ol>/gis, (match, listContent) => {
      let counter = 1;
      return listContent.replace(/<li[^>]*>(.*?)<\/li>/gi, () => {
        return `${counter++}. $1\n`;
      }) + '\n';
    });
    
    // Convert code blocks
    content = content.replace(/<pre[^>]*><code[^>]*>(.*?)<\/code><\/pre>/gis, '```\n$1\n```\n\n');
    content = content.replace(/<code[^>]*>(.*?)<\/code>/gi, '`$1`');
    
    // Convert blockquotes
    content = content.replace(/<blockquote[^>]*>(.*?)<\/blockquote>/gis, (match, quote) => {
      return quote.split('\n').map(line => `> ${line}`).join('\n') + '\n\n';
    });
    
    // Remove all remaining HTML tags
    content = content.replace(/<[^>]*>/g, '');
    
    // Decode HTML entities
    content = content.replace(/&lt;/g, '<');
    content = content.replace(/&gt;/g, '>');
    content = content.replace(/&amp;/g, '&');
    content = content.replace(/&quot;/g, '"');
    content = content.replace(/&#39;/g, "'");
    content = content.replace(/&nbsp;/g, ' ');
    
    // Clean up multiple newlines
    content = content.replace(/\n{3,}/g, '\n\n');
    
    return title + date + tags + content.trim();
  }

  private generateFilename(article: Article | ArticleWithAuthor, format: ExportFormat): string {
    // Sanitize title for filename
    const sanitizedTitle = article.title
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/[\s_-]+/g, '_') // Replace spaces/underscores/hyphens with underscore
      .replace(/^_+|_+$/g, '') // Remove leading/trailing underscores
      .toLowerCase();
    
    const extension = this.getFileExtension(format);
    const maxLength = 100; // Limit filename length
    
    const baseFilename = sanitizedTitle.length > maxLength 
      ? sanitizedTitle.substring(0, maxLength) 
      : sanitizedTitle;
    
    return `${baseFilename}.${extension}`;
  }

  private getFileExtension(format: ExportFormat): string {
    switch (format) {
      case 'markdown':
        return 'md';
      case 'html':
        return 'html';
      case 'text':
        return 'txt';
      default:
        return 'txt';
    }
  }

  private getContentType(format: ExportFormat): string {
    switch (format) {
      case 'markdown':
        return 'text/markdown';
      case 'html':
        return 'text/html';
      case 'text':
        return 'text/plain';
      default:
        return 'text/plain';
    }
  }

  private downloadFile(content: string, filename: string, contentType: string): void {
    const blob = new Blob([content], { type: `${contentType};charset=utf-8` });
    const url = window.URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }
}