// base-controller>src>ping>ping.controller.ts

// --- CLEANED IMPORTS ---
import { Controller, Get, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { PingService } from './ping.service';

// --- ADDED CONTROLLER PATH ---
@Controller('ping')
export class PingController {
  constructor(private readonly pingService: PingService) {}

  /**
   * --- REWRITTEN POST METHOD ---
   * No longer uses @Res() so Nest can handle the response.
   * @HttpCode(200) explicitly sets the status code.
   * The route is now POST /ping
   */
  @Post()
  @HttpCode(HttpStatus.OK)
  ping(@Body() data: any): string {
    console.log('Ping controller received data:', data);
    return 'OK';
  }

  /**
   * --- REWRITTEN GET METHOD ---
   * Renamed from 'pingGet' to 'getConnections' for clarity.
   * Simplified the return statement.
   * The route is now GET /ping/connections
   */
  @Get('connections')
  @ApiResponse({ status: 200, description: 'The request has succeeded.' })
  async getConnections(): Promise<any> {
    return this.pingService.getConnections();
  }
}