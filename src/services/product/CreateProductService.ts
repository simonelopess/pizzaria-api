import prismaClient from "../../prisma";
import cloudinary from "../../config/cloudinary";
import { Readable } from "node:stream";

interface CreateProductServiceProps {
  name: string;
  price: number;
  description: string;
  category_id: string;
  imageBuffer: Buffer;
  imageName: string;
}

class CreateProductService {
  async execute({
    name,
    price,
    description,
    category_id,
    imageBuffer,
    imageName,
  }: CreateProductServiceProps) {
    const categoryExists = await prismaClient.category.findFirst({
      where: {
        id: category_id,
      },
    });

    if (!categoryExists) {
      throw new Error("Categoria não encontrada");
    }

    let bannerUrl = "";
    // Send to cloudinary image and get url
    try {
      const result = await new Promise<any>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "products",
            resource_type: "image",
            public_id: `${Date.now()} - ${imageName.split(".")[0]} }`,
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          },
        );
        //   Create buffer stream and do cloudinary pipe
        const bufferStream = Readable.from(imageBuffer);
        bufferStream.pipe(uploadStream);
      });

      bannerUrl = result.secure_url;
    } catch (error) {
      throw new Error("Erro ao fazer upload da imagem");
    }

    // Save image url and data at DB
    const product = await prismaClient.product.create({
      data: {
        name,
        price: price,
        description,
        banner: bannerUrl,
        category_id,
      },
      select: {
        id: true,
        name: true,
        price: true,
        description: true,
        category_id: true,
        banner: true,
        createdAt: true,
      },
    });

    return product;
  }
}

export { CreateProductService };
