
import { ReactNode } from "react";
import BottomNavigation from "./BottomNavigation";

interface MobileLayoutProps {
  children: ReactNode;
}

const MobileLayout = ({ children }: MobileLayoutProps) => {
  return (
    <div className="mobile-container bg-background">
      <div className="content-area pb-20">{children}</div>
      <BottomNavigation />
    </div>
  );
};

export default MobileLayout;
