"use client";

import { useEffect, useState } from "react";

const words = [
    "Auditing Web Security",
    "Analyzing Risk Exposure",
    "Evaluating NIST CSF Compliance",
    "Scanning URLs for Vulnerabilities",
    "Generating Security Intelligence",
    "Transforming Risk into Insight",
];

export default function Typewriter() {
    const [text, setText] = useState("");
    const [wordIndex, setWordIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const currentWord = words[wordIndex];
        const speed = isDeleting ? 40 : 70;

        const timeout = setTimeout(() => {
            setText((prev) =>
                isDeleting
                    ? currentWord.substring(0, prev.length - 1)
                    : currentWord.substring(0, prev.length + 1)
            );

            // finished typing
            if (!isDeleting && text === currentWord) {
                setTimeout(() => setIsDeleting(true), 1200);
            }

            // finished deleting
            if (isDeleting && text === "") {
                setIsDeleting(false);
                setWordIndex((prev) => (prev + 1) % words.length);
            }
        }, speed);

        return () => clearTimeout(timeout);
    }, [text, isDeleting, wordIndex]);

    return (
        <p className="mt-4 text-3xl font-medium text-gray-300">
            {text}
            <span className="animate-pulse border-r-2 border-gray-300 ml-1"></span>
        </p>
    );
}