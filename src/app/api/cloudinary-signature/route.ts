import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { callback, paramsToSign } = body;

    const signature = cloudinary.utils.build_upload_params({
      ...paramsToSign,
      folder: 'zaart_assets',
      use_filename: true,
      unique_filename: false,
    });

    return Response.json({
      signature: signature.signature,
      timestamp: signature.timestamp,
    });
  } catch (error) {
    console.error('Signature error:', error);
    return Response.json({ error: 'Signature generation failed' }, { status: 500 });
  }
}
