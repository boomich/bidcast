export interface NavigationItem {
  name: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  description?: string;
  external?: boolean;
}

export interface NavigationGroup {
  title: string;
  items: NavigationItem[];
}

export interface UserNavigationItem {
  name: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  onClick?: () => void;
}

export interface MobileNavigationProps {
  isOpen: boolean;
  onClose: () => void;
  navigationItems: NavigationItem[];
  userNavigationItems?: UserNavigationItem[];
}