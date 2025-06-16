const { classifyClientType } = require("../clientClassification");

describe("classifyClientType", () => {
  it("should classify browser and node SDKs correctly", () => {
    expect(classifyClientType("stream-chat-js-v8.60.0-browser")).toBe(
      "client-js-browser"
    );
    expect(classifyClientType("stream-chat-js-v8.57.6-node")).toBe(
      "client-js-node"
    );
    expect(
      classifyClientType("stream-chat-javascript-client-browser-8.14.4")
    ).toBe("client-js-browser");
    expect(classifyClientType("stream-chat-js-v8.57.6-node")).toBe(
      "client-js-node"
    );
  });

  it("should classify iOS and UIKit SDKs correctly", () => {
    expect(classifyClientType("stream-chat-uikit-client-v4.22.0")).toBe("iOS");
    expect(classifyClientType("ios")).toBe("iOS");
  });
});
