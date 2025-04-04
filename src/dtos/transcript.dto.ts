

export class HighSchoolTranscriptDto {
    
    // The full transcript if they can't send labeled data, may be a PDF
    studentTranscript: string;

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

    cumulativeGpa: number;
    weightedCumulativeGpa: number;
    cumulativeCreditsEarned: number;
    weightedCumulativeCreditsEarned: number;

    studentClassRank: string;

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