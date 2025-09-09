export class HttpError extends Error {
    constructor(public status: number, message: string) {
        super(message);
        this.name = "HttpError";
    }
}

export class FileUploadError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "FileUploadError";
    }
}
