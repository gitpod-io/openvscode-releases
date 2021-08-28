const artifact = require('@actions/artifact');

const downloadAll = async () => {
  const artifactClient = artifact.create();
  const downloadResponse = await artifactClient.downloadAllArtifacts();

  for (response in downloadResponse) {
    console.table(response)
  }
}

downloadAll();
