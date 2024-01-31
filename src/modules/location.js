"use client";

import { useEffect, useState } from "react";

export function Location() {
    const [pos, setPos] = useState({});
    useEffect(() => {
        navigator.geolocation.watchPosition(
            success => {
                setPos(success.coords);
            },
            error => {
                console.error(error);
            },
            {
                enableHighAccuracy: true,
            }
        );
    }, []);
    return pos;
}