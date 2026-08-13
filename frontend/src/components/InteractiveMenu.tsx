import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Sparkles } from "lucide-react";
import { tableService } from "@/services/tableService";
import { MenuItem } from "@/types";
import { formatINR } from "@/lib/utils";

const CATEGORIES = [
  { id: "all", name: "Full Archive" },
  { id: "breakfast", name: "Breakfast" },
  { id: "lunch", name: "Lunch" },
  { id: "dinner", name: "Dinner" },
  { id: "desserts", name: "Desserts" },
  { id: "drinks", name: "Drinks" },
];

const FALLBACK_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%23050b07' width='400' height='300'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23dfb93c' font-family='serif' font-size='14'%3ENo image%3C/text%3E%3C/svg%3E";

const itemId = (item: MenuItem) => item._id || item.id || item.name;

const InteractiveMenu = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    tableService
      .getPublicMenu()
      .then(setItems)
      .catch(() => setError("Could not load menu"))
      .finally(() => setLoading(false));
  }, []);

  const filteredItems = useMemo(
    () =>
      activeCategory === "all"
        ? items
        : items.filter((item) => item.category === activeCategory),
    [activeCategory, items]
  );

  return (
    <div
      id="menu"
      className="relative min-h-screen bg-forest-950 py-24 md:py-32 border-t border-gold-300/5 overflow-hidden"
    >
      <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-primary/5 rounded-full filter blur-[110px] pointer-events-none animate-candle" />

      <div className="container-width relative z-10 space-y-16">
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

        {loading ? (
          <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm py-16">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading menu…
          </div>
        ) : error ? (
          <p className="text-center text-sm text-muted-foreground py-16">{error}</p>
        ) : filteredItems.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground py-16">
            No items in this category yet.
          </p>
        ) : (
          <motion.div layout className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  key={itemId(item)}
                  className="bg-forest-glass rounded-2xl p-5 border border-gold-300/5 hover:border-primary/20 transition-all duration-300 relative group gold-sweep flex flex-col sm:flex-row gap-6 items-start sm:items-center"
                >
                  <div className="w-full sm:w-28 sm:h-28 md:w-32 md:h-32 aspect-[16/10] sm:aspect-square relative rounded-xl overflow-hidden shrink-0 border border-gold-300/10 shadow-md">
                    <img
                      src={item.image || FALLBACK_IMAGE}
                      alt={item.name}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 select-none"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-forest-950/40 via-transparent to-transparent opacity-60" />
                  </div>

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

                      <span className="font-playfair text-base text-primary font-semibold border border-primary/20 bg-primary/5 px-2.5 py-1 rounded-md shrink-0">
                        {formatINR(item.price)}
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
        )}
      </div>
    </div>
  );
};

export default InteractiveMenu;
