import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  ArrowRight,
  Check,
  Map,
  MapPin,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { currency, stays } from "../data";
import { Modal, StayCard } from "../components";
interface Filters {
  max: number;
  type: string;
  rating: number;
  amenities: string[];
}
const defaults: Filters = {
  max: 300,
  type: "All stays",
  rating: 0,
  amenities: [],
};
export function Catalog() {
  const [params, setParams] = useSearchParams();
  const destination = params.get("destination") || "";
  const [filters, setFilters] = useState<Filters>({
    ...defaults,
    type: params.get("type") || "All stays",
  });
  const [sort, setSort] = useState("recommended");
  const [drawer, setDrawer] = useState(false);
  const [area, setArea] = useState(false);
  const visible = useMemo(() => {
    let items = stays.filter(
      (s) =>
        (s.city + " " + s.country + " " + s.name + " " + s.area)
          .toLowerCase()
          .includes(destination.toLowerCase()) &&
        s.price <= filters.max &&
        (filters.type === "All stays" || s.type === filters.type) &&
        s.rating >= filters.rating &&
        filters.amenities.every((a) => s.amenities.includes(a)),
    );
    if (sort === "price-low") items.sort((a, b) => a.price - b.price);
    if (sort === "price-high") items.sort((a, b) => b.price - a.price);
    if (sort === "rating") items.sort((a, b) => b.rating - a.rating);
    return items;
  }, [destination, filters, sort]);
  const activeCount =
    (filters.max < 300 ? 1 : 0) +
    (filters.type !== "All stays" ? 1 : 0) +
    (filters.rating ? 1 : 0) +
    filters.amenities.length;
  function updateSearch(value: string) {
    const next = new URLSearchParams(params);
    if (value) next.set("destination", value);
    else next.delete("destination");
    setParams(next, { replace: true });
  }
  function set<K extends keyof Filters>(key: K, value: Filters[K]) {
    setFilters((f) => ({ ...f, [key]: value }));
  }
  const amenities = [
    "Wi-Fi",
    "Pool",
    "Breakfast",
    "Kitchen",
    "Sea view",
    "Air conditioning",
  ];
  function clear() {
    setFilters(defaults);
    setParams({});
  }
  const filterContent = (
    <>
      <div className="filter-group">
        <div className="filter-label">
          <strong>Nightly budget</strong>
          <span>Up to {currency(filters.max)}</span>
        </div>
        <input
          type="range"
          aria-label="Maximum nightly price"
          min="75"
          max="300"
          step="5"
          value={filters.max}
          onChange={(e) => set("max", Number(e.target.value))}
        />
        <div className="range-labels">
          <span>€75</span>
          <span>€300</span>
        </div>
      </div>
      <div className="filter-group">
        <strong>Stay your way</strong>
        <div className="filter-chips">
          {["All stays", "Boutique hotel", "Villa", "Apartment"].map((t) => (
            <button
              key={t}
              className={filters.type === t ? "chip active" : "chip"}
              onClick={() => set("type", t)}
            >
              {t}
            </button>
          ))}
        </div>
      </div>
      <div className="filter-group">
        <label htmlFor="drawer-rating">Guest rating</label>
        <select
          id="drawer-rating"
          value={filters.rating}
          onChange={(e) => set("rating", Number(e.target.value))}
        >
          <option value="0">All ratings</option>
          <option value="4.9">Exceptional · 4.9+</option>
          <option value="4.8">Wonderful · 4.8+</option>
        </select>
      </div>
      <div className="filter-group">
        <strong>The little comforts</strong>
        <div className="amenity-checkboxes">
          {amenities.map((a) => (
            <label key={a}>
              <input
                type="checkbox"
                checked={filters.amenities.includes(a)}
                onChange={(e) =>
                  set(
                    "amenities",
                    e.target.checked
                      ? [...filters.amenities, a]
                      : filters.amenities.filter((x) => x !== a),
                  )
                }
              />
              {a}
            </label>
          ))}
        </div>
      </div>
    </>
  );
  return (
    <div className="catalog-page">
      <div className="container page-intro">
        <p className="eyebrow">GOOD PLACES. GREAT LITTLE ESCAPES.</p>
        <h1>
          Find your <em>somewhere.</em>
        </h1>
        <p className="muted">
          Thoughtful stays for a weekend away — or a little longer.
        </p>
      </div>
      <div className="filter-toolbar">
        <div className="container filter-toolbar-inner">
          <div className="catalog-search">
            <Search size={18} />
            <label className="sr-only" htmlFor="catalog-destination">
              Search destinations or stays
            </label>
            <input
              id="catalog-destination"
              value={destination}
              onChange={(e) => updateSearch(e.target.value)}
              placeholder="City, neighborhood, or stay…"
            />
            {destination && (
              <button
                className="icon-btn"
                aria-label="Clear destination search"
                onClick={() => updateSearch("")}
              >
                <X size={15} />
              </button>
            )}
          </div>
          <div className="desktop-filters">
            <label>
              <span className="sr-only">Maximum nightly price</span>
              <select
                value={filters.max}
                onChange={(e) => set("max", Number(e.target.value))}
              >
                {![100, 150, 200, 250, 300].includes(filters.max) && (
                  <option value={filters.max}>
                    Up to {currency(filters.max)}
                  </option>
                )}
                {[100, 150, 200, 250, 300].map((n) => (
                  <option key={n} value={n}>
                    {n === 300 ? "Any budget" : "Up to " + currency(n)}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span className="sr-only">Stay type</span>
              <select
                value={filters.type}
                onChange={(e) => set("type", e.target.value)}
              >
                {["All stays", "Boutique hotel", "Villa", "Apartment"].map(
                  (t) => (
                    <option key={t}>{t}</option>
                  ),
                )}
              </select>
            </label>
            <label>
              <span className="sr-only">Minimum guest rating</span>
              <select
                value={filters.rating}
                onChange={(e) => set("rating", Number(e.target.value))}
              >
                <option value={0}>Any rating</option>
                <option value={4.9}>4.9+ rating</option>
                <option value={4.8}>4.8+ rating</option>
              </select>
            </label>
          </div>
          <button
            className="btn btn-outline filter-button"
            onClick={() => setDrawer(true)}
          >
            <SlidersHorizontal size={17} />
            <span>
              Filters{activeCount > 0 ? " (" + activeCount + ")" : ""}
            </span>
          </button>
        </div>
      </div>
      <section className="container catalog-results">
        <div className="results-topline">
          <div>
            <strong>
              {visible.length} beautiful{" "}
              {visible.length === 1 ? "stay" : "stays"}
              {destination ? " near " + destination : ""}
            </strong>
            <p className="muted">
              A smaller collection. A better kind of choice.
            </p>
          </div>
          <div className="results-controls">
            <button
              className={`view-toggle ${area ? "active" : ""}`}
              onClick={() => setArea(!area)}
              aria-pressed={area}
            >
              <Map size={17} />
              <span>{area ? "Hide" : "Show"} area view</span>
            </button>
            <label className="sort-label">
              <span>Sort:</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                aria-label="Sort stays"
              >
                <option value="recommended">Our picks</option>
                <option value="price-low">Price: low to high</option>
                <option value="price-high">Price: high to low</option>
                <option value="rating">Top rated</option>
              </select>
            </label>
          </div>
        </div>
        {activeCount > 0 && (
          <div className="active-filters">
            {filters.type !== "All stays" && (
              <button className="chip" onClick={() => set("type", "All stays")}>
                {filters.type}
                <X size={13} />
              </button>
            )}
            {filters.max < 300 && (
              <button className="chip" onClick={() => set("max", 300)}>
                Up to {currency(filters.max)}
                <X size={13} />
              </button>
            )}
            {filters.rating > 0 && (
              <button className="chip" onClick={() => set("rating", 0)}>
                {filters.rating}+ rating
                <X size={13} />
              </button>
            )}
            {filters.amenities.map((a) => (
              <button
                key={a}
                className="chip"
                onClick={() =>
                  set(
                    "amenities",
                    filters.amenities.filter((x) => x !== a),
                  )
                }
              >
                {a}
                <X size={13} />
              </button>
            ))}
            <button className="text-link" onClick={() => setFilters(defaults)}>
              Clear filters
            </button>
          </div>
        )}
        <div className={`catalog-layout ${area ? "with-area" : ""}`}>
          <div>
            {visible.length ? (
              <div className="catalog-grid">
                {visible.map((s) => (
                  <StayCard key={s.id} stay={s} />
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <Search size={34} />
                <h2>A little further afield?</h2>
                <p>
                  No stays match those filters. Try a wider budget or another
                  destination.
                </p>
                <button className="btn btn-primary" onClick={clear}>
                  Reset and rediscover
                  <ArrowRight size={17} />
                </button>
              </div>
            )}
          </div>
          {area && (
            <aside className="area-view">
              <div className="area-heading">
                <MapPin size={18} />
                <strong>Your little corner of the world</strong>
              </div>
              <p className="muted">An illustrated neighborhood guide</p>
              <div className="area-canvas">
                <div className="area-water" />
                <div className="area-park" />
                <div className="area-street street-one" />
                <div className="area-street street-two" />
                <div className="area-street street-three" />
                <span className="area-label label-one">OLD TOWN</span>
                <span className="area-label label-two">GARDEN QUARTER</span>
                <span className="area-label label-three">WATERFRONT</span>
                {visible.slice(0, 5).map((s, i) => (
                  <Link
                    key={s.id}
                    to={"/stays/" + s.id}
                    className={"map-pin pin-" + i}
                    aria-label={`${s.name}, ${currency(s.price)} per night`}
                  >
                    {currency(s.price)}
                  </Link>
                ))}
              </div>
              <div className="area-footnote">
                <Check size={14} /> Illustration only. Locations are
                approximate.
              </div>
            </aside>
          )}
        </div>
        <div className="catalog-end">
          <span>Found your kind of somewhere?</span>
          <Link to="/experiences" className="text-link">
            Add a little local discovery
            <ArrowRight size={17} />
          </Link>
        </div>
      </section>
      {drawer && (
        <Modal
          drawer
          title="Make it your kind of stay"
          onClose={() => setDrawer(false)}
        >
          {filterContent}
          <div className="modal-actions">
            <button className="text-link" onClick={() => setFilters(defaults)}>
              Reset filters
            </button>
            <button
              className="btn btn-primary"
              onClick={() => setDrawer(false)}
            >
              Show {visible.length} stays
              <Check size={16} />
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
