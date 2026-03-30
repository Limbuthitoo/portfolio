"use client";

import { motion } from "framer-motion";
import { Project, Experience, SiteConfig } from "@/types";
import ProjectShowcase from "./cards/ProjectShowcase";
import SkillsCard from "./cards/SkillsCard";
import LocationCard from "./cards/LocationCard";
import HighlightsCard from "./cards/HighlightsCard";
import ExperienceTimeline from "./cards/ExperienceTimeline";
import AvailabilityCard from "./cards/AvailabilityCard";
import TechStack from "./cards/TechStack";
import QuickLinks from "./cards/QuickLinks";

interface Props {
  projects: Project[];
  experiences: Experience[];
  siteConfig?: SiteConfig;
}

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.06 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20, scale: 0.96, filter: "blur(4px)" },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
  },
};

export default function BentoGrid({ projects, experiences, siteConfig }: Props) {
  const featured = projects.filter((p) => p.featured).slice(0, 4);

  return (
    <div className="px-4 md:px-6 lg:px-8 py-2">
      <motion.div
        className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 lg:grid-cols-12 gap-2 sm:gap-3 auto-rows-[120px] sm:auto-rows-[130px] md:auto-rows-[140px] max-w-[1440px] mx-auto"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {/* Row 1: Info cards — Availability, Highlights, Location, Tech */}
        <motion.div variants={item} className="col-span-1 sm:col-span-2 md:col-span-2 lg:col-span-3 row-span-1">
          <AvailabilityCard siteConfig={siteConfig} />
        </motion.div>

        <motion.div variants={item} className="col-span-1 sm:col-span-2 md:col-span-2 lg:col-span-3 row-span-1">
          <HighlightsCard siteConfig={siteConfig} />
        </motion.div>

        <motion.div variants={item} className="col-span-1 sm:col-span-2 md:col-span-2 lg:col-span-3 row-span-1">
          <LocationCard siteConfig={siteConfig} />
        </motion.div>

        <motion.div variants={item} className="col-span-1 sm:col-span-2 md:col-span-2 lg:col-span-3 row-span-1">
          <TechStack siteConfig={siteConfig} />
        </motion.div>

        {/* Row 2-3: Skills + Experience + QuickLinks */}
        <motion.div variants={item} className="col-span-2 sm:col-span-4 md:col-span-3 lg:col-span-3 row-span-2">
          <SkillsCard siteConfig={siteConfig} />
        </motion.div>

        <motion.div variants={item} className="col-span-2 sm:col-span-4 md:col-span-5 lg:col-span-5 row-span-2">
          <ExperienceTimeline experiences={experiences} />
        </motion.div>

        <motion.div variants={item} className="col-span-2 sm:col-span-4 md:col-span-8 lg:col-span-4 row-span-1">
          <QuickLinks siteConfig={siteConfig} />
        </motion.div>

        {/* Row 4-5+: Featured projects */}
        {featured[0] && (
          <motion.div variants={item} className="col-span-2 sm:col-span-4 md:col-span-4 lg:col-span-6 row-span-2">
            <ProjectShowcase project={featured[0]} index={0} />
          </motion.div>
        )}

        {featured[1] && (
          <motion.div variants={item} className="col-span-2 sm:col-span-4 md:col-span-4 lg:col-span-6 row-span-2">
            <ProjectShowcase project={featured[1]} index={1} />
          </motion.div>
        )}

        {featured[2] && (
          <motion.div variants={item} className="col-span-2 sm:col-span-4 md:col-span-4 lg:col-span-6 row-span-2">
            <ProjectShowcase project={featured[2]} index={2} />
          </motion.div>
        )}

        {featured[3] && (
          <motion.div variants={item} className="col-span-2 sm:col-span-4 md:col-span-4 lg:col-span-6 row-span-2">
            <ProjectShowcase project={featured[3]} index={3} />
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
