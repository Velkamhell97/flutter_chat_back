import { UploadApiResponse, v2 } from 'cloudinary';
import streamifier from 'streamifier';

interface UploadParams {
  path: string,
  filename ?: string,
  folder ?: string,
  type ?: string,
}

type AllowesExt = "jpg" | "jpeg" | "png" | "wav" | any;

const resourceTypes: Record<AllowesExt, string> = {
  jpg: "image",
  jpeg: "image",
  png: "image",
  wav: "video"
}

class Cloudinary {
  private cloudinary;

  constructor(){
    this.cloudinary = v2;
    
    this.cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_SECRET_KEY
    })
  }

  init(){
    //-se debe instanciar la clase luego de que se creen las variables de entorno
    // this.cloudinary.config(process.env.CLOUDINARY_URL!); //->No funciono con la variable de entorno
    // this.cloudinary.config({
    //   cloud_name: process.env.CLOUDINARY_CLOUD,
    //   api_key: process.env.CLOUDINARY_API_KEY,
    //   api_secret: process.env.CLOUDINARY_SECRET_KEY
    // })
  }
  
  //->Si envia un path lo sobreescribe si no genera un id
  async uploadImage({path, filename, folder, type = 'jpg'}: UploadParams) : Promise<UploadApiResponse> {
      return await this.cloudinary.uploader.upload(path,{
        public_id: filename,
        folder:`flutter_chat_back/${folder}`,
        overwrite: filename ? true : false,
        resource_type: resourceTypes[type]
      });
  }

  async removeImage(url:string, folder?:string) {
    const id = url.split('/').at(-1)!.split('.')[0]
    const chunk = folder ? (folder + "/") : "" ;

    await this.cloudinary.uploader.destroy(`flutter_chat_back/${chunk}${id}`);
  }

  uploadImageBytes(buffer: string | Buffer, folder:string) : Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      let stream = this.cloudinary.uploader.upload_stream(
        {
          folder:`flutter_chat_back/${folder}`
        },
        (error, result) => {
          if(result){
            resolve(result);
          } else {
            return reject(error);
          }
        },
      )

      streamifier.createReadStream(buffer).pipe(stream);
    })
  }
}

//->Esta exportacion de una instancia permite tener una clase singlenton
export default new Cloudinary();