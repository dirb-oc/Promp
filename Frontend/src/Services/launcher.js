import { apiRequest } from "../Api/Api";

export async function launchPrompt({ prompt, negative_prompt, width, height }) {
  return await apiRequest("/api/launcher/", {
    method: "POST",
    body: JSON.stringify({
      prompt,
      negative_prompt,
      width,
      height,
    }),
  });
}