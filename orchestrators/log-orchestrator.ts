import * as CloudinaryGateway from "../gateways/cloudinary-gateway";
import { Logger } from "../utils/logger";

export function uploadLogFiles(logger: Logger) {
    const fileNames = logger.getFileNames();
    for (let fileName of fileNames) {
        CloudinaryGateway.uploadFile(fileName);
    }
};