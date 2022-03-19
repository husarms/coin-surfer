import * as cloudinary from 'cloudinary';

export function uploadFile(filePath: string) {
    cloudinary.v2.uploader.upload(filePath,
        {
            resource_type: 'raw',
            public_id: `coin-surfer/${filePath}`,
            overwrite: true,
        },
        function (error, result) {
            if (error) console.log(error);
        });
}