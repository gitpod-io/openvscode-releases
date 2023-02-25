import { Octokit } from 'octokit';
import { load } from 'js-yaml';
import fs from 'fs';

const ACCEPTED_FILES = {
    'WORKSPACE_YAML': 'WORKSPACE.yaml',
    'IDE_CONSTANTS': 'install/installer/pkg/components/workspace/ide/constants.go'
};

const REPOSITORIES = {
    'GITPOD_CODE': 'https://github.com/gitpod-io/gitpod-code',
    'OPEN_VSCODE_SERVER': 'https://github.com/gitpod-io/openvscode-server'
};

const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN,
}).rest;

let prNumber = 16573;
let owner = "gitpod-io";
let repo = "gitpod";

if (process.env.GITHUB_EVENT_PATH) {
    const githubActionEvent = JSON.parse(
        fs.readFileSync(process.env.GITHUB_EVENT_PATH, "utf8")
    );
    prNumber = githubActionEvent.pull_request.number;
    owner = githubActionEvent.pull_request.base.repo.owner.login;
    repo = githubActionEvent.pull_request.base.repo.name;
}

const getRelevantFileChanges = async (prNumber: number) => {

    const { data: pr } = await octokit.pulls.get({
        owner,
        repo,
        pull_number: prNumber,
    });

    const { data: files } = await octokit.pulls.listFiles({
        owner,
        repo,
        pull_number: prNumber,
    });

    const fileChanges = files.map(file => {
        const { filename, status } = file;
        const { sha } = pr.head;
        const { number } = pr;
        const { login } = pr.user;
        const { html_url } = pr;
        return { path: filename, status, sha, number, login, html_url };
    }).filter(file => file.status === 'modified' && Object.values(ACCEPTED_FILES).includes(file.path));

    return fileChanges;
}

const message = [];
message.push(`## IDE Code linker bot\n\n`);

(async () => {
    const prChanges = await getRelevantFileChanges(prNumber);
    await Promise.all(prChanges.map(async (file) => {
        const currentFileOnPr = (await octokit.repos.getContent({
            owner, repo,
            path: file.path,
            ref: file.sha,
            mediaType: { format: "raw", }
        })).data.toString();

        const currentFileOnHead = (await octokit.repos.getContent({
            owner, repo,
            ref: 'main',
            path: file.path,
            mediaType: { format: "raw", }
        })).data.toString();

        switch (file.path) {
            case ACCEPTED_FILES.WORKSPACE_YAML:
                const workspaceYamlOriginal: any = await load(currentFileOnHead);
                const workspaceYaml: any = await load(currentFileOnPr);

                const workspaceCodeCommit = workspaceYaml?.defaultArgs?.codeCommit;
                console.log(workspaceCodeCommit)
                if (!workspaceCodeCommit) {
                    return;
                }

                if (workspaceCodeCommit !== workspaceYamlOriginal.defaultArgs.codeCommit) {
                    message.push(`- VS Code Insiders is set to commit ${REPOSITORIES.OPEN_VSCODE_SERVER}/commit/${workspaceYaml.defaultArgs.codeCommit}`);
                }
                break;
            case ACCEPTED_FILES.IDE_CONSTANTS:
                const gitpodExtensionsRegex = new RegExp(/CodeWebExtensionVersion\s*= "commit-(.*)"/)

                const gitpodExtensionsCommit = currentFileOnPr.match(gitpodExtensionsRegex)[1];
                const gitpodExtensionsCommitOriginal = currentFileOnPr.match(gitpodExtensionsRegex)[1];
                if (!gitpodExtensionsCommit || !gitpodExtensionsCommitOriginal) {
                    console.debug(`Could not find gitpod extensions commit in ${gitpodExtensionsCommit} or ${gitpodExtensionsCommitOriginal}.`);
                    return;
                }

                if (gitpodExtensionsCommit !== gitpodExtensionsCommitOriginal) {
                    message.push(`- Built-in extensions are set to commit ${REPOSITORIES.GITPOD_CODE}/commit/${gitpodExtensionsCommit}`);
                }
                break;
            default:
        }
    }));
    console.log(message);

    if (message.length > 1) {
        await octokit.issues.createComment({
            owner,
            repo,
            issue_number: prNumber,
            body: message.join('\n\r'),
        });
    }
})();

