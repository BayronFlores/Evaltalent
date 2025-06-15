export interface NavigationItem {
  name: string;
  href: string;
  icon: any;
  current: boolean;
  children?: NavigationItem[];
}
