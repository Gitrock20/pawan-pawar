import { BrowserRouter as Router, Routes, Route, Link, useLocation, useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { ShoppingBag, Search, User, Heart, Menu, X, Instagram, Facebook, Twitter, Star, ChevronRight, ArrowLeft } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { GoogleGenAI } from "@google/genai";

// AI Logic
const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const AIRecommendations = ({ products }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);

  const getRecommendations = async () => {
    if (products.length === 0) return;
    setLoading(true);
    try {
      const model = "gemini-3-flash-preview";
      const prompt = `Based on these artisanal products: ${products.map(p => p.name).join(", ")}, which 2 would you recommend for someone looking for "serenity and groundedness"? Return ONLY the names of the two products separated by a comma.`;
      
      const response = await genAI.models.generateContent({
        model: model,
        contents: prompt,
      });

      const recommendedNames = response.text?.split(",").map(n => n.trim()) || [];
      const recommendedItems = products.filter(p => recommendedNames.some(name => p.name.includes(name)));
      setRecommendations(recommendedItems);
    } catch (err) {
      console.error("AI Rec Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (products.length > 0) getRecommendations();
  }, [products]);

  if (loading || recommendations.length === 0) return null;

  return (
    <section className="py-24 px-6 bg-brand-gold/5">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-xs uppercase tracking-widest font-bold text-brand-gold mb-2 block">Intelligent Selection</span>
          <h2 className="text-4xl font-serif">Aura Recommendations</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
          {recommendations.map(item => (
            <Link to={`/product/${item.id}`} key={item.id} className="group relative aspect-video overflow-hidden rounded-3xl soft-shadow">
              <img src={item.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt={item.name} />
              <div className="absolute inset-0 bg-brand-ink/40 flex flex-col justify-end p-8 text-brand-cream">
                <p className="text-[10px] uppercase tracking-widest font-bold opacity-60 mb-1">{item.category}</p>
                <h3 className="text-2xl font-serif mb-4">{item.name}</h3>
                <span className="text-xs uppercase tracking-widest font-bold flex items-center gap-2">Discover Ritual <ChevronRight className="w-4 h-4" /></span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

// Mock Data Hook
const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products")
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      });
  }, []);

  return { products, loading };
};

const Navbar = ({ cartCount, wishlistCount }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      setIsSearchOpen(false);
      navigate(`/products?q=${searchQuery}`);
    }
  };
  
  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50 bg-brand-cream/80 backdrop-blur-md border-b border-brand-olive/10">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <button className="lg:hidden" onClick={() => setIsMenuOpen(true)}>
              <Menu className="w-6 h-6" />
            </button>
            <div className="hidden lg:flex items-center gap-6 text-sm uppercase tracking-widest font-medium">
              <Link to="/products" className="hover:text-brand-gold transition-colors">Shop</Link>
              <Link to="/blog" className="hover:text-brand-gold transition-colors">Journal</Link>
              <Link to="/contact" className="hover:text-brand-gold transition-colors">Story</Link>
            </div>
          </div>
          
          <Link to="/" className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center hover:opacity-80 transition-opacity">
            <img src="/input_file_0.png" alt="SAANJH" className="h-12 md:h-16 w-auto object-contain" />
          </Link>
          
          <div className="flex items-center gap-6">
            <button className="hover:text-brand-gold transition-colors" onClick={() => setIsSearchOpen(true)}><Search className="w-5 h-5" /></button>
            <Link to="/wishlist" className="hover:text-brand-gold transition-colors relative">
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && <span className="absolute -top-2 -right-2 bg-brand-gold text-white text-[8px] w-3 h-3 rounded-full flex items-center justify-center font-bold">{wishlistCount}</span>}
            </Link>
            <button className="hover:text-brand-gold transition-colors relative">
              <ShoppingBag className="w-5 h-5" />
              <span className="absolute -top-2 -right-2 bg-brand-olive text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">{cartCount}</span>
            </button>
            <Link to="/login" className="hidden lg:block hover:text-brand-gold transition-colors"><User className="w-5 h-5" /></Link>
          </div>
        </div>
      </nav>

      {/* Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-brand-cream flex items-center justify-center p-12"
          >
            <button className="absolute top-8 right-8" onClick={() => setIsSearchOpen(false)}><X className="w-10 h-10" /></button>
            <div className="w-full max-w-2xl">
              <input 
                autoFocus
                placeholder="Search collection..."
                className="w-full bg-transparent border-b-2 border-brand-ink text-4xl md:text-6xl font-serif py-4 focus:outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearch}
              />
              <p className="mt-8 text-xs uppercase tracking-widest font-bold opacity-40">Press Enter to Search</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[60] bg-brand-cream flex flex-col p-8"
          >
            <div className="flex justify-end">
              <button onClick={() => setIsMenuOpen(false)}><X className="w-8 h-8" /></button>
            </div>
            <div className="flex flex-col gap-8 mt-12 text-4xl font-serif">
              <Link to="/" onClick={() => setIsMenuOpen(false)}>Home</Link>
              <Link to="/products" onClick={() => setIsMenuOpen(false)}>Shop All</Link>
              <Link to="/blog" onClick={() => setIsMenuOpen(false)}>Journal</Link>
              <Link to="/admin" onClick={() => setIsMenuOpen(false)}>Admin</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const Footer = () => (
  <footer className="bg-brand-ink text-brand-cream pt-24 pb-12">
    <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-brand-cream/10 pb-24">
      <div className="col-span-1 md:col-span-2">
        <div className="mb-6">
          <img src="/input_file_0.png" alt="SAANJH" className="h-16 w-auto object-contain brightness-0 invert" />
        </div>
        <p className="max-w-md text-brand-cream/60 leading-relaxed font-light italic">
          Artisanal objects for intentional spaces. Handcrafted with soul, designed for tranquility.
        </p>
      </div>
      <div>
        <h4 className="text-xs uppercase tracking-widest font-semibold mb-6">Explore</h4>
        <ul className="space-y-4 text-brand-cream/60 text-sm">
          <li><Link to="/products" className="hover:text-brand-cream transition-colors">Shop All</Link></li>
          <li><Link to="/blog" className="hover:text-brand-cream transition-colors">Journal</Link></li>
          <li><Link to="/admin" className="hover:text-brand-cream transition-colors">Admin Dashboard</Link></li>
        </ul>
      </div>
      <div>
        <h4 className="text-xs uppercase tracking-widest font-semibold mb-6">Connect</h4>
        <div className="flex gap-4 mb-8">
          <Instagram className="w-5 h-5 cursor-pointer hover:text-brand-gold transition-colors" />
          <Facebook className="w-5 h-5 cursor-pointer hover:text-brand-gold transition-colors" />
          <Twitter className="w-5 h-5 cursor-pointer hover:text-brand-gold transition-colors" />
        </div>
        <p className="text-xs text-brand-cream/40 uppercase tracking-tighter">Sign up for our newsletter</p>
        <div className="mt-4 flex">
          <input type="email" placeholder="Email Address" className="bg-transparent border-b border-brand-cream/20 py-2 w-full focus:outline-none focus:border-brand-gold" />
          <button className="ml-4 text-xs font-semibold hover:text-brand-gold transition-colors uppercase">Join</button>
        </div>
      </div>
    </div>
    <div className="max-w-7xl mx-auto px-6 mt-12 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] uppercase tracking-widest text-brand-cream/40 font-medium">
      <p>&copy; 2024 SAANJH ARTISANAL. ALL RIGHTS RESERVED.</p>
    </div>
  </footer>
);

const Home = () => {
  const { products, loading } = useProducts();
  
  return (
    <div className="pt-20">
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <motion.div initial={{ scale: 1.1, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 1.5 }} className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1572911189437-024346850c95?auto=format&fit=crop&q=80&w=2000" className="w-full h-full object-cover brightness-75" alt="Hero" />
        </motion.div>
        <div className="relative z-10 text-center text-brand-cream max-w-4xl px-6">
          <motion.h1 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.7 }} className="text-6xl md:text-8xl font-serif mb-12 leading-tight">
            Curated Artisanal <br /> Objects
          </motion.h1>
          <Link to="/products" className="bg-brand-cream text-brand-ink px-12 py-5 rounded-full font-medium hover:bg-brand-gold hover:text-brand-cream transition-all duration-300 uppercase tracking-widest text-xs">
            Explore Collection
          </Link>
        </div>
      </section>

      <AIRecommendations products={products} />

      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-16">
          <h2 className="text-5xl font-serif">Featured</h2>
          <Link to="/products" className="text-xs underline tracking-widest font-bold">Shop All</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {products.slice(0, 3).map((product) => (
            <motion.div key={product.id} className="group cursor-pointer">
              <Link to={`/product/${product.id}`}>
                <div className="aspect-[3/4] overflow-hidden rounded-2xl mb-6 soft-shadow relative">
                  <img src={product.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={product.name} />
                </div>
                <div className="flex justify-between">
                  <h3 className="text-xl font-serif group-hover:text-brand-gold">{product.name}</h3>
                  <p className="font-medium">₹{product.price}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

const ProductDetailPage = ({ addToCart, addToWishlist }) => {
  const { id } = useParams();
  const { products, loading } = useProducts();
  const [reviews, setReviews] = useState([
    { id: 1, user: "Elena", rating: 5, comment: "The Midnight Jasmine is truly transformative. My evening ritual is now complete.", date: "2 days ago" },
    { id: 2, user: "Marcus", rating: 4, comment: "Beautiful craftsmanship on the ring. Worth the wait.", date: "1 week ago" }
  ]);
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const product = products.find(p => p.id === id);

  const handleSubmitReview = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setReviews([{ id: Date.now(), user: "You", ...newReview, date: "Just now" }, ...reviews]);
      setNewReview({ rating: 5, comment: "" });
      setIsSubmitting(false);
    }, 1000);
  };

  if (loading) return <div className="h-screen flex items-center justify-center font-serif text-2xl">Loading...</div>;
  if (!product) return <div className="h-screen flex items-center justify-center font-serif text-2xl">Product not found</div>;

  return (
    <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24">
        <div className="space-y-8">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="aspect-[4/5] rounded-3xl overflow-hidden soft-shadow">
            <img src={product.image} className="w-full h-full object-cover" alt={product.name} />
          </motion.div>
        </div>
        
        <div className="flex flex-col">
          <Link to="/products" className="flex items-center gap-2 text-xs uppercase tracking-widest font-bold opacity-40 hover:opacity-100 mb-12 transition-all">
            <ArrowLeft className="w-4 h-4" /> Back to Collection
          </Link>
          <span className="text-xs uppercase tracking-widest font-bold text-brand-gold mb-2">{product.category}</span>
          <h1 className="text-6xl font-serif mb-6">{product.name}</h1>
          <div className="flex items-center gap-4 mb-8">
             <div className="flex gap-1 text-brand-gold">
               {[...Array(5)].map((_, i) => <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-current' : ''}`} />)}
             </div>
             <span className="text-xs opacity-40 font-bold">{product.reviews} Authenticated Reviews</span>
          </div>
          <p className="text-3xl font-serif mb-8">₹{product.price}</p>
          <p className="text-brand-olive/60 leading-relaxed italic mb-12 text-lg">{product.description}</p>
          
          <div className="space-y-4">
             <button onClick={() => addToCart(product)} className="w-full bg-brand-ink text-brand-cream py-6 rounded-2xl font-bold uppercase tracking-[0.2em] transform active:scale-95 transition-all hover:bg-brand-gold">
               Add to Ritual Bundle
             </button>
             <button onClick={() => addToWishlist(product)} className="w-full artisanal-border py-4 rounded-2xl font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-brand-gold/5 transition-all">
               <Heart className="w-4 h-4" /> Save to Wishlist
             </button>
          </div>

          <div className="flex gap-4 mt-8">
             <button className="p-3 rounded-full artisanal-border hover:bg-brand-ink hover:text-brand-cream transition-all"><Instagram className="w-5 h-5" /></button>
             <button className="p-3 rounded-full artisanal-border hover:bg-brand-ink hover:text-brand-cream transition-all"><Facebook className="w-5 h-5" /></button>
             <button className="p-3 rounded-full artisanal-border hover:bg-brand-ink hover:text-brand-cream transition-all"><Twitter className="w-5 h-5" /></button>
          </div>

          <div className="mt-16 pt-16 border-t border-brand-olive/10 grid grid-cols-2 gap-8">
            <div>
              <h4 className="text-xs uppercase tracking-widest font-bold mb-4">Crafting Time</h4>
              <p className="text-sm opacity-60 italic">Small batch production. Each piece takes 7-10 working days to artisanally perfect.</p>
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-widest font-bold mb-4">Sourcing</h4>
              <p className="text-sm opacity-60 italic">Ethically obtained materials. 100% biodegradable soy wax and recycled gold.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="max-w-4xl border-t border-brand-olive/10 pt-24">
        <div className="flex flex-col md:flex-row justify-between gap-12">
          <div className="md:w-1/2">
            <h2 className="text-4xl font-serif mb-12 italic">Honest Reflections</h2>
            <div className="space-y-12">
              {reviews.map(review => (
                <div key={review.id} className="border-l-2 border-brand-gold pl-6">
                  <div className="flex gap-1 text-brand-gold mb-2">
                    {[...Array(5)].map((_, i) => <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'fill-current' : ''}`} />)}
                  </div>
                  <p className="text-brand-ink/80 italic mb-4 leading-relaxed line-clamp-3">"{review.comment}"</p>
                  <p className="text-[10px] uppercase tracking-widest font-bold opacity-40">{review.user} — {review.date}</p>
                </div>
              ))}
            </div>
          </div>
          
          <div className="md:w-1/2 bg-brand-gold/5 p-12 rounded-3xl h-fit sticky top-32">
            <h3 className="text-2xl font-serif mb-6 italic">Leave a Review</h3>
            <form onSubmit={handleSubmitReview} className="space-y-6">
              <div>
                <label className="text-[10px] uppercase tracking-widest font-bold opacity-40 mb-2 block">Rating</label>
                <div className="flex gap-2">
                  {[1,2,3,4,5].map(val => (
                    <button key={val} type="button" onClick={() => setNewReview({...newReview, rating: val})} className={`p-1 ${newReview.rating >= val ? 'text-brand-gold' : 'text-brand-olive/20'}`}>
                      <Star className={`w-6 h-6 ${newReview.rating >= val ? 'fill-current' : ''}`} />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-widest font-bold opacity-40 mb-2 block">Your Reflection</label>
                <textarea 
                  required
                  value={newReview.comment}
                  onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                  className="w-full bg-brand-cream border-b border-brand-olive/20 py-4 focus:outline-none focus:border-brand-gold italic min-h-[120px]" 
                  placeholder="Share your experience with this object..."
                />
              </div>
              <button disabled={isSubmitting} className="w-full py-4 text-[10px] bg-brand-ink text-brand-cream uppercase tracking-widest font-bold rounded-xl hover:bg-brand-gold transition-all disabled:opacity-50">
                {isSubmitting ? "Submitting..." : "Post Review"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

const WishlistPage = ({ wishlist }) => (
  <div className="pt-40 max-w-7xl mx-auto px-6 pb-24 min-h-screen">
    <h1 className="text-6xl font-serif mb-16">Wishlist</h1>
    {wishlist.length === 0 ? (
      <div className="text-center py-24 italic opacity-40">Your collection is empty</div>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-12">
        {wishlist.map(item => (
          <div key={item.id} className="group">
            <Link to={`/product/${item.id}`}>
              <div className="aspect-[3/4] overflow-hidden rounded-2xl mb-6 soft-shadow relative">
                <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={item.name} />
              </div>
              <h3 className="text-xl font-serif">{item.name}</h3>
              <p className="font-medium">₹{item.price}</p>
            </Link>
          </div>
        ))}
      </div>
    )}
  </div>
);

const LoyaltyPoints = ({ points }) => (
  <div className="bg-brand-gold/10 p-6 rounded-2xl flex items-center justify-between border border-brand-gold/20">
    <div>
      <p className="text-[10px] uppercase tracking-widest font-bold text-brand-gold mb-1">Ritual Rewards</p>
      <h4 className="text-xl font-serif">You have {points} Essence Points</h4>
    </div>
    <div className="bg-brand-gold text-white p-3 rounded-full">
      <Star className="w-6 h-6 fill-current" />
    </div>
  </div>
);

const CheckoutPage = ({ cart, onComplete, points }) => {
  const [step, setStep] = useState(1);
  const total = cart.reduce((acc, item) => acc + item.price, 0);

  if (cart.length === 0 && step === 1) return <div className="pt-40 text-center font-serif text-2xl italic">Your ritual bag is empty</div>;

  return (
    <div className="pt-40 pb-24 px-6 max-w-2xl mx-auto min-h-screen">
      <div className="flex justify-between mb-16">
        {[1, 2, 3].map(i => (
          <div key={i} className="flex flex-col items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${step >= i ? 'bg-brand-ink text-brand-cream' : 'bg-brand-olive/5'}`}>{i}</div>
            <span className="text-[10px] uppercase tracking-widest font-bold opacity-40">{i === 1 ? 'Bag' : i === 2 ? 'Address' : 'Payment'}</span>
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} key="step1">
            <h2 className="text-4xl font-serif mb-8">Review Bag</h2>
            <div className="space-y-6 mb-12">
              {cart.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center border-b border-brand-olive/10 pb-6">
                  <div className="flex gap-4">
                    <img src={item.image} className="w-16 h-16 object-cover rounded-lg" alt={item.name} />
                    <div>
                      <h4 className="font-serif">{item.name}</h4>
                      <p className="text-xs opacity-40">{item.category}</p>
                    </div>
                  </div>
                  <p className="font-medium">₹{item.price}</p>
                </div>
              ))}
            </div>
            <div className="bg-brand-gold/5 p-8 rounded-2xl mb-8 space-y-4">
              <div className="flex justify-between">
                <span className="opacity-60 italic">Subtotal</span>
                <span className="font-medium">₹{total}</span>
              </div>
              <div className="flex justify-between font-bold text-xl border-t border-brand-olive/10 pt-4">
                <span>Total</span>
                <span>₹{total}</span>
              </div>
            </div>
            <button onClick={() => setStep(2)} className="w-full bg-brand-ink text-brand-cream py-6 rounded-2xl font-bold uppercase tracking-widest hover:bg-brand-gold">Proceed to Sizing & Delivery</button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} key="step2">
             <div className="flex justify-between items-center mb-8">
               <h2 className="text-4xl font-serif">Delivery Details</h2>
               <span className="text-[10px] uppercase tracking-widest font-bold bg-brand-gold/10 text-brand-gold px-3 py-1 rounded-full">Guest Checkout</span>
             </div>
             <form className="grid grid-cols-2 gap-6" onSubmit={(e) => { e.preventDefault(); setStep(3); }}>
                <input required type="email" placeholder="Email Address for Order Updates" className="col-span-2 bg-transparent border-b border-brand-olive/20 py-4 focus:outline-none focus:border-brand-gold h-fit p-1" />
                <input required placeholder="First Name" className="col-span-1 bg-transparent border-b border-brand-olive/20 py-4 focus:outline-none focus:border-brand-gold h-fit p-1" />
                <input required placeholder="Last Name" className="col-span-1 bg-transparent border-b border-brand-olive/20 py-4 focus:outline-none focus:border-brand-gold h-fit p-1" />
                <input required placeholder="Shipping Address" className="col-span-2 bg-transparent border-b border-brand-olive/20 py-4 focus:outline-none focus:border-brand-gold h-fit p-1" />
                <input required placeholder="City" className="col-span-1 bg-transparent border-b border-brand-olive/20 py-4 focus:outline-none focus:border-brand-gold h-fit p-1" />
                <input required placeholder="Postal Code" className="col-span-1 bg-transparent border-b border-brand-olive/20 py-4 focus:outline-none focus:border-brand-gold h-fit p-1" />
                <button type="submit" className="col-span-2 bg-brand-ink text-brand-cream py-6 rounded-2xl font-bold uppercase tracking-widest hover:bg-brand-gold mt-8">Confirm Details</button>
             </form>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} key="step3" className="text-center">
             <div className="bg-brand-olive p-12 rounded-3xl text-brand-cream mb-8">
                <ShoppingBag className="w-16 h-16 mx-auto mb-6 opacity-40" />
                <h2 className="text-4xl font-serif mb-4">Secure Payment</h2>
                <p className="opacity-60 italic mb-8 italic">Your artisanal objects are awaiting their journey.</p>
                <button 
                  onClick={onComplete}
                  className="w-full bg-brand-cream text-brand-ink py-6 rounded-2xl font-bold uppercase tracking-widest hover:bg-brand-gold hover:text-brand-cream transition-all"
                >
                  Confirm & Pay ₹{total}
                </button>
             </div>
             <p className="text-[10px] uppercase tracking-widest font-bold opacity-30">Encrypted with Industry Standards</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const AdminDashboard = ({ products }) => {
  return (
    <div className="pt-40 pb-24 px-6 max-w-7xl mx-auto min-h-screen">
      <div className="flex justify-between items-end mb-16">
        <div>
          <h1 className="text-6xl font-serif mb-4">Steward Dashboard</h1>
          <p className="opacity-40 uppercase tracking-widest font-bold text-xs">Inventory & Ritual Management</p>
        </div>
        <button className="bg-brand-olive text-brand-cream px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest">Add New Object</button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {products.map(p => (
          <div key={p.id} className="bg-white p-6 rounded-2xl flex items-center justify-between soft-shadow artisanal-border">
            <div className="flex items-center gap-6">
              <img src={p.image} className="w-16 h-16 object-cover rounded-xl" alt={p.name} />
              <div>
                <h4 className="text-xl font-serif">{p.name}</h4>
                <p className="text-xs opacity-40 font-bold uppercase tracking-widest">{p.category}</p>
              </div>
            </div>
            <div className="flex gap-12">
               <div className="text-center">
                 <span className="block font-bold">₹{p.price}</span>
                 <span className="text-[10px] uppercase opacity-40 font-bold">Price</span>
               </div>
               <div className="text-center">
                 <span className="block font-bold">12</span>
                 <span className="text-[10px] uppercase opacity-40 font-bold">Stock</span>
               </div>
            </div>
            <div className="flex gap-4">
               <button className="text-xs font-bold uppercase underline">Edit</button>
               <button className="text-xs font-bold uppercase text-red-500 underline">Hide</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ProductsPage = () => {
  const { products, loading } = useProducts();
  const [filter, setFilter] = useState("All");
  const location = useLocation();
  
  const queryParams = new URLSearchParams(location.search);
  const q = queryParams.get("q");

  const filteredProducts = useMemo(() => {
    let result = products;
    if (filter !== "All") result = result.filter(p => p.category === filter);
    if (q) result = result.filter(p => p.name.toLowerCase().includes(q.toLowerCase()));
    return result;
  }, [products, filter, q]);

  if (loading) return <div className="h-screen flex items-center justify-center font-serif text-2xl">Gathering Collection...</div>;

  return (
    <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-16">
        <div>
          <h1 className="text-6xl font-serif mb-4">{q ? `Search: "${q}"` : "Collection"}</h1>
          <p className="text-brand-olive/60 italic">Handcrafted objects designed for modern rituals.</p>
        </div>
        <div className="flex gap-4">
          {["All", "Candle", "Jewelry"].map(cat => (
            <button key={cat} onClick={() => setFilter(cat)} className={`px-6 py-2 rounded-full text-xs uppercase tracking-widest transition-all ${filter === cat ? 'bg-brand-olive text-brand-cream' : 'bg-brand-olive/5'}`}>{cat}</button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-x-8 gap-y-16">
        {filteredProducts.map(product => (
          <motion.div layout key={product.id} className="group">
            <Link to={`/product/${product.id}`} className="aspect-[3/4] overflow-hidden rounded-2xl mb-6 soft-shadow block relative">
              <img src={product.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={product.name} />
            </Link>
            <div className="flex justify-between mb-2">
              <h3 className="text-lg font-serif">{product.name}</h3>
              <p className="font-medium">₹{product.price}</p>
            </div>
            <p className="text-[10px] uppercase tracking-widest font-bold opacity-30">{product.category}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const ContactPage = () => {
  const [submitted, setSubmitted] = useState(false);
  
  return (
    <div className="pt-40 pb-24 px-6 max-w-4xl mx-auto min-h-screen">
      <div className="text-center mb-24">
        <h1 className="text-6xl font-serif mb-6 italic text-brand-olive">Reach Out</h1>
        <p className="opacity-60 max-w-lg mx-auto leading-relaxed">Whether you have a query about our artisanal process or want to share your ritual experience, we're here to listen.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-24">
        <div>
          <h3 className="text-2xl font-serif mb-8 italic">The Studio</h3>
          <div className="space-y-6 opacity-60 text-sm leading-relaxed">
            <p>128 Artisanal Lane<br />Creative District, Saanjh 40001</p>
            <p>Monday — Friday<br />10am — 6pm</p>
            <p>studio@saanjh.com<br />+91 9988776655</p>
          </div>
        </div>

        <div>
          {submitted ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-brand-gold/5 p-12 rounded-3xl text-center">
              <Star className="w-12 h-12 mx-auto mb-6 text-brand-gold" />
              <h3 className="text-2xl font-serif mb-4 italic">Message Gathered</h3>
              <p className="text-sm opacity-60">We've received your notes. Expect a response within 48 artisanal hours.</p>
            </motion.div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="space-y-8">
              <div>
                <label className="text-[10px] uppercase tracking-widest font-bold opacity-40 mb-2 block">Name</label>
                <input required className="w-full bg-transparent border-b border-brand-olive/20 py-3 focus:outline-none focus:border-brand-gold" />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-widest font-bold opacity-40 mb-2 block">Email</label>
                <input required type="email" className="w-full bg-transparent border-b border-brand-olive/20 py-3 focus:outline-none focus:border-brand-gold" />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-widest font-bold opacity-40 mb-2 block">Inquiry</label>
                <textarea required className="w-full bg-transparent border-b border-brand-olive/20 py-3 focus:outline-none focus:border-brand-gold min-h-[100px]" />
              </div>
              <button className="w-full bg-brand-ink text-brand-cream py-5 rounded-2xl font-bold uppercase tracking-widest hover:bg-brand-gold transition-all">Send Message</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  return (
    <div className="pt-40 pb-24 px-6 max-w-md mx-auto min-h-screen">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-serif mb-4">{isLogin ? 'Welcome Back' : 'Join the Ritual'}</h2>
        <p className="text-xs uppercase tracking-widest font-bold opacity-40">Access your curated collection</p>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); navigate('/'); }} className="space-y-8">
        {!isLogin && (
          <div>
            <label className="text-[10px] uppercase tracking-widest font-bold opacity-40 mb-2 block">Full Name</label>
            <input required className="w-full bg-transparent border-b border-brand-olive/20 py-3 focus:outline-none focus:border-brand-gold" />
          </div>
        )}
        <div>
          <label className="text-[10px] uppercase tracking-widest font-bold opacity-40 mb-2 block">Email Address</label>
          <input required type="email" className="w-full bg-transparent border-b border-brand-olive/20 py-3 focus:outline-none focus:border-brand-gold" />
        </div>
        <div>
          <label className="text-[10px] uppercase tracking-widest font-bold opacity-40 mb-2 block">Secret Key (Password)</label>
          <input required type="password" className="w-full bg-transparent border-b border-brand-olive/20 py-3 focus:outline-none focus:border-brand-gold" />
        </div>
        
        <button className="w-full bg-brand-ink text-brand-cream py-5 rounded-2xl font-bold uppercase tracking-widest hover:bg-brand-gold transition-all">
          {isLogin ? 'Enter Studio' : 'Begin Journey'}
        </button>
      </form>

      <div className="mt-12 text-center">
        <button onClick={() => setIsLogin(!isLogin)} className="text-xs font-bold uppercase tracking-widest underline opacity-40 hover:opacity-100 italic transition-all">
          {isLogin ? "Don't have an account? Sign up" : "Already have an account? Login"}
        </button>
      </div>
    </div>
  );
};

export default function App() {
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [points, setPoints] = useState(150);
  const { products } = useProducts();
  const navigate = useNavigate();

  const addToCart = (product) => setCart([...cart, product]);
  const addToWishlist = (product) => {
    if (!wishlist.find(p => p.id === product.id)) setWishlist([...wishlist, product]);
  };

  const handleCheckoutComplete = () => {
    // Reward points for purchase
    setPoints(prev => prev + 50);
    setCart([]);
    alert("Order Confirmed. Your ritual has begun.");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-brand-cream selection:bg-brand-gold selection:text-white">
      <Navbar cartCount={cart.length} wishlistCount={wishlist.length} />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/product/:id" element={<ProductDetailPage addToCart={addToCart} addToWishlist={addToWishlist} />} />
          <Route path="/wishlist" element={<WishlistPage wishlist={wishlist} />} />
          <Route path="/checkout" element={<CheckoutPage cart={cart} onComplete={handleCheckoutComplete} points={points} />} />
          <Route path="/admin" element={<AdminDashboard products={products} />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/blog" element={<div className="pt-40 text-center text-4xl font-serif">Journal Coming Soon</div>} />
        </Routes>
        {cart.length > 0 && <Link to="/checkout" className="fixed bottom-8 right-8 bg-brand-ink text-brand-cream px-8 py-4 rounded-full font-bold uppercase tracking-widest soft-shadow hover:bg-brand-gold transition-all z-40 flex items-center gap-3">
          <ShoppingBag className="w-5 h-5" /> Checkout (₹{cart.reduce((a, b) => a + b.price, 0)})
        </Link>}
      </main>
      <Footer />
    </div>
  );
}
