import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock,
  Compass,
  Heart,
  MapPin,
  Search,
  Users,
} from "lucide-react";
import {
  currency,
  dateAfter,
  experiences,
  images,
  stays,
  type Experience,
} from "../data";
import {
  ExperienceCard,
  GuestStepper,
  Modal,
  Photo,
  Rating,
  StayCard,
} from "../components";
import { useDemo } from "../state";
export function ExperienceDialog({
  experience,
  onClose,
}: {
  experience: Experience;
  onClose: () => void;
}) {
  const [date, setDate] = useState(dateAfter(14));
  const [guests, setGuests] = useState(2);
  const [time, setTime] = useState("10:00");
  const [confirmed, setConfirmed] = useState(false);
  return (
    <Modal
      title={confirmed ? "A good story in the making." : experience.name}
      onClose={onClose}
    >
      {confirmed ? (
        <>
          <div className="confirmation-icon">
            <CheckCircle2 size={36} />
          </div>
          <p className="confirmation-lead">
            A little local discovery, reserved.
          </p>
          <div className="experience-confirmation">
            <strong>{experience.name}</strong>
            <p>
              {date} at {time} · {guests} guests
            </p>
            <p>{currency(experience.price * guests)} total</p>
          </div>
          <p className="demo-note">
            This is a demo confirmation. No real booking or payment was made.
          </p>
          <button className="btn btn-primary full-width" onClick={onClose}>
            Keep exploring
            <ArrowRight size={17} />
          </button>
        </>
      ) : (
        <>
          <div className="experience-modal-photo">
            <Photo src={experience.image} alt={experience.name} />
          </div>
          <div className="experience-modal-meta">
            <span>
              <MapPin size={15} />
              {experience.city}
            </span>
            <span>
              <Clock size={15} />
              {experience.duration}
            </span>
            <Rating rating={experience.rating} />
          </div>
          <p className="modal-copy">{experience.description}</p>
          <div className="experience-included">
            <CheckCircle2 size={17} /> Small groups · Local host · Thoughtfully
            curated
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (date >= dateAfter(0)) setConfirmed(true);
            }}
          >
            <div className="date-grid">
              <label>
                Your day
                <input
                  type="date"
                  required
                  min={dateAfter(0)}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </label>
              <label>
                Start time
                <select value={time} onChange={(e) => setTime(e.target.value)}>
                  <option>10:00</option>
                  <option>14:00</option>
                  <option>17:00</option>
                </select>
              </label>
            </div>
            <GuestStepper value={guests} onChange={setGuests} max={6} />
            <div className="experience-price">
              <span>
                {currency(experience.price)} × {guests} guests
              </span>
              <strong>{currency(experience.price * guests)}</strong>
            </div>
            <button className="btn btn-primary full-width">
              Reserve this experience
              <ArrowRight size={17} />
            </button>
            <p className="booking-disclaimer">
              A demo reservation. You won’t be charged.
            </p>
          </form>
        </>
      )}
    </Modal>
  );
}
export function Experiences() {
  const [params] = useSearchParams();
  const [city, setCity] = useState(params.get("city") || "");
  const [category, setCategory] = useState("All experiences");
  const [selected, setSelected] = useState<Experience | null>(null);
  const [sort, setSort] = useState("curated");
  const visible = experiences
    .filter(
      (e) =>
        (e.city + " " + e.name).toLowerCase().includes(city.toLowerCase()) &&
        (category === "All experiences" || e.category === category),
    )
    .sort((a, b) =>
      sort === "price"
        ? a.price - b.price
        : sort === "rating"
          ? b.rating - a.rating
          : 0,
    );
  return (
    <>
      <section className="container experience-hero">
        <div className="experience-hero-copy">
          <p className="eyebrow">LESS SIGHTSEEING. MORE FEELING.</p>
          <h1>
            Go a little
            <br />
            <em>local.</em>
          </h1>
          <p>
            The kind of moments you can’t find in a guidebook.
            <br />
            Meet the people who make a place a place.
          </p>
          <div className="experience-hero-note">
            <Users size={19} />
            <span>Small groups. Good company. Real connection.</span>
          </div>
        </div>
        <div className="experience-hero-photo">
          <Photo
            src={images.food}
            alt="A thoughtfully prepared meal waiting to be shared"
          />
          <span className="experience-photo-tag">
            <MapPin size={14} /> Pull up a chair. Stay a little longer.
          </span>
        </div>
      </section>
      <section className="container section experience-list">
        <div className="section-heading">
          <div>
            <p className="eyebrow">COLLECT MOMENTS, NOT CHECKLISTS</p>
            <h2>A different way to discover.</h2>
          </div>
          <div className="catalog-search">
            <Search size={17} />
            <label className="sr-only" htmlFor="experience-search">
              Search experiences
            </label>
            <input
              id="experience-search"
              placeholder="Find a city or experience…"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>
        </div>
        <div className="collection-toolbar">
          <div className="filter-chips">
            {[
              "All experiences",
              "Food & culture",
              "On the water",
              "Outdoors",
              "Art & discovery",
            ].map((c) => (
              <button
                key={c}
                className={category === c ? "chip active" : "chip"}
                onClick={() => setCategory(c)}
              >
                {c}
              </button>
            ))}
          </div>
          <select
            aria-label="Sort experiences"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="curated">Our picks</option>
            <option value="price">Price: low to high</option>
            <option value="rating">Top rated</option>
          </select>
        </div>
        <p className="results-count">
          {visible.length} local discoveries, thoughtfully chosen.
        </p>
        {visible.length ? (
          <div className="experience-grid">
            {visible.map((e) => (
              <ExperienceCard key={e.id} experience={e} onOpen={setSelected} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <Compass size={36} />
            <h2>There’s more to discover.</h2>
            <p>Try another city or explore every kind of experience.</p>
            <button
              className="btn btn-primary"
              onClick={() => {
                setCity("");
                setCategory("All experiences");
              }}
            >
              See all experiences
              <ArrowRight size={17} />
            </button>
          </div>
        )}
        <div className="experience-promise">
          <Compass size={30} />
          <div>
            <h3>A place is better with a local.</h3>
            <p>
              Every experience in our collection is built around a host’s
              personal perspective.
              <br />
              Less rushing between landmarks. More moments that stay with you.
            </p>
          </div>
        </div>
      </section>
      {selected && (
        <ExperienceDialog
          experience={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  );
}
export function Saved() {
  const { saved } = useDemo();
  const [tab, setTab] = useState("All places");
  const [selected, setSelected] = useState<Experience | null>(null);
  const savedStays = stays.filter((s) => saved.includes(s.id));
  const savedExperiences = experiences.filter((e) => saved.includes(e.id));
  const count = savedStays.length + savedExperiences.length;
  return (
    <div className="container saved-page">
      <div className="saved-heading">
        <div>
          <p className="eyebrow">YOUR LITTLE COLLECTION OF POSSIBILITIES</p>
          <h1>
            For <em>another day.</em>
          </h1>
          <p className="muted">
            Good places to come back to. All your favorites, right here.
          </p>
        </div>
        <div className="saved-heading-icon">
          <Heart size={38} strokeWidth={1} />
        </div>
      </div>
      <div className="collection-toolbar saved-toolbar">
        <div
          className="filter-chips"
          role="tablist"
          aria-label="Saved item category"
        >
          {["All places", "Stays", "Experiences"].map((t) => (
            <button
              role="tab"
              aria-selected={tab === t}
              key={t}
              className={tab === t ? "chip active" : "chip"}
              onClick={() => setTab(t)}
            >
              {t}{" "}
              <span>
                {t === "All places"
                  ? count
                  : t === "Stays"
                    ? savedStays.length
                    : savedExperiences.length}
              </span>
            </button>
          ))}
        </div>
        <span className="muted">
          <Heart size={14} /> Saved on this device
        </span>
      </div>
      {count === 0 ? (
        <div className="saved-empty">
          <div className="empty-illustration">
            <Compass size={70} strokeWidth={0.7} />
            <Heart size={25} />
          </div>
          <p className="eyebrow">
            EVERY GOOD TRIP STARTS WITH A LITTLE INSPIRATION
          </p>
          <h2>
            Your next escape
            <br />
            is waiting to be found.
          </h2>
          <p>
            Tap the heart on a stay or experience to keep it here.
            <br />A little collection of places you’d love to be.
          </p>
          <Link className="btn btn-primary" to="/stays">
            Find your somewhere
            <ArrowRight size={18} />
          </Link>
        </div>
      ) : (
        <>
          <div role="tabpanel">
            {tab !== "Experiences" && (
              <section className="saved-collection">
                <div className="section-heading">
                  <h2>Somewhere to stay.</h2>
                  <Link to="/stays" className="text-link">
                    Discover more
                    <ArrowRight size={17} />
                  </Link>
                </div>
                {savedStays.length ? (
                  <div className="stay-grid">
                    {savedStays.map((s) => (
                      <StayCard key={s.id} stay={s} />
                    ))}
                  </div>
                ) : (
                  <div className="small-empty">
                    <BedIcon />
                    <p>No stays saved yet. Find a place that feels like you.</p>
                    <Link to="/stays" className="text-link">
                      Explore stays
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                )}
              </section>
            )}
            {tab !== "Stays" && (
              <section className="saved-collection">
                <div className="section-heading">
                  <h2>Something to remember.</h2>
                  <Link to="/experiences" className="text-link">
                    Discover more
                    <ArrowRight size={17} />
                  </Link>
                </div>
                {savedExperiences.length ? (
                  <div className="stay-grid">
                    {savedExperiences.map((e) => (
                      <ExperienceCard
                        key={e.id}
                        experience={e}
                        onOpen={setSelected}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="small-empty">
                    <CalendarDays size={26} />
                    <p>
                      No experiences saved yet. Make room for a local discovery.
                    </p>
                    <Link to="/experiences" className="text-link">
                      Explore experiences
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                )}
              </section>
            )}
          </div>
          <p className="saved-note">
            Your collection is kept in this browser. Come back whenever the
            wanderlust strikes.
          </p>
        </>
      )}
      {selected && (
        <ExperienceDialog
          experience={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}
function BedIcon() {
  return <MapPin size={26} />;
}
export function NotFound() {
  return (
    <div className="container empty-state not-found">
      <Compass size={50} strokeWidth={1} />
      <p className="eyebrow">A LITTLE OFF THE BEATEN PATH</p>
      <h1>
        This way to <em>somewhere.</em>
      </h1>
      <p>
        We couldn’t find that page. There are plenty of good places still to
        discover.
      </p>
      <Link to="/" className="btn btn-primary">
        Back to discovery
        <ArrowRight size={17} />
      </Link>
    </div>
  );
}
