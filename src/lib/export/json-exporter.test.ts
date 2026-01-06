import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createExportStructure, downloadJson, JSON_PRESETS, toJson } from './json-exporter';

describe('json-exporter', () => {
  describe('toJson', () => {
    it('converts array to JSON string', () => {
      const data = [
        { id: '1', name: 'Agent A' },
        { id: '2', name: 'Agent B' },
      ];

      const result = toJson(data);
      const parsed = JSON.parse(result);

      expect(parsed).toEqual(data);
    });

    it('pretty-prints by default', () => {
      const data = [{ id: '1' }];

      const result = toJson(data);

      expect(result).toContain('\n');
      expect(result).toContain('  '); // 2-space indent
    });

    it('uses custom indent', () => {
      const data = [{ id: '1' }];

      const result = toJson(data, { indent: 4 });

      expect(result).toContain('    '); // 4-space indent
    });

    it('disables pretty-print when specified', () => {
      const data = [{ id: '1', name: 'Agent A' }];

      const result = toJson(data, { prettyPrint: false });

      expect(result).not.toContain('\n');
      expect(result).toBe('[{"id":"1","name":"Agent A"}]');
    });

    it('filters to specified fields', () => {
      const data = [
        { id: '1', name: 'Agent A', secret: 'hidden' },
        { id: '2', name: 'Agent B', secret: 'hidden' },
      ];

      const result = toJson(data, { fields: ['id', 'name'] });
      const parsed = JSON.parse(result);

      expect(parsed[0]).toEqual({ id: '1', name: 'Agent A' });
      expect(parsed[0]).not.toHaveProperty('secret');
    });

    it('excludes specified fields', () => {
      const data = [
        { id: '1', name: 'Agent A', secret: 'hidden' },
        { id: '2', name: 'Agent B', secret: 'hidden' },
      ];

      const result = toJson(data, { excludeFields: ['secret'] });
      const parsed = JSON.parse(result);

      expect(parsed[0]).toEqual({ id: '1', name: 'Agent A' });
      expect(parsed[0]).not.toHaveProperty('secret');
    });

    it('wraps data with wrapperKey', () => {
      const data = [{ id: '1', name: 'Agent A' }];

      const result = toJson(data, { wrapperKey: 'agents' });
      const parsed = JSON.parse(result);

      expect(parsed).toEqual({ agents: data });
    });

    it('adds metadata to wrapped output', () => {
      const data = [{ id: '1' }];

      const result = toJson(data, {
        wrapperKey: 'agents',
        metadata: { version: '1.0', exportedAt: '2024-01-01' },
      });
      const parsed = JSON.parse(result);

      expect(parsed.version).toBe('1.0');
      expect(parsed.exportedAt).toBe('2024-01-01');
      expect(parsed.agents).toEqual(data);
    });

    it('uses "data" as default key when only metadata is provided', () => {
      const data = [{ id: '1' }];

      const result = toJson(data, { metadata: { version: '1.0' } });
      const parsed = JSON.parse(result);

      expect(parsed.version).toBe('1.0');
      expect(parsed.data).toEqual(data);
    });

    it('handles empty array', () => {
      const result = toJson([]);
      const parsed = JSON.parse(result);

      expect(parsed).toEqual([]);
    });

    it('handles nested objects', () => {
      const data = [{ id: '1', details: { score: 85, tags: ['a', 'b'] } }];

      const result = toJson(data);
      const parsed = JSON.parse(result);

      expect(parsed[0].details).toEqual({ score: 85, tags: ['a', 'b'] });
    });

    it('handles null and undefined values', () => {
      const data = [{ id: '1', name: null, desc: undefined }] as unknown as Record<
        string,
        unknown
      >[];

      const result = toJson(data);
      const parsed = JSON.parse(result);

      expect(parsed[0].name).toBeNull();
      // undefined is not serialized in JSON
      expect(parsed[0]).not.toHaveProperty('desc');
    });
  });

  describe('downloadJson', () => {
    let createObjectURLMock: ReturnType<typeof vi.fn<(obj: Blob | MediaSource) => string>>;
    let revokeObjectURLMock: ReturnType<typeof vi.fn<(url: string) => void>>;

    beforeEach(() => {
      createObjectURLMock = vi.fn<(obj: Blob | MediaSource) => string>(() => 'blob:test-url');
      revokeObjectURLMock = vi.fn<(url: string) => void>();
      global.URL.createObjectURL = createObjectURLMock;
      global.URL.revokeObjectURL = revokeObjectURLMock;
    });

    it('creates and triggers download', () => {
      const data = [{ id: '1', name: 'Agent A' }];

      const clickSpy = vi.fn();
      const appendChildSpy = vi
        .spyOn(document.body, 'appendChild')
        .mockImplementation(() => null as unknown as HTMLAnchorElement);
      const removeChildSpy = vi
        .spyOn(document.body, 'removeChild')
        .mockImplementation(() => null as unknown as HTMLAnchorElement);

      const originalCreateElement = document.createElement.bind(document);
      vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
        const element = originalCreateElement(tagName);
        if (tagName === 'a') {
          element.click = clickSpy;
        }
        return element;
      });

      downloadJson(data, 'agents.json');

      expect(createObjectURLMock).toHaveBeenCalled();
      expect(appendChildSpy).toHaveBeenCalled();
      expect(clickSpy).toHaveBeenCalled();
      expect(removeChildSpy).toHaveBeenCalled();
      expect(revokeObjectURLMock).toHaveBeenCalledWith('blob:test-url');

      appendChildSpy.mockRestore();
      removeChildSpy.mockRestore();
    });

    it('adds .json extension if missing', () => {
      const data = [{ id: '1' }];

      let downloadFilename = '';
      const appendChildSpy = vi.spyOn(document.body, 'appendChild').mockImplementation((node) => {
        downloadFilename = (node as HTMLAnchorElement).download;
        return node;
      });
      vi.spyOn(document.body, 'removeChild').mockImplementation(
        () => null as unknown as HTMLAnchorElement,
      );

      downloadJson(data, 'agents');

      expect(downloadFilename).toBe('agents.json');

      appendChildSpy.mockRestore();
    });

    it('preserves .json extension if present', () => {
      const data = [{ id: '1' }];

      let downloadFilename = '';
      const appendChildSpy = vi.spyOn(document.body, 'appendChild').mockImplementation((node) => {
        downloadFilename = (node as HTMLAnchorElement).download;
        return node;
      });
      vi.spyOn(document.body, 'removeChild').mockImplementation(
        () => null as unknown as HTMLAnchorElement,
      );

      downloadJson(data, 'agents.json');

      expect(downloadFilename).toBe('agents.json');

      appendChildSpy.mockRestore();
    });

    it('passes options to toJson', () => {
      const data = [{ id: '1', name: 'Agent A', secret: 'hidden' }];

      let capturedBlobContent = '';
      const OriginalBlob = global.Blob;
      global.Blob = class MockBlob extends OriginalBlob {
        constructor(content?: BlobPart[], options?: BlobPropertyBag) {
          super(content, options);
          capturedBlobContent = content?.[0] as string;
        }
      };

      vi.spyOn(document.body, 'appendChild').mockImplementation(
        () => null as unknown as HTMLAnchorElement,
      );
      vi.spyOn(document.body, 'removeChild').mockImplementation(
        () => null as unknown as HTMLAnchorElement,
      );

      downloadJson(data, 'agents.json', { fields: ['id', 'name'] });

      const parsed = JSON.parse(capturedBlobContent);
      expect(parsed[0]).toEqual({ id: '1', name: 'Agent A' });

      global.Blob = OriginalBlob;
    });
  });

  describe('JSON_PRESETS', () => {
    it('has bookmarks preset with correct structure', () => {
      expect(JSON_PRESETS.bookmarks.wrapperKey).toBe('bookmarks');
      expect(JSON_PRESETS.bookmarks.metadata?.type).toBe('agent-explorer-bookmarks');
    });

    it('has agents preset with correct structure', () => {
      expect(JSON_PRESETS.agents.wrapperKey).toBe('agents');
      expect(JSON_PRESETS.agents.excludeFields).toContain('matchReasons');
    });

    it('has minimal preset for raw export', () => {
      expect(JSON_PRESETS.minimal.prettyPrint).toBe(false);
      expect(JSON_PRESETS.minimal.wrapperKey).toBeUndefined();
    });

    it('works with toJson function', () => {
      const bookmarks = [
        {
          agentId: '11155111:123',
          name: 'Test Agent',
          chainId: 11155111,
          bookmarkedAt: 1704067200000,
        },
      ];

      const result = toJson(bookmarks, JSON_PRESETS.bookmarks);
      const parsed = JSON.parse(result);

      expect(parsed.version).toBe('1.0');
      expect(parsed.type).toBe('agent-explorer-bookmarks');
      expect(parsed.bookmarks).toEqual(bookmarks);
    });
  });

  describe('createExportStructure', () => {
    it('creates structure with metadata', () => {
      const data = [{ id: '1', name: 'Agent A' }];

      const result = createExportStructure(data, { type: 'test' });

      expect(result.meta.type).toBe('test');
      expect(result.meta.version).toBe('1.0');
      expect(result.meta.count).toBe(1);
      expect(result.meta.exportedAt).toBeDefined();
      expect(result.data).toEqual(data);
    });

    it('allows custom version', () => {
      const data = [{ id: '1' }];

      const result = createExportStructure(data, { type: 'test', version: '2.0' });

      expect(result.meta.version).toBe('2.0');
    });

    it('includes additional metadata', () => {
      const data = [{ id: '1' }];

      const result = createExportStructure(data, {
        type: 'test',
        exportedBy: 'user@example.com',
        source: 'agent-explorer',
      });

      expect(result.meta.exportedBy).toBe('user@example.com');
      expect(result.meta.source).toBe('agent-explorer');
    });

    it('sets exportedAt to ISO string', () => {
      const data = [{ id: '1' }];

      const before = new Date().toISOString();
      const result = createExportStructure(data, { type: 'test' });
      const after = new Date().toISOString();

      expect(result.meta.exportedAt >= before).toBe(true);
      expect(result.meta.exportedAt <= after).toBe(true);
    });

    it('counts items correctly', () => {
      const data = [{ id: '1' }, { id: '2' }, { id: '3' }];

      const result = createExportStructure(data, { type: 'test' });

      expect(result.meta.count).toBe(3);
    });

    it('handles empty array', () => {
      const result = createExportStructure([], { type: 'test' });

      expect(result.meta.count).toBe(0);
      expect(result.data).toEqual([]);
    });
  });
});
