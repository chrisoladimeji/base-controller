import { ConfigService } from "@nestjs/config";
import { SisLoaderService } from "./loaders/sisLoader.service";
import { SisController } from "./sis.controller";
import { SisService } from "./sis.service";
import { StudentsService } from "./students/students.service";
import { mock } from "node:test";


describe('SisController', () => {

    let studentsService: StudentsService;
    let loaderService: SisLoaderService;
    let configService: ConfigService;
    let sisController: SisController;
    let sisService: SisService;

    beforeEach(() => {

    })


})