export const extractSDKVersions = (clientString) => {
  if (!clientString) return null;

  // Extract version from different SDK formats
  const patterns = {
    swift: /stream-chat-swift-client-v(\d+\.\d+\.\d+)/,
    java: /stream-java-client-(\d+\.\d+\.\d+)/,
    android: /stream-chat-android-compose-(\d+\.\d+\.\d+)/,
    react: /stream-chat-react-(\d+\.\d+\.\d+)/,
    "react-native": /stream-chat-react-native-(\d+\.\d+\.\d+)/,
    python: /stream-chat-python-(\d+\.\d+\.\d+)/,
    node: /stream-chat-node-(\d+\.\d+\.\d+)/,
    php: /stream-chat-php-(\d+\.\d+\.\d+)/,
    ruby: /stream-chat-ruby-(\d+\.\d+\.\d+)/,
    go: /stream-chat-go-(\d+\.\d+\.\d+)/,
    dotnet: /stream-chat-dotnet-(\d+\.\d+\.\d+)/,
    flutter: /stream-chat-flutter-(\d+\.\d+\.\d+)/,
  };

  for (const [sdk, pattern] of Object.entries(patterns)) {
    const match = clientString.match(pattern);
    if (match) {
      return {
        sdk,
        version: match[1],
      };
    }
  }

  return null;
};
