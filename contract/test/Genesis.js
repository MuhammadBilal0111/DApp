const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");

describe("Genesis Contract", function () {
  async function deployGenesisFixture() {
    const [owner, backer1, backer2] = await ethers.getSigners();
    const projectTax = 10; // 10% tax
    const Genesis = await ethers.getContractFactory("Genesis");
    const genesis = await Genesis.deploy(projectTax);

    return { genesis, owner, backer1, backer2, projectTax };
  }

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      const { genesis, owner } = await loadFixture(deployGenesisFixture);
      expect(await genesis.owner()).to.equal(owner.address);
    });

    it("Should set the correct project tax", async function () {
      const { genesis, projectTax } = await loadFixture(deployGenesisFixture);
      expect(await genesis.projectTax()).to.equal(projectTax);
    });
  });

  describe("Project Management", function () {
    it("Should allow creating a project", async function () {
      const { genesis, owner } = await loadFixture(deployGenesisFixture);

      const title = "Test Project";
      const description = "This is a test project";
      const imageURL = "https://example.com/image.png";
      const cost = ethers.parseEther("1");
      const expiresAt = (await time.latest()) + 86400; // 1 day from now

      await expect(
        genesis.createProject(title, description, imageURL, cost, expiresAt)
      )
        .to.emit(genesis, "Action")
        .withArgs(0, "PROJECT CREATED", owner.address, anyValue);

      const project = await genesis.getProject(0);
      expect(project.title).to.equal(title);
      expect(project.description).to.equal(description);
      expect(project.cost).to.equal(cost);
    });

    it("Should allow updating a project", async function () {
      const { genesis, owner } = await loadFixture(deployGenesisFixture);

      const title = "Updated Title";
      const description = "Updated Description";
      const imageURL = "https://example.com/updated.png";
      const expiresAt = (await time.latest()) + 86400; // 1 day from now

      await genesis.createProject(
        "Old Title",
        "Old Description",
        "https://example.com/old.png",
        ethers.parseEther("1"),
        expiresAt
      );
      await genesis.updateProject(0, title, description, imageURL, expiresAt);

      const project = await genesis.getProject(0);
      expect(project.title).to.equal(title);
      expect(project.description).to.equal(description);
      expect(project.imageURL).to.equal(imageURL);
    });

    it("Should allow deleting a project", async function () {
      const { genesis, owner } = await loadFixture(deployGenesisFixture);

      await genesis.createProject(
        "Test Project",
        "Description",
        "https://example.com/image.png",
        ethers.parseEther("1"),
        (await time.latest()) + 86400
      );
      await expect(genesis.deleteProject(0))
        .to.emit(genesis, "Action")
        .withArgs(0, "PROJECT DELETED", owner.address, anyValue);

      const project = await genesis.getProject(0);
      expect(project.status).to.equal(3); // DELETED
    });
  });

  describe("Backing Projects", function () {
    it("Should allow backing a project", async function () {
      const { genesis, backer1 } = await loadFixture(deployGenesisFixture);

      await genesis.createProject(
        "Test Project",
        "Description",
        "https://example.com/image.png",
        ethers.parseEther("1"),
        (await time.latest()) + 86400
      );
      await expect(
        genesis
          .connect(backer1)
          .backProject(0, { value: ethers.parseEther("0.5") })
      )
        .to.emit(genesis, "Action")
        .withArgs(0, "PROJECT BACKED", backer1.address, anyValue);

      const project = await genesis.getProject(0);
      expect(project.raised).to.equal(ethers.parseEther("0.5"));
      expect(project.backers).to.equal(1);
    });

    it("Should refund backers if project is reverted", async function () {
      const { genesis, backer1 } = await loadFixture(deployGenesisFixture);

      await genesis.createProject(
        "Test Project",
        "Description",
        "https://example.com/image.png",
        ethers.parseEther("1"),
        (await time.latest()) + 86400
      );
      await genesis
        .connect(backer1)
        .backProject(0, { value: ethers.parseEther("0.5") });

      await time.increase(86401); // Expire the project
      await genesis.requestRefund(0);

      const project = await genesis.getProject(0);
      expect(project.status).to.equal(2); // REVERTED
    });
  });

  describe("Payouts", function () {
    it("Should allow payout for an approved project", async function () {
      const { genesis, owner, backer1 } = await loadFixture(
        deployGenesisFixture
      );

      await genesis.createProject(
        "Test Project",
        "Description",
        "https://example.com/image.png",
        ethers.parseEther("1"),
        (await time.latest()) + 86400
      );
      await genesis
        .connect(backer1)
        .backProject(0, { value: ethers.parseEther("1") });

      // Ensure the project is approved
      const projectBeforePayout = await genesis.getProject(0);
      expect(projectBeforePayout.status).to.equal(1); // APPROVED

      await expect(genesis.payOutProject(0))
        .to.emit(genesis, "Action")
        .withArgs(0, "PROJECT PAID OUT", owner.address, anyValue);

      const projectAfterPayout = await genesis.getProject(0);
      expect(projectAfterPayout.status).to.equal(4); // PAIDOUT
    });
  });
});
