export const runCommand = async (command: string) => {
  // Simulate CLI bridge - replace this with actual API call or WebSocket
  console.log("Running CLI command:", command);
  return { success: true, output: "Command executed: " + command };
};
