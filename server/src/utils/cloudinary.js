import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
  secure: true,
});

// default format for using  the cloudinary

export const uploadToCloudinary = async (file, options = {}) => {
  try {
    const defaultOptions = {
      folder: "Clinicare",
      resource_type: "auto", //using auto is like giving cloudinary the power or options to decide the formats you upload, we majorly use auto if we are using more than one format other than that we can specify if its an image or video
      // Image optimization settings
      quality: "auto",
      fetch_format: "auto",
      // Delivery optimization
      eager: [
        { width: 800, height: 600, crop: "limit" },
        { width: 400, height: 300, crop: "limit" },
      ],
      // Performance optimization
      responsive_breakpoints: {
        create_derived: true,
        transformation: {
          quality: "auto",
          fetch_format: "auto", //jpeg, webp(most optimized version), svg
        },
      },
      secure: true,
      optimize: true,
      ...options, //for adding additional options
    };

    const uploadResponse = await cloudinary.uploader.upload(
      file,
      defaultOptions
    );
    
    return {
      url: uploadResponse.secure_url,
      public_id: uploadResponse.public_id,
    };
  } catch (error) {
    throw new Error(`Upload failed: ${error.error.message}`);
  }
};

export const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    throw new Error(`Deletion failed: ${error.error.message}`);
    //throw error means that it stops the operation from running while return an error mean
  }
};