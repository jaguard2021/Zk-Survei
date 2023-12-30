"use client";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import "@rainbow-me/rainbowkit/styles.css";
import { FiBox } from "react-icons/fi";

function Navbar() {
	return (
		<div className="pb-[80px]">
			<div className="z-50 fixed navbar backdrop-filter backdrop-blur-lg bg-opacity-30  bg-base-100 flex justify-between top-30 z-54">
				<Link href={"/home"} className="btn btn-ghost normal-case font-bold text-2xl">
					<FiBox className="mr-2" /> SurveyBlock
				</Link>
				<div className="m-2">
					<ConnectButton />
				</div>
			</div>
		</div>
	);
}

export default Navbar;
