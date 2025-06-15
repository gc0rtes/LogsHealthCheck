export const classifyClientType = (clientString) => {
  if (!clientString) return "Unknown";

  const client = clientString.toLowerCase();
  if (client.includes("react-native")) return "React Native";
  if (client.includes("react")) return "React";
  if (client.includes("browser")) return "client-js-browser";
  if (client.includes("node")) return "client-js-node";
  if (client.includes("ios")) return "iOS";
  if (client.includes("android")) return "Android";
  if (client.includes("python")) return "Python SDK";
  if (client.includes("java")) return "Java SDK";
  if (client.includes("php")) return "PHP SDK";
  if (client.includes("ruby")) return "Ruby SDK";
  if (client.includes("go")) return "Go SDK";
  if (client.includes("dotnet")) return ".NET SDK";
  if (client.includes("flutter ")) return "Flutter";
  return "Other";
};
