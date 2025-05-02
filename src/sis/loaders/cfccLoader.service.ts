import { HttpService } from "@nestjs/axios";
import { StudentIdDto } from "../../dtos/studentId.dto";
import { TranscriptDto } from "../../dtos/transcript.dto";
import { EllucianService } from "../../ellucian/ellucian.service";
import { SisLoaderService } from "./sisLoader.service";
import { firstValueFrom } from "rxjs";
import * as sharp from "sharp";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class CfccLoaderService extends SisLoaderService {

    constructor(
            private readonly configService: ConfigService,
            private readonly httpService: HttpService,
            private readonly ellucianService: EllucianService,
        ) {
            super();
        };
    
    async load(): Promise<void> {
        console.log("This loader service does not implement an initial batch load");
        return null;
    }

    async getStudentId(studentNumber: string): Promise<StudentIdDto> {
        let studentId: StudentIdDto = await this.ellucianService.getStudentId(studentNumber);
        studentId.studentPhoto = await this.getStudentPhoto(studentNumber);
        return studentId;
    }


    async getStudentTranscript(studentNumber: string): Promise<TranscriptDto> {
        return this.ellucianService.getStudentTranscript(studentNumber);
    }

    async getStudentPhoto(studentNumber: string): Promise<string> {
        const imageServerBaseUrl = this.configService.get("PHOTOID_BASE_URL");
        const imageFileType = this.configService.get("PHOTOID_FILE_TYPE")
        const imageUrl = `${imageServerBaseUrl}/${studentNumber}.${imageFileType}`

        let response;
        try {
            response = await firstValueFrom(this.httpService.get(
                imageUrl,
                {
                    headers: {
                        "Accept": "image/*",
                        "Content-Type": "image/*"
                    },
                    responseType: "arraybuffer"
                }
            ));
        }
        catch (err) {
            console.error(`Error fetching photo for student ${studentNumber} from ${imageUrl}:`, err);
        }
        if (!response) {
            console.error("No image data found for student: ", studentNumber);
        }
        const rawPhotoBuffer = Buffer.from(response.data);

        const compressedPhotoBuffer = await sharp(rawPhotoBuffer)
            .resize(256)
            .webp({ quality: 50 })
            .toBuffer();

        return compressedPhotoBuffer.toString("base64");
    }
}
