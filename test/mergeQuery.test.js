'use strict';

import { describe, it, expect } from 'vitest';
import { mergeQuery } from '@/mergeQuery.js';

describe('mergeQuery - URL 查询参数合并', () => {
  it('合并后按字母顺序排序查询键', () => {
    expect(mergeQuery('https://example.com/path?b=2&a=1', { c: 3 })).toBe('https://example.com/path?a=1&b=2&c=3');
  });

  it('当补丁值为 undefined 时移除键', () => {
    expect(mergeQuery('https://example.com/path?x=1&y=2', { x: undefined })).toBe('https://example.com/path?y=2');
  });

  it('当 overwrite 为 false 且键不存在时添加新参数', () => {
    expect(mergeQuery('https://example.com/path?x=1', { y: 2 }, { overwrite: false })).toBe('https://example.com/path?x=1&y=2');
  });

  it('当 overwrite 为 true 时替换重复的已有参数', () => {
    expect(mergeQuery('https://example.com/search?tag=a&tag=b', { tag: 'c' }, { overwrite: true })).toBe('https://example.com/search?tag=c');
  });

  it('当 overwrite 为 false 时保留重复的已有参数', () => {
    expect(mergeQuery('https://example.com/search?tag=a&tag=b', { tag: 'c' }, { overwrite: false })).toBe('https://example.com/search?tag=a&tag=b');
  });

  it('处理没有初始查询字符串的 URL', () => {
    expect(mergeQuery('https://example.com/home', { lang: 'en' })).toBe('https://example.com/home?lang=en');
  });

  it('当补丁值为数组时处理', () => {
    expect(mergeQuery('https://example.com/path?tags=a', { tags: ['b', 'c'] })).toBe('https://example.com/path?tags=b&tags=c');
  });

  it('合并时保留哈希片段', () => {
    expect(mergeQuery('https://example.com/page?x=1#section', { x: 2, y: 3 })).toBe('https://example.com/page?x=2&y=3#section');
  });

  it('正确编码值（空格在查询字符串中变为 +）', () => {
    expect(mergeQuery('https://example.com/search', { q: 'a b' })).toBe('https://example.com/search?q=a+b');
  });

  it('处理特殊字符', () => {
    expect(mergeQuery('https://example.com/path', { special: 'a/b&c=d' })).toBe('https://example.com/path?special=a%2Fb%26c%3Dd');
  });

  it('处理中文字符', () => {
    expect(mergeQuery('https://example.com/path', { query: '测试' })).toBe('https://example.com/path?query=%E6%B5%8B%E8%AF%95');
  });
});
