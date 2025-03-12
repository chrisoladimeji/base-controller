interface Student {
    studentIdCred: {
      firstName: string;
      middleName: string;
      lastName: string;
      fullName: string;
      studentNumber: string;
    };
    studentCumulativeTranscript: any;
    courseTranscript: Object[];
  }

  export default Student;