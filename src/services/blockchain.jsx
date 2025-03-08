import { ethers, parseEther } from "ethers";
import address from "../../contract/artifacts/contractAddress.json";
import abi from "../../contract/artifacts/contracts/Genesis.sol/Genesis.json";
import { getGlobalState, setGlobalState } from "../store/index";

const { ethereum } = window;
const contractAddress = address.address;
const contractAbi = abi.abi;

// function for connecting the wallet
const connectWallet = async () => {
  try {
    if (!ethereum) {
      console.log("Make sure you have metamask installed!");
      return;
    }
    const accounts = await ethereum.request({ method: "eth_requestAccounts" });
    setGlobalState("connectedAccount", accounts[0]?.toLowerCase());
    console.log(accounts[0]?.toLowerCase());
  } catch (error) {
    reportError(error);
  }
};

// function for connecting the wallet
const isWallectConnected = async () => {
  try {
    if (!ethereum) return alert("Please install Metamask");
    const accounts = await ethereum.request({ method: "eth_accounts" });
    setGlobalState("connectedAccount", accounts[0]?.toLowerCase());

    ethereum.on("chainChanged", (chainId) => {
      // chainchange i.e an event listener when the account chain shifted from goeli to sepolia
      window.location.reload(); // reload the entire window
    });
    // an event listener when the account chain shifted from goeli to sepolia

    ethereum.on("accountsChanged", async (e) => {
      setGlobalState("connectedAccount", accounts[0]?.toLowerCase());
      console.log(e);
      await isWallectConnected();
    });

    if (accounts.length) {
      setGlobalState("connectedAccount", accounts[0]?.toLowerCase());
    } else {
      alert("Please connect wallet.");
      console.log("No accounts found.");
    }
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

// getting ethereum contract
const getEtheriumContract = async () => {
  const connectedAccount = getGlobalState("connectedAccount");

  if (connectedAccount) {
    const provider = new ethers.BrowserProvider(ethereum);
    console.log("Provider", provider);
    const signer = await provider.getSigner();

    console.log("signner", signer);
    const contract = new ethers.Contract(contractAddress, contractAbi, signer);

    return contract;
  } else {
    console.log("No Account connected");
    // return getGlobalState("contract");
  }
};

const createProject = async ({
  title,
  description,
  imageURL,
  cost,
  expiresAt,
}) => {
  try {
    if (!ethereum) return alert("Please install Metamask");

    const contract = await getEtheriumContract();
    cost = parseEther(cost);
    const tx = await contract.createProject(
      title,
      description,
      imageURL,
      cost,
      expiresAt
    );
    await tx.wait();
    await loadProjects();
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};
const loadProjects = async () => {
  try {
    if (!ethereum) return alert("Please install Metamask");

    const contract = await getEtheriumContract();
    const projects = await contract.getProjects();
    const stats = await contract.stats();
    setGlobalState("stats", structureStats(stats));
    setGlobalState("projects", structuredProjects(projects));
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};
/*
      Why Use .reverse() Here?
          Reverse Chronological Order
            1.  If projects is fetched from a smart contract and is stored in an array, it might be in oldest-first order.
            .reverse() ensures newer projects appear first.
            Latest Data on Top

            2.  If projects is an array of funding campaigns, reversing ensures the most recent campaign appears at the top.
*/

const loadProject = async (id) => {
  try {
    if (!ethereum) return alert("Please install Metamask");
    const contract = await getEtheriumContract();

    const project = await contract.getProject(id);
    setGlobalState("project", structuredProjects([project])[0]);
  } catch (error) {
    alert(JSON.stringify(error.message));
    console.log(error);
    throw new Error(error);
  }
};
const updateProject = async ({
  id,
  title,
  description,
  imageURL,
  expiresAt,
}) => {
  try {
    if (!ethereum) return alert("Please install Metamask");
    const contract = await getEtheriumContract();
    console.log("edit", contract);
    const tx = await contract.updateProject(
      id,
      title,
      description,
      imageURL,
      expiresAt
    );
    await tx.wait();
    await loadProject(id);
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};
const deleteProject = async (id) => {
  try {
    if (!ethereum) return alert("Please enter metamsk");
    const contract = await getEtheriumContract();
    await contract.deleteProject(id);
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};
// const backProject = async (id, amount) => {
//   // amount that is beng backed
//   console.log("amount", amount);
//   if (!ethereum) return alert("Please enter metamsk");
//   const connectedAccount = getGlobalState("connectedAccount");
//   const contract = await getEtheriumContract();
//   amount = ethers.parseEther(amount.toString()); // conversion of amount in wei

//   await contract.backProject(id, {
//     from: connectedAccount,
//     value: amount,
//   });
// };
const backProject = async (id, amount) => {
  console.log("Amount to back:", amount);

  // Check if MetaMask is available
  if (!ethereum) return alert("Please enter MetaMask");

  const connectedAccount = getGlobalState("connectedAccount"); // Get the connected account
  const contract = await getEtheriumContract(); // Assuming getEtheriumContract() returns a contract instance

  // Convert the amount to wei (BigNumber) using ethers.js
  try {
    amount = ethers.parseEther(amount.toString());
  } catch (error) {
    console.error("Error converting amount to wei:", error);
    return alert("Invalid amount");
  }

  console.log("Amount in wei:", amount.toString()); // Debug the final amount in wei

  try {
    const tx = await contract.backProject(id, {
      from: connectedAccount,
      value: amount, // Pass amount directly
    });

    console.log("Transaction Hash:", tx.hash); // Log transaction hash for debugging
    await tx.wait(); // Wait for the transaction to be mined

    alert("Project backed successfully!");
  } catch (error) {
    console.error("Error in backing project:", error);
    alert("An error occurred while backing the project.");
  }
};
const payoutProject = async (id) => {
  if (!ethereum) return alert("Please enter MetaMask");
  const connectedAccount = getGlobalState("connectedAccount");
  const contract = await getEtheriumContract();
  await contract.payOutProject(id, {
    from: connectedAccount,
  });
};
const getBackers = async (id) => {
  try {
    if (!ethereum) return alert("Please enter MetaMask");
    const contract = await getEtheriumContract();
    let backers = await contract.getBackers(id);
    setGlobalState("backers", structuredBackers(backers));
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};
const structuredProjects = (projects) =>
  projects
    .map((project) => ({
      id: Number(project[0]), // Convert BigInt to a number
      owner: project[1]?.toLowerCase(), // Ethereum address in lowercase
      title: project[2], // Title as a string
      description: project[3], // Description as a string
      imageURL: project[4], // Image URL as a string
      cost: Number(project[5]) / 10 ** 18, // Convert BigInt (wei) to Ether
      raised: Number(project[6]) / 10 ** 18, // Convert BigInt (wei) to Ether
      timestamp: new Date(Number(project[7]) * 1000).getTime(), // Convert UNIX timestamp to milliseconds
      expiresAt: new Date(Number(project[8]) * 1000).getTime(), // Convert UNIX timestamp to milliseconds
      date: toDate(Number(project[8]) * 1000),
      backers: Number(project[9]), // Convert BigInt to number
      status: Number(project[10]), // Convert BigInt to number
    }))
    .reverse();
const structuredBackers = (backers) =>
  backers
    .map((backer) => ({
      owner: backer[0].toLowerCase(),
      contribution: Number(backer[1]) / 10 ** 18,
      timestamp: new Date(Number(backer[2]) * 1000).toJSON(),
      refunded: backer[3],
    }))
    .reverse();

const toDate = (timestamp) => {
  const date = new Date(timestamp);
  const dd = date.getDate() > 9 ? date.getDate() : `0${date.getDate()}`;
  const mm =
    date.getMonth() + 1 > 9 ? date.getMonth() + 1 : `0${date.getMonth() + 1}`; // date.getMonth() returns the month index (0-based, meaning January = 0).
  const yyyy = date.getFullYear();
  return `${yyyy}-${mm}-${dd}`;
};

const structureStats = (stats) => ({
  totalProjects: Number(stats[0]),
  totalBacking: Number(stats[1]),
  totalDonations: parseInt(stats[2]) / 10 ** 18,
});
export {
  connectWallet,
  isWallectConnected,
  getEtheriumContract,
  createProject,
  loadProjects,
  loadProject,
  updateProject,
  deleteProject,
  backProject,
  getBackers,
  payoutProject,
};
