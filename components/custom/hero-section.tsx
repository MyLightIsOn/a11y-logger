import Link from "next/link";
import { getUserMeLoader } from "@/data/services/get-user-me-loader";
import { StrapiImage } from "@/components/custom/strapi-image";
import AnimatedBackground from "@/components/custom/animated-background";
import { Block } from "@/types/blocks";

/**
 * The HeroSection component renders a large hero banner with background image,
 * heading, subheading, and a call-to-action button.
 * It supports conditional navigation based on user login state.
 */
export async function HeroSection({ data }: { readonly data: Block }) {
  // Guard: Ensure we're rendering the correct block type
  if (data.__component !== "layout.hero-section") return null;

  // Fetch user status to determine where the CTA link should go
  const user = await getUserMeLoader();
  const userLoggedIn = user?.ok;

  // Destructure necessary content fields from CMS block
  const { heading, subheading, image, link } = data;

  // Determine CTA destination based on login status
  const linkUrl = userLoggedIn ? "/dashboard" : link?.url;

  return (
    <header className="relative h-[600px] overflow-hidden">
      {/* Render background image from Strapi with fallback alt text */}
      <StrapiImage
        alt={image.alternativeText ?? "no alternative text"}
        className="absolute inset-0 object-cover w-full h-full aspect/16:9"
        src={image.url}
        height={1080}
        width={1920}
      />

      {/* Overlay content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white bg-black bg-opacity-70">
        {/* Main heading */}
        <h1 className="text-4xl font-bold max-w-[800px] relative z-10">
          {heading}
        </h1>

        {/* Subheading text */}
        <p className="mt-4 text-lg md:text-xl lg:text-2xl max-w-[800px] relative z-10">
          {subheading}
        </p>

        {/* CTA button with conditional label + destination */}
        <Link
          className="mt-8 inline-flex items-center justify-center px-6 py-3 text-base font-medium text-black bg-white rounded-md shadow hover:bg-gray-100 hover:text-primary hover:underline relative z-10"
          href={linkUrl}
        >
          {userLoggedIn ? "Dashboard" : link.text}
        </Link>

        {/* Optional animated background layer */}
        <AnimatedBackground />

        {/* Gradient overlay for visual depth */}
        <div className="bg-gradient-to-r from-transparent  to-purple-400 absolute w-full h-full top-0 left-0 opacity-30" />
      </div>
    </header>
  );
}
