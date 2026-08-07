import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";
import dishSteak from "@/assets/images/dish-steak.webp";
import dishCoffee from "@/assets/images/dish-coffee.webp";
import ourStory from "@/assets/images/our-story.webp";
import ambience1 from "@/assets/images/ambience-1.webp";
import jungleHero from "@/assets/images/jungle-hero.webp";
import heroBg from "@/assets/images/hero-bg.webp";

type MenuItem = {
  id: string;
  name: string;
  price: string;
  category: "breakfast" | "lunch" | "dinner" | "desserts" | "drinks";
  description: string;
  tag?: string;
  image: string;
};

const MENU_ITEMS: MenuItem[] = [
  // Breakfast
  {
    id: "b1",
    name: "Wild Chanterelle Frittata",
    price: "$26",
    category: "breakfast",
    description: "Fluffy forest hen eggs baked with wild-harvested chanterelle mushrooms, local fontina cheese, and fresh sage greens.",
    tag: "Staff Choice",
    image: ourStory
  },
  {
    id: "b2",
    name: "Forest Honey & Oats Parfait",
    price: "$19",
    category: "breakfast",
    description: "Creamy house-made sheep yogurt, organic wild honey, toasted heirloom oats, and seasonal pine-cone berry jam.",
    image: dishCoffee
  },
  // Lunch
  {
    id: "l1",
    name: "Smoked Venison Flatbread",
    price: "$34",
    category: "lunch",
    description: "Thin-crust wood-fired flatbread topped with cured venison strips, caramelized forest onions, and a wild huckleberry reduction.",
    tag: "Signature",
    image: dishSteak
  },
  {
    id: "l2",
    name: "Rainforest Botanist Salad",
    price: "$24",
    category: "lunch",
    description: "Lush moss greens, organic micro-herbs, roasted walnuts, shaved radish, and a sparkling citrus pine-needle vinaigrette.",
    image: ambience1
  },
  // Dinner
  {
    id: "dn1",
    name: "Cedar-Planked Stream Trout",
    price: "$48",
    category: "dinner",
    description: "Freshly caught local stream trout slow-grilled on aromatic cedar planks, served with wild ramp purée and blistered vine tomatoes.",
    tag: "Highly Recommended",
    image: jungleHero
  },
  {
    id: "dn2",
    name: "Pine-Crusted Rack of Lamb",
    price: "$58",
    category: "dinner",
    description: "Tender grass-fed lamb rack encrusted with crushed pine nuts and herbs, roasted parsnips, and a rich bone-marrow broth.",
    image: dishSteak
  },
  // Desserts
  {
    id: "ds1",
    name: "Wild Blackberry Lavender Tart",
    price: "$18",
    category: "desserts",
    description: "Crispy sweet crust filled with fresh blackberries, infused with local mountain lavender oil, and topped with spun sugar.",
    tag: "Delicate",
    image: ourStory
  },
  {
    id: "ds2",
    name: "Spruce-Infused Mousse",
    price: "$16",
    category: "desserts",
    description: "Dark single-origin Peruvian chocolate whipped with a hint of young spruce shoot oil, served inside a miniature wood bowl.",
    image: dishCoffee
  },
  // Drinks
  {
    id: "dr1",
    name: "Smoked Botanical Gin & Tonic",
    price: "$22",
    category: "drinks",
    description: "House-distilled forest gin infused with pine needles, juniper berries, elderflower, served with local tonic and active cedar smoke.",
    tag: "House Special",
    image: heroBg
  },
  {
    id: "dr2",
    name: "Geisha Pour-Over Coffee",
    price: "$14",
    category: "drinks",
    description: "Single-origin Geisha beans brewed slow tableside. Offers distinct tasting notes of jasmine, peach nectar, and citrus honey.",
    image: dishCoffee
  }
];

const CATEGORIES = [
  { id: "all", name: "Full Archive" },
  { id: "breakfast", name: "Breakfast" },
  { id: "lunch", name: "Lunch" },
  { id: "dinner", name: "Dinner" },
  { id: "desserts", name: "Desserts" },
  { id: "drinks", name: "Drinks" }
];

const InteractiveMenu = () => {
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const filteredItems = activeCategory === "all"
    ? MENU_ITEMS
    : MENU_ITEMS.filter((item) => item.category === activeCategory);

  return (
    <div
      id="menu"
      className="relative min-h-screen bg-forest-950 py-24 md:py-32 border-t border-gold-300/5 overflow-hidden"
    >
      {/* Candlelight backdrop */}
      <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-primary/5 rounded-full filter blur-[110px] pointer-events-none animate-candle"></div>

      <div className="container-width relative z-10 space-y-16">
        
        {/* Title Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <span className="inline-block text-xs font-semibold tracking-[6px] uppercase text-primary font-inter">
            Chapter 04
          </span>
          <h2 className="font-playfair text-4xl sm:text-5xl text-foreground font-semibold leading-tight">
            The Interactive Gastronomy Archive
          </h2>
          <p className="font-inter text-muted-foreground text-sm leading-relaxed">
            Filter our culinary chronicle by course. Each plate is meticulously composed to reflect the seasonal offerings of the forest soil.
          </p>
        </div>

        {/* Filter Navigation Row */}
        <div className="flex flex-wrap justify-center gap-2 md:gap-4 border-b border-gold-300/10 pb-6">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`relative px-5 py-2.5 text-xs font-semibold tracking-widest uppercase transition-all duration-300 ${
                activeCategory === cat.id
                  ? "text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span className="relative z-10">{cat.name}</span>
              {activeCategory === cat.id && (
                <motion.div
                  layoutId="activeCategoryBg"
                  className="absolute inset-0 bg-primary rounded-full z-0"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Dynamic Grid Layout */}
        <motion.div 
          layout 
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                key={item.id}
                className="bg-forest-glass rounded-2xl p-5 border border-gold-300/5 hover:border-primary/20 transition-all duration-300 relative group gold-sweep flex flex-col sm:flex-row gap-6 items-start sm:items-center"
              >
                {/* Elegant Rounded Image Container */}
                <div className="w-full sm:w-28 sm:h-28 md:w-32 md:h-32 aspect-[16/10] sm:aspect-square relative rounded-xl overflow-hidden shrink-0 border border-gold-300/10 shadow-md">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 select-none"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-forest-950/40 via-transparent to-transparent opacity-60" />
                </div>

                {/* Content */}
                <div className="flex-grow space-y-3 w-full">
                  <div className="flex justify-between items-start gap-4">
                    <div className="space-y-1.5">
                      {item.tag && (
                        <div className="inline-flex items-center gap-1 text-[8px] font-bold uppercase tracking-wider text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-full">
                          <Sparkles className="h-2.5 w-2.5" />
                          {item.tag}
                        </div>
                      )}
                      <h3 className="font-playfair text-lg sm:text-xl text-foreground font-semibold group-hover:text-primary transition-colors">
                        {item.name}
                      </h3>
                    </div>
                    
                    {/* Glowing Price Seal */}
                    <span className="font-playfair text-base text-primary font-semibold border border-primary/20 bg-primary/5 px-2.5 py-1 rounded-md shrink-0">
                      {item.price}
                    </span>
                  </div>

                  <p className="font-inter text-muted-foreground text-xs leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

      </div>
    </div>
  );
};

export default InteractiveMenu;
