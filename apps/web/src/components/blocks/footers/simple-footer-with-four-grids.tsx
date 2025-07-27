"use client";

import React from "react";

import { motion } from "motion/react";

import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";

export function SimpleFooterWithFourGrids() {
  const productLinks = [
    {
      title: "Features",
      href: "#",
    },
    {
      title: "Pricing",
      href: "#",
    },
    {
      title: "Templates",
      href: "#",
    },
  ];

  const resourcesLinks = [
    {
      title: "Blog",
      href: "#",
    },
    {
      title: "Help Center",
      href: "#",
    },
    {
      title: "Community",
      href: "#",
    },
  ];

  const companyLinks = [
    {
      title: "About",
      href: "#",
    },
    {
      title: "Careers",
      href: "#",
    },
    {
      title: "Contact",
      href: "#",
    },
  ];
  const legalLinks = [
    {
      title: "Privacy",
      href: "#",
    },
    {
      title: "Terms",
      href: "#",
    },
    {
      title: "Security",
      href: "#",
    },
  ];

  const socialIcons = [
    { href: "#", icon: Facebook, name: "Facebook" },
    { href: "#", icon: Instagram, name: "Instagram" },
    { href: "#", icon: Twitter, name: "Twitter" },
    { href: "#", icon: Linkedin, name: "LinkedIn" },
  ];

  return (
    <div className="border-t border-border px-8 py-20 bg-background w-full relative overflow-hidden">
      <div className="max-w-7xl mx-auto text-sm text-secondary flex sm:flex-row flex-col justify-between items-start md:px-8">
        <div>
          <div className="mr-0 md:mr-4 md:flex mb-4">
            <Logo />
          </div>
          <p className="mt-4 text-sm text-secondary max-w-xs">
            Empowering creators.
          </p>
        </div>
        <div>
          <div className="flex items-center space-x-4 mt-6">
            {socialIcons.map((social) => (
              <Link
                href={social.href}
                key={social.name}
                className="text-secondary hover:text-primary transition-colors"
                aria-label={social.name}
              >
                <social.icon className="h-5 w-5" />
              </Link>
            ))}
          </div>

          {/* <div className="mt-8 text-sm text-secondary">
            &copy; Bidcast {new Date().getFullYear()}. All rights reserved.
          </div> */}
        </div>
        {/* <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 items-start mt-10 sm:mt-0 md:mt-0">
          <div className="flex justify-center space-y-4 flex-col w-full">
            <p className="font-bold text-foreground">Product</p>
            <ul className="list-none space-y-4">
              {productLinks.map((page, idx) => (
                <li key={"pages" + idx} className="list-none">
                  <Link
                    className="transition-colors text-secondary hover:text-primary"
                    href={page.href}
                  >
                    {page.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex justify-center space-y-4 flex-col">
            <p className="font-bold text-foreground">Resources</p>
            <ul className="list-none space-y-4">
              {resourcesLinks.map((social, idx) => (
                <li key={"social" + idx} className="list-none">
                  <Link
                    className="transition-colors text-secondary hover:text-primary"
                    href={social.href}
                  >
                    {social.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex justify-center space-y-4 flex-col">
            <p className="font-bold text-foreground">Company</p>
            <ul className="list-none space-y-4">
              {companyLinks.map((legal, idx) => (
                <li key={"legal" + idx} className="list-none">
                  <Link
                    className="transition-colors text-secondary hover:text-primary"
                    href={legal.href}
                  >
                    {legal.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex justify-center space-y-4 flex-col">
            <p className="font-bold text-foreground">Legal</p>
            <ul className="list-none space-y-4">
              {legalLinks.map((auth, idx) => (
                <li key={"auth" + idx} className="list-none">
                  <Link
                    className="transition-colors text-secondary hover:text-primary"
                    href={auth.href}
                  >
                    {auth.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div> */}
      </div>
      {/* <p className="text-center mt-20 text-5xl md:text-9xl lg:text-[12rem] xl:text-[13rem] font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 dark:from-neutral-950 to-neutral-200 dark:to-neutral-800 inset-x-0">
        Bidcast
      </p> */}
    </div>
  );
}

const Logo = () => {
  return (
    <Link
      href="/"
      className="font-normal flex space-x-2 items-center text-sm mr-4 text-foreground px-2 py-1 relative z-20"
    >
      <motion.div className="flex justify-center -ml-4">
        <Image
          src="/bidcast-logo.svg"
          alt="Bidcast Logo"
          width={80}
          height={70}
        />
      </motion.div>
    </Link>
  );
};
