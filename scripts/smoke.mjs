import { JSDOM, VirtualConsole } from "jsdom";
import fs from "node:fs/promises";
import assert from "node:assert/strict";
const html = await fs.readFile("dist/index.html", "utf8");
const bundleFile = html.match(/src="([^"]+\.js)"/)[1];
const bundle = await fs.readFile("dist" + bundleFile, "utf8");
const errors = [];
const vc = new VirtualConsole();
vc.on("jsdomError", (e) => {
  if (!e.message.includes("Not implemented: navigation"))
    errors.push(e.message);
});
vc.on("error", (...args) => errors.push(args.map(String).join(" ")));
const dom = new JSDOM(
  '<!doctype html><html><body><div id="root"></div></body></html>',
  {
    url: "http://localhost:5173/",
    runScripts: "outside-only",
    pretendToBeVisual: true,
    virtualConsole: vc,
  },
);
const w = dom.window;
w.scrollTo = () => {};
w.HTMLElement.prototype.scrollBy = () => {};
w.HTMLDialogElement.prototype.showModal = function () {
  this.open = true;
};
w.HTMLDialogElement.prototype.close = function () {
  this.open = false;
};
w.matchMedia = () => ({
  matches: false,
  addEventListener() {},
  removeEventListener() {},
});
w.eval(bundle);
const wait = () => new Promise((r) => setTimeout(r, 45));
await wait();
const q = (selector) => {
  const el = w.document.querySelector(selector);
  assert.ok(el, "Missing " + selector);
  return el;
};
const text = () => w.document.body.textContent;
const button = (label) => {
  const b = [...w.document.querySelectorAll("button")].find(
    (b) =>
      b.textContent.trim() === label || b.getAttribute("aria-label") === label,
  );
  assert.ok(b, "Missing button " + label);
  return b;
};
async function click(el) {
  el.click();
  await wait();
}
async function fill(el, value) {
  Object.getOwnPropertyDescriptor(
    w.HTMLInputElement.prototype,
    "value",
  ).set.call(el, value);
  el.dispatchEvent(new w.Event("input", { bubbles: true }));
  el.dispatchEvent(new w.Event("change", { bubbles: true }));
  await wait();
}
async function select(el, value) {
  el.value = value;
  el.dispatchEvent(new w.Event("change", { bubbles: true }));
  await wait();
}
async function navigate(url) {
  w.history.pushState({}, "", url);
  w.dispatchEvent(new w.PopStateEvent("popstate"));
  await wait();
}
const passed = [];
function pass(name) {
  passed.push(name);
  console.log("PASS " + name);
}
assert.match(text(), /A little further/);
assert.equal(w.document.querySelectorAll(".destination-card").length, 5);
pass("Editorial home and five destinations render");
await fill(q("#destination"), "Lis");
assert.equal(w.document.querySelectorAll("[role=option]").length, 1);
await click(q("[role=option]"));
assert.equal(q("#destination").value, "Lisbon");
pass("Destination suggestions update selection");
await click(button("Find my escape"));
assert.equal(w.location.pathname, "/stays");
assert.equal(w.document.querySelectorAll(".stay-card").length, 2);
pass("Home search navigates to filtered stays");
await select(q('select[aria-label="Sort stays"]'), "price-low");
assert.match(q(".stay-card h3").textContent, /Terra/);
pass("Price sorting updates listing order");
await click(button("Save Terra Lisboa"));
assert.deepEqual(JSON.parse(w.localStorage.getItem("roamly-saved")), [
  "terra-lisboa",
]);
pass("Favorites persist in localStorage");
await navigate("/saved");
assert.match(text(), /Terra Lisboa/);
assert.equal(w.document.querySelectorAll(".stay-card").length, 1);
pass("Saved route renders the persisted collection");
await click(button("Switch to dark mode"));
assert.equal(w.document.documentElement.dataset.theme, "dark");
assert.equal(JSON.parse(w.localStorage.getItem("roamly-theme")), "dark");
pass("Theme switch persists and updates document");
await navigate("/stays");
assert.equal(w.document.querySelectorAll(".stay-card").length, 8);
await select(q(".desktop-filters select"), 100);
assert.equal(w.document.querySelectorAll(".stay-card").length, 2);
pass("Nightly budget filters stays");
await click(button("Filters (1)"));
assert.ok(q("dialog").classList.contains("filter-drawer"));
await click(button("Villa"));
assert.equal(w.document.querySelectorAll(".stay-card").length, 0);
pass("Drawer stay type and budget combine into empty state");
await click(button("Reset filters"));
await click(button("Show 8 stays"));
await fill(q("#catalog-destination"), "nothing-at-all");
assert.match(text(), /No stays match/);
await click(button("Reset and rediscover"));
assert.equal(w.document.querySelectorAll(".stay-card").length, 8);
pass("Search empty state resets correctly");
await click(button("Show area view"));
assert.equal(w.document.querySelectorAll(".map-pin").length, 5);
pass("Illustrated area view opens with stay links");
const start = new Date();
start.setDate(start.getDate() + 20);
const end = new Date(start);
end.setDate(end.getDate() + 3);
const ds = (d) => d.toISOString().slice(0, 10);
await navigate(
  "/stays?destination=Lisbon&start=" +
    ds(start) +
    "&end=" +
    ds(end) +
    "&guests=4",
);
assert.match(q(".stay-card h3 a").href, /guests=4/);
pass("Dates and guests carry through catalog links");
await click(q(".stay-card h3 a"));
assert.ok(w.location.pathname.startsWith("/stays/"));
assert.equal(q(".room-select-label select").value, "suite");
assert.equal(q(".booking-fields input[type=date]").value, ds(start));
pass("Stay detail receives trip dates and selects an appropriate room");
const totalBefore = q(".booking-total").textContent;
await select(q(".room-select-label select"), "classic");
assert.notEqual(q(".booking-total").textContent, totalBefore);
pass("Room selection recalculates booking total");
await click(button("Reserve your escape"));
assert.match(q("dialog").textContent, /No booking was made/);
assert.match(q("dialog").textContent, /3 nights/);
pass("Stay reservation opens calculated demo confirmation");
await click(button("Keep exploring"));
await click(button("All photos"));
assert.match(q(".modal-heading h2").textContent, /1 \/ 5/);
await click(button("Next photo"));
assert.match(q(".modal-heading h2").textContent, /2 \/ 5/);
await click(button("Close dialog"));
pass("Gallery modal and navigation work");
await navigate("/experiences");
assert.equal(w.document.querySelectorAll(".experience-card").length, 6);
await click(button("On the water"));
assert.equal(w.document.querySelectorAll(".experience-card").length, 1);
pass("Experience category filters update visible activities");
await click(button("Sail into the Santorini sunset"));
assert.ok(q("dialog form"));
await click(button("Add a guest"));
assert.match(q(".experience-price").textContent, /€285/);
await click(button("Reserve this experience"));
assert.match(q("dialog").textContent, /No real booking or payment/);
await click(button("Keep exploring"));
pass("Experience guest stepper, total and reservation confirmation work");
await navigate("/stays/nonexistent");
assert.match(text(), /We couldn’t find that page/);
pass("Unknown stay renders graceful fallback");
assert.equal(errors.length, 0, "Runtime errors: " + errors.join("\\n"));
pass("No JavaScript runtime errors");
console.log(JSON.stringify({ checks: passed.length, errors }, null, 2));
dom.window.close();
