import HeroShowcase from "@/components/home/HeroShowcase";
import SolutionsIntro from "@/components/home/SolutionsIntro";
import CategoryGrid from "@/components/home/CategoryGrid";
import OrderingSteps from "@/components/home/OrderingSteps";
import LatestCollection from "@/components/home/LatestCollection";
import StatsBar from "@/components/home/StatsBar";
import GetInTouch from "@/components/home/GetInTouch";
import BespokeCopy from "@/components/home/BespokeCopy";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import FaqSection from "@/components/home/FaqSection";
import Testimonials from "@/components/home/Testimonials";
import { getFeatured } from "@/lib/store";
import { SITE } from "@/lib/site";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const latest = await getFeatured(8);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Store",
    name: SITE.name,
    description: SITE.description,
    url: SITE.url,
    image: `${SITE.url}/icon.png`,
    address: { "@type": "PostalAddress", addressCountry: "US" },
    priceRange: "$$",
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <HeroShowcase />
      <SolutionsIntro />
      <CategoryGrid />
      <OrderingSteps />
      <LatestCollection products={latest} />
      <StatsBar />
      <GetInTouch />
      <BespokeCopy />
      <WhyChooseUs />
      <FaqSection />
      <Testimonials />
    </>
  );
}
