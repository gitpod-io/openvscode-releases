import { Octokit } from 'octokit';
import semver from 'semver';
const { inc, major, minor } = semver;
import fs from 'fs';

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

const replaceInFile = (file, transform) => {
    const text = fs.readFileSync(file, 'utf8');
    const transformed = transform(text);
    fs.writeFileSync(file, transformed, 'utf-8');
}

const getNextReleaseTag = async () => {
    const releaseResult = await octokit.rest.repos.getLatestRelease({
        owner: 'gitpod-io',
        repo: 'openvscode-server',
    });
    return inc(releaseResult.data.tag_name.split("-").at(-1), 'minor');
}

const nextTag = process.env.NEXT_TAG || await getNextReleaseTag();

try {
    const branch = `release/${major(nextTag)}.${minor(nextTag)}`;
    await octokit.rest.repos.getBranch({
        owner: 'microsoft',
        repo: 'vscode',
        branch,
    });
    replaceInFile('.github/workflows/insiders-gp.yml', (object) => {
        object = object.replace("'upstream/main'", `'upstream/${branch}'`);
        object = object.replace("'gp-code/main'", `'gp-code/${branch}'`);
        return object;
    });
    replaceInFile('.github/workflows/insiders.yml', (object) => {
        object = object.replace("'upstream/main'", `'upstream/${branch}'`);
        object = object.replace("'main'", `'${branch}'`);
        return object;
    });
} catch (e) {
    console.info(`A release for ${nextTag} branch does not exist. Reverting to main.`, e);
    replaceInFile('.github/workflows/insiders-gp.yml', (object) => {
        object = object.replace(/'upstream\/release\/.{1,5}'/i, "'upstream/main'");
        object = object.replace(/'gp-code\/release\/.{1,5}'/i, "'gp-code/main'");
        return object;
    });
    replaceInFile('.github/workflows/insiders.yml', (object) => {
        object = object.replace(/'upstream\/release\/.{1,5}'/i, "'upstream/main'");
        object = object.replace(/'release\/.{1,5}'/i, "'main'");
        return object;
    });
}