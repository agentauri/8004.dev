import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CSV_PRESETS, downloadCsv, toCsv } from './csv-exporter';

describe('csv-exporter', () => {
  describe('toCsv', () => {
    it('returns empty string for empty array', () => {
      const result = toCsv([]);
      expect(result).toBe('');
    });

    it('converts simple objects to CSV', () => {
      const data = [
        { id: '1', name: 'Agent A' },
        { id: '2', name: 'Agent B' },
      ];

      const result = toCsv(data);

      expect(result).toBe('id,name\n1,Agent A\n2,Agent B');
    });

    it('uses specified columns', () => {
      const data = [
        { id: '1', name: 'Agent A', extra: 'ignored' },
        { id: '2', name: 'Agent B', extra: 'ignored' },
      ];

      const result = toCsv(data, { columns: ['id', 'name'] });

      expect(result).toBe('id,name\n1,Agent A\n2,Agent B');
    });

    it('uses custom column labels', () => {
      const data = [
        { id: '1', name: 'Agent A' },
        { id: '2', name: 'Agent B' },
      ];

      const result = toCsv(data, {
        columnLabels: { id: 'Agent ID', name: 'Agent Name' },
      });

      expect(result).toBe('Agent ID,Agent Name\n1,Agent A\n2,Agent B');
    });

    it('excludes headers when includeHeaders is false', () => {
      const data = [
        { id: '1', name: 'Agent A' },
        { id: '2', name: 'Agent B' },
      ];

      const result = toCsv(data, { includeHeaders: false });

      expect(result).toBe('1,Agent A\n2,Agent B');
    });

    it('uses custom delimiter', () => {
      const data = [
        { id: '1', name: 'Agent A' },
        { id: '2', name: 'Agent B' },
      ];

      const result = toCsv(data, { delimiter: ';' });

      expect(result).toBe('id;name\n1;Agent A\n2;Agent B');
    });

    describe('value escaping', () => {
      it('escapes values containing delimiter', () => {
        const data = [{ name: 'Agent, Inc.' }];

        const result = toCsv(data);

        expect(result).toBe('name\n"Agent, Inc."');
      });

      it('escapes values containing newlines', () => {
        const data = [{ name: 'Agent\nCorp' }];

        const result = toCsv(data);

        expect(result).toBe('name\n"Agent\nCorp"');
      });

      it('escapes values containing quotes', () => {
        const data = [{ name: 'Agent "Pro"' }];

        const result = toCsv(data);

        expect(result).toBe('name\n"Agent ""Pro"""');
      });

      it('escapes values with multiple special characters', () => {
        const data = [{ name: '"Agent, Inc."\nDivision' }];

        const result = toCsv(data);

        expect(result).toBe('name\n"""Agent, Inc.""\nDivision"');
      });
    });

    describe('null and undefined handling', () => {
      it('handles null values', () => {
        const data = [{ id: '1', name: null }] as unknown as Record<string, unknown>[];

        const result = toCsv(data);

        expect(result).toBe('id,name\n1,');
      });

      it('handles undefined values', () => {
        const data = [{ id: '1', name: undefined }];

        const result = toCsv(data);

        expect(result).toBe('id,name\n1,');
      });
    });

    describe('boolean handling', () => {
      it('converts booleans to Yes/No', () => {
        const data = [
          { name: 'Agent A', active: true },
          { name: 'Agent B', active: false },
        ];

        const result = toCsv(data);

        expect(result).toBe('name,active\nAgent A,Yes\nAgent B,No');
      });
    });

    describe('array handling', () => {
      it('joins arrays by default', () => {
        const data = [{ name: 'Agent A', caps: ['mcp', 'a2a'] }];

        const result = toCsv(data);

        expect(result).toBe('name,caps\nAgent A,mcp; a2a');
      });

      it('uses custom array separator', () => {
        const data = [{ name: 'Agent A', caps: ['mcp', 'a2a'] }];

        const result = toCsv(data, { arraySeparator: ' | ' });

        expect(result).toBe('name,caps\nAgent A,mcp | a2a');
      });

      it('returns first element when arrayHandling is "first"', () => {
        const data = [{ name: 'Agent A', caps: ['mcp', 'a2a'] }];

        const result = toCsv(data, { arrayHandling: 'first' });

        expect(result).toBe('name,caps\nAgent A,mcp');
      });

      it('returns count when arrayHandling is "count"', () => {
        const data = [{ name: 'Agent A', caps: ['mcp', 'a2a', 'x402'] }];

        const result = toCsv(data, { arrayHandling: 'count' });

        expect(result).toBe('name,caps\nAgent A,3');
      });

      it('handles empty arrays', () => {
        const data = [{ name: 'Agent A', caps: [] }];

        const result = toCsv(data);

        expect(result).toBe('name,caps\nAgent A,');
      });
    });

    describe('object handling', () => {
      it('converts nested objects to JSON', () => {
        const data = [{ name: 'Agent A', meta: { foo: 'bar' } }];

        const result = toCsv(data);

        expect(result).toBe('name,meta\nAgent A,"{""foo"":""bar""}"');
      });
    });

    describe('nested values', () => {
      it('accesses nested values with dot notation', () => {
        const data = [
          { name: 'Agent A', details: { score: 85 } },
          { name: 'Agent B', details: { score: 92 } },
        ];

        const result = toCsv(data, { columns: ['name', 'details.score'] });

        expect(result).toBe('name,details.score\nAgent A,85\nAgent B,92');
      });

      it('handles missing nested values', () => {
        const data = [{ name: 'Agent A' }] as unknown as Record<string, unknown>[];

        const result = toCsv(data, { columns: ['name', 'details.score'] });

        expect(result).toBe('name,details.score\nAgent A,');
      });
    });

    describe('number handling', () => {
      it('converts numbers to strings', () => {
        const data = [
          { id: 1, score: 85.5, chainId: 11155111 },
          { id: 2, score: 92.0, chainId: 84532 },
        ];

        const result = toCsv(data);

        expect(result).toBe('id,score,chainId\n1,85.5,11155111\n2,92,84532');
      });
    });
  });

  describe('downloadCsv', () => {
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

      // Mock createElement to capture the link
      const originalCreateElement = document.createElement.bind(document);
      vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
        const element = originalCreateElement(tagName);
        if (tagName === 'a') {
          element.click = clickSpy;
        }
        return element;
      });

      downloadCsv(data, 'agents.csv');

      expect(createObjectURLMock).toHaveBeenCalled();
      expect(appendChildSpy).toHaveBeenCalled();
      expect(clickSpy).toHaveBeenCalled();
      expect(removeChildSpy).toHaveBeenCalled();
      expect(revokeObjectURLMock).toHaveBeenCalledWith('blob:test-url');

      appendChildSpy.mockRestore();
      removeChildSpy.mockRestore();
    });

    it('adds .csv extension if missing', () => {
      const data = [{ id: '1' }];

      let downloadFilename = '';
      const appendChildSpy = vi.spyOn(document.body, 'appendChild').mockImplementation((node) => {
        downloadFilename = (node as HTMLAnchorElement).download;
        return node;
      });
      vi.spyOn(document.body, 'removeChild').mockImplementation(
        () => null as unknown as HTMLAnchorElement,
      );

      downloadCsv(data, 'agents');

      expect(downloadFilename).toBe('agents.csv');

      appendChildSpy.mockRestore();
    });

    it('preserves .csv extension if present', () => {
      const data = [{ id: '1' }];

      let downloadFilename = '';
      const appendChildSpy = vi.spyOn(document.body, 'appendChild').mockImplementation((node) => {
        downloadFilename = (node as HTMLAnchorElement).download;
        return node;
      });
      vi.spyOn(document.body, 'removeChild').mockImplementation(
        () => null as unknown as HTMLAnchorElement,
      );

      downloadCsv(data, 'agents.csv');

      expect(downloadFilename).toBe('agents.csv');

      appendChildSpy.mockRestore();
    });
  });

  describe('CSV_PRESETS', () => {
    it('has bookmarks preset with correct columns', () => {
      expect(CSV_PRESETS.bookmarks.columns).toContain('agentId');
      expect(CSV_PRESETS.bookmarks.columns).toContain('name');
      expect(CSV_PRESETS.bookmarks.columns).toContain('chainId');
      expect(CSV_PRESETS.bookmarks.columns).toContain('bookmarkedAt');
    });

    it('has agents preset with correct columns', () => {
      expect(CSV_PRESETS.agents.columns).toContain('id');
      expect(CSV_PRESETS.agents.columns).toContain('name');
      expect(CSV_PRESETS.agents.columns).toContain('chainId');
      expect(CSV_PRESETS.agents.columns).toContain('capabilities');
    });

    it('has agentDetails preset with extended columns', () => {
      expect(CSV_PRESETS.agentDetails.columns).toContain('id');
      expect(CSV_PRESETS.agentDetails.columns).toContain('walletAddress');
      expect(CSV_PRESETS.agentDetails.columns).toContain('oasfSkills');
      expect(CSV_PRESETS.agentDetails.columns).toContain('oasfDomains');
    });

    it('works with toCsv function', () => {
      const bookmarks = [
        {
          agentId: '11155111:123',
          name: 'Test Agent',
          chainId: 11155111,
          description: 'A test agent',
          bookmarkedAt: 1704067200000,
        },
      ];

      const result = toCsv(bookmarks, CSV_PRESETS.bookmarks);

      expect(result).toContain('Agent ID');
      expect(result).toContain('11155111:123');
      expect(result).toContain('Test Agent');
    });
  });
});
