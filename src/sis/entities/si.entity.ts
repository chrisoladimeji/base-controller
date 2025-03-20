interface Student {
    studentIdCred: {
      firstName: string;
      middleName: string;
      lastName: string;
      fullName: string;
      studentNumber: string;
    };
    studentTranscript: {
        studentCumulativeTranscript: Object;
        courseTranscript: Object[];
    }
  }

  export default Student;