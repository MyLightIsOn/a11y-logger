import { Block } from "@/types/blocks";
import CheckIcon from "@/components/icons/check";
import ClockIcon from "@/components/icons/clock";
import CloudIcon from "@/components/icons/cloud";

/**
 * Returns a matching icon component based on the string identifier.
 * Icons are styled with Tailwind classes to maintain visual consistency.
 */
function getIcon(name: string) {
  switch (name) {
    case "CLOCK_ICON":
      return (
        <ClockIcon className="w-12 h-12 mb-4 text-primary dark:text-secondary" />
      );
    case "CHECK_ICON":
      return (
        <CheckIcon className="w-12 h-12 mb-4 text-primary dark:text-secondary" />
      );
    case "CLOUD_ICON":
      return (
        <CloudIcon className="w-12 h-12 mb-4 text-primary dark:text-secondary" />
      );
    default:
      return null; // Gracefully handle unknown icon names
  }
}

/**
 * The FeatureSection component is responsible for rendering a grid of features,
 * each with an icon, heading, and subheading.
 * Data is provided from Strapi via the layout.features-section block.
 */
export function FeatureSection({ data }: { readonly data: Block }) {
  // Guard: Ensure we're rendering the correct block type
  if (data.__component !== "layout.features-section") return null;

  // Destructure necessary content fields from CMS block
  const { feature } = data;

  return (
    <div className="">
      <div className="flex-1">
        <section className="container px-4 py-6 mx-auto md:px-6 lg:py-24">
          <div className="grid gap-8 md:grid-cols-3">
            {/* Render each feature as a styled card */}
            {feature.map((feature) => (
              <div
                key={feature.id}
                className="flex flex-col items-center text-center dark:bg-white/5 p-6 rounded-sm border border-gray-300 dark:border-none"
              >
                {getIcon(feature.icon)}
                <h2 className="mb-4 text-2xl font-bold">{feature.heading}</h2>
                <p className="text-gray-500 dark:text-gray-200">
                  {feature.subHeading}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
