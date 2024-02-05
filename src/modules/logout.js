"use client";

export const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("id");
    window.location.href="/"
}