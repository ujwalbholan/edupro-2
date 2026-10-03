import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { parseAllDocuments } from 'yaml';

const root = process.cwd();
const ignoredDirectories = new Set([
  '.git',
  'node_modules',
  '.turbo',
  '.next',
  'coverage',
  'dist',
  'build',
]);
const yamlFiles = [];

async function collectYamlFiles(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (entry.isDirectory() && ignoredDirectories.has(entry.name)) {
      continue;
    }

    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      await collectYamlFiles(entryPath);
    } else if (entry.isFile() && /\.ya?ml$/i.test(entry.name)) {
      yamlFiles.push(entryPath);
    }
  }
}

await collectYamlFiles(root);

let hasErrors = false;
for (const filePath of yamlFiles.sort()) {
  const source = await readFile(filePath, 'utf8');
  const documents = parseAllDocuments(source, { uniqueKeys: true });
  const errors = documents.flatMap((document) => document.errors);

  if (errors.length > 0) {
    hasErrors = true;
    for (const error of errors) {
      const line = error.linePos?.[0]?.line;
      const location = line ? `:${line}` : '';
      console.error(
        `${path.relative(root, filePath)}${location}: ${error.message}`,
      );
    }
  } else {
    console.log(`Valid YAML: ${path.relative(root, filePath)}`);
  }
}

if (hasErrors) {
  process.exitCode = 1;
} else {
  console.log(`Validated ${yamlFiles.length} YAML file(s).`);
}
