"use client";

import { useState } from "react";

import { motion } from "motion/react";

import {
  SignedIn,
  SignedOut,
  UserButton,
  SignInButton,
  SignUpButton,
} from "@clerk/nextjs";

import Link from "next/link";
import Image from "next/image";

import { BackgroundDotsMaskedVertical } from "@/components/blocks/backgrounds/background-with-dots-masked-vertical";

import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavMenu,
  MobileNavHeader,
  MobileNavToggle,
} from "@/components/blocks/navbar";

import Button from "@/components/ui/bc-button";

const Hero = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { name: "Home", link: "/" },
    { name: "About", link: "/about" },
    { name: "Contact", link: "/contact" },
  ];

  return (
    <>
      {/* <Navbar>
        <NavBody>
          <NavbarLogo />
          <NavItems items={navItems} />
          <div className="flex items-center gap-4">
            <NavbarButton variant="secondary">Login</NavbarButton>
            <NavbarButton variant="primary">Book a call</NavbarButton>
          </div>
        </NavBody>

        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo />
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </MobileNavHeader>

          <MobileNavMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          >
            {navItems.map((item, idx) => (
              <a
                key={`mobile-link-${idx}`}
                href={item.link}
                onClick={() => setIsMobileMenuOpen(false)}
                className="relative text-neutral-600 dark:text-neutral-300"
              >
                <span className="block">{item.name}</span>
              </a>
            ))}
            <div className="flex w-full flex-col gap-4">
              <NavbarButton
                onClick={() => setIsMobileMenuOpen(false)}
                variant="primary"
                className="w-full"
              >
                Login
              </NavbarButton>
              <NavbarButton
                onClick={() => setIsMobileMenuOpen(false)}
                variant="primary"
                className="w-full"
              >
                Book a call
              </NavbarButton>
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar> */}
      <BackgroundDotsMaskedVertical content={<HeroContent />} />
    </>
  );
};

const HeroContent = () => {
  return (
    <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col justify-center overflow-hidden">
      <motion.div
        animate={{ y: 0, opacity: 1 }}
        initial={{ y: -40, opacity: 0 }}
        transition={{ ease: "easeOut", duration: 0.5 }}
        className="flex justify-center -ml-5 md:-ml-8"
      >
        <Image
          width={180}
          height={100}
          alt="Bidcast Logo"
          src="/bidcast-logo.svg"
        />
      </motion.div>
      <motion.h1
        animate={{ y: 0, opacity: 1 }}
        initial={{ y: 40, opacity: 0 }}
        transition={{ ease: "easeOut", duration: 0.4 }}
        className="relative tracking-tight z-10 mx-auto mt-6 max-w-6xl text-center text-5xl text-foreground md:text-6xl lg:text-8xl"
      >
        <span className="bg-[radial-gradient(61.17%_178.53%_at_38.83%_-13.54%,#3B3B3B_0%,#888787_12.61%,#FFFFFF_60%,#888787_100%,#3B3B3B_120%)] bg-clip-text text-transparent">
          Meet your
          <br />
          new producer:
        </span>
        <br />
        <span className="text-primary">Your Audience</span>
      </motion.h1>
      <motion.p
        animate={{ y: 0, opacity: 1 }}
        initial={{ y: 40, opacity: 0 }}
        transition={{ ease: "easeOut", duration: 0.5, delay: 0.2 }}
        className="relative px-5 z-10 mx-auto mt-6 max-w-3xl text-center text-base/8 text-secondary md:text-xl"
      >
        Empower your audience to drive your content decisions.
        <br />
        Make the content they want, and get paid for it.
      </motion.p>
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ ease: "easeOut", duration: 0.5, delay: 0.4 }}
        className="flex items-center justify-center flex-col sm:flex-row gap-4 relative z-10 mt-10 px-8"
      >
        <SignedOut>
          <SignUpButton>
            <Button className="w-full sm:w-auto" variant="primary">
              Get started. Make content happen.
            </Button>
          </SignUpButton>
          <SignInButton>
            <Button className="w-full sm:w-auto" variant="simple">
              Sign In
            </Button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <Link href="/feed">
            <Button className="w-full sm:w-auto" variant="primary">
              Go to campaign feed
            </Button>
          </Link>
        </SignedIn>
      </motion.div>
    </div>
  );
};

export default Hero;
