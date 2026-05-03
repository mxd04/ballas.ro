"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Body from "@/components/Body";
import LoadingScreen from "@/components/LoadingScreen";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  return (
    <>
      {/* Loading Screen cu logo pulsant */}
      {isLoading && <LoadingScreen onLoadingComplete={handleLoadingComplete} />}

      {/* Site-ul principal */}
      <div
        className={`min-h-screen flex flex-col bg-background transition-opacity duration-500 ${
          isLoading ? "opacity-0" : "opacity-100"
        }`}
      >
        <Header />
        <Body />
      </div>
    </>
  );
}
