export function mergeQuery(url, patch = {}, options = {}) {
  const { overwrite = true } = options;

  const urlObj = new URL(url);
  const params = new URLSearchParams(urlObj.search);

  for (const [key, value] of Object.entries(patch)) {
    if (value === undefined || value === null) {
      params.delete(key);
    } else if (Array.isArray(value)) {
      params.delete(key);
      value.forEach(item => {
        params.append(key, item);
      });
    } else if (overwrite || !params.has(key)) {
      params.set(key, value);
    }
  }

  // 按 key 的字典序排序
  const sortedEntries = Array.from(params.entries()).sort(([a], [b]) => a.localeCompare(b));
  urlObj.search = new URLSearchParams(sortedEntries).toString();

  return urlObj.toString();
}
