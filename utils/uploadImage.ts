import { getUploadUrl, type StorageBucket } from "@/api/storage";

export type LocalImage = {
  uri: string;
  mimeType?: string;
  fileName?: string;
};

function extensionFromMime(mime: string | undefined): string {
  if (!mime) return "jpg";
  if (mime.includes("png")) return "png";
  if (mime.includes("webp")) return "webp";
  if (mime.includes("heic")) return "heic";
  return "jpg";
}

// Pulls bytes off the local file URI, asks the API for a presigned URL,
// PUTs the bytes there, and returns the public URL the backend gave us.
// `prefix` becomes the directory inside the bucket (e.g. user id) — some
// buckets reject uploads without it.
export async function uploadImage(
  bucket: StorageBucket,
  image: LocalImage,
  prefix?: string,
): Promise<string> {
  const ext = extensionFromMime(image.mimeType);
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const path = prefix ? `${prefix}/${filename}` : filename;

  const { data: presigned } = await getUploadUrl(bucket, path);

  const blob = await (await fetch(image.uri)).blob();
  const method = presigned.method ?? "PUT";

  const res = await fetch(presigned.upload_url, {
    method,
    headers: {
      "Content-Type": image.mimeType ?? "image/jpeg",
      ...(presigned.headers ?? {}),
    },
    body: blob,
  });

  if (!res.ok) {
    let detail = "";
    try {
      detail = await res.text();
    } catch {
      // ignore
    }
    console.warn("[uploadImage] failed", {
      status: res.status,
      url: presigned.upload_url,
      method,
      contentType: image.mimeType ?? "image/jpeg",
      bodySize: blob.size,
      response: detail.slice(0, 500),
    });
    throw new Error(
      `ფაილის ატვირთვა ვერ მოხერხდა (${res.status})${detail ? `: ${detail.slice(0, 200)}` : ""}`,
    );
  }

  return presigned.public_url ?? presigned.upload_url.split("?")[0];
}
