import { GlowingEffectDemoSecond } from "@/components/glowingeffectdemo";
import Halfsite from "@/components/half-site";
import HeroSectionOne from "@/components/hero-section-demo-1";
import { InfiniteMovingCardsDemo } from "@/components/infinitemovingcardsdemo";
import { GlowingEffect } from "@/components/ui/glowing-effect";

export default function Home(){
  return (<>
      <HeroSectionOne />
      <GlowingEffectDemoSecond/>
      <InfiniteMovingCardsDemo/>
      <Halfsite/>
    </>)
}