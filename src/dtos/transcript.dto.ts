

export class TranscriptDto {
    // Transcript Metadata
    transcriptDate: string;
    transcriptComments: string;

    // Student Information
    studentNumber: string;
    studentFullName: string;
    studentBirthDate: string;
    studentPhone: string;
    studentEmail: string;
    studentAddress: string;
    studentSsn: string;

    gradeLevel: string;
    graduationDate: string;
    program: string;


    // School Information
    schoolName: string;
    schoolPhone: string;
    schoolAddress: string;
    schoolFax: string;
    schoolCode: string;
    schoolGradeLevels: string;

    // Grade information
    gpa: number; // Weighted GPA for High Schools

    // Term Information
    terms: TermDto[] | string;
}

export class HighSchoolTranscriptDto extends TranscriptDto {

    // Grade and Credit Information
    gpaUnweighted: number;
    classRank: string;

    attemptedCredits: number;
    earnedCredits: number;
    requiredCredits: number;
    remainingCredits: number;

    // High School Information
    schoolDistrict: string;
    schoolAccreditation: string;
    schoolCeebCode: string;
    schoolPrincipal: string;
}

export class CollegeTranscriptDto extends TranscriptDto {

}

export class TermDto {
    // Term Information
    termGradeLevel: string;
    termYear: string;
    termSchoolName: string;

    // Course Information
    courses: CourseDto[];
}

export class HighSchoolTermDto extends TermDto {
    termCredit: number;
    cumulativeGpa: number;
    cumulativeUnweightedGpa: number;
}

export class CollegeTermDto {
    termSeason: string;
    academicStanding: string;
}

export class CourseDto {
    courseCode: string;
    courseTitle: string;

    grade: string; // Also displayed as "Mark" on some transcripts

    creditEarned: number;
}

export class NorthCarolinaCourseDto extends CourseDto {
    courseWeight: number;
    UncRequirement: boolean;
}

export class CollegeCourseDto extends CourseDto {
    hoursPossible: number;
    hoursEarned: number;

    repeat: boolean;
}
