import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import Chef1 from "../assets/images/chef-1.webp";
import Chef2 from "../assets/images/chef-2.webp";
import Chef3 from "../assets/images/chef-3.webp";

// Centralized configuration for team/founders data, matching original chef images
const TEAM_PROFILES = [
  {
    name: "Aarav Kapoor",
    title: "Co-Founder & CEO",
    image: Chef1,
    bio: "With over 12 years in café operations and restaurant consulting, Aarav drives CafeFlow's product strategy.",
    specialties: ["Operations Veteran", "Product Strategy"],
  },
  {
    name: "Sloane Harper",
    title: "Co-Founder & Head of Product",
    image: Chef2,
    bio: "Sloane specializes in visual styling and user experience, ensuring our mobile guest menu is clean and simple.",
    specialties: ["UX & UI Design", "Café Branding"],
  },
  {
    name: "Diego Montoya",
    title: "Co-Founder & CTO",
    image: Chef3,
    bio: "Diego leads the engineering team, specializing in websocket synchronization and cloud backend performance.",
    specialties: ["Real-Time Systems", "Cloud Scaling"],
  },
];

const Chefs = () => {
  return (
    <section id="team" className="section-padding bg-muted/30">
      <div className="container-width">
        {/* Section Heading */}
        <div className="text-center mb-16" data-aos="fade-up">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold uppercase tracking-wider mb-3">
            Our Team
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-playfair font-bold text-foreground mb-4">
            Meet the <span className="text-primary">Founders</span>
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto mb-6" />
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-inter">
            Our founding team brings together deep hospitality experience and modern technology expertise to solve restaurant service delays.
          </p>
        </div>

        {/* Team Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {TEAM_PROFILES.map((member, index) => (
            <Card
              key={index}
              data-aos="zoom-in-up"
              data-aos-delay={index * 100}
              className="group hover:shadow-xl bg-card border-border/80 hover:border-primary/45 transition-all duration-300 transform hover:-translate-y-2 overflow-hidden"
            >
              {/* Profile Image with specialties overlay */}
              <div className="relative overflow-hidden">
                <img
                  src={member.image}
                  alt={`${member.name} - ${member.title}`}
                  className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                  <div className="p-6 text-white">
                    <ul className="flex flex-wrap gap-2">
                      {member.specialties.map((specialty, idx) => (
                        <li
                          key={idx}
                          className="bg-primary/90 px-2 py-1 rounded-full text-xs font-semibold font-inter"
                        >
                          {specialty}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Founder Details */}
              <CardContent className="p-6 space-y-2">
                <h3 className="text-xl font-playfair font-bold text-foreground mb-1 group-hover:text-primary transition-colors duration-200">
                  {member.name}
                </h3>
                <p className="text-primary font-semibold text-sm font-inter">{member.title}</p>
                <p className="text-muted-foreground text-sm leading-relaxed font-inter">
                  {member.bio}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Chefs;
