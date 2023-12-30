"use client";
import WeaveDB from "weavedb-sdk";
import { useEffect, useState, useContext } from "react";
import { ethers, Contract } from "ethers";
import Payable_abi from "../../../utils/abi.json";
import NFT_abi from "../../../utils/balance.json";
import { storeFiles } from "../../../utils/ipfsUpload";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Link from "next/link";
import { FiAtSign, FiCheckCircle, FiCreditCard, FiKey } from "react-icons/fi";
import { MdOutlineNumbers, MdOutlineShortText } from "react-icons/md";
import { BiSelectMultiple } from "react-icons/bi";
import { BsCalendar2Date, BsTextareaResize } from "react-icons/bs";
import { FaRegFile } from "react-icons/fa";
import { TbPhone } from "react-icons/tb";
import Image from "next/image";
import { weavedbContractId } from "../../../utils/util";
import { LogInWithAnonAadhaar, useAnonAadhaar } from "anon-aadhaar-react";

export default function Survey({ params: { surveyId } }) {
	const [anonAadhaar] = useAnonAadhaar();
	let provider = new ethers.BrowserProvider(window.ethereum);
	const [survey, setSurvey] = useState();
	const [db, setDB] = useState();
	const [loadingSurveyData, setLoadingSurveyData] = useState(true);
	const [uploadedURL, setUploadedURL] = useState(null);

	const { address } = useAccount();

	const initDB = async () => {
		setLoadingSurveyData(true);
		const db = new WeaveDB({
			contractTxId: weavedbContractId,
		});
		await db.init();
		const survey = (await db.get("surveys", ["id", "==", surveyId]))[0];
		setSurvey(survey);
		if (anonAadhaar?.status === "logged-out") {
			// document.getElementById("my_modal_2").showModal();

			// setTimeout(async () => {
			// 	// setIsNFTValid(await validateNft(survey?.nftContractAddress));
			// 	setVerifyingAadhaar(false);
			// }, 2000);
		}
		console.log((await db.get("surveys", ["id", "==", surveyId]))[0]);
		setDB(db);
		setLoadingSurveyData(false);
	};

	useEffect(() => {
		initDB();
	}, []);

	//Payment
	const [contract, setContract] = useState();

	const updateContract = async () => {
		const provider = new ethers.BrowserProvider(window.ethereum);
		const signer = await provider.getSigner();
		const contract = new Contract("0xB28cbafcb69d18ad60Efe4E6183f02800C2e33FB", Payable_abi, signer);
		setContract(contract);
		console.log("Contract loaded: ", contract);
	};

	useEffect(() => {
		if (address) {
			updateContract();
		}
	}, [])

	const pay = async (amount, fieldId) => {
		if (!address) {
			updateContract();
			return;
		}

		const options = { value: ethers.parseEther(amount?.toString()) };
		contract.register(survey?.author, options).then(async (res) => {
			await res.wait()
			console.log(res);
			answers[fieldId] = amount;
			setAnswers({ ...answers });
			toast.success("Payment successful!");
		});
	};

	const [uploadingFile, setUploadingFile] = useState(false);

	const handleFileUpload = async (event) => {
		setUploadingFile(true);
		try {
			const files = event.target.files;
			var fileURL;
			if (files.length > 0) {
				fileURL = await storeFiles(files);
				setUploadedURL(fileURL);
			} else {
				console.error("No files selected.");
			}

			setUploadingFile(false);
			toast.success("File uploaded successfully!");
			return fileURL;
		} catch (error) {
			setUploadingFile(false);
			console.error("Error uploading files:", error);
		}
	};

	const [answers, setAnswers] = useState({});

	useEffect(() => {
		console.log(answers)
	}, [answers])

	const [surveySubmitted, setSurveySubmitted] = useState(false);
	const [submittingSurvey, setSubmittingSurvey] = useState(false);

	const submitSurvey = async () => {
		setSubmittingSurvey(true);

		var orderedAnswers = {};

		for (const field of survey?.fields) {
			orderedAnswers[field?.id] = "";
		}

		for (const field of survey?.fields) {
			orderedAnswers[field?.id] = answers[field?.id];
		}

		const surveyResponse = {
			surveyId: surveyId,
			answers: orderedAnswers,
			user: db.signer(),
		};

		await db.add(surveyResponse, "responses");
		setSubmittingSurvey(false);

		setSurveySubmitted(true);
		toast.success("Survey submitted successfully!");
	};

	return (
		<main>
			{loadingSurveyData ? "" : <div className="mb-5 flex justify-between	items-center"><ConnectButton />{anonAadhaar?.status === "logged-in" ? <div className="flex items-center"><p className="text-xl font-semibold mr-5">Aadhaar Verified ✅ </p><LogInWithAnonAadhaar/></div> : ""}</div>}
			{surveySubmitted ? <div className="bg-white rounded-xl p-10">
				<div className="row1 title">
					<div className="flex items-center gap-3">
						<span className="text-3xl font-semibold ">📄 {survey?.title}</span>{" "}
					</div>
				</div>
				<hr className="my-5" />
				<p className="font-semibold text-2xl ml-2">🎉 Survey Submitted!</p>
				<p>
					Your survey has been submitted successfully.
				</p>
				<button className="btn btn-primary mt-10">⚡️ Create your survey</button>
				<hr className="my-10" />
				<div className="flex items-center mt-5">
					<p>powered by</p><p className="ml-2 text-xl font-semibold">SurveyBlock</p>
				</div>
			</div> : loadingSurveyData ? (
				<div className="w-full h-full flex items-center justify-center">
					<span className="loading loading-spinner loading-lg"></span>
				</div>
			) : (
				<div className="flex flex-col items-center bg-white py-10 px-20 shadow-2xl rounded-2xl">
					<div className="row1 title flex flex-col items-center">
						<div className="flex items-center gap-3">
							<span className="text-3xl font-bold ">📄 {survey?.title}</span>
						</div>
						<div className="mt-5 flex items-center gap-3">
							<span className="text-lg">{survey?.description}</span>
						</div>
					</div>
					<div className="inputs min-w-[50vw]">
						{anonAadhaar.status === "logging-in" || anonAadhaar.status === "logged-out" ?
							<div className="flex flex-col mt-10">
								<p className="mb-3">Please verify your identity to continue.</p>
								<LogInWithAnonAadhaar />
							</div> : survey?.fields?.map((field, index) => {
								return (
									<div className="inputrow" key={index}>
										<div className="flex items-center gap-3 mt-5">
											<label className="flex items-center text-lg font-semibold">{({
												"text": <MdOutlineShortText className="mr-2" />,
												"longtext": <BsTextareaResize className="mr-2" />,
												"multiplechoice": <BiSelectMultiple className="mr-2" />,
												"numbers": <MdOutlineNumbers className="mr-2" />,
												"date": <BsCalendar2Date className="mr-2" />,
												"file": <FaRegFile className="mr-2" />,
												"phone": <TbPhone className="mr-2" />,
												"payment": <FiCreditCard className="mr-2" />,
												"email": <FiAtSign className="mr-2" />,
											})[field?.type] ?? <MdOutlineShortText className="mr-2" />}{field?.title} <span className="ml-2 font-semibold text-red-500">*</span></label>
										</div>
										<div className="flex items-center gap-3 mt-3">
											{field?.type === "multiplechoice" ? (
												<select className="w-full max-w-4xl select select-bordered" onChange={(e) => {
													answers[field?.id] = e.target.value;
													setAnswers({ ...answers });
												}}>
													{field?.choices?.map((option, id) => {
														return <option key={id} value={option}>{option}</option>;
													})}
												</select>
											) : field?.type === "longtext" ? (
												<textarea
													className="w-full max-w-4xl textarea textarea-bordered"
													placeholder={field?.title}
													onChange={(e) => {
														answers[field?.id] = e.target.value;
														setAnswers({ ...answers });
													}}
												></textarea>
											) : field?.type === "payment" ? (
												!(answers[field?.id]) ? <button
													className="btn btn-primary"
													onClick={() => {
														console.log(field?.amount);
														pay(field?.amount, field?.id);
													}}
												>
													<FiCreditCard /> Pay {field?.amount} HBR
												</button> : <p className="font-semibold text-md ml-2">✅ Paid {field?.amount} HBR</p>
											) : field?.type === "file" ? (answers[field?.id]) ? <p className="font-semibold text-md ml-2">✅ File uploaded: <Link className="underline text-blue-500" href={answers[field?.id]} target="_blank">{answers[field?.id]}</Link></p> : (
												uploadingFile ? <div className="flex items-center">
													<span className="loading loading-spinner loading-md"></span>
													<p className="font-semibold text-md ml-2">Uploading file...</p>
												</div> : <input type="file" multiple onChange={async (event) => {
													const url = await handleFileUpload(event);
													console.log("URL: ", url);
													answers[field?.id] = url;
													setAnswers({ ...answers });
												}} />
											) : (
												<input
													className="w-full max-w-4xl input input-bordered"
													type={field?.type}
													placeholder={field?.title}
													onChange={(e) => {
														answers[field?.id] = e.target.value;
														setAnswers({ ...answers });
													}}
												/>
											)}
										</div>
									</div>
								);
							})}
						<hr className="my-5 mt-10" />
						{anonAadhaar.status === "logging-in" || anonAadhaar?.status === "logged-out" ? "" : submittingSurvey ? <div className="flex items-center">
							<span className="loading loading-spinner loading-md"></span>
							<p className="font-semibold text-md ml-2">Submitting survey...</p>
						</div> : address ? <button className="btn btn-primary btn-lg" onClick={submitSurvey}><FiCheckCircle /> Submit survey</button> : <div className="flex flex-col">
							<p className="mb-5 font-semibold">Connect wallet to submit survey</p>
							<ConnectButton /></div>}
						<div className="flex items-center mt-5">
							<p>powered by</p><p className="ml-2 text-xl font-semibold">SurveyBlock</p>
						</div>
					</div>
				</div>
			)}
			<ToastContainer />
			{/* <dialog id="my_modal_2" className="modal">
				<div className="modal-box w-11/12 max-w-3xl">
					<h3 className="font-bold text-2xl flex items-center mb-5"><FiKey className="mr-2" /> Access Verification</h3>
					<div className="flex flex-col items-center">
						{
							anonAadhaar.status === "logging-in" ? "" : anonAadhaar?.status === "logged-in" ? <Image src={"/nft-valid.png"} width={500} height={250} /> : <Image src={"/nft-invalid.png"} width={500} height={250} />
						}
						{
							anonAadhaar.status === "logging-in" ? <p className="mt-5 text-2xl text-gray-800"><LogInWithAnonAadhaar/></p> : anonAadhaar?.status === "logged-in" ? <p className="mt-5 text-2xl text-green-500">✅ Aadhaar verified. You can continue.</p> : <p className="mt-5 text-2xl text-red-500">❌ Failed to verify Aadhaar.</p>
						}
						{anonAadhaar.status === "logging-in" ? "" : <div className="mt-10 modal-action flex justify-center ">
							<button
								className={
									"btn btn-primary w-full "
								}
								onClick={() => {
									document.getElementById("my_modal_2").close();
								}}
							>
								{anonAadhaar?.status === "logged-in" ? "Continue" : "Close"}
							</button>
						</div>}
					</div>
				</div>
			</dialog> */}
		</main>
	);
}