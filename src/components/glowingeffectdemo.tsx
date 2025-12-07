"use client";

import { GlowingEffect } from "@/components/ui/glowing-effect";
import type { ReactNode } from "react";
import { MessageCircle, Brain, BarChart3, Zap, TrendingUp } from "lucide-react";

export function GlowingEffectDemoSecond() {
  return (
    <div className="bg-black/10">
      <h1 className="text-center text-4xl font-bold mb-4">
        Trading Reimagined by Vertex
      </h1>
      <p className="text-center text-md font-normal text-neutral-600 dark:text-neutral-400 mb-10">
        Experience the future of trading with our revolutionary AI-powered platform.
      </p>

      <ul className="grid grid-cols-1 grid-rows-none gap-4 md:grid-cols-12 md:grid-rows-3 lg:gap-4 xl:max-h-[34rem] xl:grid-rows-2 mx-40 py-4">
        <GridItem
          area="md:[grid-area:1/1/2/7] xl:[grid-area:1/1/2/5]"
          icon={<MessageCircle className="h-4 w-4 text-black dark:text-neutral-400" />}
          title="Natural Language Trading"
          description="Simply type 'buy 10 Tesla shares' or 'analyze Netflix stock' and let our AI handle the complex execution and analysis."
        />

        <GridItem
          area="md:[grid-area:1/7/2/13] xl:[grid-area:2/1/3/5]"
          icon={<Brain className="h-4 w-4 text-black dark:text-neutral-400" />}
          title="Advanced AI Assistant"
          description="Get real-time market insights, stock analysis, and personalized trading recommendations powered by large language models."
        />
        <GridItem
          area="md:[grid-area:2/1/3/7] xl:[grid-area:1/5/3/8]"
          icon={<BarChart3 className="h-4 w-4 text-black dark:text-neutral-400" />}
          title="Real-Time Analytics"
          description="Access live market data, interactive charts, and comprehensive portfolio tracking with professional-grade tools."
        />

        <GridItem
          area="md:[grid-area:2/7/3/13] xl:[grid-area:1/8/2/13]"
          icon={<Zap className="h-4 w-4 text-black dark:text-neutral-400" />}
          title="Lightning Fast Execution"
          description="Execute trades in milliseconds with our optimized infrastructure and direct market access for maximum efficiency."
        />

        <GridItem
          area="md:[grid-area:3/1/4/13] xl:[grid-area:2/8/3/13]"
          icon={<TrendingUp className="h-4 w-4 text-black dark:text-neutral-400" />}
          title="Smart Portfolio Management"
          description="AI-driven portfolio optimization, risk assessment, and automated rebalancing to maximize your returns."
        />
      </ul>
    </div>
  );
}

interface GridItemProps {
  area: string;
  icon: ReactNode;
  title: string;
  description: ReactNode;
}

const GridItem = ({ area, icon, title, description }: GridItemProps) => {
  return (
    <li className={`min-h-[14rem] list-none ${area}`}>
      <div className="relative h-full rounded-2xl border p-2 md:rounded-3xl md:p-3">
        <GlowingEffect
          blur={0}
          borderWidth={3}
          spread={80}
          glow={true}
          disabled={false}
          proximity={64}
          inactiveZone={0.01}
        />
        <div className="border-0.75 relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-xl p-6 md:p-6 dark:shadow-[0px_0px_27px_0px_#2D2D2D]">
          <div className="relative flex flex-1 flex-col justify-between gap-3">
            <div className="w-fit rounded-lg border border-gray-600 p-2">
              {icon}
            </div>
            <div className="space-y-3">
              <h3 className="-tracking-4 pt-0.5 font-sans text-xl/[1.375rem] font-semibold text-balance text-black md:text-2xl/[1.875rem] dark:text-white">
                {title}
              </h3>
              <h2 className="font-sans text-sm/[1.125rem] text-black md:text-base/[1.375rem] dark:text-neutral-400 [&_b]:md:font-semibold [&_strong]:md:font-semibold">
                {description}
              </h2>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
};
