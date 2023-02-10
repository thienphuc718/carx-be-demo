import { FolderEnum } from "../enum/FileEnum";
import { FileObject } from "./FileType";

export interface IFileService {
  upload(file: Express.Multer.File, folder: FolderEnum): Promise<FileObject>;
  uploadLocalHostFile(filePath: string): Promise<FileObject>;
  uploadLocalHostFileWithCustomFileName(filePath: string, fileName: string): Promise<FileObject>;
}

export const IFileService = Symbol('IFileService');
