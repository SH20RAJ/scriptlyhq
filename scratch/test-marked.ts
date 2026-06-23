import { marked } from "marked";

const testMarkdown = "Check [our link](https://example.com) out.";

// Let's test the custom renderer override in marked v18
const customRenderer = new marked.Renderer();
const originalLink = customRenderer.link;

customRenderer.link = function(token) {
  console.log("Token:", token);
  // In marked v12+, token is an object with { href, title, text, tokens }
  const href = token.href;
  const title = token.title || "";
  const text = token.text;
  return `<a href="${href}" title="${title}" target="_blank" rel="noopener noreferrer" class="text-blue-500 hover:text-blue-600 underline">${text}</a>`;
};

const html = marked.parse(testMarkdown, { renderer: customRenderer });
console.log("Parsed HTML:", html);
