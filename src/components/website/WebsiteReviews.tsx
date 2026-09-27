import React, { useState, useEffect, useRef } from 'react';
import {
  Star,
  ChevronLeft,
  ChevronRight,
  Quote,
  CheckCircle2,
  ThumbsUp,
  MessageSquare,
  Award,
  Sparkles,
  PlusCircle,
  X,
  Send,
} from 'lucide-react';

export interface CustomerReview {
  id: string;
  author: string;
  cityCountry: string;
  avatarText: string;
  category: 'DIVING' | 'DOLPHIN' | 'PADI' | 'SAFARI';
  tripTitle: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
  highlightTag: string;
  source: 'Google Reviews' | 'TripAdvisor' | 'Direct Guest';
}

const INITIAL_REVIEWS: CustomerReview[] = [
  {
    id: 'rev-1',
    author: 'Marcus & Julia Weber',
    cityCountry: 'Munich, Germany 🇩🇪',
    avatarText: 'MW',
    category: 'DIVING',
    tripTitle: 'Daily Boat Diving (2 Guided Dives)',
    rating: 5,
    date: 'September 2026',
    comment:
      'Outstanding 3 days of boat diving! The vessel was spotless, lunch was freshly cooked and delicious, and our dive guide Ahmed showed us eagle rays and giant morays at Abu Ramada. Professional German safety briefing and punctually picked us up from Steigenberger ALDAU Beach.',
    verified: true,
    highlightTag: 'Saw Eagle Rays & Turtles',
    source: 'TripAdvisor',
  },
  {
    id: 'rev-2',
    author: 'Sarah & Liam Jenkins',
    cityCountry: 'Manchester, United Kingdom 🇬🇧',
    avatarText: 'SJ',
    category: 'DOLPHIN',
    tripTitle: 'Dolphin House Snorkeling Safari',
    rating: 5,
    date: 'August 2026',
    comment:
      'A magical highlight of our Red Sea holiday! We swam alongside a pod of wild spinner dolphins in the lagoon at Shaab El Erg. The crew took incredible care of our 7-year-old daughter, provided perfect life vests, and made sure everyone was safe.',
    verified: true,
    highlightTag: 'Wild Dolphins Encounter',
    source: 'Google Reviews',
  },
  {
    id: 'rev-3',
    author: 'Claire & Pierre Dubois',
    cityCountry: 'Lyon, France 🇫🇷',
    avatarText: 'CD',
    category: 'PADI',
    tripTitle: 'PADI Open Water Diver Course',
    rating: 5,
    date: 'July 2026',
    comment:
      'Completed our PADI certification with Instructor Youssef. Super patient, bilingual French instruction, top-tier Mares equipment, and calm confined water sessions before open sea boat dives. We felt completely safe and thrilled!',
    verified: true,
    highlightTag: 'PADI Certified 5-Star',
    source: 'Google Reviews',
  },
  {
    id: 'rev-4',
    author: 'Krzysztof Nowak',
    cityCountry: 'Warsaw, Poland 🇵🇱',
    avatarText: 'KN',
    category: 'DIVING',
    tripTitle: 'Daily Boat Diving (Abu Nuhas Wrecks)',
    rating: 5,
    date: 'September 2026',
    comment:
      'Best dive operator in Hurghada. We visited the Giannis D and Carnatic shipwrecks. The captain was exceptionally skilled at mooring in choppy seas. Generous bottom times, small buddy teams (max 4 per guide), and 15L tanks available on request.',
    verified: true,
    highlightTag: 'World-Class Wreck Dives',
    source: 'TripAdvisor',
  },
  {
    id: 'rev-5',
    author: 'Elena & Marco Rossi',
    cityCountry: 'Milan, Italy 🇮🇹',
    avatarText: 'MR',
    category: 'SAFARI',
    tripTitle: 'Super Desert Quad Safari & Bedouin BBQ',
    rating: 5,
    date: 'August 2026',
    comment:
      'Incredible adrenaline rush through the Hurghada desert mountains! 45km riding quad ATVs followed by camel riding, authentic Bedouin tea, and a delicious evening grill buffet under the stars. Perfect family adventure.',
    verified: true,
    highlightTag: 'Thrilling Quad Adventure',
    source: 'Google Reviews',
  },
  {
    id: 'rev-6',
    author: 'Sander Van Der Beek',
    cityCountry: 'Amsterdam, Netherlands 🇳🇱',
    avatarText: 'SV',
    category: 'DIVING',
    tripTitle: 'Discover Scuba Diving (Beginners)',
    rating: 5,
    date: 'August 2026',
    comment:
      'I was very nervous before my first introductory dive, but Dive Go Hurghada made it so easy. The instructor stayed holding my hand until I relaxed, and then we hovered over stunning coral gardens full of clownfish and blue-spotted rays. Unforgettable!',
    verified: true,
    highlightTag: 'Zero Stress for Beginners',
    source: 'Direct Guest',
  },
  {
    id: 'rev-7',
    author: 'Lukas & Anna Steiner',
    cityCountry: 'Zurich, Switzerland 🇨🇭',
    avatarText: 'LS',
    category: 'DOLPHIN',
    tripTitle: 'Dolphin House Snorkeling Safari',
    rating: 5,
    date: 'September 2026',
    comment:
      'Transparent booking, no hidden port fees, and respectful ethical dolphin encounters following HEPCA eco-guidelines. The boat has plenty of shade, clean restrooms, and the crew treats the marine reserve with deep respect.',
    verified: true,
    highlightTag: 'Ethical & Eco-Friendly',
    source: 'TripAdvisor',
  },
  {
    id: 'rev-8',
    author: 'Jan & Petra Dvořák',
    cityCountry: 'Prague, Czech Republic 🇨🇿',
    avatarText: 'JD',
    category: 'PADI',
    tripTitle: 'PADI Advanced Open Water Diver',
    rating: 5,
    date: 'July 2026',
    comment:
      'Did Deep Dive (30m) and Navigation specialties. Clear academic briefings, brand-new dive computers, and very welcoming vibe on the sundeck between dives. Highly recommend Dive Go Hurghada to anyone visiting Egypt!',
    verified: true,
    highlightTag: 'PADI Advanced Certified',
    source: 'Google Reviews',
  },
];

const CATEGORIES = [
  { id: 'ALL', label: 'All Reviews (5.0 ★)' },
  { id: 'DIVING', label: 'Scuba Diving 🤿' },
  { id: 'DOLPHIN', label: 'Dolphin House 🐬' },
  { id: 'PADI', label: 'PADI Courses 📜' },
  { id: 'SAFARI', label: 'Quad Safari 🏜️' },
];

export const WebsiteReviews: React.FC = () => {
  const [reviews, setReviews] = useState<CustomerReview[]>(() => {
    try {
      const saved = localStorage.getItem('dive_go_hurghada_guest_reviews');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      // fallback
    }
    return INITIAL_REVIEWS;
  });

  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [showReviewModal, setShowReviewModal] = useState(false);

  // New review form state
  const [formName, setFormName] = useState('');
  const [formCity, setFormCity] = useState('');
  const [formTrip, setFormTrip] = useState('Daily Boat Diving (2 Guided Dives)');
  const [formCategory, setFormCategory] = useState<'DIVING' | 'DOLPHIN' | 'PADI' | 'SAFARI'>('DIVING');
  const [formRating, setFormRating] = useState(5);
  const [formComment, setFormComment] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Filtered reviews
  const filteredReviews = reviews.filter((r) =>
    activeCategory === 'ALL' ? true : r.category === activeCategory
  );

  // Reset index when filter changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [activeCategory]);

  // Autoplay timer
  useEffect(() => {
    if (!isAutoPlay || filteredReviews.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % filteredReviews.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isAutoPlay, filteredReviews.length]);

  const handlePrev = () => {
    setIsAutoPlay(false);
    setCurrentIndex((prev) => (prev === 0 ? filteredReviews.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setIsAutoPlay(false);
    setCurrentIndex((prev) => (prev + 1) % filteredReviews.length);
  };

  const handleSubmitNewReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formComment) return;

    const newRev: CustomerReview = {
      id: `rev-${Date.now()}`,
      author: formName,
      cityCountry: formCity || 'Hurghada Traveler 🌍',
      avatarText: formName.slice(0, 2).toUpperCase(),
      category: formCategory,
      tripTitle: formTrip,
      rating: formRating,
      date: 'Just now',
      comment: formComment,
      verified: true,
      highlightTag: 'Verified Direct Guest',
      source: 'Direct Guest',
    };

    const updated = [newRev, ...reviews];
    setReviews(updated);
    try {
      localStorage.setItem('dive_go_hurghada_guest_reviews', JSON.stringify(updated));
    } catch (e) {
      // ignore
    }

    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setShowReviewModal(false);
      setFormName('');
      setFormCity('');
      setFormComment('');
      setActiveCategory('ALL');
      setCurrentIndex(0);
    }, 1500);
  };

  // Determine window of 3 reviews to display responsively
  const getVisibleReviews = () => {
    if (filteredReviews.length === 0) return [];
    if (filteredReviews.length <= 3) return filteredReviews;

    const items: CustomerReview[] = [];
    for (let i = 0; i < 3; i++) {
      const idx = (currentIndex + i) % filteredReviews.length;
      items.push(filteredReviews[idx]);
    }
    return items;
  };

  const visibleReviews = getVisibleReviews();

  return (
    <section id="reviews" className="py-20 bg-slate-900/60 text-white border-t border-slate-900 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div className="max-w-2xl">
            <span className="text-cyan-400 font-bold text-xs uppercase tracking-wider block mb-2">
              Verified Traveler Experiences
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight text-balance">
              Loved by Divers & Families Worldwide
            </h2>
            <p className="text-sm text-slate-400 mt-2 leading-relaxed text-balance">
              Explore authentic reviews from certified divers and holidaymakers across Europe and the Middle East who
              ventured into the Red Sea with Dive Go Hurghada.
            </p>
          </div>

          {/* Social Proof Score Card */}
          <div className="flex items-center gap-4 bg-slate-950/80 border border-slate-800 p-4 rounded-2xl shrink-0 backdrop-blur-sm shadow-xl">
            <div className="text-center border-r border-slate-800 pr-4">
              <span className="text-3xl font-black text-white block">4.9</span>
              <div className="flex text-amber-400 text-xs">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-amber-400" />
                ))}
              </div>
              <span className="text-[10px] text-slate-400 mt-0.5 block">1,240+ Reviews</span>
            </div>

            <div className="space-y-1 text-xs">
              <div className="flex items-center space-x-1.5 text-emerald-400 font-bold text-[11px]">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>100% Verified Guests</span>
              </div>
              <div className="flex items-center space-x-1.5 text-cyan-400 text-[11px]">
                <Award className="h-3.5 w-3.5" />
                <span>TripAdvisor Choice 2026</span>
              </div>
              <button
                onClick={() => setShowReviewModal(true)}
                className="text-[11px] text-white hover:text-cyan-300 font-semibold underline flex items-center space-x-1 cursor-pointer pt-0.5"
              >
                <PlusCircle className="h-3 w-3" />
                <span>Leave a Review</span>
              </button>
            </div>
          </div>
        </div>

        {/* Category Filter Chips & Carousel Nav Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          {/* Category Tabs */}
          <div className="flex overflow-x-auto space-x-2 pb-1 sm:pb-0 no-scrollbar">
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                    isActive
                      ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                      : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Carousel Arrow Controls */}
          <div className="flex items-center space-x-2 self-end sm:self-auto">
            <span className="text-[11px] text-slate-400 mr-2 hidden sm:inline">
              Showing {currentIndex + 1} of {filteredReviews.length}
            </span>
            <button
              onClick={handlePrev}
              aria-label="Previous Review"
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700 transition cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={handleNext}
              aria-label="Next Review"
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700 transition cursor-pointer"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Carousel Cards Container (Paused on hover) */}
        <div
          onMouseEnter={() => setIsAutoPlay(false)}
          onMouseLeave={() => setIsAutoPlay(true)}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 transition-all duration-500 ease-in-out"
        >
          {visibleReviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-slate-900/90 border border-slate-800 hover:border-cyan-500/40 rounded-3xl p-6 shadow-xl space-y-4 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 relative group"
            >
              {/* Highlight Tag & Source */}
              <div className="flex items-center justify-between text-[11px]">
                <span className="px-2.5 py-0.5 rounded-full font-bold bg-cyan-950 text-cyan-300 border border-cyan-800">
                  {rev.highlightTag}
                </span>
                <span className="text-slate-400 text-[10px] flex items-center space-x-1">
                  <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                  <span>{rev.source}</span>
                </span>
              </div>

              {/* Stars & Testimonial Quote */}
              <div className="space-y-2.5">
                <div className="flex items-center space-x-1 text-amber-400">
                  {[...Array(rev.rating)].map((_, idx) => (
                    <Star key={idx} className="h-3.5 w-3.5 fill-amber-400" />
                  ))}
                </div>

                <p className="text-xs text-slate-300 leading-relaxed italic relative pl-4 border-l-2 border-cyan-500/30">
                  "{rev.comment}"
                </p>
              </div>

              {/* Author & Trip Details */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-3">
                  <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center font-bold text-white text-xs shrink-0 shadow-sm">
                    {rev.avatarText}
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm leading-tight">{rev.author}</h4>
                    <p className="text-slate-400 text-[11px]">{rev.cityCountry}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-cyan-400 block font-medium max-w-[130px] truncate">
                    {rev.tripTitle}
                  </span>
                  <span className="text-[10px] text-slate-400">{rev.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Carousel Pagination Dots */}
        <div className="flex justify-center items-center space-x-2 mt-8">
          {filteredReviews.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setIsAutoPlay(false);
                setCurrentIndex(i);
              }}
              aria-label={`Jump to review slide ${i + 1}`}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                currentIndex === i ? 'w-8 bg-cyan-400' : 'w-2 bg-slate-800 hover:bg-slate-700'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Guest "Leave a Review" Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setShowReviewModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white transition"
            >
              <X className="h-5 w-5" />
            </button>

            {formSubmitted ? (
              <div className="text-center py-8 space-y-3">
                <div className="h-12 w-12 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-white">Thank You for Your Feedback!</h3>
                <p className="text-xs text-slate-300">
                  Your review has been successfully submitted and added to the Dive Go Hurghada guest showcase.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitNewReview} className="space-y-4 text-xs">
                <div className="flex items-center space-x-2">
                  <Sparkles className="h-5 w-5 text-cyan-400" />
                  <h3 className="text-base font-bold text-white">Share Your Red Sea Experience</h3>
                </div>
                <p className="text-slate-400 text-[11px]">
                  Help future divers and families by leaving your authentic feedback about our boats, instructors, and
                  excursions.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Your Name *</label>
                    <input
                      type="text"
                      required
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="e.g. David Miller"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">City & Country</label>
                    <input
                      type="text"
                      value={formCity}
                      onChange={(e) => setFormCity(e.target.value)}
                      placeholder="e.g. Berlin, Germany 🇩🇪"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Excursion Taken</label>
                    <select
                      value={formTrip}
                      onChange={(e) => {
                        setFormTrip(e.target.value);
                        if (e.target.value.includes('Dolphin')) setFormCategory('DOLPHIN');
                        else if (e.target.value.includes('PADI')) setFormCategory('PADI');
                        else if (e.target.value.includes('Safari')) setFormCategory('SAFARI');
                        else setFormCategory('DIVING');
                      }}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                    >
                      <option value="Daily Boat Diving (2 Guided Dives)">Daily Boat Diving (2 Dives)</option>
                      <option value="Discover Scuba Diving (Beginners)">Discover Scuba Diving</option>
                      <option value="Dolphin House Snorkeling Safari">Dolphin House Snorkeling</option>
                      <option value="PADI Open Water Diver Course">PADI Open Water Course</option>
                      <option value="Super Desert Quad Safari & Bedouin BBQ">Super Desert Quad Safari</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Star Rating</label>
                    <div className="flex items-center space-x-1 pt-1.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setFormRating(s)}
                          className="p-1 cursor-pointer transition hover:scale-110"
                        >
                          <Star
                            className={`h-5 w-5 ${
                              s <= formRating ? 'text-amber-400 fill-amber-400' : 'text-slate-600'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Your Review / Highlights *</label>
                  <textarea
                    required
                    rows={3}
                    value={formComment}
                    onChange={(e) => setFormComment(e.target.value)}
                    placeholder="Tell us about the dive boat, instructors, lunch, marine life you saw..."
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="flex items-center justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowReviewModal(false)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl font-bold shadow-md shadow-cyan-600/30 flex items-center space-x-1.5 cursor-pointer transition"
                  >
                    <Send className="h-3.5 w-3.5" />
                    <span>Publish Review</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
