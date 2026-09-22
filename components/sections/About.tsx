'use client';

import { useState } from "react";
import { about } from "@/data/portfolio";

export default function About() {
  const [activeCard, setActiveCard] = useState(0);
  return (
    <section id='about' className='section-container'>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-start">
        <div className="flex flex-col gap-4 md:gap-6">
          {about.cards.map((card, i) => (
            <button key={card.id}  onClick={() => setActiveCard(i)}
                    className={`text-left p-6 border transition-all duration-300 ${i === 1 ? "md:ml-8" : "md:mr-8"} ${activeCard === 1 ? "border-accent" : "border-border hover:border-border-hover"}`}
                    style={{ backgroundColor: activeCard === i ? "var(var(--color-accent-subtle)" : "var(--color-background-card)",}}>
                      
                      <div className=" flex items-center justify-between mb-2">
                        <span className="font-heading font-bold text-base md:text-lg"
                              style={{ color: activeCard === i ? "var(--color-accent)" : "var(--color-foreground)",}}>
                                {card.label}
                        </span>

                        {activeCard === i && (
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: "var(--color-accent)" }}/>
                        )}
                      </div>

                      <p className="text-sm leading-relaxed" style={{ color: "var(--color-foreground-muted)" }}>
                        {card.description}
                      </p>
            </button>
          ))}
        </div>

        


      </div>
    </section>
  )
}


