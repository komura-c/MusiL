import { TestBed } from '@angular/core/testing';
import { ExportService } from './export.service';
import { Article } from '@interfaces/article';
import { Timestamp } from '@angular/fire/firestore/lite';

describe('ExportService', () => {
  let service: ExportService;
  let mockArticle: Article;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExportService);

    mockArticle = {
      articleId: 'test-id',
      uid: 'test-uid',
      title: 'Test Article',
      text: '<p>This is a test article with <strong>bold</strong> text.</p>',
      tags: ['test', 'article'],
      thumbnailURL: 'test-url',
      isPublic: true,
      likeCount: 0,
      createdAt: Timestamp.fromDate(new Date('2023-01-01')),
      updatedAt: Timestamp.fromDate(new Date('2023-01-01'))
    };

    // Mock URL.createObjectURL and URL.revokeObjectURL
    global.URL.createObjectURL = jest.fn(() => 'mock-url');
    global.URL.revokeObjectURL = jest.fn();

    // Mock document.createElement and appendChild/removeChild
    const mockLink = {
      href: '',
      download: '',
      style: { display: '' },
      click: jest.fn()
    };
    jest.spyOn(document, 'createElement').mockReturnValue(mockLink as any);
    jest.spyOn(document.body, 'appendChild').mockImplementation();
    jest.spyOn(document.body, 'removeChild').mockImplementation();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('exportArticle', () => {
    it('should export article in markdown format', () => {
      service.exportArticle(mockArticle, 'markdown');
      
      expect(document.createElement).toHaveBeenCalledWith('a');
      expect(document.body.appendChild).toHaveBeenCalled();
      expect(document.body.removeChild).toHaveBeenCalled();
    });

    it('should export article in HTML format', () => {
      service.exportArticle(mockArticle, 'html');
      
      expect(document.createElement).toHaveBeenCalledWith('a');
      expect(document.body.appendChild).toHaveBeenCalled();
      expect(document.body.removeChild).toHaveBeenCalled();
    });

    it('should export article in text format', () => {
      service.exportArticle(mockArticle, 'text');
      
      expect(document.createElement).toHaveBeenCalledWith('a');
      expect(document.body.appendChild).toHaveBeenCalled();
      expect(document.body.removeChild).toHaveBeenCalled();
    });
  });

  describe('convertToMarkdown', () => {
    it('should convert HTML to markdown', () => {
      const articleWithHtml = {
        ...mockArticle,
        text: '<h1>Heading</h1><p>Paragraph with <strong>bold</strong> text.</p>'
      };

      const result = (service as any).convertToMarkdown(articleWithHtml);
      
      expect(result).toContain('# Test Article');
      expect(result).toContain('**タグ:** #test, #article');
      expect(result).toContain('# Heading');
      expect(result).toContain('**bold**');
    });
  });

  describe('convertToHtml', () => {
    it('should create valid HTML document', () => {
      const result = (service as any).convertToHtml(mockArticle);
      
      expect(result).toContain('<!DOCTYPE html>');
      expect(result).toContain('<title>Test Article</title>');
      expect(result).toContain('<h1>Test Article</h1>');
      expect(result).toContain('タグ: <span class="tag">#test</span>');
    });
  });

  describe('convertToText', () => {
    it('should convert HTML to plain text', () => {
      const result = (service as any).convertToText(mockArticle);
      
      expect(result).toContain('Test Article');
      expect(result).toContain('タグ: #test, #article');
      expect(result).toContain('This is a test article with bold text.');
      expect(result).not.toContain('<');
      expect(result).not.toContain('>');
    });
  });

  describe('generateFilename', () => {
    it('should generate markdown filename', () => {
      const result = (service as any).generateFilename(mockArticle, 'markdown');
      expect(result).toBe('test_article.md');
    });

    it('should generate HTML filename', () => {
      const result = (service as any).generateFilename(mockArticle, 'html');
      expect(result).toBe('test_article.html');
    });

    it('should generate text filename', () => {
      const result = (service as any).generateFilename(mockArticle, 'text');
      expect(result).toBe('test_article.txt');
    });

    it('should sanitize special characters in filename', () => {
      const articleWithSpecialChars = {
        ...mockArticle,
        title: 'Test: Article & More!'
      };
      const result = (service as any).generateFilename(articleWithSpecialChars, 'markdown');
      expect(result).toBe('test_article__more.md');
    });
  });
});