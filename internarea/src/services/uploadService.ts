import axios from "axios";

export const uploadImage = async (file: File): Promise<string | null> => {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (cloudName === "PLACEHOLDER" || uploadPreset === "PLACEHOLDER") {
    console.warn("Cloudinary credentials are placeholders. Using dummy URL for testing.");
    return "https://via.placeholder.com/600x400.png?text=Dummy+Image+Upload";
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset || "");

  try {
    const res = await axios.post(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, formData);
    return res.data.secure_url;
  } catch (error) {
    console.error("Error uploading image:", error);
    return null;
  }
};

export const uploadVideo = async (file: File): Promise<string | null> => {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (cloudName === "PLACEHOLDER" || uploadPreset === "PLACEHOLDER") {
    console.warn("Cloudinary credentials are placeholders. Using dummy URL for testing.");
    return "https://www.w3schools.com/html/mov_bbb.mp4";
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset || "");

  try {
    const res = await axios.post(`https://api.cloudinary.com/v1_1/${cloudName}/video/upload`, formData);
    return res.data.secure_url;
  } catch (error) {
    console.error("Error uploading video:", error);
    return null;
  }
};
