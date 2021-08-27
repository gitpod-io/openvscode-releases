const artifact = require('@actions/artifact');

const downloadAll = async () => {
  const artifactClient = artifact.create();
  const downloadResponse = await artifactClient.downloadAllArtifacts();
  // output result
  for (response in downloadResponse) {
    console.log(response.artifactName);
    console.log(response.downloadPath);
  }
}

downloadAll();
