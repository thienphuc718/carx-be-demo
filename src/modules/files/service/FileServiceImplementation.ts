import { Injectable } from '@nestjs/common';
import * as S3 from 'aws-sdk/clients/s3';
import * as crypto from 'crypto';
import { FolderEnum } from '../enum/FileEnum';
import { IFileService } from './FileServiceInterface';
import { FileObject } from './FileType';
import * as fs from "fs";
import * as path from 'path';

function hashingMd5FileName(filename) {
  return crypto
    .createHash('md5')
    .update(filename + Date.now())
    .digest('hex');
}

@Injectable()
export class FileServiceImplementation implements IFileService {
  private s3: S3;
  constructor() {
    this.s3 = new S3({
      accessKeyId: 'AKIA55QWKTD4RBJRKGMI',
      secretAccessKey: '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',
      region: 'ap-southeast-1',
    });
  }

  private uploadFolder(folder: FolderEnum) {
    return folder + '/';
  }

  private uploadS3Bucket(
    file: Express.Multer.File,
    folder: FolderEnum,
  ): Promise<FileObject> {
    const params = {
      Bucket: 'carx',
      Key:
        '/' +
        hashingMd5FileName(file.originalname + Date.now()) +
        `.${file.mimetype.split('/')[1]}`,
      Body: file.buffer,
      ContentType: file.mimetype,
      // ACL: FilePermission.PUBLIC_READ,
    };
    return this.s3.upload(params).promise();
  }

  public upload(
    file: Express.Multer.File,
    folder: FolderEnum,
  ): Promise<FileObject> {
    return this.uploadS3Bucket(file, folder);
  }

  public async uploadLocalHostFile(
    filePath: string
  ): Promise<FileObject> {
    try {
      const data = await fs.readFileSync(filePath);
      const params = {
        Bucket: 'carx',
        Key: FolderEnum.FILE + '/' + hashingMd5FileName(filePath.replace(/^.*[\\\/]/, '')) + path.extname(filePath),
        Body: data,
      };
      return this.s3.upload(params).promise();
    } catch (error) {
      throw error;
    }
  }

  public async uploadLocalHostFileWithCustomFileName(
    filePath: string,
    fileName: string,
  ): Promise<FileObject> {
    try {
      const data = await fs.readFileSync(filePath);
      const params = {
        Bucket: 'carx',
        Key: FolderEnum.FILE + '/' + fileName + path.extname(filePath),
        Body: data,
      };
      return this.s3.upload(params).promise();
    } catch (error) {
      throw error;
    }
  }
}
