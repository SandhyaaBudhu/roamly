import { useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Bath,
  BedDouble,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Coffee,
  Grid2X2,
  Heart,
  MapPin,
  ShieldCheck,
  Snowflake,
  Sparkles,
  Star,
  Users,
  UtensilsCrossed,
  Waves,
  Wifi,
} from "lucide-react";
import { currency, dateAfter, images, nightsBetween, stays } from "../data";
import { GuestStepper, Modal, Photo, Rating, StayCard } from "../components";
import { NotFound } from "./Collections";
import { useDemo } from "../state";
const amenityIcons: Record<string, typeof Wifi> = {
  "Wi-Fi": Wifi,
  Pool: Waves,
  Breakfast: Coffee,
  Kitchen: UtensilsCrossed,
  "Sea view": Waves,
  "Air conditioning": Snowflake,
};
export function StayDetail() {
  const { id } = useParams();
  const [params] = useSearchParams();
  const stay = stays.find((s) => s.id === id);
  const { saved, toggleSaved } = useDemo();
  const [gallery, setGallery] = useState<number | null>(null);
  const [room, setRoom] = useState(
    (Number(params.get("guests")) || 2) > 2 ? "suite" : "classic",
  );
  const [start, setStart] = useState(params.get("start") || dateAfter(14));
  const [end, setEnd] = useState(params.get("end") || dateAfter(17));
  const [guests, setGuests] = useState(
    Math.max(1, Math.min(Number(params.get("guests")) || 2, 4)),
  );
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState("");
  if (!stay) return <NotFound />;
  const photos = [
    stay.image,
    images.room,
    images.interior,
    images.pool,
    images.villa,
  ];
  const titles = [
    "Your own little escape",
    "A restful room",
    "Space to slow down",
    "A moment in the sunshine",
    "Thoughtfully chosen details",
  ];
  const roomPrice = stay.price + (room === "suite" ? 55 : 0);
  const nights = nightsBetween(start, end);
  const valid = Number.isFinite(nights) && nights > 0;
  const subtotal = valid ? nights * roomPrice : 0;
  const fee = Math.round(subtotal * 0.08);
  const total = subtotal + 35 + fee;
  function reserve(e: React.FormEvent) {
    e.preventDefault();
    if (!valid || start < dateAfter(0)) {
      setError("Choose future dates with check-out after check-in.");
      return;
    }
    if (nights > 30) {
      setError(
        "Our little escapes are up to 30 nights. Please choose a shorter stay.",
      );
      return;
    }
    setError("");
    setConfirmed(true);
  }
  function changeRoom(value: string) {
    setRoom(value);
    if (value === "classic" && guests > 2) setGuests(2);
  }
  return (
    <div className="container detail-page">
      <Link to="/stays" className="back-link">
        <ArrowLeft size={16} /> All thoughtful stays
      </Link>
      <div className="detail-title">
        <div>
          <p className="eyebrow">
            {stay.type.toUpperCase()} · {stay.city.toUpperCase()}
          </p>
          <h1>{stay.name}</h1>
          <div className="detail-meta">
            <Rating rating={stay.rating} reviews={stay.reviews} />
            <span>·</span>
            <span>
              <MapPin size={15} />
              {stay.area}, {stay.city}, {stay.country}
            </span>
            <span className="detail-favorite-badge">
              <Sparkles size={14} /> Roamly favorite
            </span>
          </div>
        </div>
        <button
          className="btn btn-outline"
          onClick={() => toggleSaved(stay.id)}
        >
          <Heart
            size={17}
            fill={saved.includes(stay.id) ? "currentColor" : "none"}
          />
          {saved.includes(stay.id) ? "Saved" : "Save stay"}
        </button>
      </div>
      <div className="photo-mosaic">
        {photos.map((src, i) => (
          <button
            key={i}
            className={"mosaic-item mosaic-" + i}
            aria-label={`Open photo ${i + 1}: ${titles[i]}`}
            onClick={() => setGallery(i)}
          >
            <Photo
              src={src}
              alt={titles[i] + " at " + stay.name}
              loading={i === 0 ? "eager" : "lazy"}
            />
          </button>
        ))}
        <button className="gallery-open btn" onClick={() => setGallery(0)}>
          <Grid2X2 size={16} /> All photos
        </button>
      </div>
      <div className="detail-layout">
        <div className="detail-content">
          <section className="host-section">
            <div>
              <h2>
                A lovely place to
                <br className="mobile-only" /> call your own.
              </h2>
              <p className="muted">2–4 guests · 1 bedroom · 1 bathroom</p>
            </div>
            <div className="host-badge">
              <div className="host-avatar">I</div>
              <div>
                <strong>Hosted by Inês</strong>
                <span>
                  <ShieldCheck size={13} /> Roamly verified host
                </span>
              </div>
            </div>
          </section>
          <div className="stay-highlights">
            <div>
              <MapPin />
              <span>
                <strong>A neighborhood worth knowing</strong>
                <small>Local favorites right on your doorstep.</small>
              </span>
            </div>
            <div>
              <BedDouble />
              <span>
                <strong>Rest comes naturally here</strong>
                <small>Soft linens, considered details, peaceful nights.</small>
              </span>
            </div>
            <div>
              <CheckCircle2 />
              <span>
                <strong>A little flexibility goes a long way</strong>
                <small>Free cancellation up to 7 days before arrival.</small>
              </span>
            </div>
          </div>
          <section className="detail-section">
            <p className="eyebrow">A FEELING OF BELONGING</p>
            <h2>Settle in. Slow down.</h2>
            <p>{stay.description}</p>
            <p>
              Each day can be as full or as unhurried as you like. Your host’s
              personal neighborhood guide points you toward the good coffee, the
              little shops, and the corners most visitors walk right past.
            </p>
          </section>
          <section className="detail-section">
            <h2>The little comforts.</h2>
            <div className="amenities-grid">
              {[...stay.amenities, "Fresh linen", "Private bathroom"].map(
                (a) => {
                  const Icon =
                    amenityIcons[a] || (a === "Fresh linen" ? BedDouble : Bath);
                  return (
                    <div key={a}>
                      <Icon size={20} />
                      <span>{a}</span>
                    </div>
                  );
                },
              )}
            </div>
          </section>
          <section className="detail-section">
            <h2>Room to make yourself at home.</h2>
            <p className="muted">Choose the space that suits your escape.</p>
            <div className="room-options">
              {[
                {
                  id: "classic",
                  name: "The Classic Room",
                  desc: "A cozy retreat for two",
                  image: images.room,
                  price: stay.price,
                  max: 2,
                },
                {
                  id: "suite",
                  name: "The Terrace Suite",
                  desc: "A little more room. A lovely private terrace.",
                  image: images.interior,
                  price: stay.price + 55,
                  max: 4,
                },
              ].map((r) => (
                <button
                  key={r.id}
                  className={`room-option ${room === r.id ? "selected" : ""}`}
                  onClick={() => changeRoom(r.id)}
                  aria-pressed={room === r.id}
                >
                  <Photo src={r.image} alt={r.name} />
                  <div>
                    <strong>{r.name}</strong>
                    <p>{r.desc}</p>
                    <span>
                      <Users size={13} /> Up to {r.max} guests · Queen bed
                    </span>
                    <b>
                      {currency(r.price)} <small>/ night</small>
                    </b>
                  </div>
                  <span className="radio-check">
                    {room === r.id && <Check size={14} />}
                  </span>
                </button>
              ))}
            </div>
          </section>
          <section className="detail-section">
            <div className="review-heading">
              <h2>A few words from fellow wanderers.</h2>
              <span>
                <Star size={17} fill="currentColor" /> {stay.rating}{" "}
                <small>· {stay.reviews} reviews</small>
              </span>
            </div>
            <div className="reviews-grid">
              {[
                {
                  name: "Charlotte",
                  initial: "C",
                  from: "London, UK",
                  text: "The sort of place that makes you want to stay an extra night. Every detail felt thoughtful, and the local recommendations were wonderful.",
                },
                {
                  name: "Julian",
                  initial: "J",
                  from: "Berlin, Germany",
                  text: "Beautiful light, a genuinely comfortable bed, and such a lovely welcome. We already want to come back.",
                },
              ].map((r) => (
                <article key={r.name}>
                  <div className="review-person">
                    <span>{r.initial}</span>
                    <div>
                      <strong>{r.name}</strong>
                      <small>{r.from} · Recent guest</small>
                    </div>
                  </div>
                  <div className="review-stars" aria-label="5 out of 5 stars">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star key={i} size={11} fill="currentColor" />
                    ))}
                  </div>
                  <p>{r.text}</p>
                </article>
              ))}
            </div>
          </section>
          <section className="neighborhood-note">
            <MapPin size={25} />
            <div>
              <p className="eyebrow">YOUR NEIGHBORHOOD, AT A GLANCE</p>
              <h2>A little local perspective.</h2>
              <p>
                {stay.area} has its own wonderful rhythm. Start with a slow
                breakfast, explore the neighborhood’s independent shops, and ask
                your host about a favorite place for dinner. Most everyday
                essentials are an easy walk away.
              </p>
              <span>
                Exact address shared with a confirmed booking in a real service.
              </span>
            </div>
          </section>
          <section className="detail-section house-rules">
            <h2>Good to know before you go.</h2>
            <div>
              <span>
                <strong>Check-in</strong>After 3:00 PM
              </span>
              <span>
                <strong>Check-out</strong>Before 11:00 AM
              </span>
              <span>
                <strong>House rules</strong>No smoking · No parties
              </span>
            </div>
            <details>
              <summary>Cancellation & booking details</summary>
              <p>
                Cancel free up to 7 days before arrival. This is an illustrative
                policy for our portfolio demo. No actual availability is checked
                and no reservation or payment is processed.
              </p>
            </details>
          </section>
        </div>
        <aside className="booking-column">
          <form className="booking-card" onSubmit={reserve}>
            <div className="booking-price">
              <span>
                <strong>{currency(roomPrice)}</strong>{" "}
                <span className="muted">/ night</span>
              </span>
              <Rating rating={stay.rating} />
            </div>
            <p className="booking-caption">
              Your own little escape, made easy.
            </p>
            <div className="booking-fields">
              <div className="date-grid">
                <label>
                  CHECK-IN
                  <input
                    type="date"
                    required
                    min={dateAfter(0)}
                    value={start}
                    onChange={(e) => setStart(e.target.value)}
                  />
                </label>
                <label>
                  CHECK-OUT
                  <input
                    type="date"
                    required
                    min={start ? dateAfterDifference(start, 1) : dateAfter(1)}
                    value={end}
                    onChange={(e) => setEnd(e.target.value)}
                  />
                </label>
              </div>
              <label className="room-select-label">
                YOUR ROOM
                <select
                  value={room}
                  onChange={(e) => changeRoom(e.target.value)}
                >
                  <option value="classic">The Classic Room</option>
                  <option value="suite">
                    The Terrace Suite (+€55 / night)
                  </option>
                </select>
              </label>
              <GuestStepper
                value={guests}
                onChange={setGuests}
                max={room === "suite" ? 4 : 2}
              />
            </div>
            {valid && (
              <div className="booking-breakdown">
                <div>
                  <span>
                    {currency(roomPrice)} × {nights}{" "}
                    {nights === 1 ? "night" : "nights"}
                  </span>
                  <span>{currency(subtotal)}</span>
                </div>
                <div>
                  <span>Cleaning fee</span>
                  <span>€35</span>
                </div>
                <div>
                  <span>Service fee · 8%</span>
                  <span>{currency(fee)}</span>
                </div>
                <div className="booking-total">
                  <strong>
                    Total <small>EUR</small>
                  </strong>
                  <strong>{currency(total)}</strong>
                </div>
              </div>
            )}
            {error && (
              <p className="form-error" role="alert">
                {error}
              </p>
            )}
            <button className="btn btn-primary full-width">
              Reserve your escape
              <ArrowRight size={18} />
            </button>
            <p className="booking-disclaimer">
              You won’t be charged. This is a demo booking.
            </p>
            <div className="booking-trust">
              <ShieldCheck size={17} />
              <span>Thoughtful stays. A little peace of mind.</span>
            </div>
          </form>
        </aside>
      </div>
      <section className="section related-stays">
        <div className="section-heading">
          <div>
            <p className="eyebrow">KEEP YOUR OPTIONS OPEN</p>
            <h2>You might feel at home here, too.</h2>
          </div>
          <Link to="/stays" className="text-link">
            Explore more
            <ArrowRight size={17} />
          </Link>
        </div>
        <div className="stay-grid">
          {stays
            .filter((s) => s.id !== stay.id)
            .slice(0, 4)
            .map((s) => (
              <StayCard key={s.id} stay={s} />
            ))}
        </div>
      </section>
      {gallery !== null && (
        <Modal
          title={`${stay.name} · ${gallery + 1} / ${photos.length}`}
          onClose={() => setGallery(null)}
          wide
        >
          <div className="gallery-view">
            <Photo
              src={photos[gallery]}
              alt={titles[gallery] + " at " + stay.name}
            />
            <button
              className="gallery-prev icon-btn"
              aria-label="Previous photo"
              onClick={() =>
                setGallery((gallery + photos.length - 1) % photos.length)
              }
            >
              <ChevronLeft />
            </button>
            <button
              className="gallery-next icon-btn"
              aria-label="Next photo"
              onClick={() => setGallery((gallery + 1) % photos.length)}
            >
              <ChevronRight />
            </button>
          </div>
          <div className="gallery-thumbnails">
            {photos.map((p, i) => (
              <button
                key={i}
                className={gallery === i ? "active" : ""}
                onClick={() => setGallery(i)}
                aria-label={`View photo ${i + 1}`}
                aria-pressed={gallery === i}
              >
                <Photo src={p} alt={titles[i]} />
              </button>
            ))}
          </div>
        </Modal>
      )}
      {confirmed && (
        <Modal
          title="Your little escape is taking shape."
          onClose={() => setConfirmed(false)}
        >
          <div className="confirmation-icon">
            <CheckCircle2 size={36} />
          </div>
          <p className="confirmation-lead">You’re headed to {stay.city}.</p>
          <div className="confirmation-summary">
            <Photo src={stay.image} alt={stay.name} />
            <div>
              <strong>{stay.name}</strong>
              <p>
                {room === "suite" ? "The Terrace Suite" : "The Classic Room"}
              </p>
              <p>
                {start} → {end}
              </p>
              <p>
                {guests} guests · {nights} nights
              </p>
              <strong>{currency(total)} total</strong>
            </div>
          </div>
          <p className="demo-note">
            Demo reservation · RM-{stay.id.slice(0, 3).toUpperCase()}-2048
            <br />
            No booking was made and no payment was collected.
          </p>
          <button
            className="btn btn-primary full-width"
            onClick={() => setConfirmed(false)}
          >
            Keep exploring
            <ArrowRight size={18} />
          </button>
        </Modal>
      )}
    </div>
  );
}
function dateAfterDifference(value: string, days: number) {
  const d = new Date(value + "T12:00");
  d.setDate(d.getDate() + days);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
