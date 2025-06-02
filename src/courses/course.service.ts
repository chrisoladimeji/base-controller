import { Injectable } from '@nestjs/common';

@Injectable()
export class CourseService {
  private courses = []; // Optionally define a type if available

  getCourseInfo(courseTitle: string, courseCode: string) {
    const course = this.courses.find(
      (c) => c.name.toLowerCase() === courseTitle.toLowerCase()
    );

    if (!course) {
      return {
        error: `Course with title "${courseTitle}" not found.`,
      };
    }

    return {
      name: course.name,
      description: course.description,
      university: course.university,
      abilities: course.Matches?.Abilities || [],
      skills: course.Matches?.Skills || [],
      techAndTools: course.Matches?.TechAndTools || [],
      knowledge: course.Matches?.Knowledge || [],
    };
  }
}
