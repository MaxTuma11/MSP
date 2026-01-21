// text_format.jsx
export function manifesto_layout(text) {
  const lines = text
    .replace(/(-{5,})\s*(\S)/g, '\n$1\n$2')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]+/g, ' ')
    .replace(/•/g, '\n•')
    .replace(/◦/g, '\n◦')
    .replace(/(^|\s)([1-9]|1[0-9])\.\s+/g, '\n\n$2. ')
    .split('\n')
    .map(l => l.trim())
    .filter(Boolean);

  const blocks = [];
  let currentList = null;

  for (const line of lines) {
    if (/^(?:[1-9]|1[0-9])\.\s+[A-Z]/.test(line)) {
      blocks.push({ type: 'heading', text: line });
      currentList = null;
      continue;
    } else if (/^[•◦]\s*/.test(line)) {
      if (!currentList) {
        currentList = [];
        blocks.push({ type: 'list', items: currentList });
      }
      currentList.push(line.replace(/^[•◦]\s*/, ''));
    } else if (/^-{5,}$/.test(line)) {
      blocks.push({ type: 'separator', text: line });
      currentList = null;
      continue;
    } else {
      currentList = null;
      blocks.push({ type: 'paragraph', text: line });
    }
  }

  return blocks;
}
