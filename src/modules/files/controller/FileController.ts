import {
  Body,
  Controller,
  HttpStatus,
  Inject,
  Post,
  Res,
  UploadedFile,
  UploadedFiles,
  UseInterceptors
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiTags, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { BaseController } from '../../../BaseController';
import { IFileService } from '../service/FileServiceInterface';
import * as express from 'express';

import { Result } from '../../../results/Result';
import { FolderEnum } from '../enum/FileEnum';

@ApiTags('Files')
@Controller('/v1/files')
export class FileController extends BaseController {
  constructor(
    @Inject(IFileService)
    private readonly fileService: IFileService,
  ) {
    super();
  }

  @Post('/multiple-upload')
  @UseInterceptors(FilesInterceptor('files'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        }
      },
      required: ['files']
    },
  })
  @ApiOperation({ summary: 'Upload Files' })
  async uploadFiles(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Res() response: express.Response
  ) {
    try {
      let urls = [];
      for(let i = 0; i < files.length; i++) {
        let data = await this.fileService.upload(files[i], FolderEnum.FILE);
        urls.push(data.Location);
      }
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        message: 'Upload files successfully',
        urls: urls
      });
      return this.ok(response, result.value);
    } catch (error) {
      const err = Result.fail({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      });
      return this.fail(response, err.error);
    }
  }

  @Post('/upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        }
      },
      required: ['file']
    },
  })
  @ApiOperation({ summary: 'Upload File' })
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Res() response: express.Response,
    @Body() folder: FolderEnum
  ) {
    try {
      let fileUpload = await this.fileService.upload(file, FolderEnum.FILE);
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        message: 'Upload file successfully',
        url: fileUpload.Location
      });
      return this.ok(response, result.value);
    } catch (error) {
      const err = Result.fail({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      });
      return this.fail(response, err.error);
    }
  }
}
