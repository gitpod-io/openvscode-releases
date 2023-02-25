import { Octokit } from 'octokit';
import { loadYamlFile } from 'load-yaml-file';
import * as fs from 'fs';
import * as download from 'download';
import * as os from 'os';
import * as path from 'path';
import { basename } from 'path';

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

const [owner, repo] = process.env.GITHUB_REPOSITORY.split('/');
const prNumber = parseInt(process.env.GITHUB_REF.split('/').at(-1));

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
(async () => {
    const prChanges = await getRelevantFileChanges(prNumber);
    await Promise.all(prChanges.map(async (file) => {
        const directory = await fs.promises.mkdtemp(path.join(os.tmpdir(), 'gp-'));
        const fileName = basename(file.path);
        await download.default(`https://raw.githubusercontent.com/${owner}/${repo}/${file.sha}/${file.path}`, directory, { filename: `${file.sha}-${fileName}` });
        await download.default(`https://raw.githubusercontent.com/${owner}/${repo}/HEAD/${file.path}`, directory, { filename: `head-${fileName}` });

        switch (file.path) {
            case ACCEPTED_FILES.WORKSPACE_YAML:
                const workspaceYamlOriginal: any = await loadYamlFile(path.join(directory, `${file.sha}-${fileName}`));
                const workspaceYaml: any = await loadYamlFile(path.join(directory, `head-${fileName}`));
                
                const workspaceCodeCommit = workspaceYaml?.defaultArgs?.codeCommit;
                if (!workspaceCodeCommit) {
                    return;
                }

                if (workspaceCodeCommit !== workspaceYamlOriginal.defaultArgs.codeCommit) {
                    message.push(`- VS Code Insiders is set to commit ${REPOSITORIES.OPEN_VSCODE_SERVER}/commit/${workspaceYaml.defaultArgs.codeCommit}`);
                }
                break;
            case ACCEPTED_FILES.IDE_CONSTANTS:
                const gitpodExtensionsRegex = new RegExp(/CodeWebExtensionVersion\s*= "commit-(.*)"/g)
                const fileContents = await fs.promises.readFile(path.join(directory, `${file.sha}-${fileName}`), 'utf8');
                const fileContentsOriginal = await fs.promises.readFile(path.join(directory, `head-${fileName}`), 'utf8');

                const gitpodExtensionsCommit = gitpodExtensionsRegex.exec(fileContents)?.[1];
                const gitpodExtensionsCommitOriginal = gitpodExtensionsRegex.exec(fileContentsOriginal)?.[1];
                if (!gitpodExtensionsCommit || !gitpodExtensionsCommitOriginal) {
                    console.debug('Could not find gitpod extensions commit in ' + gitpodExtensionsCommit + ' or ' + gitpodExtensionsCommitOriginal + '.');
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
})();


