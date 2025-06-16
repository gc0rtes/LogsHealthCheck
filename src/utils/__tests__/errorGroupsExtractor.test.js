import { describe, it, expect } from "@jest/globals";
import { extractErrorGroups } from "../errorGroupsExtractor";
import { ERROR_CODES } from "../StreamErrorCodes";

describe("extractErrorGroups", () => {
  const sampleData = [
    {
      response: "400",
      error_code: "4",
      error_message: '{"message": "Input error occurred"}',
      operation_type: "UpdateUsers",
    },
    {
      response: "400",
      error_code: "4",
      error_message: '{"message": "Another input error"}',
      operation_type: "UpdateUsers",
    },
    {
      response: "401",
      error_code: "5",
      error_message: '{"message": "Authentication failed"}',
      operation_type: "QueryChannels",
    },
    {
      response: "404",
      error_code: "16",
      error_message: '{"message": "Resource not found"}',
      operation_type: "GetMessage",
    },
  ];

  it("should group errors by response code and error code", () => {
    const result = extractErrorGroups(sampleData);

    expect(result).toHaveLength(3); // 400, 401, 404

    // Check 400 error group
    const badRequestGroup = result.find(
      (group) => group.responseCode === "400"
    );
    expect(badRequestGroup).toBeDefined();
    expect(badRequestGroup.errorCode).toBe("4");
    expect(badRequestGroup.count).toBe(2);
    expect(badRequestGroup.description).toBe(ERROR_CODES["4"].description);
    expect(badRequestGroup.operationTypes).toHaveLength(1);
    expect(badRequestGroup.operationTypes[0].type).toBe("UpdateUsers");
    expect(badRequestGroup.operationTypes[0].count).toBe(2);
    expect(badRequestGroup.operationTypes[0].exampleMessage).toBe(
      "Input error occurred"
    );
  });

  it("should handle missing error codes gracefully", () => {
    const dataWithMissingCode = [
      {
        response: "400",
        error_code: "999", // Non-existent error code
        error_message: '{"message": "Unknown error"}',
        operation_type: "UnknownOperation",
      },
    ];

    const result = extractErrorGroups(dataWithMissingCode);
    const group = result[0];

    expect(group.errorCode).toBe("999");
    expect(group.description).toBe("Unknown error code");
  });

  it("should parse error messages correctly", () => {
    const dataWithComplexMessage = [
      {
        response: "400",
        error_code: "4",
        error_message:
          '{"message": "Complex error with details: {nested: true}"}',
        operation_type: "ComplexOperation",
      },
    ];

    const result = extractErrorGroups(dataWithComplexMessage);
    const group = result[0];

    expect(group.operationTypes[0].exampleMessage).toBe(
      "Complex error with details: {nested: true}"
    );
  });

  it("should handle empty data", () => {
    const result = extractErrorGroups([]);
    expect(result).toHaveLength(0);
  });
});
