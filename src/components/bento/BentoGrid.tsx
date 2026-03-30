"use client";

import { useState, useCallback } from "react";
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
import CurrentlyCard from "./cards/CurrentlyCard";
import TiltCard from "@/components/common/TiltCard";
import CardModal from "./CardModal";
import {
  AvailabilityExpanded,
  HighlightsExpanded,
  LocationExpanded,
  TechStackExpanded,
  QuickLinksExpanded,
  CurrentlyExpanded,
} from "./CardModalContent";

type ModalType = "availability" | "highlights" | "location" | "techstack" | "quicklinks" | "currently" | null;

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
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const close = useCallback(() => setActiveModal(null), []);

  const modalTitles: Record<Exclude<ModalType, null>, string> = {
    availability: "Availability",
    highlights: "Highlights",
    location: "Based In",
    techstack: "Tech Stack",
    quicklinks: "Find Me On",
    currently: "Currently",
  };

  const modalContent: Record<Exclude<ModalType, null>, React.ReactNode> = {
    availability: <AvailabilityExpanded siteConfig={siteConfig} />,
    highlights: <HighlightsExpanded siteConfig={siteConfig} />,
    location: <LocationExpanded siteConfig={siteConfig} />,
    techstack: <TechStackExpanded siteConfig={siteConfig} />,
    quicklinks: <QuickLinksExpanded siteConfig={siteConfig} />,
    currently: <CurrentlyExpanded siteConfig={siteConfig} />,
  };

  return (
    <div className="px-4 md:px-6 lg:px-8 py-2">
      <motion.div
        className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 lg:grid-cols-12 gap-2 sm:gap-3 auto-rows-[120px] sm:auto-rows-[130px] md:auto-rows-[140px] max-w-[1440px] mx-auto"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
      >
        {/* Row 1: Info cards — Availability, Highlights, Location, Tech */}
        <motion.div variants={item} className="col-span-1 sm:col-span-2 md:col-span-2 lg:col-span-3 row-span-1 cursor-pointer" onClick={() => setActiveModal("availability")}>
          <TiltCard className="h-full"><AvailabilityCard siteConfig={siteConfig} /></TiltCard>
        </motion.div>

        <motion.div variants={item} className="col-span-1 sm:col-span-2 md:col-span-2 lg:col-span-3 row-span-1 cursor-pointer" onClick={() => setActiveModal("highlights")}>
          <TiltCard className="h-full"><HighlightsCard siteConfig={siteConfig} /></TiltCard>
        </motion.div>

        <motion.div variants={item} className="col-span-1 sm:col-span-2 md:col-span-2 lg:col-span-3 row-span-1 cursor-pointer" onClick={() => setActiveModal("location")}>
          <TiltCard className="h-full"><LocationCard siteConfig={siteConfig} /></TiltCard>
        </motion.div>

        <motion.div variants={item} className="col-span-1 sm:col-span-2 md:col-span-2 lg:col-span-3 row-span-1 cursor-pointer" onClick={() => setActiveModal("techstack")}>
          <TiltCard className="h-full"><TechStack siteConfig={siteConfig} /></TiltCard>
        </motion.div>

        {/* Row 2-3: Skills + Experience + QuickLinks */}
        <motion.div variants={item} className="col-span-2 sm:col-span-4 md:col-span-3 lg:col-span-3 row-span-2">
          <TiltCard className="h-full" tiltStrength={5}><SkillsCard siteConfig={siteConfig} /></TiltCard>
        </motion.div>

        <motion.div variants={item} className="col-span-2 sm:col-span-4 md:col-span-5 lg:col-span-5 row-span-2">
          <TiltCard className="h-full" tiltStrength={5}><ExperienceTimeline experiences={experiences} /></TiltCard>
        </motion.div>

        <motion.div variants={item} className="col-span-2 sm:col-span-4 md:col-span-8 lg:col-span-4 row-span-1 cursor-pointer" onClick={() => setActiveModal("quicklinks")}>
          <TiltCard className="h-full"><QuickLinks siteConfig={siteConfig} /></TiltCard>
        </motion.div>

        <motion.div variants={item} className="col-span-2 sm:col-span-4 md:col-span-8 lg:col-span-4 row-span-1 cursor-pointer" onClick={() => setActiveModal("currently")}>
          <TiltCard className="h-full"><CurrentlyCard siteConfig={siteConfig} /></TiltCard>
        </motion.div>

        {/* Row 4-5+: Featured projects */}
        {featured[0] && (
          <motion.div variants={item} className="col-span-2 sm:col-span-4 md:col-span-4 lg:col-span-6 row-span-2">
            <TiltCard className="h-full" tiltStrength={4}><ProjectShowcase project={featured[0]} index={0} /></TiltCard>
          </motion.div>
        )}

        {featured[1] && (
          <motion.div variants={item} className="col-span-2 sm:col-span-4 md:col-span-4 lg:col-span-6 row-span-2">
            <TiltCard className="h-full" tiltStrength={4}><ProjectShowcase project={featured[1]} index={1} /></TiltCard>
          </motion.div>
        )}

        {featured[2] && (
          <motion.div variants={item} className="col-span-2 sm:col-span-4 md:col-span-4 lg:col-span-6 row-span-2">
            <TiltCard className="h-full" tiltStrength={4}><ProjectShowcase project={featured[2]} index={2} /></TiltCard>
          </motion.div>
        )}

        {featured[3] && (
          <motion.div variants={item} className="col-span-2 sm:col-span-4 md:col-span-4 lg:col-span-6 row-span-2">
            <TiltCard className="h-full" tiltStrength={4}><ProjectShowcase project={featured[3]} index={3} /></TiltCard>
          </motion.div>
        )}
      </motion.div>

      {/* Card Modal */}
      <CardModal
        isOpen={activeModal !== null}
        onClose={close}
        title={activeModal ? modalTitles[activeModal] : ""}
      >
        {activeModal && modalContent[activeModal]}
      </CardModal>
    </div>
  );
}
