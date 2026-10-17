// Race List page: loads the "Race List & Links" tab of the club's Google Sheet
// (sheet must stay shared as "anyone with the link can view") and renders it
// as a mobile-friendly, filterable list grouped by month.
(function () {
  const SHEET_ID = "1iO4Y767tNH6MjvKmbQtChp_S1ZEFbRcdeS4bgyVhhKY";
  const GID = "0"; // "Race List & Links" tab
  const CSV_URL =
    "https://docs.google.com/spreadsheets/d/" + SHEET_ID + "/gviz/tq?tqx=out:csv&gid=" + GID;

  const DISTANCES = [
    { key: "sprint", label: "Sprint", cls: "" },
    { key: "olympic", label: "Olympic", cls: "olympic" },
    { key: "half", label: "Half Iron", cls: "half" },
    { key: "ironman", label: "Ironman", cls: "ironman" },
    { key: "other", label: "Other", cls: "other" },
  ];

  const listEl = document.getElementById("raceList");
  const filtersEl = document.getElementById("raceFilters");
  if (!listEl) return;

  // Minimal CSV parser (handles quoted cells containing commas/newlines).
  function parseCSV(text) {
    const rows = [];
    let row = [], cell = "", inQuotes = false;
    for (let i = 0; i < text.length; i++) {
      const c = text[i];
      if (inQuotes) {
        if (c === '"' && text[i + 1] === '"') { cell += '"'; i++; }
        else if (c === '"') inQuotes = false;
        else cell += c;
      } else if (c === '"') inQuotes = true;
      else if (c === ",") { row.push(cell); cell = ""; }
      else if (c === "\n" || c === "\r") {
        if (c === "\r" && text[i + 1] === "\n") i++;
        row.push(cell); rows.push(row); row = []; cell = "";
      } else cell += c;
    }
    if (cell || row.length) { row.push(cell); rows.push(row); }
    return rows;
  }

  function el(tag, cls, text) {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  // Turn the sheet into [{month, entries:[{day, races:[{name, place, tags[]}]}]}]
  function build(rows) {
    const months = [];
    let current = null;
    rows.slice(1).forEach((r) => {
      const month = (r[0] || "").trim();
      const day = (r[1] || "").trim();
      const cells = r.slice(2, 7).map((c) => (c || "").trim());
      if (!month || cells.every((c) => !c)) return;

      const merged = new Map(); // same race under several distances → one entry
      cells.forEach((text, i) => {
        if (!text || /^yellow shading/i.test(text)) return;
        const lines = text.split(/\n/).map((l) => l.trim()).filter(Boolean);
        const key = text.replace(/\s+/g, " ").toLowerCase();
        if (!merged.has(key)) {
          merged.set(key, { name: lines[0], place: lines.slice(1).join(" · "), tags: [] });
        }
        merged.get(key).tags.push(DISTANCES[i]);
      });
      if (!merged.size) return;

      if (!current || current.month !== month) {
        current = { month, entries: [] };
        months.push(current);
      }
      current.entries.push({ day, races: [...merged.values()] });
    });
    return months;
  }

  function render(months, filter) {
    listEl.textContent = "";
    let shown = 0;
    months.forEach((m) => {
      const section = el("div", "race-month");
      section.appendChild(el("h2", null, m.month));
      let monthCount = 0;

      m.entries.forEach((entry) => {
        const races = entry.races.filter((r) => filter === "all" || r.tags.some((t) => t.key === filter));
        if (!races.length) return;
        monthCount += races.length;

        const row = el("div", "race-row");
        const date = el("div", "race-date");
        date.appendChild(el("small", null, m.month.slice(0, 3)));
        date.appendChild(el("span", null, entry.day || "TBD"));
        row.appendChild(date);

        const list = el("div", "race-list");
        races.forEach((r) => {
          const item = el("div", "race-item");
          item.appendChild(el("span", "race-name", r.name));
          if (r.place) item.appendChild(el("span", "race-place", r.place));
          const tags = el("div", "race-tags");
          r.tags.forEach((t) => tags.appendChild(el("span", "race-tag " + t.cls, t.label)));
          item.appendChild(tags);
          list.appendChild(item);
        });
        row.appendChild(list);
        section.appendChild(row);
      });

      if (monthCount) { listEl.appendChild(section); shown += monthCount; }
    });
    if (!shown) listEl.appendChild(el("p", "race-status", "No races listed for that distance yet."));
  }

  function buildFilters(months) {
    const options = [{ key: "all", label: "All" }, ...DISTANCES];
    options.forEach((o, i) => {
      const b = el("button", "race-filter" + (i === 0 ? " active" : ""), o.label);
      b.type = "button";
      b.addEventListener("click", () => {
        filtersEl.querySelectorAll(".race-filter").forEach((x) => x.classList.remove("active"));
        b.classList.add("active");
        render(months, o.key);
      });
      filtersEl.appendChild(b);
    });
    filtersEl.hidden = false;
  }

  function fail() {
    listEl.textContent = "";
    const p = el("p", "race-status");
    p.append("We couldn't load the race list right now. Please try again in a bit, or ask in the ");
    const a = el("a", null, "Facebook group");
    a.href = "https://www.facebook.com/share/g/1Ea239nSPP/?mibextid=wwXIfr";
    a.target = "_blank"; a.rel = "noopener";
    p.append(a, ".");
    listEl.appendChild(p);
  }

  fetch(CSV_URL)
    .then((r) => { if (!r.ok) throw new Error(r.status); return r.text(); })
    .then((text) => {
      const months = build(parseCSV(text));
      if (!months.length) throw new Error("empty");
      buildFilters(months);
      render(months, "all");
    })
    .catch(fail);
})();
