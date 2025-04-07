import { UserContextProvider } from "@/context/user-context";
import type { ReactNode } from "react";

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout = (props: AppLayoutProps) => {
  return (
    <>
      <main className="min-h-screen bg-white text-black dark:bg-background dark:text-white">
        <div className="mx-auto flex max-w-7xl">
          <UserContextProvider>{props.children}</UserContextProvider>
        </div>
      </main>
    </>
  );
};

export default AppLayout;
