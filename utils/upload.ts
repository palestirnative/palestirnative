import { load } from "$std/dotenv/mod.ts";

const env = {
  ...(await load()),
  ...Deno.env.toObject(),
};

export default async function upload(file: File) {
  const body = new FormData();

  body.append(File.name, file);
  body.append("UPLOADCARE_PUB_KEY", env.UPLOAD_API_KEY);

  const response = await fetch("https://upload.uploadcare.com/base/", {
    method: "POST",
    body,
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return response.json();
}
