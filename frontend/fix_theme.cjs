const fs = require('fs');
const path = require('path');

const replacements = {
  'bg-white': 'bg-panel',
  'bg-slate-50': 'bg-slate-800/50',
  'bg-slate-100': 'bg-slate-800',
  'bg-slate-200': 'bg-slate-700',
  'bg-slate-300': 'bg-slate-600',
  'text-slate-900': 'text-slate-50',
  'text-slate-800': 'text-slate-200',
  'text-slate-700': 'text-slate-300',
  'text-slate-600': 'text-slate-400',
  'text-slate-500': 'text-slate-400',
  'text-gray-900': 'text-slate-50',
  'text-gray-800': 'text-slate-200',
  'text-gray-700': 'text-slate-300',
  'text-gray-600': 'text-slate-400',
  'text-gray-500': 'text-slate-400',
  'border-slate-200': 'border-slate-700',
  'border-slate-100': 'border-slate-800/50',
  'border-gray-200': 'border-slate-700',
  'border-gray-100': 'border-slate-800/50',
  'divide-slate-200': 'divide-slate-700',
  'divide-slate-100': 'divide-slate-800',
  'divide-gray-200': 'divide-slate-700',
  'hover:bg-slate-50': 'hover:bg-slate-800',
  'hover:bg-slate-100': 'hover:bg-slate-700',
  'hover:bg-gray-50': 'hover:bg-slate-800',
  'hover:bg-gray-100': 'hover:bg-slate-700',
  'bg-gray-50': 'bg-slate-800/50',
  'bg-gray-100': 'bg-slate-800',
  'bg-gray-200': 'bg-slate-700',
  'ring-slate-200': 'ring-slate-700',
  'ring-gray-200': 'ring-slate-700',
  'focus:ring-slate-200': 'focus:ring-slate-700'
};

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      walkDir(dirPath, callback);
    } else {
      if (dirPath.endsWith('.jsx') || dirPath.endsWith('.css') || dirPath.endsWith('.js')) {
        callback(dirPath);
      }
    }
  });
}

walkDir('d:\\study\\webdev\\scse\\frontend\\src', (filePath) => {
  let content = fs.readFileSync(filePath, 'utf8');
  let newContent = content;
  
  for (const [key, value] of Object.entries(replacements)) {
    const regex = new RegExp(`(?<![\\w-])` + key + `(?![\\w-])`, 'g');
    newContent = newContent.replace(regex, value);
  }
  
  if (content !== newContent) {
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`Updated ${filePath}`);
  }
});
