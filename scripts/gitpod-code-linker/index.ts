import { Octokit } from 'octokit';

const ACCEPTED_FILES = {
    'WORKSPACE_YAML': 'WORKSPACE.yaml',
    'IDE_CONSTANTS': 'install/installer/pkg/components/workspace/ide/constants.go'
}

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
        return { filename, status, sha, number, login, html_url };
    }).filter(file => file.status === 'modified' && Object.values(ACCEPTED_FILES).includes(file.filename));

    return fileChanges;
}

getRelevantFileChanges(prNumber).then(console.log);

