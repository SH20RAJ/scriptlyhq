"use server";

import crypto from "crypto";

export async function uploadImageAction(formData: FormData) {
  try {
    const file = formData.get("file") as File;
    if (!file) {
      return { error: "No file provided" };
    }

    const githubPat = process.env.GITHUB_PAT;
    const githubRepoOwner = process.env.GITHUB_REPO_OWNER || "30tools";
    const githubRepoName = process.env.GITHUB_REPO_NAME || "scriptly-assets";

    if (!githubPat) {
      return { error: "GitHub PAT token is not configured on the server." };
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Content = buffer.toString("base64");

    const lastDotIndex = file.name.lastIndexOf(".");
    const nameWithoutExt = lastDotIndex !== -1 ? file.name.substring(0, lastDotIndex) : file.name;
    const ext = lastDotIndex !== -1 ? file.name.substring(lastDotIndex) : "";
    const sanitizedName = nameWithoutExt.replace(/[^a-zA-Z0-9.\-_]/g, "_");
    
    // Generate a random 8-byte (16-char) hex suffix
    const randomSuffix = crypto.randomBytes(8).toString("hex");
    const path = `${sanitizedName}-${randomSuffix}${ext}`;

    const url = `https://api.github.com/repos/${githubRepoOwner}/${githubRepoName}/contents/${path}`;
    
    console.log(`Uploading file ${file.name} to GitHub at path: ${path}`);
    
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${githubPat}`,
        "Accept": "application/vnd.github+json",
        "User-Agent": "ScriptlyStore",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: `Upload product image: ${file.name}`,
        content: base64Content,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("GitHub upload failed response:", errorText);
      return { error: `GitHub API error (${response.status}): ${errorText}` };
    }

    const result = await response.json() as {
      content: {
        sha: string;
        path: string;
      };
      commit: {
        sha: string;
      };
    };

    const commitSha = result.commit.sha;
    const cdnUrl = `https://cdn.jsdelivr.net/gh/${githubRepoOwner}/${githubRepoName}@${commitSha}/${path}`;

    console.log(`Successfully uploaded. Generated jsDelivr CDN URL: ${cdnUrl}`);

    return { 
      url: cdnUrl, 
      public_id: result.content.sha 
    };
  } catch (error: any) {
    console.error("Upload action error:", error);
    return { error: error.message || "Upload failed" };
  }
}

