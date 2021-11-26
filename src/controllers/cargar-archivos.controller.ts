// Uncomment these imports to begin using these cool features!

// import {inject} from '@loopback/core';

import {authenticate} from '@loopback/authentication';
import {inject} from '@loopback/context';
import {intercept} from '@loopback/core';
import {
  post, Request, response,Response,
  RestBindings,get, oas,param
} from '@loopback/rest';
import path from 'path';
import {cloudFilesRoutes} from '../config/index.config';
import {filesInterceptor} from '../middleware/multer';
import {cloudinary} from '../services/cloudinary.service';
import {blobservice} from '../services/azure.service';

import {server,azureStorage} from '../config/index.config'
//import {Response} from 'node-fetch';
const fs = require("fs/promises");
export class CargarArchivosController {
  constructor(
    @inject(RestBindings.Http.REQUEST) private req: Request,
    @inject(RestBindings.Http.RESPONSE) response: Response
  ) {
  }

  /**
   *
   * @param response
   * @param request
   */
 // @authenticate('admin', 'auxiliar', 'evaluador', 'director')
  @post('/cargar_archivos')
  @intercept(filesInterceptor)
  @response(200, {
    description: 'Subida de Archivos',
    content: {'application/json': {schema: {type: 'object'}}},
  })

  async cargarArchivo(): Promise<String> {
    const { } = this.req.body;

    const {file} = this.req;

    if (file) {
      console.log(file.path);


      const uploadedFile: cloudinary.UploadApiResponse = await cloudinary.v2.uploader.upload(
        file.path,
        {
          resource_type: "auto",
          public_id: `${cloudFilesRoutes.archivos}/${path.basename(
            file.path,
            path.extname(file.path),

          )}` //VER ESTO
        },
      );
      console.log(uploadedFile);

      const archivo = uploadedFile.secure_url;
      console.log(archivo);

      const archivo_public_id = uploadedFile.public_id;

      console.log(file.size);

      return file.filename;


    }

    return ('El archivo no fue posible subirlo');

  }
 // @authenticate('admin', 'auxiliar', 'evaluador', 'director')
  @post('/cargar_archivos_azure')
  @intercept(filesInterceptor)
  @response(200, {
    description: 'Subida de Archivos',
    content: {'application/json': {schema: {type: 'object'}}},
  })

  async cargarArchivoAzure(): Promise<String> {

    const {file} = this.req;
console.log(file);
console.log(1);

    if (file) {
      console.log(file.path);

      const onUploadFile = (err: {message: string | undefined;}, result: {name: any;}) => {
        if (err) throw new Error(err.message);

        fs.unlink(file.path);

        return (result.name);
      };
console.log(file);

      return blobservice.createBlockBlobFromLocalFile(
        azureStorage.containerName,
        file.filename,
        file.path,
        onUploadFile
      );



    }

    return ('El archivo no fue posible subirlo');

  }

  @get('/descargar_archivos_azure/{id}')

  async descargarArchivo(
    @param.path.string('id') ruta: string,
    @inject(RestBindings.Http.RESPONSE) response: Response,
  ): Promise<any> {
    try {
      ruta = ruta.trim();

      const getFile = () =>
        new Promise((resolve, reject) => {
          blobservice.getBlobToLocalFile(
            azureStorage.containerName,
            ruta,
            path.resolve(__dirname, `../../temp/${ruta}`),
            (err: any) => {
              if (err) return reject(false);
              return resolve(true);
            },
          );
        });

      await getFile();

      const onSendFile = (err: {message: string | undefined}) => {
        if (err) throw new Error(err.message);
        fs.unlink(path.resolve(__dirname, `../../temp/${ruta}`));
      };

      response.download(
        path.resolve(__dirname, `../../temp/${ruta}`),
        onSendFile,
      );
      return response;
    } catch {
      return 'El archivo no fue posible subirlo';
    }
  }
}


//solucion de Github
