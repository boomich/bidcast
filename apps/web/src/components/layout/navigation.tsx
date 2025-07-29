"use client";

import { useState } from "react";
import { SignedIn, SignedOut, UserButton, SignInButton } from "@clerk/nextjs";
import { NavigationItem, MobileNavigationProps } from "@/types/navigation";
import { NAVIGATION } from "@/lib/constants";
import { cn } from "@/lib/utils";
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

interface NavigationProps {
  className?: string;
  showAuthButtons?: boolean;
  customNavItems?: NavigationItem[];
}

export function Navigation({
  className,
  showAuthButtons = true,
  customNavItems,
}: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const navItems = (customNavItems || NAVIGATION.main).map(item => ({
    name: item.name,
    link: item.href,
  }));

  return (
    <Navbar className={className}>
      <NavBody>
        <NavbarLogo />
        <NavItems items={navItems} />
        
        {showAuthButtons && (
          <div className="flex items-center gap-4">
            <SignedIn>
              <UserButton />
            </SignedIn>
            <SignedOut>
              <div className="flex items-center gap-2">
                <NavbarButton variant="secondary" as={SignInButton}>
                  Sign In
                </NavbarButton>
                <NavbarButton variant="primary" as={SignInButton}>
                  Sign Up
                </NavbarButton>
              </div>
            </SignedOut>
          </div>
        )}
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
              className="relative text-neutral-300 hover:text-white transition-colors"
            >
              <span className="block">{item.name}</span>
            </a>
          ))}
          
          {showAuthButtons && (
            <div className="flex w-full flex-col gap-4 pt-4 border-t border-border">
              <SignedIn>
                <UserButton />
              </SignedIn>
              <SignedOut>
                <div className="flex flex-col gap-2">
                  <NavbarButton variant="secondary" as={SignInButton} className="w-full">
                    Sign In
                  </NavbarButton>
                  <NavbarButton variant="primary" as={SignInButton} className="w-full">
                    Sign Up
                  </NavbarButton>
                </div>
              </SignedOut>
            </div>
          )}
        </MobileNavMenu>
      </MobileNav>
    </Navbar>
  );
}