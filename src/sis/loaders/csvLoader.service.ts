import { Injectable } from "@nestjs/common";
import { SisLoaderService } from "./sisLoader.service";
import { RedisService } from "src/services/redis.service";
import { TranscriptDto } from "src/dtos/transcript.dto";
import { StudentIdDto } from "src/dtos/studentId.dto";

@Injectable()
export class CsvLoaderService extends SisLoaderService {


    private readonly uploadDir = './uploads' // The docker volume where uploads should go
    
        constructor(
            private readonly redisService: RedisService
        ) {
            super();
        };
    
    async load(): Promise<void> {
        
        
    }

    async getStudentId(studentNumber: string): Promise<StudentIdDto> {
        return null;
    }

    async getStudentTranscript(studentNumber: string): Promise<TranscriptDto> {
        return null;
    }

}