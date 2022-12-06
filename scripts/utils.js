import { Octokit } from "octokit";
import { paginateRest } from "@octokit/plugin-paginate-rest";
import { createPullRequest } from "octokit-plugin-create-pull-request";

export const getOctokit = () => {
  const token = process.env.GITHUB_TOKEN;

  if (!token) {
    console.error("GITHUB_TOKEN environment variable is required");
    process.exit(1);
  }

  const OctokitWithPlugins =
    Octokit.plugin(paginateRest).plugin(createPullRequest);

  const octokit = new OctokitWithPlugins({ auth: token });

  return octokit;
};

