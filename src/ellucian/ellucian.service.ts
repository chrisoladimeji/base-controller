import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { map } from 'rxjs/operators';
import { RedisService } from '../services/redis.service';
import { jwtDecode } from 'jwt-decode';
import { StudentIdDto } from 'src/dtos/studentId.dto';
import { SisLoaderService } from 'src/sis/loaders/sisLoader.service';
import { TranscriptDto } from 'src/dtos/transcript.dto';


@Injectable()
export class EllucianService extends SisLoaderService {
  private accessToken: string = '';
  private apiUrl: string;
  private authUrl: string;

  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
    private redisService: RedisService
  ) {
    super();
    const baseUrl = this.configService.get<string>('ELLUCIAN_BASE_API_URL');
    const authRoute = this.configService.get<string>('ELLUCIAN_AUTH_ROUTE');
    this.authUrl = `${baseUrl}${authRoute}`;
    this.apiUrl = baseUrl;
  }

  // Ellucian had not specified a load procedure
  async load(): Promise<void> {}


  async getAccessToken(): Promise<void> {
    const tokenKey = 'accessToken';
    const expiryKey = 'tokenExpiry';

    const cachedToken = await this.redisService.get(tokenKey);
    const cachedExpiry = await this.redisService.get(expiryKey);


    if (cachedToken && cachedExpiry && Number(cachedExpiry) > Date.now()) {
      this.accessToken = cachedToken;
      console.log('Using cached access token');
      return;
    }

    console.log(`Fetching new access token from: ${this.authUrl}`);
    let response;
    try {
      response = await firstValueFrom(this.httpService.post(this.authUrl, {}, {
        headers: { Authorization: `Bearer ${this.configService.get<string>('ELLUCIAN_API_KEY')}` }
      }).pipe(map(res => res.data)));
    }
    catch (error) {
      console.log(`Could not fetch access token: ${error}`);
    }

    const decodedToken = jwtDecode(response) as any;
    const currentTime = Date.now();
    const expiresIn = Math.floor((decodedToken.exp * 1000 - currentTime) / 1000);

    await this.redisService.set(tokenKey, response, expiresIn);
    await this.redisService.set(expiryKey, (currentTime + expiresIn * 1000).toString());

    this.accessToken = response;
  }

  async getPerson(studentNumber: string): Promise<any> {
    if (!studentNumber) {
      throw new Error('Student number is required');
    }

    const apiRoute = this.configService.get<string>('ELLUCIAN_PERSON_API_ROUTE', '');
    const criteria = encodeURIComponent(`{"credentials":[{"type":"colleaguePersonId","value":"${studentNumber}"}]}`);
    const url = `${this.apiUrl}${apiRoute}?criteria=${criteria}`;

    try {
      const response = await firstValueFrom(
        this.httpService.get(url, {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        }).pipe(
          map(response => response.data)
        )
      );
      return response;
    } catch (error) {
      console.error('Error fetching student information:', error.response ? error.response.data : error.message);
      throw new Error('Failed to fetch student information');
    }
  }

  private async fetchFromEllucian(url: string): Promise<any> {
    try {
      const response = await firstValueFrom(this.httpService.get(url, {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }

      }));
      return response.data;
    } catch (error) {
      console.error(`Error accessing ${url}:`, error.message);
      throw new Error('Failed to fetch data from Ellucian API');
    }
  }


  async getStudentTranscriptGrades(studentGuid: string): Promise<any> {
    const apiRoute = this.configService.get<string>('ELLUCIAN_TRANSCRIPT_API_ROUTE', '');
    const url = `${this.apiUrl}${apiRoute}?criteria={"student":{"id":"${studentGuid}"}}`;
    return this.fetchFromEllucian(url);
  }


  async getStudent(studentGuid: string): Promise<any> {
    const apiRoute = this.configService.get<string>('ELLUCIAN_STUDENT_API_ROUTE', '');
    const url = `${this.apiUrl}${apiRoute}?criteria={"person":{"id":"${studentGuid}"}}`;
    return this.fetchFromEllucian(url);
  }

  async getCourseIdBySection(sectionId: string): Promise<any> {
    const apiRoute = this.configService.get<string>('ELLUCIAN_SECTIONS_API_ROUTE', '');
    const url = `${this.apiUrl}${apiRoute}/${sectionId}`;
    return this.fetchFromEllucian(url);
  }

  async getCourse(courseId: string): Promise<any> {
    const apiRoute = this.configService.get<string>('ELLUCIAN_COURSES_API_ROUTE', '');
    const url = `${this.apiUrl}${apiRoute}/${courseId}`;
    return this.fetchFromEllucian(url);
  }

  async getAcademicPeriod(academicPeriodId: string): Promise<any> {
    const apiRoute = this.configService.get<string>('ELLUCIAN_ACADEMIC_PERIOD_API_ROUTE', '');
    const url = `${this.apiUrl}${apiRoute}/${academicPeriodId}`;
    return this.fetchFromEllucian(url);
  }

  async getGradeDefinition(gradeDefinitionId: string): Promise<any> {
    const apiRoute = this.configService.get<string>('ELLUCIAN_ACADEMIC_GRADE_DEF_API_ROUTE', '');
    const url = `${this.apiUrl}${apiRoute}/${gradeDefinitionId}`;
    return this.fetchFromEllucian(url);
  }

  async getStudentGradePointAverages(studentGuid: string): Promise<any> {
    const apiRoute = this.configService.get<string>('ELLUCIAN_GRADE_POINT_AVERAGE_API_ROUTE', '');
    const url = `${this.apiUrl}${apiRoute}?criteria={"student":{"id":"${studentGuid}"}}`;
    return this.fetchFromEllucian(url);
  }

  async getStudentId(studentNumber: string) {
    await this.getAccessToken();
    const person = await this.getPerson(studentNumber);
    if (!person || !person.length) {
      throw new HttpException('Student not found', HttpStatus.NOT_FOUND);
    }

    console.log(person);

    let studentId = new StudentIdDto();
    studentId.studentNumber = person[0].studentsId?.studentsId ?? null;
    studentId.studentFullName = person[0].names[0]?.fullName ?? null;
    studentId.studentBirthDate = person[0].dateOfBirth ?? null;
    studentId.studentPhone = person[0].phones[0]?.number ?? null;
    studentId.studentEmail = person[0].emails.find(e => e.preference === "primary")?.address ?? null;

    // student.photo = getStudentPhoto();

    return studentId;
  }

  async getStudentTranscript(studentNumber: string): Promise<TranscriptDto> {
    return null;
  }
}