

export class TranscriptDto {

}

export class HighSchoolTranscriptDto extends TranscriptDto {
    
    // Raw transcript data, may be a PDF, XML, etc.
    originalTranscript: string;

    transcriptDate: string;

    // Student Information
    studentId: string;
    studentFullName: string;
    studentBirthDate: string;
    studentAddress: string;
    studentPhone: string;
    studentSsn: string;
    emergencyContactName: string;
    emergencyContactPhone: string;
    studentGraduationDate: string;
    studentProgram: string;

    // Grade and Credit Information
    gpa: number;
    weightedGpa: number;
    studentClassRank: string;
    totalPoints: number;
    weightedTotalPoints: number;
    totalCredits: number;
    potentialCredits: number;

    // School Information
    schoolName: string;
    schoolAddress: string;
    schoolContactName: string;
    schoolContactPhone: string;
    schoolDistrict: string;
    schoolId: string;
    schoolGradeLevels: string;

    // Term Information
    terms: TermDto[];

    other: any;
}

export class CollegeTranscriptDto extends TranscriptDto {

}

export class TermDto {
    // Term Information

    studentGradeLevel: string;
    academicStanding: string;

    sessionSeason: string;
    sessionYear: string;

    transferTerm: boolean;
    transferSchool: string;

    // Course Information
    courses: CourseDto[];

    other: any;
}

export class CourseDto {
    courseCode: string;
    courseTitle: string;
    repeat: boolean;

    grade: string;
    
    hoursPossible: number; // College
    hoursEarned: number; // College

    pointsEarned: number;
    weightedPointsEarned: number; // High School

    sessionStartDate: string;
    sessionEndDate: string;

    other: any;
}
