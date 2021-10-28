// Uncomment these imports to begin using these cool features!

// import {inject} from '@loopback/core';

import multer from 'multer';
import {inject} from '@loopback/core';
import {
  HttpErrors,
  post,
  Request,
  requestBody,
  Response,
  RestBindings
} from '@loopback/rest';
import path from 'path';
import {keys as llaves} from '../config/keys';


export class CargarArchivosController {
  constructor() { }


  /**
   *
   * @param response
   * @param request
   */
  @post('/CargarArchivo', {
    responses: {
      200: {
        content: {
          'application/json': {
            schema: {
              type: 'object',
            },
          },
        },
        description: 'Función de carga de archivos.',
      },
    },
  })

  async cargarArchivo(
    @inject(RestBindings.Http.RESPONSE) response: Response,
    @requestBody.file() request: Request,
  ): Promise<object | false> {
    const rutaComprobantePago = path.join(__dirname, llaves.carpeta_Archivos);
    let res = await this.SubirArchivoPlano(rutaComprobantePago, llaves.nombre_campo_archivo, request, response, llaves.extenciones_archivos);
    if (res) {
      if (response.req.file) {
        const nombre_archivo = response.req?.file.filename;
        if (nombre_archivo) {
          return {filename: nombre_archivo};
        }
      }

    }
    return res;
  }

  /**
       * store the file in a specific path
       * @param storePath
       * @param request
       * @param response
       */
  private SubirArchivoPlano(storePath: string, fieldname: string, request: Request, response: Response, acceptedExt: string[]): Promise<object> {
    return new Promise<object>((resolve, reject) => {
      const storage = this.GetMulterStorageConfig(storePath);
      const upload = multer({
        storage: storage,
        fileFilter: function (req: any, file: any, callback: any) {
          var ext = path.extname(file.originalname).toUpperCase();
          if (acceptedExt.includes(ext)) {
            return callback(null, true);
          }
          return callback(new HttpErrors[400]('El formato del archivo plano no es valido.'));
        },
        limits: {
          //fileSize: llaves.tamMaxImagenProyecto//LIMITE DEL PDF
        }
      },
      ).single(fieldname);
      upload(request, response, (err: any) => {
        if (err) {
          reject(err);
        }
        resolve(response);
      });
    });
  }

  /**
   * Return a config for multer storage
   * @param path
   */
   private GetMulterStorageConfig(path: string) {
    var filename: string = '';
    const storage = multer.diskStorage({
      destination: function (req: any, file: any, cb: any) {
        cb(null, path)
      },
      filename: function (req: any, file: any, cb: any) {
        filename = `${Date.now()}-${file.originalname}`
        cb(null, filename);
      }
    });
    return storage;
  }
}
