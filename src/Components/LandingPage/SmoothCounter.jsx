"use client";
import React, { useEffect, useState, useRef } from 'react';

// সংখ্যাকে বাংলায় রূপান্তর করার ফাংশন
const toBengali = (n) => {
    const digits = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
    return n.toString().replace(/\d/g, (d) => digits[d]);
};

export const SmoothCounter = ({ target, suffix = "" }) => {
    const [count, setCount] = useState(1);
    const countRef = useRef(null);
    const [started, setStarted] = useState(false);

    useEffect(() => {
        // স্ক্রিনে আসলে কাউন্ট শুরু হবে
        const observer = new IntersectionObserver(([entry]) => { 
            if (entry.isIntersecting) setStarted(true); 
        }, { threshold: 0.1 });

        if (countRef.current) observer.observe(countRef.current);

        if (started) {
            let start = 1;
            const timer = setInterval(() => {
                // টার্গেট অনুযায়ী স্মুথ অ্যানিমেশন
                start += target / 60;
                if (start >= target) { 
                    setCount(target); 
                    clearInterval(timer); 
                } else { 
                    setCount(Math.floor(start)); 
                }
            }, 30);
            return () => clearInterval(timer);
        }
    }, [started, target]);

    return (
        <span ref={countRef}>
            {toBengali(count)}{suffix}
        </span>
    );
};