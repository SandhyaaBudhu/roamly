import {
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
  type ImgHTMLAttributes,
} from "react";
import { Link, NavLink, useNavigate, useSearchParams } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Check,
  Compass,
  Heart,
  MapPin,
  Menu,
  Minus,
  Moon,
  Plus,
  Search,
  Star,
  Sun,
  Users,
  X,
} from "lucide-react";
import {
  currency,
  dateAfter,
  destinations,
  type Experience,
  type Stay,
} from "./data";
import { useDemo } from "./state";
export function Photo({
  src,
  alt,
  ...props
}: ImgHTMLAttributes<HTMLImageElement>) {
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      {...props}
      onError={(e) => {
        e.currentTarget.onerror = null;
        e.currentTarget.src = "/placeholder.svg";
      }}
    />
  );
}
export function Brand() {
  return (
    <Link to="/" className="brand" aria-label="ROAMLY home">
      <Compass strokeWidth={1.4} />
      <span>
        roamly<span className="brand-dot">.</span>
      </span>
    </Link>
  );
}
export function Header() {
  const { theme, toggleTheme, saved } = useDemo();
  const [menu, setMenu] = useState(false);
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Brand />
        <nav
          className={menu ? "main-nav open" : "main-nav"}
          aria-label="Main navigation"
        >
          {[
            ["/", "Discover"],
            ["/stays", "Stays"],
            ["/experiences", "Experiences"],
          ].map(([to, label]) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              onClick={() => setMenu(false)}
            >
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="header-actions">
          <Link to="/saved" className="saved-nav">
            <Heart size={18} />
            <span>Saved</span>
            {saved.length > 0 && <small>{saved.length}</small>}
          </Link>
          <span className="header-divider" />
          <button
            className="icon-btn theme-toggle"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          >
            {theme === "light" ? <Moon size={19} /> : <Sun size={19} />}
          </button>
          <button
            className="icon-btn menu-toggle"
            onClick={() => setMenu(!menu)}
            aria-expanded={menu}
            aria-label="Toggle navigation"
          >
            {menu ? <X /> : <Menu />}
          </button>
        </div>
      </div>
    </header>
  );
}
export function Modal({
  title,
  onClose,
  children,
  wide = false,
  drawer = false,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
  wide?: boolean;
  drawer?: boolean;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const id = useId();
  function close() {
    ref.current?.close();
    onClose();
  }
  useEffect(() => {
    const dialog = ref.current;
    dialog?.showModal();
    const old = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = old;
    };
  }, []);
  return (
    <dialog
      ref={ref}
      className={`modal ${drawer ? "filter-drawer" : ""} ${wide ? "modal-wide" : ""}`}
      aria-labelledby={id}
      onCancel={(e) => {
        e.preventDefault();
        close();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
      onClose={onClose}
    >
      <div className="modal-heading">
        <h2 id={id}>{title}</h2>
        <button
          autoFocus
          className="icon-btn"
          onClick={close}
          aria-label="Close dialog"
        >
          <X />
        </button>
      </div>
      {children}
    </dialog>
  );
}
export function GuestStepper({
  value,
  onChange,
  max = 8,
}: {
  value: number;
  onChange: (n: number) => void;
  max?: number;
}) {
  return (
    <div className="guest-stepper">
      <div>
        <strong>Guests</strong>
        <small>Ages 12 and above · max {max}</small>
      </div>
      <div className="stepper-controls">
        <button
          type="button"
          className="icon-btn"
          aria-label="Remove a guest"
          disabled={value <= 1}
          onClick={() => onChange(value - 1)}
        >
          <Minus size={16} />
        </button>
        <span aria-live="polite">{value}</span>
        <button
          type="button"
          className="icon-btn"
          aria-label="Add a guest"
          disabled={value >= max}
          onClick={() => onChange(value + 1)}
        >
          <Plus size={16} />
        </button>
      </div>
    </div>
  );
}
export function SearchForm() {
  const navigate = useNavigate();
  const [destination, setDestination] = useState("");
  const [suggest, setSuggest] = useState(false);
  const [active, setActive] = useState(-1);
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [guests, setGuests] = useState(2);
  const [panel, setPanel] = useState<"dates" | "guests" | null>(null);
  const [error, setError] = useState("");
  const matches = destinations.filter((d) =>
    d.name.toLowerCase().includes(destination.toLowerCase()),
  );
  const dateLabel =
    start && end
      ? new Date(start + "T12:00").toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
        }) +
        " – " +
        new Date(end + "T12:00").toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
        })
      : "Add dates";
  function submit(e: React.FormEvent) {
    e.preventDefault();
    const query = new URLSearchParams();
    if (destination) query.set("destination", destination);
    if (start) query.set("start", start);
    if (end) query.set("end", end);
    query.set("guests", String(guests));
    navigate("/stays?" + query.toString());
  }
  return (
    <>
      <form className="hero-search" onSubmit={submit}>
        <div className="search-field destination-field">
          <MapPin size={20} />
          <div>
            <label htmlFor="destination">Where to?</label>
            <input
              id="destination"
              role="combobox"
              aria-autocomplete="list"
              aria-expanded={suggest && matches.length > 0}
              aria-controls="destination-options"
              aria-activedescendant={
                active >= 0 ? `destination-${active}` : undefined
              }
              placeholder="Find your next escape"
              autoComplete="off"
              value={destination}
              onChange={(e) => {
                setDestination(e.target.value);
                setSuggest(true);
                setActive(-1);
              }}
              onFocus={() => setSuggest(true)}
              onBlur={() => setTimeout(() => setSuggest(false), 150)}
              onKeyDown={(e) => {
                if (e.key === "ArrowDown") {
                  e.preventDefault();
                  setActive((a) => Math.min(a + 1, matches.length - 1));
                  setSuggest(true);
                }
                if (e.key === "ArrowUp") {
                  e.preventDefault();
                  setActive((a) => Math.max(0, a - 1));
                }
                if (e.key === "Enter" && suggest && active >= 0) {
                  e.preventDefault();
                  setDestination(matches[active].name);
                  setSuggest(false);
                }
                if (e.key === "Escape") setSuggest(false);
              }}
            />
          </div>
          {suggest && matches.length > 0 && (
            <ul id="destination-options" role="listbox" className="suggestions">
              {matches.map((d, i) => (
                <li
                  id={`destination-${i}`}
                  key={d.name}
                  role="option"
                  aria-selected={i === active}
                  className={i === active ? "selected" : ""}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    setDestination(d.name);
                    setSuggest(false);
                  }}
                >
                  <MapPin size={16} />
                  <span>
                    {d.name}
                    <small>{d.country}</small>
                  </span>
                  <ArrowUpRight size={15} />
                </li>
              ))}
            </ul>
          )}
        </div>
        <button
          type="button"
          className="search-field search-option"
          onClick={() => {
            setPanel("dates");
            setError("");
          }}
        >
          <CalendarDays size={20} />
          <span>
            <strong>When?</strong>
            <small>{dateLabel}</small>
          </span>
        </button>
        <button
          type="button"
          className="search-field search-option"
          onClick={() => setPanel("guests")}
        >
          <Users size={20} />
          <span>
            <strong>Who’s coming?</strong>
            <small>{guests} guests</small>
          </span>
        </button>
        <button className="btn btn-primary search-submit" type="submit">
          <Search size={19} />
          <span>Find my escape</span>
        </button>
      </form>
      {panel && (
        <Modal
          title={
            panel === "dates"
              ? "Make time for a little escape"
              : "Who’s coming along?"
          }
          onClose={() => setPanel(null)}
        >
          {panel === "dates" ? (
            <>
              <p className="muted">Pick your check-in and check-out dates.</p>
              <div className="date-grid">
                <label>
                  Check-in
                  <input
                    type="date"
                    min={dateAfter(0)}
                    value={start}
                    onChange={(e) => setStart(e.target.value)}
                  />
                </label>
                <label>
                  Check-out
                  <input
                    type="date"
                    min={start || dateAfter(1)}
                    value={end}
                    onChange={(e) => setEnd(e.target.value)}
                  />
                </label>
              </div>
              {error && (
                <p className="form-error" role="alert">
                  {error}
                </p>
              )}
            </>
          ) : (
            <GuestStepper value={guests} onChange={setGuests} />
          )}
          <button
            className="btn btn-primary full-width"
            onClick={() => {
              if (
                panel === "dates" &&
                (!start || !end || end <= start || start < dateAfter(0))
              ) {
                setError("Choose future dates with check-out after check-in.");
                return;
              }
              setPanel(null);
            }}
          >
            Apply {panel === "dates" ? "dates" : "guests"}
            <Check size={17} />
          </button>
        </Modal>
      )}
    </>
  );
}
export function Favorite({ id, name }: { id: string; name: string }) {
  const { saved, toggleSaved } = useDemo();
  const selected = saved.includes(id);
  return (
    <button
      className={`favorite ${selected ? "is-saved" : ""}`}
      aria-label={`${selected ? "Unsave" : "Save"} ${name}`}
      aria-pressed={selected}
      onClick={() => toggleSaved(id)}
    >
      <Heart size={19} fill={selected ? "currentColor" : "none"} />
    </button>
  );
}
export function Rating({
  rating,
  reviews,
}: {
  rating: number;
  reviews?: number;
}) {
  return (
    <span className="rating">
      <Star size={13} fill="currentColor" />
      {rating.toFixed(2)}
      {reviews !== undefined && <span className="muted">({reviews})</span>}
    </span>
  );
}
export function StayCard({ stay }: { stay: Stay }) {
  const [params] = useSearchParams();
  const trip = new URLSearchParams();
  for (const key of ["start", "end", "guests"]) {
    const value = params.get(key);
    if (value) trip.set(key, value);
  }
  const href = "/stays/" + stay.id + (trip.size ? "?" + trip.toString() : "");
  return (
    <article className="stay-card">
      <div className="card-photo">
        <Link to={href} tabIndex={-1} aria-hidden="true">
          <Photo src={stay.image} alt={`${stay.name} in ${stay.city}`} />
        </Link>
        <span className="photo-tag">{stay.tag}</span>
        <Favorite id={stay.id} name={stay.name} />
      </div>
      <div className="card-topline">
        <span>{stay.type}</span>
        <Rating rating={stay.rating} />
      </div>
      <h3>
        <Link to={href}>{stay.name}</Link>
      </h3>
      <p className="card-location">
        {stay.city}, {stay.country}
      </p>
      <div className="card-bottom">
        <span>
          <strong>{currency(stay.price)}</strong>
          <span className="muted"> / night</span>
        </span>
        <Link to={href} className="text-link" aria-label={`View ${stay.name}`}>
          <ArrowUpRight size={20} />
        </Link>
      </div>
    </article>
  );
}
export function ExperienceCard({
  experience,
  onOpen,
}: {
  experience: Experience;
  onOpen: (e: Experience) => void;
}) {
  return (
    <article className="stay-card experience-card">
      <div className="card-photo">
        <button
          className="image-button"
          onClick={() => onOpen(experience)}
          tabIndex={-1}
          aria-hidden="true"
        >
          <Photo src={experience.image} alt={experience.name} />
        </button>
        <span className="photo-tag">{experience.duration}</span>
        <Favorite id={experience.id} name={experience.name} />
      </div>
      <div className="card-topline">
        <span>
          {experience.city} · {experience.category}
        </span>
        <Rating rating={experience.rating} />
      </div>
      <h3>
        <button className="plain-button" onClick={() => onOpen(experience)}>
          {experience.name}
        </button>
      </h3>
      <div className="card-bottom">
        <span>
          <strong>{currency(experience.price)}</strong>
          <span className="muted"> / person</span>
        </span>
        <button
          className="text-link"
          aria-label={`Explore ${experience.name}`}
          onClick={() => onOpen(experience)}
        >
          <ArrowUpRight size={20} />
        </button>
      </div>
    </article>
  );
}
export function SectionHeading({
  eyebrow,
  title,
  description,
  link,
  label,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  link?: string;
  label?: string;
}) {
  return (
    <div className="section-heading">
      <div>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h2>{title}</h2>
        {description && <p className="muted">{description}</p>}
      </div>
      {link && (
        <Link className="text-link" to={link}>
          {label || "Explore all"}
          <ArrowRight size={18} />
        </Link>
      )}
    </div>
  );
}
export function Footer() {
  const [info, setInfo] = useState<string | null>(null);
  const copy: Record<string, string> = {
    "Our story":
      "We believe the best trips leave space for the unexpected. ROAMLY is a portfolio travel demo celebrating thoughtful stays, independent hosts, and local discoveries.",
    "How it works":
      "Explore our curated sample stays, save your favorites, and choose your dates. Reservations are interactive demonstrations: no payment is collected and no real booking is made.",
    Privacy:
      "Your saved places and theme preference are stored only in this browser. This demo has no user accounts, tracking system, or server collecting your information.",
    Terms:
      "ROAMLY is a fictional front-end portfolio demo. All prices, hosts, reviews, availability, and reservations are illustrative. Images are provided by Unsplash.",
    "Contact us":
      "This is a self-contained portfolio demo. There is no support inbox or messaging service connected. Explore the stays and booking flows to see the experience in action.",
  };
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-main">
          <div className="footer-brand">
            <Brand />
            <p>
              Good places. Great little escapes.
              <br />A world worth slowing down for.
            </p>
            <span className="footer-note">
              <Compass size={15} /> Made for the curious.
            </span>
          </div>
          <div>
            <h4>Find your escape</h4>
            <Link to="/stays">Thoughtful stays</Link>
            <Link to="/experiences">Local experiences</Link>
            <Link to="/saved">Your saved places</Link>
          </div>
          <div>
            <h4>A little about us</h4>
            {["Our story", "How it works", "Contact us"].map((s) => (
              <button key={s} onClick={() => setInfo(s)}>
                {s}
              </button>
            ))}
          </div>
          <div>
            <h4>Somewhere good</h4>
            {destinations.slice(0, 3).map((d) => (
              <Link key={d.name} to={"/stays?destination=" + d.name}>
                {d.name}, {d.country}
              </Link>
            ))}
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} ROAMLY. Stay curious.</span>
          <div>
            <button onClick={() => setInfo("Privacy")}>Privacy</button>
            <button onClick={() => setInfo("Terms")}>Terms</button>
            <span>English · EUR €</span>
          </div>
        </div>
      </div>
      {info && (
        <Modal title={info} onClose={() => setInfo(null)}>
          <p className="modal-copy">{copy[info]}</p>
          <button className="btn btn-primary" onClick={() => setInfo(null)}>
            Got it
            <Check size={16} />
          </button>
        </Modal>
      )}
    </footer>
  );
}
