import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SearchEngine } from './search-engine';
import fs from 'fs';

// Mock fs and os
vi.mock('fs');
vi.mock('os', () => ({
    default: {
        homedir: () => 'C:\\Users\\MockUser'
    }
}));

describe('SearchEngine', () => {
    let searchEngine: SearchEngine;

    beforeEach(() => {
        vi.clearAllMocks();
        searchEngine = new SearchEngine();

        // Mock fs.existsSync
        vi.mocked(fs.existsSync).mockReturnValue(true);

        // Mock fs.readdirSync
        vi.mocked(fs.readdirSync).mockImplementation((path: any) => {
            const p = path.toString().toLowerCase();
            if (p.includes('desktop')) {
                return [
                    { name: 'TestApp.lnk', isDirectory: () => false, isFile: () => true } as any,
                    { name: 'MyDoc.pdf', isDirectory: () => false, isFile: () => true } as any,
                ];
            }
            return [];
        });
    });

    it('should index system apps correctly', async () => {
        await searchEngine.initialize();

        const results = searchEngine.search('notepad');
        expect(results).toHaveLength(1);
        expect(results[0].title).toBe('Notepad');
        expect(results[0].type).toBe('app');
    });

    it('should index and find scanned apps', async () => {
        await searchEngine.initialize();

        const results = searchEngine.search('TestApp');
        expect(results.length).toBeGreaterThan(0);
        expect(results[0].title).toBe('TestApp');
        expect(results[0].type).toBe('app');
    });

    it('should index and find files', async () => {
        await searchEngine.initialize();

        const results = searchEngine.search('MyDoc');
        expect(results.length).toBeGreaterThan(0);
        expect(results[0].title).toBe('MyDoc.pdf');
        expect(results[0].type).toBe('file');
    });

    it('should return serializable objects (no functions)', async () => {
        await searchEngine.initialize();

        const results = searchEngine.search('notepad');

        // This stringify mimics the IPC serialization check
        // If there were functions or circular refs, this might fail or omit them
        // We explicitly check that 'action' is undefined
        const json = JSON.stringify(results);
        const parsed = JSON.parse(json);

        expect(parsed[0]).not.toHaveProperty('action');
        expect(typeof parsed[0].id).toBe('string');
        expect(typeof parsed[0].title).toBe('string');
    });
});
