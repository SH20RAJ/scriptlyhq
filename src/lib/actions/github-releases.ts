"use server";

import crypto from "crypto";

export async function uploadToGithubReleaseAction(formData: FormData) {
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

    const headers = {
      "Authorization": `Bearer ${githubPat}`,
      "Accept": "application/vnd.github+json",
      "User-Agent": "ScriptlyStore",
    };

    // 1. Get or Create "assets" release
    const releasesUrl = `https://api.github.com/repos/${githubRepoOwner}/${githubRepoName}/releases`;
    
    // Find if "assets" release exists
    const findRes = await fetch(`${releasesUrl}/tags/assets`, {
      headers,
    });

    let release: any = null;

    if (findRes.status === 200) {
      release = await findRes.json();
    } else {
      // Create a release with tag 'assets'
      const createRes = await fetch(releasesUrl, {
        method: "POST",
        headers: {
          ...headers,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tag_name: "assets",
          name: "Scriptly Asset Store",
          body: "Storage for large files, thumbnails, and packages uploaded via ScriptlyStore Admin.",
          draft: false,
          prerelease: false,
        }),
      });

      if (!createRes.ok) {
        const errText = await createRes.text();
        return { error: `Failed to create GitHub release tag 'assets': ${errText}` };
      }
      release = await createRes.json();
    }

    const releaseId = release.id;
    
    // 2. Upload file to this release's assets
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Sanitize filename to avoid spaces and special characters
    const lastDotIndex = file.name.lastIndexOf(".");
    const nameWithoutExt = lastDotIndex !== -1 ? file.name.substring(0, lastDotIndex) : file.name;
    const ext = lastDotIndex !== -1 ? file.name.substring(lastDotIndex) : "";
    const sanitizedName = nameWithoutExt.replace(/[^a-zA-Z0-9.\-_]/g, "_");
    const randomSuffix = crypto.randomBytes(8).toString("hex");
    const filename = `${sanitizedName}-${randomSuffix}${ext}`;

    const uploadUrl = `https://uploads.github.com/repos/${githubRepoOwner}/${githubRepoName}/releases/${releaseId}/assets?name=${encodeURIComponent(filename)}`;

    console.log(`Uploading ${filename} to GitHub release ${releaseId}...`);

    const uploadRes = await fetch(uploadUrl, {
      method: "POST",
      headers: {
        ...headers,
        "Content-Type": file.type || "application/octet-stream",
        "Content-Length": buffer.length.toString(),
      },
      body: buffer,
    });

    if (!uploadRes.ok) {
      const errText = await uploadRes.text();
      return { error: `GitHub asset upload failed: ${errText}` };
    }

    const assetData = await uploadRes.json() as {
      browser_download_url: string;
    };

    console.log(`Uploaded successfully. Public URL: ${assetData.browser_download_url}`);

    return { url: assetData.browser_download_url };
  } catch (error: any) {
    console.error("GitHub Release Upload error:", error);
    return { error: error.message || "Release upload failed" };
  }
}
