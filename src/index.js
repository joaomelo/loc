export function initApp() {
  const button = document.getElementById("open");
  button.onclick = doIt;
}

async function doIt() {
  const items = [];
  const rootDir = await showDirectoryPicker();
  await processDir(rootDir, "", items);

  const table = document.getElementById("table");

  const titles = document.createElement("tr");
  ["name", "complexity"].forEach((str) => {
    const title = document.createElement("td");
    title.textContent = str;
    titles.appendChild(title);
  });
  table.appendChild(titles);

  items.forEach((item) => {
    const tr = document.createElement("tr");

    const name = document.createElement("td");
    name.textContent = item.name;
    tr.appendChild(name);

    const complexity = document.createElement("td");
    complexity.textContent = item.level;
    tr.appendChild(complexity);

    table.appendChild(tr);
  });
}

async function processDir(dir, suffix, items) {
  for await (const [name, handle] of dir.entries()) {
    const newSuffix = suffix + "/" + name;

    if (handle.kind === "file") {
      if (isCode(name)) {
        const complexity = await getComplexity(handle);
        items.push({ name: newSuffix, complexity });
      }
    } else if (handle.kind === "directory") {
      await processDir(handle, newSuffix, items);
    }
  }
}

function isCode(name) {
  if (["index.scss", "index.js"].includes(name)) return false;
  const index = name.lastIndexOf(".");
  if (index === -1) return false;
  const ext = name.substring(index);
  return [".js", ".scss", ".vue"].includes(ext);
}

async function getComplexity(handle) {
  const file = await handle.getFile();
  const text = await file.text();
  const lines = text.split("\n");
  const loc = lines.length;

  return loc <= 10 ? "simple" : loc <= 50 ? "medium" : "high";
}
