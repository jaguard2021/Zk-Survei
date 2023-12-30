"use client";
import Navbar from "../../../components/Navbar";
import { PiMicrosoftExcelLogoFill } from "react-icons/pi";
import { FaRegFilePdf } from "react-icons/fa";

import { useEffect, useState } from "react";
import WeaveDB from "weavedb-sdk";
import Link from "next/link";
import { FiCopy } from "react-icons/fi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { weavedbContractId } from "../../../utils/util";

export default function Home({ params: { surveyId } }) {
	// const temp = () => {
	//   document.getElementById("my_modal_2").showModal();
	//   document.getElementById("my_modal_1").close();
	// };

	const [survey, setSurvey] = useState();

	const [loadingSurveyData, setLoadingSurveyData] = useState(true);

	const [db, setDB] = useState();

	const [responses, setResponses] = useState([]);

	const temp = () => { };

	const initDB = async () => {
		setLoadingSurveyData(true);
		const db = new WeaveDB({
			contractTxId: weavedbContractId,
		});
		await db.init();
		setDB(db);
		const responses = await db.get("responses", ["surveyId", "==", surveyId]);
		setResponses(responses);
		console.log(responses);
		setSurvey((await db.get("surveys", ["id", "==", surveyId]))[0]);
		console.log((await db.get("surveys", ["id", "==", surveyId]))[0]);
		setLoadingSurveyData(false);
	};

	useEffect(() => {
		initDB();
	}, []);

	return (
		<>
			<Navbar />
			<div className="flex justify-between p-5">
				<div className="join">
					<Link href={"/editor/" + surveyId}><button className="join-item btn btn-lg">Editor</button></Link>
					<button className="join-item btn btn-primary btn-lg">Responses</button>
				</div>
				<div className="items-center flex p-2 bg-gray-200 rounded-xl">
					<p className="cursor-pointer underline text-lg px-3" onClick={() => window.open((new URL(window.location.href)).protocol + "//" + (new URL(window.location.href)).host + "/surveys/" + surveyId)}>{(new URL(window.location.href)).protocol + "//" + (new URL(window.location.href)).host + "/surveys/" + surveyId}</p>
					<button className="ml-2 btn btn-square btn-primary" onClick={() => {
						navigator.clipboard.writeText((new URL(window.location.href)).protocol + "//" + (new URL(window.location.href)).host + `/surveys/${surveyId}`);
						toast.success("Copied to clipboard!");
					}}><FiCopy /></button>
				</div>
				<button className="btn btn-primary btn-lg">Export</button>
			</div>
			<>
				<main className="container mx-auto relative mt-6 ">
					{loadingSurveyData ? (
						<div>
							<span className="loading loading-spinner loading-lg"></span>
						</div>
					) : (
						<>
							<div className="border-black w-full border-b h-auto  p-3 pl-8 mb-10 pb-10">
								<div className="row1 title">
									<div className="">
										<span className="text-3xl font-bold ">
											Responses for &apos;{survey?.title}&apos;
										</span>{" "}
									</div>
								</div>
							</div>

							<div className="overflow-x-auto">
								<table className="table table-lg table-pin-rows table-pin-cols">
									<thead>
										<tr>
											<th>No.</th>
											{survey?.fields?.map((field, index) => {
												return <th key={index}>{field?.title}</th>;
											})}
										</tr>
									</thead>
									<tbody>
										{responses?.map((response, index) => {
											return (
												<tr key={index}>
													<td>{index + 1}</td>
													{Object.keys(response?.answers)?.map((key, i) => {
														return (
															<td key={i}>
																{response?.answers[key]
																	.toString()
																	.includes("https://") ? (
																	<Link
																		className="cursor-pointer underline text-blue-500"
																		href={response?.answers[key]}
																		target="_blank"
																	>
																		Download
																	</Link>
																) : (
																	response?.answers[key]
																)}
															</td>
														);
													})}
												</tr>
											);
										})}
									</tbody>
									{/* <tfoot>
                    <tr>
                      {survey?.fields?.map((field) => {
                        return <th>{field?.title}</th>;
                      })}
                    </tr>
                  </tfoot> */}
								</table>
							</div>
						</>
					)}
				</main>
				<ToastContainer />
			</>
		</>
	);
}
