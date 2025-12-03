import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.variant.deleteMany();
  await prisma.product.deleteMany();

  const products = [
    {
      name: 'Classic Oversized Hoodie',
      description: 'Warm fleece-lined hoodie with a relaxed fit.',
      imageUrl:
        'https://lsco.scene7.com/is/image/lsco/A10340000-front-pdp-lse?fmt=webp&qlt=70&resMode=sharp2&fit=crop,1&op_usm=0.6,0.6,8&wid=1320&hei=1320',
      variants: [
        {
          size: 'M',
          color: 'Black',
          price: 49.99,
          sku: 'HOODIE-BLK-M',
          stock: 25,
        },
        {
          size: 'L',
          color: 'Beige',
          price: 49.99,
          sku: 'HOODIE-BGE-L',
          stock: 20,
        },
      ],
    },

    {
      name: 'Slim Fit Denim Jeans',
      description: 'Premium blue denim with a tapered leg fit.',
      imageUrl:
        'https://www.sartoriale.com/cdn/shop/files/LEVI_SPremium501BlueDenimSlimTaperJeans1.jpg?v=1756376423&width=1400',
      variants: [
        {
          size: '32',
          color: 'Dark Blue',
          price: 69.99,
          sku: 'JEANS-DB-32',
          stock: 40,
        },
        {
          size: '34',
          color: 'Light Blue',
          price: 69.99,
          sku: 'JEANS-LB-34',
          stock: 35,
        },
      ],
    },

    {
      name: 'Premium Cotton T-Shirt',
      description: 'Soft and breathable T-shirt for daily wear.',
      imageUrl:
        'https://i5.walmartimages.com/seo/Men-Soft-T-Shirts-Breathable-Sleeveless-Slim-Summer-Crew-Neck-Short-Sleeve-Sportstyle-Training-Stretch-Classic-Dailywear-Tee-Dailywear-Fashion-Clothe_9e81a484-6866-4dd2-a1cd-4e75d481717a.744222c33290c528b2d8dc4fbacea88a.jpeg?odnHeight=573&odnWidth=573&odnBg=FFFFFF',
      variants: [
        {
          size: 'S',
          color: 'White',
          price: 24.99,
          sku: 'TSHIRT-WHT-S',
          stock: 60,
        },
        {
          size: 'M',
          color: 'Black',
          price: 24.99,
          sku: 'TSHIRT-BLK-M',
          stock: 50,
        },
      ],
    },

    {
      name: 'Leather Crossbody Bag',
      description: 'Minimalist shoulder bag made from genuine leather.',
      imageUrl:
        'https://i.etsystatic.com/19476521/r/il/eab70f/3918801745/il_1588xN.3918801745_o9xm.jpg',
      variants: [
        {
          size: 'One Size',
          color: 'Brown',
          price: 119.99,
          sku: 'BAG-BRN-OS',
          stock: 15,
        },
      ],
    },

    {
      name: 'Women’s Running Sneakers',
      description: 'Lightweight running shoes with breathable mesh.',
      imageUrl:
        'https://m.media-amazon.com/images/I/71WXBq2bhiL._AC_SY395_SX395_QL70_FMwebp_.jpg',
      variants: [
        {
          size: '38',
          color: 'White/Pink',
          price: 89.99,
          sku: 'SNEAK-WP-38',
          stock: 30,
        },
        {
          size: '39',
          color: 'Black/Gold',
          price: 89.99,
          sku: 'SNEAK-BG-39',
          stock: 22,
        },
      ],
    },
  ];

  for (const product of products) {
    await prisma.product.create({
      data: {
        name: product.name,
        description: product.description,
        imageUrl: product.imageUrl,
        variants: {
          create: product.variants,
        },
      },
    });
  }

  console.log('🌱 Database has been seeded successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
