import * as fs from "fs";
import * as path from "path";

const targetDir = path.join(process.cwd(), "src/app/creator");

function walkDir(dir: string, callback: (filePath: string) => void) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      walkDir(fullPath, callback);
    } else if (file.endsWith(".ts") || file.endsWith(".tsx")) {
      callback(fullPath);
    }
  }
}

walkDir(targetDir, (filePath) => {
  let content = fs.readFileSync(filePath, "utf8");
  let modified = false;

  // Replace imports like "../../.." with "../.."
  // Replace imports like "../../../.." with "../../.."
  // Replace imports like "../../../../.." with "../../../.."
  
  // Regex to match from "..." or '...'
  const importRegex = /(from\s+["']|import\s+["']|import\s*\(["'])(\.\.\/[^"']+)(["'])/g;
  
  content = content.replace(importRegex, (match, prefix, importPath, suffix) => {
    if (importPath.startsWith("../")) {
      // Remove one level of "../"
      const newImportPath = importPath.substring(3);
      if (newImportPath.startsWith("../") || newImportPath.startsWith("./")) {
        modified = true;
        console.log(`Fixing import in ${path.relative(process.cwd(), filePath)}: ${importPath} -> ${newImportPath}`);
        return prefix + newImportPath + suffix;
      }
    }
    return match;
  });

  if (modified) {
    fs.writeFileSync(filePath, content, "utf8");
  }
});
