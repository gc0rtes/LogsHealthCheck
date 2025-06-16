import { classifyClientType } from "./clientClassification";

const extractAllVersions = (clientString) => {
  // Capture everything up to the version number, and possible suffix after the version
  const regex =
    /([a-zA-Z0-9_.-]+?)(?:-v?|_v?)?(\d+\.\d+\.\d+)(?:-([a-z]+))?(?:[^0-9]|$)/g;
  let match;
  const results = [];
  while ((match = regex.exec(clientString)) !== null) {
    let sdkString = match[1];
    if (match[3]) {
      sdkString += "-" + match[3];
    }
    results.push({
      sdkString,
      version: match[2],
    });
  }
  return results;
};

function compareVersions(a, b) {
  const pa = a.split(".").map(Number);
  const pb = b.split(".").map(Number);
  for (let i = 0; i < 3; i++) {
    if (pa[i] > pb[i]) return 1;
    if (pa[i] < pb[i]) return -1;
  }
  return 0;
}

const extractLatestSDKVersions = (clientStrings) => {
  const versionsByType = {};

  clientStrings.forEach((clientString) => {
    const all = extractAllVersions(clientString);
    all.forEach(({ sdkString, version }) => {
      const clientType = classifyClientType(sdkString);
      if (clientType === "Unknown" || clientType === "Other") return;
      if (
        !versionsByType[clientType] ||
        compareVersions(version, versionsByType[clientType]) > 0
      ) {
        versionsByType[clientType] = version;
      }
    });
  });

  return versionsByType;
};

export { extractLatestSDKVersions };
