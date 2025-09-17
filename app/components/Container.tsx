import React, { ReactNode } from "react";
import AuthNavbar from "./AuthNavbar";

type ContainerProps = {
    sidebar?: ReactNode;
    children: ReactNode; // main content
};

const Container = ({ sidebar, children }: ContainerProps) => {
    return (
        <div className="flex min-h-screen bg-white text-black">
            {sidebar ? (
                <div className="shrink-0 bg-white">
                    {sidebar}
                </div>
            ) : null}
            <div className="flex flex-col flex-1 min-h-screen">
                <AuthNavbar />
                {/* Main scrollable content area */}
                <main className="flex-1 px-10 py-8 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Container;
