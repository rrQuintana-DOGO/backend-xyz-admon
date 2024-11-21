import { Injectable, PipeTransform,  BadRequestException } from '@nestjs/common';

@Injectable()
export class CustomFileValidator implements PipeTransform {
  constructor(private readonly allowedTypes: string[], private readonly maxSizeMB: number) { }

  transform(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException({
        message: 'No se ha subido ningún archivo',

        status: 400,
      });
    }

    if (!this.allowedTypes.includes(file.mimetype)) {
      throw new BadRequestException({
        message: `Tipo de archivo no válido. Los tipos permitidos son: ${this.allowedTypes.join(', ')}`,
        status: 400,
      });
    }

    const maxSize = this.maxSizeMB * 1024 * 1024;
    if (file.size > maxSize) {
      throw new BadRequestException({
        message: `El tamaño del archivo excede el límite de ${this.maxSizeMB}MB`,
        status: 400,
      });
    }

    return file;
  }
}