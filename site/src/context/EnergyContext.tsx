"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

interface EnergyContextType {
  energyLevel: number; // 0 to 100
  setEnergyLevel: (level: number) => void;
  energyRatio: number; // 0.0 to 1.0 (Derived)
  isRaveMode: boolean; // > 80
  isChillMode: boolean; // < 30
}

const EnergyContext = createContext<EnergyContextType | undefined>(undefined);

export const EnergyProvider = ({ children }: { children: ReactNode }) => {
  const [energyLevel, setEnergyLevel] = useState(50);

  // Derived state for easier consumption
  const energyRatio = energyLevel / 100;
  const isRaveMode = energyLevel > 80;
  const isChillMode = energyLevel < 30;

  return (
    <EnergyContext.Provider
      value={{
        energyLevel,
        setEnergyLevel,
        energyRatio,
        isRaveMode,
        isChillMode,
      }}
    >
      {children}
    </EnergyContext.Provider>
  );
};

export const useEnergy = () => {
  const context = useContext(EnergyContext);
  if (context === undefined) {
    throw new Error("useEnergy must be used within an EnergyProvider");
  }
  return context;
};
