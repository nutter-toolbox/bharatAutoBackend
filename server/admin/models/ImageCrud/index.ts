import * as fs from "fs";
import * as path from "path";
import { ERROR_MESSAGE } from "admin/constants";

export class ImageCrud {
    private uploadDir: string;

    constructor() {
        // Set the upload directory to the root-level "uploads" folder
        this.uploadDir = path.resolve("uploads"); // Resolve path to the root of the project
    }

    async uploadImage(imageData: Buffer, fileName: string, type: string) {
        try {
            // Define the sub-folder based on type (staff or star)
            const folderPath = path.join(this.uploadDir, type);

            // Ensure the directory exists (create it if it doesn't exist)
            if (!fs.existsSync(folderPath)) {
                fs.mkdirSync(folderPath, { recursive: true });
            }

            // Define the full file path where the image will be saved (within the appropriate folder)
            const filePath = path.join(folderPath, `${fileName}.jpg`);

            // Write the image data to the local file system
            await new Promise<void>((resolve, reject) => {
                fs.writeFile(filePath, imageData, (err) => {
                    if (err) reject(err);
                    else resolve();
                });
            });

            // Return the relative path (folder + file name) to store in the database
            return `/uploads/${type}/${fileName}.jpg`; // Relative path
        } catch (err) {
            throw new Error(ERROR_MESSAGE.INTERNAL_SERVER_ERROR);
        }
    }

    async uploadMultipleImages(images: Buffer[], fileName: string, type: string) {
        try {
            // Define the sub-folder based on type (staff or star)
            const folderPath = path.join(this.uploadDir, type);

            // Ensure the directory exists (create it if it doesn't exist)
            if (!fs.existsSync(folderPath)) {
                fs.mkdirSync(folderPath, { recursive: true });
            }

            let fileNames: string[] = [];

            for (let i = 0; i < images.length; i++) {
                const filePath = path.join(folderPath, `${fileName}-${i}.jpg`);

                // Write each image to the file system
                await new Promise<void>((resolve, reject) => {
                    fs.writeFile(filePath, images[i], (err) => {
                        if (err) reject(err);
                        else resolve();
                    });
                });

                fileNames.push(`/uploads/${type}/${fileName}-${i}.jpg`); // Store only the relative path
            }
            return fileNames;
        } catch (err) {
            throw new Error(ERROR_MESSAGE.INTERNAL_SERVER_ERROR);
        }
    }

    async updateImage(oldFileName: string, imageData: Buffer, newFileName: string, type: string) {
        try {
            // Define the sub-folder based on type (staff or star)
            const folderPath = path.join(this.uploadDir, type);

            // Ensure the directory exists (create it if it doesn't exist)
            if (!fs.existsSync(folderPath)) {
                fs.mkdirSync(folderPath, { recursive: true });
            }

            // Delete the old image
            const oldFilePath = path.join(folderPath, oldFileName);
            if (fs.existsSync(oldFilePath)) {
                fs.unlinkSync(oldFilePath);
            }

            // Save the new image
            const newFilePath = path.join(folderPath, newFileName);
            await new Promise<void>((resolve, reject) => {
                fs.writeFile(newFilePath, imageData, (err) => {
                    if (err) reject(err);
                    else resolve();
                });
            });

            // Return the relative path of the new image
            return `/uploads/${type}/${newFileName}`; // Relative path
        } catch (err) {
            throw new Error(ERROR_MESSAGE.INTERNAL_SERVER_ERROR);
        }
    }

    async getImage(fileName: string, type: string) {
        const filePath = path.join(this.uploadDir, type, fileName);
        if (!fs.existsSync(filePath)) {
            throw new Error("Image not found");
        }
        // Return just the relative file path (used to reference the image in the database)
        return `/uploads/${type}/${fileName}`;
    }

    async deleteImage(fileName: string, type: string) {
        const filePath = path.join(this.uploadDir, type, fileName);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
        return true;
    }
}

