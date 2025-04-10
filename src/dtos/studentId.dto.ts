import { IsDefined, IsNotEmpty } from "class-validator";


export class StudentIdDto {

    // Credential fields
    @IsNotEmpty()
    expiration: string;

    // Student ID fields
    @IsNotEmpty()
    studentNumber: string;

    @IsNotEmpty()
    studentFullName: string;

    studentBirthDate: string;
    
    studentContactName: string;
    
    studentContactPhone: string;

    studentPhoto: File;

    // Student registration fields
    program: string;
    
    gradeLevel: string;
    
    graduationDate: string;

    @IsNotEmpty()
    // School ID fields
    schoolName: string;
    
    schoolContact: string;
    
    schoolPhone: string;

    // Barcode fields
    barcodeType: string;
    
    barcode: string;
    
    qrCode: string;
}