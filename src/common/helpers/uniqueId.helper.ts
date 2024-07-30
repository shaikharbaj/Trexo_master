import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { PrismaService } from 'src/modules/prisma/prisma.service';

@Injectable()
export class UniqueIdHelper {
  constructor(private prismaService: PrismaService) {}

  public async generateUniqueId(slug: string) {
    // const data = await this.prismaService.serialNumberConfiguration.findFirst({
    //   where: { slug: slug },
    // });
    const data = null;
    if (!data) {
      throw new RpcException('Error while generating unique id');
    }
    await this.incrementUniqueId(data.id, data.current_value);
    return data.current_value;
  }

  public async incrementUniqueId(id: number, currentValue: bigint) {
    let incrementedCurrentValue = currentValue + 1n;
    // await this.prismaService.serialNumberConfiguration.update({
    //   where: { id: id },
    //   data: { current_value: incrementedCurrentValue },
    // });
  }
}
