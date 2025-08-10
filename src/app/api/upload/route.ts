import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const photos = formData.getAll('photos');
    const types = formData.getAll('photoTypes');

    if (!photos.length || !types.length || photos.length !== types.length) {
      return NextResponse.json(
        { error: 'Invalid upload data' },
        { status: 400 },
      );
    }

    const uploadedPhotos = await Promise.all(
      photos.map(async (photo, i) => {
        const uploadFormData = new FormData();
        uploadFormData.append('file', photo);
        uploadFormData.append(
          'upload_preset',
          process.env.CLOUDINARY_PRESET_NAME!,
        );

        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`,
          {
            method: 'POST',
            body: uploadFormData,
          },
        );

        const data = await res.json();

        return {
          imageUrl: data.secure_url,
          type: types[i],
        };
      }),
    );

    return NextResponse.json({
      uploadedPhotos,
      message: 'Success',
      status: 200,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to upload photos' },
      { status: 500 },
    );
  }
}
