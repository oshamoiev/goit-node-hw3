import { v2 as cloudinary } from "cloudinary";
import { config } from "../config.ts";

cloudinary.config({
  cloud_name: config.cloudinaryCloudName,
  api_key: config.cloudinaryApiKey,
  api_secret: config.cloudinaryApiSecret,
  secure: true,
});

export const uploadImage = (filePath: string) => {
  return cloudinary.uploader.upload(filePath, {
    folder: "announcements",
    resource_type: "image",
  });
};
