import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

// AppController handles incoming requests and returns responses
// endpoint: GET / maps to localhost:3000/api/
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  @Get()
  getData() {
    return this.appService.getData();
  }
  //test endpoint to check if the API is running
  @Get('health')
  getHealth() {
    return this.appService.getHealth();
  }


}
