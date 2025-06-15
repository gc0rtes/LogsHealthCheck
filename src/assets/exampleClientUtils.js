// Helper function to extract client type from x-stream-client
const uniqueClientStrings = {};

// Track total counts for each SDK type
const totalClientTypeCounts = {};

// Pure function: just returns the type
export const classifyClientType = (clientString) => {
  if (!clientString) return "Unknown";

  const client = clientString.toLowerCase();
  if (client.includes("web") || client.includes("react")) return "Web (React)";
  if (client.includes("ios")) return "iOS";
  if (client.includes("android")) return "Android";
  if (client.includes("react-native")) return "React Native";
  if (client.includes("python")) return "Python SDK";
  if (client.includes("node")) return "Node.js SDK";
  if (client.includes("java")) return "Java SDK";
  if (client.includes("php")) return "PHP SDK";
  if (client.includes("ruby")) return "Ruby SDK";
  if (client.includes("go")) return "Go SDK";
  if (client.includes("dotnet")) return ".NET SDK";
  return "Other";
};

/**
 * @param {string} clientString - The x-stream-client value
 * @param {object} [source] - Optional: pass the source row or index for debugging
 */
export const countClientType = (clientString, source) => {
  const type = classifyClientType(clientString);

  // Log the raw client string and its source for debugging
  if (source !== undefined) {
    console.log(`[countClientType][raw]`, clientString, "[source]", source);
  } else {
    console.log(`[countClientType][raw]`, clientString);
  }

  // Store unique client strings for each type
  if (!uniqueClientStrings[type]) uniqueClientStrings[type] = new Set();
  uniqueClientStrings[type].add(clientString);

  // Count total occurrences for each type
  totalClientTypeCounts[type] = (totalClientTypeCounts[type] || 0) + 1;
  console.log(
    `[countClientType][total] ${type}: ${totalClientTypeCounts[type]}`
  );

  // Log the unique count for each type
  console.log(
    `[countClientType][unique] ${type}: ${uniqueClientStrings[type].size}`
  );

  return type;
};

// Debug function to print all unique Node.js SDK x-stream-client values
export const printAllUniqueNodeSDKClients = () => {
  console.log(
    "All unique Node.js SDK x-stream-client values:",
    Array.from(uniqueClientStrings["Node.js SDK"] || [])
  );
};

// Debug function to print total counts for all SDK types
export const printTotalClientTypeCounts = () => {
  console.log("Total counts for all SDK types:", totalClientTypeCounts);
};

// Helper function to extract version from x-stream-client
export const getClientVersion = (clientString) => {
  if (!clientString) return null;

  // Match version patterns like v1.2.3, 1.2.3, or version-1.2.3
  const versionMatch = clientString.match(/[vV]?(\d+\.\d+\.\d+)/);
  return versionMatch ? versionMatch[1] : null;
};

// Helper function to compare versions
export const compareVersions = (v1, v2) => {
  const v1Parts = v1.split(".").map(Number);
  const v2Parts = v2.split(".").map(Number);

  for (let i = 0; i < 3; i++) {
    if (v1Parts[i] > v2Parts[i]) return 1;
    if (v1Parts[i] < v2Parts[i]) return -1;
  }
  return 0;
};

// Get latest version for each client type
export const getLatestVersions = (errorGroups) => {
  const versions = {};
  errorGroups.forEach((group) => {
    group.clients.forEach((client) => {
      const clientType = classifyClientType(client);
      const version = getClientVersion(client);
      if (version) {
        if (
          !versions[clientType] ||
          compareVersions(version, versions[clientType]) > 0
        ) {
          versions[clientType] = version;
        }
      }
    });
  });
  return versions;
};

export const resetClientTypeCounters = () => {
  for (const key in totalClientTypeCounts) delete totalClientTypeCounts[key];
  for (const key in uniqueClientStrings) delete uniqueClientStrings[key];
};

export const printFinalSDKCounts = () => {
  console.log("\n=== Final SDK Counts ===");
  console.log("Total counts:");
  Object.entries(totalClientTypeCounts).forEach(([type, count]) => {
    console.log(`${type}: ${count}`);
  });
  console.log("\nUnique client strings:");
  Object.entries(uniqueClientStrings).forEach(([type, clients]) => {
    console.log(`${type}: ${clients.size} unique clients`);
  });
  console.log("=====================\n");
};
