import Link from "next/link";
import { getUserMeLoader } from "@/data/services/get-user-me-loader";
import { StrapiImage } from "@/components/custom/strapi-image";
import AnimatedBackground from "@/components/custom/animated-background";

interface Image {
  id: number;
  documentId: string;
  url: string;
  alternativeText: string | null;
}

interface Link {
  id: number;
  url: string;
  text: string;
}

interface HeroSectionProps {
  id: number;
  documentId: string;
  __component: string;
  heading: string;
  subheading: string;
  image: Image;
  link: Link;
}

export async function HeroSection({
  data,
}: {
  readonly data: HeroSectionProps;
}) {
  const user = await getUserMeLoader();
  const userLoggedIn = user?.ok;

  const { heading, subheading, image, link } = data;
  const linkUrl = userLoggedIn ? "/dashboard" : link.url;

  return (
    <header className="relative h-[600px] overflow-hidden">
      <StrapiImage
        alt={image.alternativeText ?? "no alternative text"}
        className="absolute inset-0 object-cover w-full h-full aspect/16:9"
        src={image.url}
        height={1080}
        width={1920}
      />
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white bg-black bg-opacity-70">
        <h1 className="text-4xl font-bold max-w-[800px] relative z-10">
          {heading}
        </h1>
        <p className="mt-4 text-lg md:text-xl lg:text-2xl max-w-[800px] relative z-10">
          {subheading}
        </p>
        <Link
          className="mt-8 inline-flex items-center justify-center px-6 py-3 text-base font-medium text-black bg-white rounded-md shadow hover:bg-gray-100 hover:text-primary hover:underline relative z-10"
          href={linkUrl}
        >
          {userLoggedIn ? "Dashboard" : link.text}
        </Link>
        <AnimatedBackground />
        <div className="bg-gradient-to-r from-transparent  to-purple-400 absolute w-full h-full top-0 left-0 opacity-30" />
      </div>
    </header>
  );
}
