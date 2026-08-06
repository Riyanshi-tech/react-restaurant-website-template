import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

const FAQ_ITEMS = [
  {
    question: "How does QR ordering work?",
    answer: "Each table in your restaurant is assigned a unique, secure QR code. When a customer scans it with their phone camera, the digital menu opens instantly in their browser. The menu is automatically paired with their table number, so when they place an order, it sends directly to the kitchen queue under that table name."
  },
  {
    question: "Do customers need to install an app?",
    answer: "No, absolutely not! CafeFlow operates as a progressive web application. It opens immediately in any standard mobile web browser (like Safari or Chrome). There's no app store download, account registration, or friction required for the customer."
  },
  {
    question: "Can I manage multiple tables and sections?",
    answer: "Yes! The Admin Dashboard lets you design your restaurant floor layout. You can create tables, group them by sections (e.g., Indoor, Patio, Bar), and generate custom QR code PDFs for printing. You can monitor the live ordering status of all tables simultaneously."
  },
  {
    question: "Is online payment required to use the system?",
    answer: "No, online payment is fully optional. You can configure CafeFlow to allow online table checkout (via Apple Pay, Google Pay, or credit cards), or select 'Pay at Counter' where customers send the order online but pay the server in cash or via a card reader at the end of their meal."
  }
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(prev => (prev === index ? null : index));
  };

  return (
    <section id="faq" className="section-padding bg-background relative overflow-hidden">
      {/* Decorative details */}
      <div className="absolute bottom-[10%] left-[-15%] w-[35%] h-[35%] bg-primary/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="container-width max-w-4xl">
        {/* Section Header */}
        <div className="text-center mb-16" data-aos="fade-up">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold uppercase tracking-wider mb-3">
            Questions & Answers
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-playfair font-bold text-foreground mb-4">
            Frequently Asked <span className="text-primary">Questions</span>
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto mb-6" />
          <p className="text-muted-foreground text-lg max-w-xl mx-auto font-inter">
            Got questions about CafeFlow? Here are simple answers on how table ordering fits into your daily routine.
          </p>
        </div>

        {/* Collapsible FAQ Items */}
        <div className="space-y-4" data-aos="fade-up">
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-card border border-border/80 hover:border-primary/25 rounded-2xl overflow-hidden transition-all duration-300 shadow-md"
              >
                {/* Question Accordion Header */}
                <button
                  onClick={() => toggleFAQ(idx)}
                  className="w-full flex items-center justify-between p-5 md:p-6 text-left focus:outline-none"
                >
                  <div className="flex gap-3 items-center">
                    <HelpCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="font-playfair font-bold text-base md:text-lg text-foreground group-hover:text-primary">
                      {item.question}
                    </span>
                  </div>
                  <ChevronDown
                    className={`h-5 w-5 text-muted-foreground transition-transform duration-300 ${
                      isOpen ? "transform rotate-180 text-primary" : ""
                    }`}
                  />
                </button>

                {/* Answer Accordion Content */}
                <div
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${
                    isOpen ? "max-h-[300px] border-t border-border/50" : "max-h-0"
                  }`}
                >
                  <p className="p-5 md:p-6 text-sm md:text-base text-muted-foreground leading-relaxed font-inter bg-muted/10">
                    {item.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
