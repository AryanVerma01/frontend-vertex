"use client";

import React from "react";
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";

export function InfiniteMovingCardsDemo() {
  return (
    <div>
      
      <div className="h-[40rem] rounded-md flex flex-col antialiased bg-white dark:bg-black/10 dark:bg-grid-white/[0.05] items-center justify-center relative overflow-hidden">
      <h1 className="text-center text-3xl font-bold mb-10">
        Trusted by traders worldwide
      </h1>
      <p className="text-center text-lg font-normal text-neutral-600 dark:text-neutral-400 mb-10">
        See what our traders have to say about Vertex.
      </p>
        <InfiniteMovingCards
          items={testimonials}
          direction="right"
          speed="slow"
        />
      </div>
      
    </div>
  );
}

const testimonials = [
  {
    quote:
      "Vertex has completely transformed how I trade. The AI insights are incredibly accurate and have improved my returns by 40%.",
    name: "Sarah Chen",
    title: "Day Trader",
  },
  {
    quote:
      "The natural language interface is game-changing. I can execute complex strategies just by describing what I want to do.",
    name: "Michael Rodriguez",
    title: "Portfolio Manager",
  },
  {
    quote:
      "As a beginner, Vertex made trading accessible. The AI explains everything clearly and helps me make informed decisions.",
    name: "Emily Johnson",
    title: "Retail Investor",
  },
  {
    quote:
      "Vertex’s AI-powered analysis has simplified my decision-making process. I can confidently plan trades knowing I have real-time insights at my fingertips.",
    name: "Laura Martinez",
    title: "Swing Trader",
  },
  {
    quote:
      "The platform’s speed and accuracy are unmatched. I no longer worry about missing opportunities—Vertex ensures I’m always one step ahead in the market.",
    name: "David Kim",
    title: "Quantitative Analyst",
  },
];
