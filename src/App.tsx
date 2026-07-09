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
  Languages,
  MapPin,
  Menu,
  Moon,
  Phone,
  Star,
  Stethoscope,
  Sun,
  Syringe,
  UserRound,
  UserRoundCheck,
  X,
} from "lucide-react";

type Language = "en" | "ta";
type Theme = "light" | "dark";

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

const tamilNavItems = [
  { label: "முகப்பு", href: "#home" },
  { label: "எங்களை பற்றி", href: "#about" },
  { label: "சேவைகள்", href: "#services" },
  { label: "மருத்துவர்", href: "#doctor" },
  { label: "கருத்துகள்", href: "#testimonials" },
  { label: "புகைப்படங்கள்", href: "#gallery" },
  { label: "தொடர்பு", href: "#contact" },
];

const services = [
  { name: "General Consultation", icon: Stethoscope, description: "Complete everyday health consultations for adults and seniors." },
  { name: "Pediatric Care", icon: UserRoundCheck, description: "Child-friendly checkups, nutrition advice, and growth monitoring." },
  { name: "Dental Care", icon: HeartPulse, description: "Preventive dental evaluations and referral-based treatment planning." },
  { name: "Vaccination", icon: Syringe, description: "Routine and seasonal immunization services for families." },
  { name: "Health Checkup", icon: ClipboardList, description: "Preventive annual packages with detailed medical counseling." },
  { name: "Referral Support", icon: Ambulance, description: "Prompt guidance and referral coordination when specialist care is needed." },
];

const tamilServices = [
  { name: "பொது மருத்துவ ஆலோசனை", icon: Stethoscope, description: "பெரியவர்கள் மற்றும் மூத்தவர்களுக்கு அன்றாட உடல்நல ஆலோசனைகள்." },
  { name: "குழந்தை பராமரிப்பு", icon: UserRoundCheck, description: "குழந்தைகளுக்கான சோதனை, உணவு ஆலோசனை மற்றும் வளர்ச்சி கண்காணிப்பு." },
  { name: "பல் பராமரிப்பு", icon: HeartPulse, description: "முன்கூட்டிய பல் மதிப்பீடு மற்றும் தேவையான பரிந்துரை வழிகாட்டல்." },
  { name: "தடுப்பூசி", icon: Syringe, description: "குடும்பத்திற்கான வழக்கமான மற்றும் பருவகால தடுப்பூசி சேவைகள்." },
  { name: "உடல்நல பரிசோதனை", icon: ClipboardList, description: "விரிவான மருத்துவ ஆலோசனையுடன் முன்கூட்டிய சுகாதார பரிசோதனைகள்." },
  { name: "பரிந்துரை உதவி", icon: Ambulance, description: "சிறப்பு மருத்துவ பராமரிப்பு தேவைப்படும் போது சரியான வழிகாட்டல்." },
];

const clinicDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const tamilClinicDays = ["ஞாயிறு", "திங்கள்", "செவ்வாய்", "புதன்", "வியாழன்", "வெள்ளி", "சனி"];

const copy = {
  en: {
    place: "Parangipettai, Tamil Nadu",
    heroEyebrow: "WELCOME TO MALAR MEMORIAL CLINIC",
    heroTitle: "Malar Memorial Clinic",
    heroSubtitle: "Your Health, Our Priority",
    heroText: "Personalized and professional care led by one dedicated physician for your family and community.",
    callNow: "Call Now",
    featureCards: [
      ["Medical Clinic", "General patient care", UserRound],
      ["Evening Hours", "Daily, 5:00-10:00 PM", Clock3],
      ["Local Care", "Serving Parangipettai", MapPin],
      ["5-Star Rating", "Rated on Google", Star],
    ],
    metricLabels: ["Google Rating", "Google Review", "Google Reviews", "Daily Hours", "Postal Code"],
    servicesEyebrow: "OUR SERVICES",
    servicesTitle: "Comprehensive Care for Every Need",
    aboutEyebrow: "ABOUT US",
    aboutTitle: "Compassionate Single-Doctor Clinic You Can Trust",
    aboutIntro: "Malar Memorial Clinic provides accessible, attentive medical care for patients and families in Parangipettai.",
    missionLabel: "Mission:",
    mission: "Deliver personalized treatment with dignity and transparency.",
    visionLabel: "Vision:",
    vision: "Become the community's most trusted neighborhood medical clinic.",
    aboutBullets: [
      "Personal continuity of care with one dedicated doctor",
      "Modern diagnostics and clean clinical environment",
      "Transparent pricing and preventive care guidance",
    ],
    aboutImageTitle: "Calm, private consultation space",
    aboutImageText: "A focused clinic environment for general health checks, follow-ups, and family care.",
    doctorTitle: "Doctor Profile",
    doctorRole: "MBBS - General Physician",
    doctorTextOne: "Dr. Sentamil Selvi provides attentive general medical care for patients of all ages, including consultations for everyday health concerns, preventive guidance, and ongoing patient support.",
    doctorTextTwo: "Her approach focuses on listening carefully, understanding each patient's concerns, and explaining the next steps in clear, practical language.",
    careTitle: "Areas of General Care",
    careItems: [
      "Everyday illness and symptom evaluation",
      "Routine health and preventive checkups",
      "Blood pressure and diabetes follow-up",
      "General health advice and referrals",
    ],
    dailyTime: "Daily, 5:00-10:00 PM",
    testimonialsTitle: "Patient Testimonials",
    writeReview: "Write a Google Review",
    galleryTitle: "Clinic Gallery",
    contactTitle: "Contact Us",
    address: "Vaathiya Palli St, Vaathiya Palli, Parangipettai, Tamil Nadu 608502",
    plusCode: "Plus code: FQW6+C3, Parangipettai",
    openDaily: "Open daily: 5:00 PM-10:00 PM",
    hoursTitle: "Opening Hours",
    hoursValue: "5:00-10:00 PM",
    openMap: "Open in Google Maps",
  },
  ta: {
    place: "பரங்கிப்பேட்டை, தமிழ்நாடு",
    heroEyebrow: "மலர் மெமோரியல் கிளினிக்கிற்கு வரவேற்கிறோம்",
    heroTitle: "மலர் மெமோரியல் கிளினிக்",
    heroSubtitle: "உங்கள் ஆரோக்கியம், எங்கள் முன்னுரிமை",
    heroText: "உங்கள் குடும்பத்துக்கும் சமூகத்துக்கும் ஒரே அர்ப்பணிப்புள்ள மருத்துவரால் வழங்கப்படும் தனிப்பட்ட மற்றும் நம்பகமான மருத்துவ பராமரிப்பு.",
    callNow: "இப்போது அழைக்கவும்",
    featureCards: [
      ["மருத்துவ கிளினிக்", "பொது நோயாளர் பராமரிப்பு", UserRound],
      ["மாலை நேர சேவை", "தினமும், 5:00-10:00 PM", Clock3],
      ["உள்ளூர் பராமரிப்பு", "பரங்கிப்பேட்டைக்கு சேவை", MapPin],
      ["5 நட்சத்திர மதிப்பீடு", "Google-ல் மதிப்பிடப்பட்டது", Star],
    ],
    metricLabels: ["Google மதிப்பீடு", "Google கருத்து", "Google கருத்துகள்", "தினசரி நேரம்", "அஞ்சல் குறியீடு"],
    servicesEyebrow: "எங்கள் சேவைகள்",
    servicesTitle: "ஒவ்வொரு தேவைக்கும் முழுமையான பராமரிப்பு",
    aboutEyebrow: "எங்களை பற்றி",
    aboutTitle: "நம்பிக்கையுடன் அணுகக்கூடிய அன்பான ஒரே மருத்துவர் கிளினிக்",
    aboutIntro: "மலர் மெமோரியல் கிளினிக் பரங்கிப்பேட்டையில் நோயாளிகளுக்கும் குடும்பங்களுக்கும் எளிதாக அணுகக்கூடிய கவனமான மருத்துவ சேவையை வழங்குகிறது.",
    missionLabel: "பணி:",
    mission: "மரியாதை மற்றும் வெளிப்படைத்தன்மையுடன் தனிப்பட்ட சிகிச்சை வழங்குதல்.",
    visionLabel: "நோக்கம்:",
    vision: "சமூகத்தின் மிகவும் நம்பகமான அருகிலுள்ள மருத்துவ கிளினிக்காக உருவாகுதல்.",
    aboutBullets: [
      "ஒரே அர்ப்பணிப்புள்ள மருத்துவருடன் தொடர்ச்சியான பராமரிப்பு",
      "சுத்தமான கிளினிக் சூழல் மற்றும் தேவையான மருத்துவ வழிகாட்டல்",
      "வெளிப்படையான அணுகுமுறை மற்றும் முன்கூட்டிய பராமரிப்பு ஆலோசனை",
    ],
    aboutImageTitle: "அமைதியான தனிப்பட்ட ஆலோசனை அறை",
    aboutImageText: "பொது உடல்நல சோதனை, தொடர்ச்சி பராமரிப்பு மற்றும் குடும்ப பராமரிப்புக்கான கவனமான கிளினிக் சூழல்.",
    doctorTitle: "மருத்துவர் விவரம்",
    doctorRole: "MBBS - பொது மருத்துவர்",
    doctorTextOne: "டாக்டர் செந்தமிழ் செல்வி அனைத்து வயதினருக்கும் அன்றாட உடல்நல பிரச்சினைகள், முன்கூட்டிய ஆலோசனை மற்றும் தொடர்ச்சி பராமரிப்புடன் கவனமான பொது மருத்துவ சேவையை வழங்குகிறார்.",
    doctorTextTwo: "நோயாளியின் கவலைகளை கவனமாக கேட்டு, அடுத்த படிகளை தெளிவாகவும் எளிமையாகவும் விளக்குவது அவரது அணுகுமுறை.",
    careTitle: "பொது பராமரிப்பு பகுதிகள்",
    careItems: [
      "அன்றாட நோய் மற்றும் அறிகுறி மதிப்பீடு",
      "வழக்கமான உடல்நல மற்றும் முன்கூட்டிய பரிசோதனைகள்",
      "இரத்த அழுத்தம் மற்றும் நீரிழிவு தொடர்ச்சி பராமரிப்பு",
      "பொது உடல்நல ஆலோசனை மற்றும் பரிந்துரைகள்",
    ],
    dailyTime: "தினமும், 5:00-10:00 PM",
    testimonialsTitle: "நோயாளர் கருத்துகள்",
    writeReview: "Google கருத்து எழுதவும்",
    galleryTitle: "கிளினிக் புகைப்படங்கள்",
    contactTitle: "தொடர்பு கொள்ளுங்கள்",
    address: "வாத்தியா பள்ளி தெரு, வாத்தியா பள்ளி, பரங்கிப்பேட்டை, தமிழ்நாடு 608502",
    plusCode: "Plus code: FQW6+C3, பரங்கிப்பேட்டை",
    openDaily: "தினமும் திறந்திருக்கும்: 5:00 PM-10:00 PM",
    hoursTitle: "திறந்திருக்கும் நேரம்",
    hoursValue: "5:00-10:00 PM",
    openMap: "Google Maps-ல் திறக்கவும்",
  },
} as const;

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
const clinicMapsUrl = "https://maps.app.goo.gl/DcsRc2AknzhRAJLa6";
const clinicMapEmbedUrl = "https://maps.google.com/maps?q=11.4960056,79.7602366&z=17&output=embed";

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
  const [language, setLanguage] = useState<Language>("en");
  const [theme, setTheme] = useState<Theme>("light");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [selectedGalleryIndex, setSelectedGalleryIndex] = useState<number | null>(null);
  const [reviews, setReviews] = useState<Testimonial[]>(fallbackTestimonials);
  const [googleRating, setGoogleRating] = useState(5);
  const [googleReviewCount, setGoogleReviewCount] = useState(1);
  const pageCopy = copy[language];
  const activeNavItems = language === "ta" ? tamilNavItems : navItems;
  const activeServices = language === "ta" ? tamilServices : services;
  const activeClinicDays = language === "ta" ? tamilClinicDays : clinicDays;
  const heroTitleClass = language === "ta"
    ? "text-[2rem] sm:text-3xl md:text-4xl xl:text-5xl"
    : "text-3xl sm:text-4xl lg:text-5xl";

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
    <div className={`${theme === "dark" ? "dark" : ""} min-h-screen bg-white text-slate-800 transition-colors dark:bg-slate-950 dark:text-slate-100`}>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-sky-100 bg-white/95 backdrop-blur transition-colors dark:border-slate-800 dark:bg-slate-950/95">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-3 py-3 sm:px-6 lg:px-8">
          <a href="#home" className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3 xl:flex-none" aria-label="Malar Memorial Clinic Home">
            <div className="shrink-0 rounded-xl bg-sky-500 p-2 text-white shadow-sm">
              <HeartPulse className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-base font-bold leading-tight text-sky-600 sm:text-lg">Malar Memorial Clinic</p>
              <p className="hidden truncate text-xs text-slate-500 dark:text-slate-400 sm:block">{pageCopy.place}</p>
            </div>
          </a>

          <nav className="hidden max-w-[58vw] rounded-full border border-sky-100 bg-white p-1 shadow-sm transition-colors dark:border-slate-700 dark:bg-slate-900 xl:flex xl:items-center xl:gap-1">
            {activeNavItems.map((item) => (
              <a key={item.label} href={item.href} className="whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-sky-50 hover:text-sky-700 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-sky-300">
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-1 sm:gap-2">
            <div className="inline-flex items-center gap-0.5 rounded-full border border-sky-100 bg-sky-50 p-0.5 transition-colors dark:border-slate-700 dark:bg-slate-900 sm:gap-1 sm:p-1" aria-label="Language selection">
              <Languages className="ml-1 hidden h-4 w-4 text-sky-700 dark:text-sky-300 sm:block" />
              <button
                type="button"
                onClick={() => setLanguage("en")}
                className={`rounded-full px-2 py-1.5 text-xs font-semibold transition sm:px-3 sm:text-sm ${language === "en" ? "bg-sky-500 text-white shadow-sm" : "text-sky-700 hover:bg-white dark:text-sky-300 dark:hover:bg-slate-800"}`}
                aria-pressed={language === "en"}
              >
                <span className="sm:hidden">EN</span>
                <span className="hidden sm:inline">English</span>
              </button>
              <button
                type="button"
                onClick={() => setLanguage("ta")}
                className={`rounded-full px-2 py-1.5 text-xs font-semibold transition sm:px-3 sm:text-sm ${language === "ta" ? "bg-sky-500 text-white shadow-sm" : "text-sky-700 hover:bg-white dark:text-sky-300 dark:hover:bg-slate-800"}`}
                aria-pressed={language === "ta"}
              >
                தமிழ்
              </button>
            </div>
            <button
              type="button"
              onClick={() => setTheme((current) => current === "light" ? "dark" : "light")}
              className="grid h-9 w-9 place-items-center rounded-full border border-sky-100 bg-white text-slate-700 transition hover:bg-sky-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
              aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
            >
              {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </button>
            <button type="button" className="rounded-lg p-2 text-slate-700 dark:text-slate-100 xl:hidden" onClick={() => setMobileNavOpen((open) => !open)} aria-label="Toggle menu">
              {mobileNavOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {mobileNavOpen ? (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="border-t border-sky-100 bg-white px-4 pb-5 pt-4 transition-colors dark:border-slate-800 dark:bg-slate-950 xl:hidden">
            <div className="space-y-2">
              {activeNavItems.map((item) => (
                <a key={item.label} href={item.href} onClick={() => setMobileNavOpen(false)} className="block rounded-lg bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 transition-colors dark:bg-slate-900 dark:text-slate-100">
                  {item.label}
                </a>
              ))}
            </div>
          </motion.div>
        ) : null}
      </header>

      <main className="pt-20">
        <section id="home" className="relative overflow-hidden bg-gradient-to-r from-sky-50 via-white to-sky-100 transition-colors dark:from-slate-950 dark:via-slate-900 dark:to-sky-950">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-20">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-3xl space-y-6">
              <p className="text-sm font-semibold tracking-wide text-sky-600">{pageCopy.heroEyebrow}</p>
              <h1 className={`${heroTitleClass} break-words font-bold leading-tight text-slate-900 dark:text-white`}>
                {pageCopy.heroTitle}<br />
                <span className="text-sky-600">{pageCopy.heroSubtitle}</span>
              </h1>
              <p className="max-w-xl text-base text-slate-600 dark:text-slate-300 sm:text-lg">{pageCopy.heroText}</p>
              <a href="tel:+918122319226" className="inline-block rounded-lg bg-sky-500 px-6 py-3 font-semibold text-white shadow-md shadow-sky-200 transition hover:bg-sky-600">{pageCopy.callNow}</a>
            </motion.div>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-4 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
          {[ 
            ...pageCopy.featureCards,
          ].map(([title, subtitle, Icon]) => (
            <div key={title} className="flex items-center gap-3 rounded-xl border border-slate-100 bg-white p-4 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900">
              <Icon className="h-8 w-8 text-sky-500" />
              <div className="min-w-0"><h3 className="break-words font-semibold text-slate-900 dark:text-white">{title}</h3><p className="break-words text-sm text-slate-600 dark:text-slate-300">{subtitle}</p></div>
            </div>
          ))}
        </section>

        <section className="bg-slate-50 py-12 transition-colors dark:bg-slate-900/70">
          <div className="mx-auto grid max-w-6xl gap-6 px-4 text-center sm:grid-cols-2 lg:grid-cols-4">
            {[
              [googleRating.toFixed(1), pageCopy.metricLabels[0]],
              [String(googleReviewCount), googleReviewCount === 1 ? pageCopy.metricLabels[1] : pageCopy.metricLabels[2]],
              ["5-10 PM", pageCopy.metricLabels[3]],
              ["608502", pageCopy.metricLabels[4]],
            ].map(([value, label]) => (
              <div key={label} className="rounded-xl bg-white p-6 shadow-sm transition-colors dark:bg-slate-950"><p className="text-3xl font-bold text-sky-600 dark:text-sky-400">{value}</p><p className="mt-1 break-words text-sm font-medium text-slate-600 dark:text-slate-300">{label}</p></div>
            ))}
          </div>
        </section>

        <section id="services" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold text-sky-600">{pageCopy.servicesEyebrow}</p>
          <h2 className="break-words text-2xl font-bold leading-tight text-slate-900 dark:text-white sm:text-3xl">{pageCopy.servicesTitle}</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {activeServices.map(({ name, icon: Icon, description }) => (
              <div key={name} className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
                <Icon className="h-7 w-7 text-sky-500" />
                <h3 className="mt-3 break-words font-semibold text-slate-900 dark:text-white">{name}</h3>
                <p className="mt-2 break-words text-sm text-slate-600 dark:text-slate-300">{description}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="about" className="bg-slate-50 py-16 transition-colors dark:bg-slate-900/70">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
            <div className="space-y-5">
              <p className="text-sm font-semibold text-sky-600">{pageCopy.aboutEyebrow}</p>
              <h2 className="break-words text-2xl font-bold leading-tight text-slate-900 dark:text-white sm:text-3xl">{pageCopy.aboutTitle}</h2>
              <p className="break-words text-slate-600 dark:text-slate-300">{pageCopy.aboutIntro}</p>
              <p className="break-words text-slate-600 dark:text-slate-300"><strong>{pageCopy.missionLabel}</strong> {pageCopy.mission}</p>
              <p className="break-words text-slate-600 dark:text-slate-300"><strong>{pageCopy.visionLabel}</strong> {pageCopy.vision}</p>
              <ul className="space-y-2 text-slate-700 dark:text-slate-200">
                {pageCopy.aboutBullets.map((item) => (
                  <li key={item} className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-5 w-5 text-teal-500" />{item}</li>
                ))}
              </ul>
            </div>
            <div className="relative overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
              <img
                src="/images/doctor-consultation-room.jpeg"
                alt="Doctor consultation room at Malar Memorial Clinic"
                className="h-80 w-full object-cover sm:h-96"
              />
              <div className="absolute bottom-4 left-4 right-4 rounded-xl bg-white/95 p-4 shadow-lg backdrop-blur dark:bg-slate-950/90">
                <div className="flex items-start gap-3">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-sky-100 text-sky-600">
                    <Stethoscope className="h-6 w-6" />
                  </span>
                  <div>
                    <p className="break-words font-semibold text-slate-900 dark:text-white">{pageCopy.aboutImageTitle}</p>
                    <p className="mt-1 break-words text-sm text-slate-600 dark:text-slate-300">{pageCopy.aboutImageText}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="doctor" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="mb-8 break-words text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">{pageCopy.doctorTitle}</h2>
          <div className="grid gap-6 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900 sm:p-6 lg:grid-cols-[300px_1fr]">
            <div
              role="img"
              aria-label="General physician symbol"
              className="grid h-72 w-full place-items-center rounded-xl bg-sky-50 text-sky-500 dark:bg-slate-950 dark:text-sky-400 sm:h-80"
            >
              <Stethoscope className="h-28 w-28" strokeWidth={1.5} />
            </div>
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold text-slate-900 dark:text-white">Dr. Sentamil Selvi</h3>
              <p className="break-words font-medium text-sky-700">{pageCopy.doctorRole}</p>
              <p className="max-w-2xl break-words leading-relaxed text-slate-700 dark:text-slate-300">{pageCopy.doctorTextOne}</p>
              <p className="max-w-2xl break-words leading-relaxed text-slate-700 dark:text-slate-300">{pageCopy.doctorTextTwo}</p>
              <div className="border-t border-slate-200 pt-4 dark:border-slate-700">
                <h4 className="break-words font-semibold text-slate-900 dark:text-white">{pageCopy.careTitle}</h4>
                <ul className="mt-3 grid gap-3 text-sm text-slate-700 dark:text-slate-200 sm:grid-cols-2">
                  {pageCopy.careItems.map((item) => (
                    <li key={item} className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-teal-500" /><span className="break-words">{item}</span></li>
                  ))}
                </ul>
              </div>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-slate-200 pt-4 text-sm dark:border-slate-700">
                <p className="flex items-center gap-2 font-medium text-slate-700 dark:text-slate-200"><Clock3 className="h-4 w-4 text-sky-500" /> {pageCopy.dailyTime}</p>
                <a href="tel:+918122319226" className="flex items-center gap-2 font-semibold text-sky-700 hover:underline"><Phone className="h-4 w-4" /> 081223 19226</a>
              </div>
            </div>
          </div>
        </section>

        <section id="testimonials" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="mb-8 break-words text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">{pageCopy.testimonialsTitle}</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {reviews.map((item, reviewIndex) => (
              <div key={`${item.name}-${reviewIndex}`} className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900">
                <div className="flex items-center gap-3">
                  <div className="grid h-12 w-12 place-items-center rounded-full bg-sky-100 font-bold text-sky-700" aria-hidden="true">{item.name.slice(0, 2).toUpperCase()}</div>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">{item.name}</p>
                    <div className="flex text-amber-400">{Array.from({ length: item.rating }).map((_, index) => <Star key={index} className="h-4 w-4 fill-current" />)}</div>
                    {item.reviewUrl ? <a href={item.reviewUrl} target="_blank" rel="noreferrer" className="mt-1 inline-flex items-center gap-1 text-xs text-sky-600 hover:underline dark:text-sky-300">{item.source}<ExternalLink className="h-3 w-3" /></a> : <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{item.source}</p>}
                  </div>
                </div>
                <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{item.review}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 border-t border-slate-200 pt-8">
            <a href={googleReviewUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-lg bg-sky-500 px-5 py-2.5 font-semibold text-white transition hover:bg-sky-600">{pageCopy.writeReview}<ExternalLink className="h-4 w-4" /></a>
          </div>
        </section>

        <section id="gallery" className="bg-slate-50 py-16 transition-colors dark:bg-slate-900/70">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="mb-8 break-words text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">{pageCopy.galleryTitle}</h2>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
              {galleryImages.map((image, index) => (
                <motion.button
                  key={image.src}
                  type="button"
                  onClick={() => setSelectedGalleryIndex(index)}
                  className={`overflow-hidden rounded-xl bg-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 dark:bg-slate-900 ${index === 0 ? "col-span-2 md:col-span-1 md:row-span-2" : ""}`}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                  aria-label={`Open ${image.alt}`}
                >
                  <img
                    src={image.src}
                    alt={image.alt}
                    className={`w-full object-cover ${index === 0 ? "h-80 md:h-[460px]" : "h-44 md:h-56"}`}
                  />
                </motion.button>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="mb-8 break-words text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">{pageCopy.contactTitle}</h2>
          <div className="space-y-4 rounded-xl border border-slate-100 bg-white p-6 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900">
            <p className="flex items-start gap-3 break-words"><MapPin className="mt-0.5 h-5 w-5 shrink-0 text-sky-500" /> <span>{pageCopy.address}</span></p>
            <a href="tel:+918122319226" className="flex items-center gap-3 transition hover:text-sky-600"><Phone className="h-5 w-5 text-sky-500" /> 081223 19226</a>
            <a href={clinicMapsUrl} target="_blank" rel="noreferrer" className="flex items-center gap-3 break-words transition hover:text-sky-600">
              <MapPin className="h-5 w-5 shrink-0 text-sky-500" />
              <span>{pageCopy.plusCode}</span>
            </a>
            <p className="flex items-center gap-3 break-words"><Clock3 className="h-5 w-5 shrink-0 text-sky-500" /> <span>{pageCopy.openDaily}</span></p>
            <a href={clinicMapsUrl} target="_blank" rel="noreferrer" className="inline-flex w-fit items-center gap-2 rounded-lg bg-sky-500 px-4 py-2.5 font-semibold text-white transition hover:bg-sky-600">
              {pageCopy.openMap}<ExternalLink className="h-4 w-4" />
            </a>
            <div className="border-t border-slate-200 pt-4 dark:border-slate-700">
              <h3 className="font-semibold text-slate-900 dark:text-white">{pageCopy.hoursTitle}</h3>
              <dl className="mt-3 grid gap-x-8 gap-y-2 text-sm sm:grid-cols-2">
                {activeClinicDays.map((day) => (
                  <div key={day} className="flex items-center justify-between gap-6 border-b border-slate-100 pb-2 dark:border-slate-800"><dt className="text-slate-600 dark:text-slate-300">{day}</dt><dd className="font-medium text-slate-900 dark:text-white">{pageCopy.hoursValue}</dd></div>
                ))}
              </dl>
            </div>
            <iframe title="Clinic location" src={clinicMapEmbedUrl} className="h-64 w-full rounded-lg border-0" loading="lazy" />
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
            className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full bg-white text-slate-800 shadow-lg transition hover:bg-slate-100 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-800 sm:right-6 sm:top-6"
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
            className="absolute left-2 grid h-11 w-11 place-items-center rounded-full bg-white/95 text-slate-800 shadow-lg transition hover:bg-white dark:bg-slate-900/95 dark:text-white dark:hover:bg-slate-800 sm:left-6"
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
            className="absolute right-2 grid h-11 w-11 place-items-center rounded-full bg-white/95 text-slate-800 shadow-lg transition hover:bg-white dark:bg-slate-900/95 dark:text-white dark:hover:bg-slate-800 sm:right-6"
            aria-label="Next image"
          >
            <ChevronRight className="h-7 w-7" />
          </button>
        </div>
      ) : null}
    </div>
  );
}
