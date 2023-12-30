"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import {FiBox} from "react-icons/fi";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function Home() {
  const router = useRouter();
  const [domLoaded, setDomLoaded] = useState(false);
  const { address } = useAccount();

  useEffect(() => {
    setDomLoaded(true);
  }, []);

  return (
    <main className="w-full h-[100vh] flex items-center justify-center bg-gradient-to-tr from-[#00ffa25e] to-[#266eff63]">
      <div className="flex flex-col items-center">
        <h1 className="font-bold flex items-center text-8xl"><FiBox className="mr-2"/> SurveyBlock</h1>
        <h1 className="text-4xl mt-6">Decentralised Survey Forms Creator</h1>
        {domLoaded ? (
          <div className="mt-10">
            {address ? (
              <button
                className="btn btn-primary btn-lg"
                onClick={() => router.push("/home")}
              >
                Get Started
              </button>
            ) : (
              <ConnectButton />
            )}
          </div>
        ) : (
          <div className="mt-10">
            <button
              className={"btn btn-primary btn-lg " + (domLoaded ? "" : "opacity-50")}
            >
              Get Started
            </button>
          </div>
        )}
      </div>
    </main>
  )
}
