import { StudentIdDto } from "src/dtos/studentId.dto";
import { TranscriptDto } from "src/dtos/transcript.dto";

export abstract class SisLoaderService {
    abstract load(): Promise<void>;

    abstract getStudentId(studentNumber: string): Promise<StudentIdDto>;
    abstract getStudentTranscript(studentNumber: string): Promise<TranscriptDto>;
}
