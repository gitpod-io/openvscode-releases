const { Octokit } = require("octokit");
const { paginateRest } = require("@octokit/plugin-paginate-rest");

const token = process.env.GITHUB_TOKEN;

if (!token) {
    console.error("GITHUB_TOKEN environment variable is required");
    process.exit(1);
}

const PaginatingOctokit = Octokit.plugin(paginateRest);
const octokit = new PaginatingOctokit({ auth: token });

const owner = "gitpod-io";
const repo = "openvscode-server";

const getSha = async (branch) => {
    const { data } = await octokit.rest.repos.getBranch({
        owner,
        repo,
        branch,
    });
    return data.commit.sha;
};

const main = async () => {
  const allBranchesUpstream = await octokit.paginate(
    octokit.rest.repos.listBranches,
    {
      owner: "microsoft",
      repo: "vscode",
      per_page: 100,
    }
  );

  const allBranchesUpstreamNames = allBranchesUpstream.map(
    (branch) => branch.name
  );

  const latestReleaseBranch = allBranchesUpstreamNames
    .sort()
    .reverse()
    .find((branch) => branch.startsWith("release/"));

  if (!latestReleaseBranch) {
    throw new Error("Could not find latest release branch");
  }

  console.info(`The latest release branch is ${latestReleaseBranch}`);

  const originReleaseBranchOpenVsCodeServer = latestReleaseBranch;
  const originReleaseBranchGpCode = `gp-code/${latestReleaseBranch}`;

  const originReleaseBranchOpenVsCodeServerExists = await octokit.rest.repos
    .getBranch({
      owner,
      repo,
      branch: originReleaseBranchOpenVsCodeServer,
    })
    .then(() => true)
    .catch(() => false);

  if (!originReleaseBranchOpenVsCodeServerExists) {
    const sha = await getSha("main");
    await octokit.rest.git.createRef({
      owner,
      repo,
      ref: `refs/heads/${originReleaseBranchOpenVsCodeServer}`,
      sha,
    });
    console.info(
      `Created branch ${originReleaseBranchOpenVsCodeServer}`
    );
  } else {
    console.info(
      `Branch ${originReleaseBranchOpenVsCodeServer} already exists`
    );
  }

  const originReleaseBranchGpCodeExists = await octokit.rest.repos
    .getBranch({
      owner,
      repo,
      branch: originReleaseBranchGpCode,
    })
    .then(() => true)
    .catch(() => false);

  if (!originReleaseBranchGpCodeExists) {
    const sha = await getSha("gp-code/main");
    await octokit.rest.git.createRef({
      owner,
      repo,
      ref: `refs/heads/${originReleaseBranchGpCode}`,
      sha,
    });
    console.info(`Created branch ${originReleaseBranchGpCode}`);
  } else {
    console.info(`Branch ${originReleaseBranchGpCode} already exists`);
  }
};

main();
