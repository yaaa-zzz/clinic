import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Ambulance,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Clock3,
  ExternalLink,
  HeartPulse,
  MapPin,
  Menu,
  Phone,
  Star,
  Stethoscope,
  Syringe,
  UserRound,
  UserRoundCheck,
  X,
} from "lucide-react";

type Testimonial = {
  name: string;
  review: string;
  rating: number;
  source: string;
  reviewUrl?: string;
};

type GoogleReview = {
  authorAttribution?: { displayName?: string };
  googleMapsURI?: string;
  rating?: number;
  relativePublishTimeDescription?: string;
  text?: string;
};

type GooglePlace = {
  fetchFields: (request: { fields: string[] }) => Promise<unknown>;
  rating?: number;
  reviews?: GoogleReview[];
  userRatingCount?: number;
};

type GoogleMapsGlobal = {
  maps: {
    importLibrary: (library: string) => Promise<{ Place: new (options: { id: string }) => GooglePlace }>;
  };
};

const navItems = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Doctor", href: "#doctor" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Gallery", href: "#gallery" },
  { label: "Contact", href: "#contact" },
];

const services = [
  { name: "General Consultation", icon: Stethoscope, description: "Complete everyday health consultations for adults and seniors." },
  { name: "Pediatric Care", icon: UserRoundCheck, description: "Child-friendly checkups, nutrition advice, and growth monitoring." },
  { name: "Dental Care", icon: HeartPulse, description: "Preventive dental evaluations and referral-based treatment planning." },
  { name: "Vaccination", icon: Syringe, description: "Routine and seasonal immunization services for families." },
  { name: "Health Checkup", icon: ClipboardList, description: "Preventive annual packages with detailed medical counseling." },
  { name: "Referral Support", icon: Ambulance, description: "Prompt guidance and referral coordination when specialist care is needed." },
];

const clinicDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const galleryImages = [
  { src: "/images/clinic-storefront.jpeg", alt: "Front view of Malar Memorial Clinic in Parangipettai" },
  { src: "/images/malar-memorial-signboard.jpeg", alt: "Illuminated Malar Memorial Clinic signboard" },
  { src: "/images/clinic-entrance-door.jpeg", alt: "Entrance door of Malar Memorial Clinic" },
  { src: "/images/doctor-consultation-room.jpeg", alt: "Doctor consultation room at Malar Memorial Clinic" },
  { src: "/images/clinic-medicine-room.jpeg", alt: "Organized medicine room inside Malar Memorial Clinic" },
];

const fallbackTestimonials: Testimonial[] = [
  { name: "Beaulah Glory", review: "Very good doctor.", rating: 5, source: "Google review" },
];

const env = (import.meta as ImportMeta & {
  env: { VITE_GOOGLE_MAPS_API_KEY?: string; VITE_GOOGLE_PLACE_ID?: string };
}).env;

const googleApiKey = env.VITE_GOOGLE_MAPS_API_KEY;
const googlePlaceId = env.VITE_GOOGLE_PLACE_ID;
const googleReviewUrl = googlePlaceId
  ? `https://search.google.com/local/writereview?placeid=${encodeURIComponent(googlePlaceId)}`
  : "https://www.google.com/maps/search/?api=1&query=Malar%20Memorial%20Clinic%20Parangipettai";

const loadGoogleMaps = (apiKey: string) =>
  new Promise<GoogleMapsGlobal>((resolve, reject) => {
    const currentGoogle = (window as Window & { google?: GoogleMapsGlobal }).google;
    if (currentGoogle) {
      resolve(currentGoogle);
      return;
    }

    const existingScript = document.querySelector<HTMLScriptElement>("script[data-google-maps]");
    const script = existingScript ?? document.createElement("script");
    const handleLoad = () => {
      const loadedGoogle = (window as Window & { google?: GoogleMapsGlobal }).google;
      if (loadedGoogle) resolve(loadedGoogle);
      else reject(new Error("Google Maps failed to initialize."));
    };

    script.addEventListener("load", handleLoad, { once: true });
    script.addEventListener("error", () => reject(new Error("Google Maps failed to load.")), { once: true });

    if (!existingScript) {
      script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}&libraries=places&v=weekly&loading=async`;
      script.async = true;
      script.dataset.googleMaps = "true";
      document.head.appendChild(script);
    }
  });

export default function App() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [selectedGalleryIndex, setSelectedGalleryIndex] = useState<number | null>(null);
  const [reviews, setReviews] = useState<Testimonial[]>(fallbackTestimonials);
  const [googleRating, setGoogleRating] = useState(5);
  const [googleReviewCount, setGoogleReviewCount] = useState(1);

  useEffect(() => {
    if (!googleApiKey || !googlePlaceId) return;

    let active = true;
    loadGoogleMaps(googleApiKey)
      .then(async (google) => {
        const { Place } = await google.maps.importLibrary("places");
        const place = new Place({ id: googlePlaceId });
        await place.fetchFields({ fields: ["rating", "reviews", "userRatingCount"] });
        if (!active) return;

        if (place.rating) setGoogleRating(place.rating);
        if (place.userRatingCount) setGoogleReviewCount(place.userRatingCount);
        if (place.reviews?.length) {
          setReviews(
            place.reviews.map((review) => ({
              name: review.authorAttribution?.displayName ?? "Google user",
              review: review.text ?? "Rated Malar Memorial Clinic on Google.",
              rating: review.rating ?? 5,
              source: review.relativePublishTimeDescription
                ? `Google review - ${review.relativePublishTimeDescription}`
                : "Google review",
              reviewUrl: review.googleMapsURI,
            })),
          );
        }
      })
      .catch(() => {
        // Keep the verified fallback review when Google is unavailable.
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (selectedGalleryIndex === null) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedGalleryIndex(null);
      if (event.key === "ArrowLeft") {
        setSelectedGalleryIndex((current) => current === null ? null : (current - 1 + galleryImages.length) % galleryImages.length);
      }
      if (event.key === "ArrowRight") {
        setSelectedGalleryIndex((current) => current === null ? null : (current + 1) % galleryImages.length);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedGalleryIndex]);

  return (
    <div className="bg-white text-slate-800">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-sky-100 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <a href="#home" className="flex items-center gap-3" aria-label="Malar Memorial Clinic Home">
            <div className="rounded-xl bg-sky-500 p-2 text-white shadow-sm">
              <HeartPulse className="h-5 w-5" />
            </div>
            <div>
              <p className="text-lg font-bold leading-tight text-sky-600">Malar Memorial Clinic</p>
              <p className="text-xs text-slate-500">Parangipettai, Tamil Nadu</p>
            </div>
          </a>

          <nav className="hidden rounded-full border border-sky-100 bg-white p-1 shadow-sm md:flex md:items-center md:gap-1">
            {navItems.map((item) => (
              <a key={item.label} href={item.href} className="rounded-full px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-sky-50 hover:text-sky-700">
                {item.label}
              </a>
            ))}
          </nav>

          <button type="button" className="rounded-lg p-2 text-slate-700 md:hidden" onClick={() => setMobileNavOpen((open) => !open)} aria-label="Toggle menu">
            {mobileNavOpen ? <X /> : <Menu />}
          </button>
        </div>

        {mobileNavOpen ? (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="border-t border-sky-100 bg-white px-4 pb-5 pt-4 md:hidden">
            <div className="space-y-2">
              {navItems.map((item) => (
                <a key={item.label} href={item.href} onClick={() => setMobileNavOpen(false)} className="block rounded-lg bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700">
                  {item.label}
                </a>
              ))}
            </div>
          </motion.div>
        ) : null}
      </header>

      <main className="pt-20">
        <section id="home" className="relative overflow-hidden bg-gradient-to-r from-sky-50 via-white to-sky-100">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-20">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-3xl space-y-6">
              <p className="text-sm font-semibold tracking-wide text-sky-600">WELCOME TO MALAR MEMORIAL CLINIC</p>
              <h1 className="text-3xl font-bold leading-tight text-slate-900 sm:text-4xl lg:text-5xl">
                Malar Memorial Clinic<br />
                <span className="text-sky-600">Your Health, Our Priority</span>
              </h1>
              <p className="max-w-xl text-base text-slate-600 sm:text-lg">Personalized and professional care led by one dedicated physician for your family and community.</p>
              <a href="tel:+918122319226" className="inline-block rounded-lg bg-sky-500 px-6 py-3 font-semibold text-white shadow-md shadow-sky-200 transition hover:bg-sky-600">Call Now</a>
            </motion.div>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-4 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
          {[
            { title: "Medical Clinic", subtitle: "General patient care", icon: UserRound },
            { title: "Evening Hours", subtitle: "Daily, 5:00-10:00 PM", icon: Clock3 },
            { title: "Local Care", subtitle: "Serving Parangipettai", icon: MapPin },
            { title: "5-Star Rating", subtitle: "Rated on Google", icon: Star },
          ].map(({ title, subtitle, icon: Icon }) => (
            <div key={title} className="flex items-center gap-3 rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
              <Icon className="h-8 w-8 text-sky-500" />
              <div><h3 className="font-semibold text-slate-900">{title}</h3><p className="text-sm text-slate-600">{subtitle}</p></div>
            </div>
          ))}
        </section>

        <section className="bg-slate-50 py-12">
          <div className="mx-auto grid max-w-6xl gap-6 px-4 text-center sm:grid-cols-2 lg:grid-cols-4">
            {[
              [googleRating.toFixed(1), "Google Rating"],
              [String(googleReviewCount), googleReviewCount === 1 ? "Google Review" : "Google Reviews"],
              ["5-10 PM", "Daily Hours"],
              ["608502", "Postal Code"],
            ].map(([value, label]) => (
              <div key={label} className="rounded-xl bg-white p-6 shadow-sm"><p className="text-3xl font-bold text-sky-600">{value}</p><p className="mt-1 text-sm font-medium text-slate-600">{label}</p></div>
            ))}
          </div>
        </section>

        <section id="services" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold text-sky-600">OUR SERVICES</p>
          <h2 className="text-3xl font-bold text-slate-900">Comprehensive Care for Every Need</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.map(({ name, icon: Icon, description }) => (
              <div key={name} className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                <Icon className="h-7 w-7 text-sky-500" />
                <h3 className="mt-3 font-semibold text-slate-900">{name}</h3>
                <p className="mt-2 text-sm text-slate-600">{description}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="about" className="bg-slate-50 py-16">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
            <div className="space-y-5">
              <p className="text-sm font-semibold text-sky-600">ABOUT US</p>
              <h2 className="text-3xl font-bold text-slate-900">Compassionate Single-Doctor Clinic You Can Trust</h2>
              <p className="text-slate-600">Malar Memorial Clinic provides accessible, attentive medical care for patients and families in Parangipettai.</p>
              <p className="text-slate-600"><strong>Mission:</strong> Deliver personalized treatment with dignity and transparency.</p>
              <p className="text-slate-600"><strong>Vision:</strong> Become the community's most trusted neighborhood medical clinic.</p>
              <ul className="space-y-2 text-slate-700">
                {["Personal continuity of care with one dedicated doctor", "Modern diagnostics and clean clinical environment", "Transparent pricing and preventive care guidance"].map((item) => (
                  <li key={item} className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-5 w-5 text-teal-500" />{item}</li>
                ))}
              </ul>
            </div>
            <div className="relative overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
              <img
                src="/images/doctor-consultation-room.jpeg"
                alt="Doctor consultation room at Malar Memorial Clinic"
                className="h-80 w-full object-cover sm:h-96"
              />
              <div className="absolute bottom-4 left-4 right-4 rounded-xl bg-white/95 p-4 shadow-lg backdrop-blur">
                <div className="flex items-start gap-3">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-sky-100 text-sky-600">
                    <Stethoscope className="h-6 w-6" />
                  </span>
                  <div>
                    <p className="font-semibold text-slate-900">Calm, private consultation space</p>
                    <p className="mt-1 text-sm text-slate-600">A focused clinic environment for general health checks, follow-ups, and family care.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="doctor" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="mb-8 text-3xl font-bold text-slate-900">Doctor Profile</h2>
          <div className="grid gap-6 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6 lg:grid-cols-[300px_1fr]">
            <div
              role="img"
              aria-label="General physician symbol"
              className="grid h-72 w-full place-items-center rounded-xl bg-sky-50 text-sky-500 sm:h-80"
            >
              <Stethoscope className="h-28 w-28" strokeWidth={1.5} />
            </div>
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold text-slate-900">Dr. Sentamizh Selvi</h3>
              <p className="font-medium text-sky-700">MBBS - General Physician</p>
              <p className="max-w-2xl leading-relaxed text-slate-700">Dr. Sentamizh Selvi provides attentive general medical care for patients of all ages, including consultations for everyday health concerns, preventive guidance, and ongoing patient support.</p>
              <p className="max-w-2xl leading-relaxed text-slate-700">Her approach focuses on listening carefully, understanding each patient's concerns, and explaining the next steps in clear, practical language.</p>
              <div className="border-t border-slate-200 pt-4">
                <h4 className="font-semibold text-slate-900">Areas of General Care</h4>
                <ul className="mt-3 grid gap-3 text-sm text-slate-700 sm:grid-cols-2">
                  {["Everyday illness and symptom evaluation", "Routine health and preventive checkups", "Blood pressure and diabetes follow-up", "General health advice and referrals"].map((item) => (
                    <li key={item} className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-teal-500" /><span>{item}</span></li>
                  ))}
                </ul>
              </div>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-slate-200 pt-4 text-sm">
                <p className="flex items-center gap-2 font-medium text-slate-700"><Clock3 className="h-4 w-4 text-sky-500" /> Daily, 5:00-10:00 PM</p>
                <a href="tel:+918122319226" className="flex items-center gap-2 font-semibold text-sky-700 hover:underline"><Phone className="h-4 w-4" /> 081223 19226</a>
              </div>
            </div>
          </div>
        </section>

        <section id="testimonials" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="mb-8 text-3xl font-bold text-slate-900">Patient Testimonials</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {reviews.map((item, reviewIndex) => (
              <div key={`${item.name}-${reviewIndex}`} className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="grid h-12 w-12 place-items-center rounded-full bg-sky-100 font-bold text-sky-700" aria-hidden="true">{item.name.slice(0, 2).toUpperCase()}</div>
                  <div>
                    <p className="font-semibold text-slate-900">{item.name}</p>
                    <div className="flex text-amber-400">{Array.from({ length: item.rating }).map((_, index) => <Star key={index} className="h-4 w-4 fill-current" />)}</div>
                    {item.reviewUrl ? <a href={item.reviewUrl} target="_blank" rel="noreferrer" className="mt-1 inline-flex items-center gap-1 text-xs text-sky-600 hover:underline">{item.source}<ExternalLink className="h-3 w-3" /></a> : <p className="mt-1 text-xs text-slate-500">{item.source}</p>}
                  </div>
                </div>
                <p className="mt-3 text-sm text-slate-600">{item.review}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 border-t border-slate-200 pt-8">
            <a href={googleReviewUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-lg bg-sky-500 px-5 py-2.5 font-semibold text-white transition hover:bg-sky-600">Write a Google Review<ExternalLink className="h-4 w-4" /></a>
          </div>
        </section>

        <section id="gallery" className="bg-slate-50 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="mb-8 text-3xl font-bold text-slate-900">Clinic Gallery</h2>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
              {galleryImages.map((image, index) => (
                <motion.button
                  key={image.src}
                  type="button"
                  onClick={() => setSelectedGalleryIndex(index)}
                  className="overflow-hidden rounded-xl shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                  aria-label={`Open ${image.alt}`}
                >
                  <img src={image.src} alt={image.alt} className="h-44 w-full object-cover md:h-56" />
                </motion.button>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="mb-8 text-3xl font-bold text-slate-900">Contact Us</h2>
          <div className="space-y-4 rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
            <p className="flex items-start gap-3"><MapPin className="mt-0.5 h-5 w-5 shrink-0 text-sky-500" /> Vathiya Palli St, Vathiya Palli, Parangipettai, Tamil Nadu 608502</p>
            <a href="tel:+918122319226" className="flex items-center gap-3 transition hover:text-sky-600"><Phone className="h-5 w-5 text-sky-500" /> 081223 19226</a>
            <p className="flex items-center gap-3"><MapPin className="h-5 w-5 text-sky-500" /> Plus code: FQX6+93, Parangipettai</p>
            <p className="flex items-center gap-3"><Clock3 className="h-5 w-5 text-sky-500" /> Open daily: 5:00 PM-10:00 PM</p>
            <div className="border-t border-slate-200 pt-4">
              <h3 className="font-semibold text-slate-900">Opening Hours</h3>
              <dl className="mt-3 grid gap-x-8 gap-y-2 text-sm sm:grid-cols-2">
                {clinicDays.map((day) => (
                  <div key={day} className="flex items-center justify-between gap-6 border-b border-slate-100 pb-2"><dt className="text-slate-600">{day}</dt><dd className="font-medium text-slate-900">5:00-10:00 PM</dd></div>
                ))}
              </dl>
            </div>
            <iframe title="Clinic location" src="https://maps.google.com/maps?q=Malar%20Memorial%20Clinic%2C%20Parangipettai%2C%20Tamil%20Nadu&t=&z=15&ie=UTF8&iwloc=&output=embed" className="h-64 w-full rounded-lg border-0" loading="lazy" />
          </div>
        </section>
      </main>

      {selectedGalleryIndex !== null ? (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/90 p-4 sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-label="Clinic gallery image preview"
          onClick={() => setSelectedGalleryIndex(null)}
        >
          <button
            type="button"
            onClick={() => setSelectedGalleryIndex(null)}
            className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full bg-white text-slate-800 shadow-lg transition hover:bg-slate-100 sm:right-6 sm:top-6"
            aria-label="Close image preview"
          >
            <X className="h-6 w-6" />
          </button>

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              setSelectedGalleryIndex((selectedGalleryIndex - 1 + galleryImages.length) % galleryImages.length);
            }}
            className="absolute left-2 grid h-11 w-11 place-items-center rounded-full bg-white/95 text-slate-800 shadow-lg transition hover:bg-white sm:left-6"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-7 w-7" />
          </button>

          <figure className="max-w-5xl" onClick={(event) => event.stopPropagation()}>
            <img
              src={galleryImages[selectedGalleryIndex].src}
              alt={galleryImages[selectedGalleryIndex].alt}
              className="max-h-[82vh] max-w-full rounded-lg object-contain shadow-2xl"
            />
            <figcaption className="mt-3 text-center text-sm text-white">
              {galleryImages[selectedGalleryIndex].alt}
            </figcaption>
          </figure>

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              setSelectedGalleryIndex((selectedGalleryIndex + 1) % galleryImages.length);
            }}
            className="absolute right-2 grid h-11 w-11 place-items-center rounded-full bg-white/95 text-slate-800 shadow-lg transition hover:bg-white sm:right-6"
            aria-label="Next image"
          >
            <ChevronRight className="h-7 w-7" />
          </button>
        </div>
      ) : null}
    </div>
  );
}
