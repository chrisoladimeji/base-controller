

export class TranscriptDto {
    
    // The full transcript if they can't send labeled data, may be a PDF
    studentTranscript: string;

    studentFullName: string;
    studentSsn: string;
    studentBirthDate: string;
    studentAddress: string;
    studentPhone: string;
    
    emergencyContactName: string;
    emergencyContactPhone: string;

    studentGraduationDate: string;
    studentProgram: string;

    studentCumulativeGpa: number;
    studentCumulativeCreditsEarned: number;

    schoolName: string;
    schoolAddress: string;
    schoolContactName: string;
    schoolContactPhone: string;
    schoolDistrict: string;

    courses: CourseDto[];

    other: any;
}

export class CourseDto {
    courseCode: string;
    courseTitle: string;

    studentGradeLevel: string;

    grade: string;

    pointsPossible: number;
    pointsEarned: number;
    weightedPointsEarned: number;

    sessionStartDate: string;
    sessionEndDate: string;

    sessionSeason: string;
    sessionYear: string;

    other: any;
}