// Uncomment these imports to begin using these cool features!

// import {inject} from '@loopback/core';

import {authenticate} from '@loopback/authentication';
import {inject} from '@loopback/context';
import {intercept} from '@loopback/core';
import {
  post, Request, response,
  RestBindings
} from '@loopback/rest';
import path from 'path';
import {cloudFilesRoutes} from '../config/index.config';
import {filesInterceptor} from '../middleware/multer';
import {cloudinary} from '../services/cloudinary.service';


export class CargarArchivosController {
  constructor(
    @inject(RestBindings.Http.REQUEST) private req: Request,
  ) {
  }

  /**
   *
   * @param response
   * @param request
   */
  @authenticate('admin', 'auxiliar', 'evaluador', 'director')
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

}
//solucion de Github
