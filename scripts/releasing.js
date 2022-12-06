import { getOctokit } from "./utils.js";
import { readFile } from "fs/promises";

export const createReleasePr = async (version, commit) => {
  const octokit = getOctokit();
  const [owner, repo] = ["gitpod-io", "gitpod"];

  const body = (await readFile("resources/insider.md", "utf-8")).replace(
    "`1.x.x`",
    `\`${version}\``
  );
  const head = `code-release/${version}`;

  // Check if PR already exists
  const { data: prs } = await octokit.rest.pulls.list({
    owner,
    repo,
    head,
  });

  if (prs.length > 0) {
    console.error(`PR already exists: #${prs[0].number}`);
    return;
  }

  const { data: pr } = await octokit.createPullRequest({
    owner,
    repo,
    title: `Release ${version}`,
    body,
    draft: true,
    update: false,
    head: `code-release/${version}`,
    changes: [
      {
        files: {
          "WORKSPACE.yaml": ({ exists, encoding, content }) => {
            if (!exists) {
              throw new Error("WORKSPACE.yaml does not exist");
            }
            const decodedContent = Buffer.from(content, encoding).toString(
              "utf-8"
            );

            return decodedContent
              .replace(/codeCommit: .*/, `codeCommit: ${commit}`)
              .replace(/codeVersion: .*/, `codeVersion: ${version}`);
          },
        },
      },
    ],
  });

  console.log(`Created PR: #${pr.number}`);

  octokit.rest.issues.addLabels({
    owner,
    repo,
    issue_number: pr.number,
    labels: ["editor: code (browser)"],
  });
};

createReleasePr("1.73.1", "5c850806c2dcf87ccc3a076c2ed96a2fbc4ad25f");
