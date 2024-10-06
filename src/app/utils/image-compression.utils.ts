import {NgxImageCompressService} from "ngx-image-compress";

export function compressImage(file: File, compressService: NgxImageCompressService): Promise<File> {
  return new Promise<File>((resolve, reject) => {
    const reader = new FileReader();

    reader.readAsDataURL(file);
    reader.onload = () => {
      compressService.compressFile(reader.result as string, 1, 50, 50)
        .then((result) => {
          const byteString = atob(result.split(',')[1]);
          const mimeString = result.split(',')[0].split(':')[1].split(';')[0];
          const ab = new ArrayBuffer(byteString.length);
          const ia = new Uint8Array(ab);

          for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
          }

          const compressedFile = new File([ab], file.name, { type: mimeString });
          resolve(compressedFile);
        })
        .catch(reject);
    };

    reader.onerror = (error) => {
      reject(error);
    };
  });
}
