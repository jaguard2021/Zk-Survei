import abi from "../abi.json";
import { ethers } from "ethers";

const mintNFT = async (address) => {
  console.log(address)
  const contractAddress = "0x7bF2739999158F9C30D35Eb32dd933C3d36c3e96";
  let provider = new ethers.providers.Web3Provider(window.ethereum);
  console.log(provider);
  const contract = new ethers.Contract(contractAddress, abi, provider.getSigner());
  console.log(contract);
  try {
    const txn = await contract.safeMint(
      address,
      "https://bafybeiesgzdc6fybjh2wejfodx4iymxiie4uyfvdddkaqm5gz4xbzpvlxi.ipfs.w3s.link/metadata.json"
    );
    const message = await txn.wait();
    console.log(message);
  } catch (error) {
    console.error("Error fetching balance:", error);
    return false;
  }
};

export default mintNFT;
