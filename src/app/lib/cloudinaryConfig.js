
import { Cloudinary } from "@cloudinary/url-gen";

const cloudinary = new Cloudinary({
  cloud: {
    cloudName: "dg56syr5x", 
  },
  url: {
    secure: true,
  },
});

export default cloudinary;
