"use client"

import { createContext, useContext, useState } from "react";

type NavbarMode = "short" | "long" | "hidden" | null;

const NavbarContext = createContext<{
    mode: NavbarMode;
    setMode: (mode: NavbarMode) => void;
}>({ mode: null, setMode: () => { } });

export function NavbarProvider({ children }: { children: React.ReactNode }) {
    const [mode, setMode] = useState<NavbarMode>(null);
    return (
        <NavbarContext.Provider value={{ mode, setMode }}>
            {children}
        </NavbarContext.Provider>
    );
}

export const useNavbar = () => useContext(NavbarContext);