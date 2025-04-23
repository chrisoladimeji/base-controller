import { Injectable } from "@nestjs/common";
import * as Zip from 'adm-zip';
import * as Pdf from 'pdf-parse';
import * as fs from 'fs';
import * as path from "path";
import { PDFDocument } from 'pdf-lib';


const uploadDir = './uploads';

@Injectable()
export class PdfLoaderService {

    static async getZipFilePath(): Promise<string | null> {
        const files = fs.readdirSync(uploadDir);
        const zipFile = files.find((file) => file.endsWith('.zip'));
        return zipFile ? path.join(uploadDir, zipFile) : null;
    }

    static async extractPdfs(zipPath: string): Promise<Buffer[]> {
        const zip = new Zip(zipPath);
        return zip.getEntries()
            .filter(e => e.entryName.endsWith('.pdf'))
            .map(e => e.getData());
    }

    static async splitPdfByTranscripts(pdfBuffer: Buffer, delimiter: string): Promise<Buffer[]> {
        const doc = await PDFDocument.load(pdfBuffer);
        const totalPages = doc.getPageCount();

        const starts: number[] = [];
        for (let i = 0; i < totalPages; i++) {
            const singlePagePdf = await PDFDocument.create();
            const [copiedPage] = await singlePagePdf.copyPages(doc, [i]);
            singlePagePdf.addPage(copiedPage);
            const pageBytes = await singlePagePdf.save();
            const text = (await Pdf(Buffer.from(pageBytes))).text;

            if (text.includes(delimiter)) {
                starts.push(i);
            }
        }

        const transcriptBuffers: Buffer[] = [];
        for (let i = 0; i < starts.length; i++) {
            const start = starts[i];
            const end = starts[i + 1] ?? totalPages;
            const newDoc = await PDFDocument.create();
            const copiedPages = await newDoc.copyPages(doc, Array.from({ length: end - start }, (_, j) => start + j));
            copiedPages.forEach(p => newDoc.addPage(p));
            transcriptBuffers.push(Buffer.from(await newDoc.save()));
        }

        return transcriptBuffers;
    }

    static stringAfterField(pdfText: string[], fieldName: string, occurrence: number = 0): string | null {
        let count = 0;
        
        // Loop through the array to find the field
        for (const str of pdfText) {
            if (str.startsWith(fieldName)) {
                // Keep scanning if we are looking for a later occurrence
                if (count < occurrence) {
                    count++;
                    continue;
                }
                
                // If this is not the first match (or skipFirst is false), handle the value extraction
                const match = str.match(new RegExp(`${fieldName}\\s*[:\\s]*([\\s\\S]*)`));

                if (match) {
                    const value = match[1].trim();
                    // Return null if the value is empty (or just a colon)
                    return value === "" ? null : value;
                }
            }
        }
    
        // If the field is not found or there's no value, return null
        return null;
    }
}
