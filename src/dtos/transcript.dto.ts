

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
    studentSex: string;
    studentSsn: string;
    studentContacts: string;

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
    earnedCredits: number;

    // Term Information
    terms: TermDto[] | string;
}

export class HighSchoolTranscriptDto extends TranscriptDto {

    studentStateId: string;

    // Grade and Credit Information
    gpaUnweighted: number;
    totalPoints: string;
    totalPointsUnweighted: string;
    classRank: string;

    // High School Information
    schoolDistrict: string;
    schoolDistrictPhone: string;
    schoolAccreditation: string;
    schoolCeebCode: string;
    schoolPrincipal: string;
    schoolPrincipalPhone: string;

    endorsements: string;
    mathRigor: string;

    cirriculumProgram: string;
    reqirementsRemaining: string;
    workExperience: string;
    achievements: string;

    tests: TestDto[];
    creditSummary: CreditRequirementDto[];
    ctePrograms: CteProgramDto[];
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
    termGpa: number;
    termUnweightedGpa: number;
}

export class CollegeTermDto extends TermDto {
    termSeason: string;
    academicStanding: string;
}

export class CourseDto {
    courseCode: string;
    courseTitle: string;

    grade: string; // Also displayed as "Mark" on some transcripts

    creditEarned: number;
    gradePoints: string;

    transfer: boolean;
    inProgress: boolean;
    flags: string[];
}

export class HighSchoolCourseDto extends CourseDto {
    courseWeight: number;
    gradePointsUnweighted: string;
}

export class CollegeCourseDto extends CourseDto {
    hoursPossible: number;
    hoursEarned: number;

    repeat: boolean;
}

export class TestDto {
    testTitle: string;
    testScore: string;
    testDate: string;
}

export class CreditRequirementDto {
    creditSubject: string;
    creditAttempted: string;
    creditEarned: string;
    creditRequired: string;
    creditRemaining: string;
}

export class CteProgramDto {
    programTitle: string;
    studentStatus: string;
}
