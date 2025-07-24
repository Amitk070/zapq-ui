const handleGenerateProject = async () => {
  const prompt = promptInput.trim(); // get from input field
  if (!prompt) return;

  setLoading(true);
  setStatus("Generating project...");

  try {
    const res = await fetch("${API_BASE}/generate-project", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userPrompt: prompt })
    });

    const data = await res.json();
    if (!data.success) throw new Error("Claude generation failed");

    const files = data.files;

    // ✅ 1. Refresh file tree (if using Zustand or local state)
    refreshFileTree(files); // or re-call GET /files

    // ✅ 2. Open first relevant file
    const openPath = files.find((f) =>
      f.includes("App.tsx") || f.includes("Home.tsx")
    );
    if (openPath) loadFile(openPath); // calls GET /file?path=...

    // ✅ 3. Show toast/success message
    toast.success("✅ Project generated!");

    // ✅ 4. (Optional) Display token usage
    if (data.tokensUsed) {
      setTokenUsage((prev) => prev + data.tokensUsed);
    }
  } catch (err) {
    console.error("🚨 generate-project failed:", err);
    toast.error("❌ Failed to generate project");
  } finally {
    setLoading(false);
    setStatus(null);
  }
};
