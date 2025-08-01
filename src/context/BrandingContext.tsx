'use client'

import { createContext, useContext } from "react";
import { useState, useEffect } from "react";
import { getUser, getOpdTahun } from "@/components/lib/Cookie";

interface OptionType {
  value: number;
  label: string;
}
interface OptionTypeString {
  value: string;
  label: string;
}
interface BrandingContextType {
  title: string;
  clientName: string;
  logo: string;
  branding: {
    title: string;
    client: string;
    logo: string;
    tahun: OptionType | null | undefined;
    opd: OptionTypeString | null | undefined;
    user: any;
  }
}

const appName = process.env.NEXT_PUBLIC_APP_NAME || "";
const clientName = process.env.NEXT_PUBLIC_CLIENT_NAME || "";
const logo = process.env.NEXT_PUBLIC_LOGO_URL || "";

// context
const BrandingContext = createContext<BrandingContextType | undefined>(undefined);

export function BrandingProvider({ children }: Readonly<{ children: React.ReactNode; }>) {

  const [Tahun, setTahun] = useState<OptionType | null>(null);
  const [SelectedOpd, setSelectedOpd] = useState<OptionTypeString | null>(null);
  const [User, setUser] = useState<any>(null);

  useEffect(() => {
    const data = getOpdTahun();
    const fetchUser = getUser();
    if (data) {
      if (data.tahun) {
        const valueTahun = {
          value: data.tahun.value,
          label: data.tahun.label
        }
        setTahun(valueTahun);
      }
      if (data.opd) {
        const valueOpd = {
          value: data.opd.value,
          label: data.opd.label
        }
        setSelectedOpd(valueOpd);
      }
      if (fetchUser) {
        setUser(fetchUser.user);
      }
    }
  }, [])

  return (
    <BrandingContext.Provider 
      value={{ 
        title: appName, 
        clientName: clientName, 
        logo: logo, 
        branding: { 
          title: appName, 
          client: clientName, 
          logo: logo, 
          tahun: Tahun,
          opd: SelectedOpd,
          user: User
          } 
      }}>
      {children}
    </BrandingContext.Provider>
  );
}

export function useBrandingContext() {
  const context = useContext(BrandingContext);
  if (context === undefined) {
    throw new Error("useBrandingContext must be used witihin a BrandingProvider")
  }
  return context;
}
