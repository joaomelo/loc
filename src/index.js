import { minimatch } from "minimatch";

export function initApp() {
  const button = document.getElementById("open");
  button.onclick = doIt;
}

async function doIt() {
  const dir = await showDirectoryPicker();
  updateProcessing();
  const match = createMatch();
  const files = await collectFiles({ dir, prefix: "", match });
  updateList(files);
}

function createMatch() {
  const includeValue = document.getElementById("include").value;
  const include = (name) => minimatch(name, includeValue);
  const ignoreValue = document.getElementById("ignore").value;
  const ignore = (name) => minimatch(name, ignoreValue);
  return { include, ignore };
}

async function collectFiles({ dir, prefix, match }) {
  const items = [];
  for await (const [name, handle] of dir.entries()) {
    const path = prefix ? prefix + "/" + name : name;
    if (match.ignore(path)) continue;
    if (handle.kind === "file" && match.include(path)) {
      const loc = await getLocs(handle);
      items.push({ name: path, loc });
    } else if (handle.kind === "directory") {
      const dirItems = await collectFiles({ dir: handle, prefix: path, match });
      items.push(...dirItems);
    }
  }
  return items;
}

function updateProcessing() {
  const output = document.getElementById("output");
  output.innerHTML = "";
  output.textContent = "processing...";
}

function updateList(files) {
  const output = document.getElementById("output");
  output.innerHTML = "";

  const table = document.createElement("table");
  output.appendChild(table);

  const titles = document.createElement("tr");
  ["name", "loc"].forEach((str) => {
    const title = document.createElement("th");
    title.textContent = str;
    titles.appendChild(title);
  });
  table.appendChild(titles);

  files.forEach((item) => {
    const tr = document.createElement("tr");

    const name = document.createElement("td");
    name.textContent = item.name;
    tr.appendChild(name);

    const loc = document.createElement("td");
    loc.textContent = item.loc;
    tr.appendChild(loc);

    table.appendChild(tr);
  });
}

async function getLocs(handle) {
  const file = await handle.getFile();
  const text = await file.text();
  const lines = text.split("\n");
  const loc = lines.length;
  return loc;
}
