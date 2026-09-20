import { Controller, Get } from '@nestjs/common';

@Controller()
export class InvitationController {
  @Get('/invitation')
  async getIntivation() {
    return 'okkk';
  }
}
