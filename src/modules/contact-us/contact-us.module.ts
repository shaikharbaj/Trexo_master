import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ContactUsController } from './contact-us.controller';
import { ContactUsService } from './contact-us.service';
import { ContactUsRepository } from './repository/contact-us.repository';
import { ContactUsReplyRepository } from './repository';

@Module({
    imports: [PrismaModule],
    controllers: [ContactUsController],
    providers: [ContactUsService, ContactUsRepository, ContactUsReplyRepository],
    exports: [ContactUsService]
})
export class ContactUsModule { }
