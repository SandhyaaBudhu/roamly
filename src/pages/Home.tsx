import { useRef, useState, type CSSProperties } from "react";
import { Link } from "react-router-dom";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Compass,
  MapPin,
  ShieldCheck,
  Sparkles,
  Star,
} from "lucide-react";
import { destinations, images, stays } from "../data";
import { Photo, SearchForm, SectionHeading, StayCard } from "../components";
export function Home() {
  const rail = useRef<HTMLDivElement>(null);
  const [subscribed, setSubscribed] = useState(false);
  const imageBg = (image: string) =>
    ({ backgroundImage: `url("${image}")` }) as CSSProperties;
  return (
    <>
      <section className="hero-shell">
        <div className="hero" style={imageBg(images.coast)}>
          <Photo
            src={images.coast}
            alt="Colorful coastal village overlooking the turquoise Mediterranean"
            loading="eager"
            fetchPriority="high"
            className="hero-photo"
          />
          <div className="hero-shade" />
          <div className="hero-content">
            <p className="hero-eyebrow">
              <span /> FOR THE DAYS THAT BECOME STORIES
            </p>
            <h1>
              A little further
              <br />
              from <em>ordinary.</em>
            </h1>
            <p>
              Beautiful stays. Local discoveries.
              <br />
              Your next great little escape starts here.
            </p>
            <a className="hero-scroll" href="#trending">
              Find your somewhere <ArrowDown size={15} />
            </a>
          </div>
          <div className="hero-location">
            <MapPin size={15} />
            <span>Somewhere in Cinque Terre, Italy</span>
          </div>
          <div className="hero-search-wrap">
            <SearchForm />
          </div>
        </div>
      </section>
      <div className="container trust-strip">
        <div>
          <ShieldCheck />
          <span>Handpicked, never endless</span>
        </div>
        <div>
          <Star />
          <span>4.9/5 from happy wanderers</span>
        </div>
        <div>
          <CheckCircle2 />
          <span>Small trips. Lasting memories.</span>
        </div>
        <div className="trust-extra">
          <Compass />
          <span>A little local knowledge</span>
        </div>
      </div>
      <section className="container section destinations-section" id="trending">
        <div className="section-heading">
          <div>
            <p className="eyebrow">FOLLOW YOUR CURIOSITY</p>
            <h2>
              Trending now<span className="heading-dot">.</span>
            </h2>
            <p className="muted">
              Places we can’t stop thinking about. You might feel the same.
            </p>
          </div>
          <div className="rail-controls">
            <button
              className="icon-btn"
              aria-label="Previous destinations"
              onClick={() =>
                rail.current?.scrollBy({ left: -330, behavior: "smooth" })
              }
            >
              <ChevronLeft size={19} />
            </button>
            <button
              className="icon-btn"
              aria-label="Next destinations"
              onClick={() =>
                rail.current?.scrollBy({ left: 330, behavior: "smooth" })
              }
            >
              <ChevronRight size={19} />
            </button>
          </div>
        </div>
        <div ref={rail} className="destination-rail">
          {destinations.map((d, i) => (
            <Link
              to={"/stays?destination=" + d.name}
              className="destination-card"
              key={d.name}
            >
              <div className="destination-photo" style={imageBg(d.image)}>
                <Photo
                  src={d.image}
                  alt={`A glimpse of ${d.name}, ${d.country}`}
                />
                <span className="destination-number">0{i + 1}</span>
                <span className="destination-arrow">
                  <ArrowUpRight size={18} />
                </span>
                <div className="destination-caption">
                  <small>{d.country}</small>
                  <h3>{d.name}</h3>
                </div>
              </div>
              <p>{d.caption}</p>
            </Link>
          ))}
        </div>
      </section>
      <section className="styles-section">
        <div className="container styles-grid">
          <div className="styles-intro">
            <p className="eyebrow">NO TWO ESCAPES ALIKE</p>
            <h2>
              Your kind
              <br />
              of <em>getaway.</em>
            </h2>
            <p>
              For a change of scenery.
              <br />A slower pace. A story to bring home.
              <br />
              Find a trip that feels like you.
            </p>
            <Link to="/stays" className="text-link">
              Let’s find your fit <ArrowRight size={18} />
            </Link>
            <div className="decorative-compass" aria-hidden="true">
              <Compass strokeWidth={0.6} />
            </div>
          </div>
          <div className="trip-style city-style" style={imageBg(images.lisbon)}>
            <Photo
              src={images.lisbon}
              alt="A yellow tram in Lisbon’s sunlit Bica district"
            />
            <div className="trip-style-content">
              <span>01 / A CHANGE OF SCENERY</span>
              <h3>
                City, with a<br />
                different rhythm.
              </h3>
              <Link to="/stays?type=Apartment">
                Find a city break <ArrowUpRight size={19} />
              </Link>
            </div>
          </div>
          <div className="trip-style-stack">
            <div
              className="trip-style island-style"
              style={imageBg(images.santorini)}
            >
              <Photo
                src={images.santorini}
                alt="Whitewashed island homes by the Aegean Sea"
              />
              <div className="trip-style-content">
                <span>02 / LESS RUSH, MORE HUSH</span>
                <h3>Island state of mind.</h3>
                <Link to="/stays?type=Villa">
                  Explore island stays <ArrowUpRight size={18} />
                </Link>
              </div>
            </div>
            <Link to="/experiences" className="local-style">
              <div>
                <span>03 / GO A LITTLE DEEPER</span>
                <h3>Live a little local.</h3>
                <p>The best stories start with a local.</p>
              </div>
              <span className="local-icon">
                <Sparkles size={24} />
                <ArrowUpRight size={20} />
              </span>
            </Link>
          </div>
        </div>
      </section>
      <section className="container section">
        <SectionHeading
          eyebrow="CHECK IN. SWITCH OFF."
          title="Good places to land."
          description="Stays with soul, chosen for the way they make you feel."
          link="/stays"
          label="Explore all stays"
        />
        <div className="stay-grid">
          {stays.slice(0, 4).map((s) => (
            <StayCard key={s.id} stay={s} />
          ))}
        </div>
        <p className="curation-note">
          <Check size={15} /> Every stay is chosen for its character, comfort,
          and sense of place.
        </p>
      </section>
      <section className="container story-section">
        <div className="story-photo" style={imageBg(images.lisbon)}>
          <Photo
            src={images.lisbon}
            alt="Lisbon’s hillside streets and warm pastel buildings"
          />
          <span className="story-photo-label">
            <MapPin size={14} /> THE CITY OF SEVEN HILLS
          </span>
        </div>
        <div className="story-copy">
          <p className="eyebrow">THE ROAMLY JOURNAL · A WEEKEND WELL SPENT</p>
          <h2>
            48 hours
            <br />
            in <em>Lisbon.</em>
          </h2>
          <p>
            Pastel-colored streets. A table in the sun. One more custard tart.
            Here’s how to make a little time feel like a lot.
          </p>
          <div className="story-itinerary">
            <div>
              <span>DAY 01</span>
              <p>
                Get lost in Alfama.
                <br />
                <strong>Find yourself over dinner.</strong>
              </p>
            </div>
            <div>
              <span>DAY 02</span>
              <p>
                A slow morning in Belém.
                <br />
                <strong>A sunset worth staying for.</strong>
              </p>
            </div>
          </div>
          <Link className="btn btn-outline" to="/experiences?city=Lisbon">
            Make it your weekend <ArrowUpRight size={18} />
          </Link>
        </div>
      </section>
      <section className="container newsletter-section">
        <div className="newsletter-decor" aria-hidden="true">
          <Compass strokeWidth={0.7} />
        </div>
        <div>
          <p className="eyebrow">A LITTLE WANDERLUST, DELIVERED</p>
          <h2>
            Your next escape might
            <br />
            start in your inbox.
          </h2>
          <p className="muted">
            Fresh finds, local stories, and good reasons to get away.
          </p>
        </div>
        <div className="newsletter-form-wrap">
          {subscribed ? (
            <div className="newsletter-success" role="status">
              <CheckCircle2 size={28} />
              <div>
                <strong>You’re on the list.</strong>
                <p>
                  Thanks for stopping by. This demo keeps your email private.
                </p>
              </div>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSubscribed(true);
              }}
              className="newsletter-form"
            >
              <label className="sr-only" htmlFor="email">
                Your email address
              </label>
              <input
                id="email"
                type="email"
                required
                placeholder="Your email address"
              />
              <button className="btn btn-primary">
                Count me in <ArrowRight size={17} />
              </button>
            </form>
          )}
          <small>
            Only the good stuff. A demo signup — no emails are sent.
          </small>
        </div>
      </section>
    </>
  );
}
