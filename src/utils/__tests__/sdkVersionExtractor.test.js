const { extractLatestSDKVersions } = require("../sdkVersionExtractor");

describe("extractLatestSDKVersions", () => {
  it("should extract latest versions for each SDK type", () => {
    const clientStrings = [
      "stream-java-client-1.29.0",
      "stream-java-client-1.26.2",
      "stream-chat-js-v8.57.6-node",
      "stream-chat-js-v8.60.0-browser",
      "stream-chat-react-10.21.0-stream-chat-javascript-client-browser-8.14.4",
      "stream-chat-react-12.13.1-stream-chat-js-v8.57.6-browser",
      "stream-chat-android-compose-6.4.3",
      "stream-chat-uikit-client-v4.22.0|app=Woolworths|app_version=9.28.1|os=iOS 18.5",
      "stream-go-client-6.10.0",
    ];

    const expected = {
      "Java SDK": "1.29.0",
      "client-js-node": "8.57.6",
      "client-js-browser": "8.60.0",
      React: "12.13.1",
      Android: "6.4.3",
      iOS: "4.22.0",
      "Go SDK": "6.10.0",
    };

    expect(extractLatestSDKVersions(clientStrings)).toEqual(expected);
  });

  it("should handle empty input", () => {
    expect(extractLatestSDKVersions([])).toEqual({});
  });

  it("should handle invalid client strings", () => {
    const clientStrings = [
      "invalid-client-string",
      "stream-java-client-1.29.0",
      "another-invalid-string",
    ];

    const expected = {
      "Java SDK": "1.29.0",
    };

    expect(extractLatestSDKVersions(clientStrings)).toEqual(expected);
  });

  it("should handle client strings with multiple SDKs", () => {
    const clientStrings = [
      "stream-chat-react-12.13.1-stream-chat-js-v8.57.6-browser",
      "stream-chat-react-10.21.0-stream-chat-javascript-client-browser-8.14.4",
    ];

    const expected = {
      React: "12.13.1",
      "client-js-browser": "8.57.6",
    };

    expect(extractLatestSDKVersions(clientStrings)).toEqual(expected);
  });
});
