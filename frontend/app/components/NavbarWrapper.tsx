"use client"

import { useNavbar } from "@/app/context/NavbarContext";
import Navbar from "./Navbar";

export default function NavbarWrapper() {
    const { mode } = useNavbar();
    return <Navbar mode={mode} />;
}