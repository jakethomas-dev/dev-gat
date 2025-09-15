import React, { ReactNode } from "react";

type ContainerProps = {
    sidebar?: ReactNode;
    children: ReactNode; // main content
};

const Container = ({ sidebar, children }: ContainerProps) => {
    return (
        <div className="flex min-h-screen bg-white text-black">
            {/* Sidebar slot (non-fixed so it participates in layout) */}
            {sidebar ? (
                <div className="shrink-0 bg-white">
                    {sidebar}
                </div>
            ) : null}

            {/* Main content area */}
            <main className="flex-1 px-4 py-6 md:px-6 lg:px-8">
                {children}
            </main>
        </div>
    );
};

export default Container;
