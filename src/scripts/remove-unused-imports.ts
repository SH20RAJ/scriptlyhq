import * as ts from "typescript";
import * as fs from "fs";
import * as path from "path";

// Recursively get all .ts and .tsx files in a directory
function getFiles(dir: string): string[] {
  const results: string[] = [];
  if (!fs.existsSync(dir)) return results;
  
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results.push(...getFiles(filePath));
    } else if (file.endsWith(".ts") || file.endsWith(".tsx")) {
      // Skip declarations
      if (!file.endsWith(".d.ts")) {
        results.push(filePath);
      }
    }
  });
  return results;
}

interface ImportInfo {
  node: ts.ImportDeclaration;
  moduleSpecifier: string;
  defaultImport?: { name: string };
  namespaceImport?: { name: string };
  namedImports: { localName: string; originalNode: ts.ImportSpecifier }[];
}

function printImport(info: ImportInfo, used: Set<string>, srcDir: string, filePath: string): string | null {
  const hasDefault = info.defaultImport && used.has(info.defaultImport.name);
  const hasNamespace = info.namespaceImport && used.has(info.namespaceImport.name);
  const activeNamed = info.namedImports.filter(n => used.has(n.localName));

  const hasImportClause = info.defaultImport || info.namespaceImport || info.namedImports.length > 0;

  // Resolve module specifier to use @ alias if it's a relative path inside src
  let specifier = info.moduleSpecifier;
  if (specifier.startsWith(".")) {
    const fileDir = path.dirname(filePath);
    const resolvedPath = path.resolve(fileDir, specifier);
    if (resolvedPath.startsWith(srcDir)) {
      const relativeToSrc = path.relative(srcDir, resolvedPath);
      specifier = `@/${relativeToSrc.replace(/\\/g, "/")}`;
    }
  }

  if (!hasImportClause) {
    // Side effect import (like import "dotenv/config" or import "@/styles.css") -> Keep it, but rewrite path if needed
    if (info.moduleSpecifier !== specifier) {
      return `import "${specifier}";`;
    }
    return null;
  }

  if (!hasDefault && !hasNamespace && activeNamed.length === 0) {
    // Entire import is unused -> remove it
    return "";
  }

  // Construct new import statement
  let clause = "";
  if (hasDefault) {
    clause += info.defaultImport!.name;
  }

  if (hasNamespace) {
    if (clause) clause += ", ";
    clause += `* as ${info.namespaceImport!.name}`;
  }

  if (activeNamed.length > 0) {
    if (clause) clause += ", ";
    const namedStr = activeNamed.map(n => {
      const orig = n.originalNode;
      if (orig.propertyName) {
        return `${orig.propertyName.text} as ${n.localName}`;
      }
      return n.localName;
    }).join(", ");
    clause += `{ ${namedStr} }`;
  }

  return `import ${clause} from "${specifier}";`;
}

function cleanUnusedAndConvertImports(filePath: string, srcDir: string) {
  const content = fs.readFileSync(filePath, "utf-8");
  const sourceFile = ts.createSourceFile(
    filePath,
    content,
    ts.ScriptTarget.Latest,
    true
  );

  const imports: ImportInfo[] = [];
  const usedIdentifiers = new Set<string>();

  function visit(node: ts.Node, inImport: boolean = false) {
    if (ts.isImportDeclaration(node)) {
      const moduleSpecifier = (node.moduleSpecifier as ts.StringLiteral).text;
      const importInfo: ImportInfo = { node, moduleSpecifier, namedImports: [] };

      if (node.importClause) {
        if (node.importClause.name) {
          importInfo.defaultImport = { name: node.importClause.name.text };
        }
        if (node.importClause.namedBindings) {
          const nb = node.importClause.namedBindings;
          if (ts.isNamespaceImport(nb)) {
            importInfo.namespaceImport = { name: nb.name.text };
          } else if (ts.isNamedImports(nb)) {
            nb.elements.forEach((elem) => {
              importInfo.namedImports.push({
                localName: elem.name.text,
                originalNode: elem
              });
            });
          }
        }
      }
      imports.push(importInfo);
      
      // Traverse children with inImport = true
      ts.forEachChild(node, (child) => visit(child, true));
    } else {
      if (!inImport && ts.isIdentifier(node)) {
        // Exclude identifier usages that are property names in definitions/calls
        let isPropertyReference = false;
        if (node.parent) {
          if (ts.isPropertyAccessExpression(node.parent) && node.parent.name === node) {
            isPropertyReference = true;
          }
          if (ts.isPropertyAssignment(node.parent) && node.parent.name === node) {
            isPropertyReference = true;
          }
          if (ts.isMethodDeclaration(node.parent) && node.parent.name === node) {
            isPropertyReference = true;
          }
          if (ts.isPropertyDeclaration(node.parent) && node.parent.name === node) {
            isPropertyReference = true;
          }
          if (ts.isPropertySignature(node.parent) && node.parent.name === node) {
            isPropertyReference = true;
          }
          if (ts.isJsxAttribute(node.parent) && node.parent.name === node) {
            isPropertyReference = true;
          }
        }
        if (!isPropertyReference) {
          usedIdentifiers.add(node.text);
        }
      }
      ts.forEachChild(node, (child) => visit(child, inImport));
    }
  }

  visit(sourceFile);

  // Replace from end to start to not mess up string index offsets
  let newContent = content;
  const sortedImports = [...imports].sort((a, b) => b.node.getStart() - a.node.getStart());

  for (const imp of sortedImports) {
    const replacement = printImport(imp, usedIdentifiers, srcDir, filePath);
    if (replacement !== null) {
      const start = imp.node.getStart(sourceFile);
      const end = imp.node.getEnd();
      newContent = newContent.slice(0, start) + replacement + newContent.slice(end);
    }
  }

  if (newContent !== content) {
    fs.writeFileSync(filePath, newContent, "utf-8");
    console.log(`Cleaned & converted imports in: ${filePath}`);
  }
}

function main() {
  console.log("Analyzing project to automatically clean unused imports and convert to @ alias paths...");
  const srcDir = path.join(process.cwd(), "src");
  const files = getFiles(srcDir);
  console.log(`Found ${files.length} source files.`);

  files.forEach((file) => {
    try {
      cleanUnusedAndConvertImports(file, srcDir);
    } catch (err) {
      console.error(`Failed to process file ${file}:`, err);
    }
  });

  console.log("Cleanup and alias path conversion complete!");
}

main();
