export class FileDetails {
  constructor(
    public content_type: string,
    public created_at: string,
    public frames: null | any[],
    public height: number,
    public width: number
  ) {}
}

export class FileItem {
  constructor(
    public delete_token: string,
    public details: FileDetails,
    public file: string
  ) {}
}

export class UploadImageResponse {
  constructor(public files: FileItem[], public msg: string) {}
}
