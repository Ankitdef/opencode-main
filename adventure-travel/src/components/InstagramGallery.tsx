"use client";

import { motion } from "framer-motion";
import { FadeUp, StaggerContainer, StaggerItem } from "./MotionWrapper";
import SmartImage from "./SmartImage";

const images = [
  { src: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&q=80", alt: "Mountain peak", likes: "2.4K" },
  { src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80", alt: "Snow mountains", likes: "1.8K" },
  { src: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=400&q=80", alt: "Camping tent", likes: "3.1K" },
  { src: "https://images.unsplash.com/photo-1473116763249-2faaef81ccda?w=400&q=80", alt: "River rapids", likes: "2.9K" },
  { src: "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=400&q=80", alt: "Snow mountains", likes: "4.2K" },
  { src: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=400&q=80", alt: "Desert dunes", likes: "1.5K" },
  { src: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=400&q=80", alt: "Forest trail", likes: "2.1K" },
  { src: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&q=80", alt: "Mountain trail", likes: "3.5K" },
];

const INSTAGRAM_URL = "https://instagram.com/expedition_happiness07";

export default function InstagramGallery() {
  return (
    <section className="py-section bg-background/70 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <FadeUp className="text-center mb-12">
          <span className="text-sm font-semibold tracking-widest uppercase text-accent">@expedition_happiness07</span>
          <h2 className="mt-4 font-heading text-display-lg font-bold text-foreground leading-tight">
            Follow Our Adventures
          </h2>
          <p className="mt-4 text-lg text-muted leading-relaxed max-w-xl mx-auto">
            Join our community of adventurers. Follow us on Instagram for daily inspiration.
          </p>
        </FadeUp>

        <StaggerContainer className="columns-2 md:columns-3 lg:columns-4 gap-4" staggerDelay={0.05}>
          {images.map((image, i) => (
            <StaggerItem key={i} className="break-inside-avoid mb-4">
              <motion.a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`View "${image.alt}" on our Instagram`}
                whileHover={{ y: -4, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="group relative block rounded-2xl overflow-hidden"
              >
                <SmartImage
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="flex items-center gap-2 text-white">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                    <span className="text-sm font-semibold">{image.likes}</span>
                  </div>
                </div>
              </motion.a>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <FadeUp delay={0.3} className="text-center mt-12">
          <a
            href="https://instagram.com/expedition_happiness07"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white font-semibold rounded-full hover:shadow-lg hover:shadow-purple-500/25 transition-all hover:-translate-y-0.5"
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
            </svg>
            Follow @expedition_happiness07
          </a>
        </FadeUp>
      </div>
    </section>
  );
}
