// types.ts
export interface NavItemProps {
    href: string;
    children: React.ReactNode;
    mobile?: boolean;
  }
  
  export interface Notification {
    id: string;
    message: string;
    read: boolean;
    createdAt: Date;
  }
  
  export interface UserMenuItemProps {
    href: string;
    icon: React.ReactNode;
    children: React.ReactNode;
    onClick? : ()=>void;
  }