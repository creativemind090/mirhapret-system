import {
  Controller,
  Post,
  Delete,
  Put,
  UseGuards,
  Param,
  Body,
  BadRequestException,
} from '@nestjs/common';
import { IsString, IsOptional } from 'class-validator';
import { CloudinaryService } from './cloudinary.service';
import { UpdateImageDto } from './dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Roles } from '../../common/decorators/roles.decorator';

class UploadBase64Dto {
  @IsString()
  data: string; // base64 data URL e.g. "data:image/jpeg;base64,..."

  @IsString()
  @IsOptional()
  folder?: string;
}

@Controller('images')
@UseGuards(JwtAuthGuard)
@Roles('admin', 'super_admin', 'store_manager')
export class CloudinaryController {
  constructor(private cloudinaryService: CloudinaryService) {}

  @Post('upload')
  async uploadImage(@Body() body: UploadBase64Dto) {
    if (!body.data) {
      throw new BadRequestException('No image data provided');
    }
    const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    const mimeMatch = body.data.match(/^data:([^;]+);base64,/);
    if (!mimeMatch || !allowedMimes.includes(mimeMatch[1])) {
      throw new BadRequestException('Only JPEG, PNG, WebP, and GIF images are allowed');
    }

    const folder = body.folder || 'ecommerce';
    const result = await this.cloudinaryService.uploadBase64(body.data, folder);

    return {
      message: 'Image uploaded successfully',
      data: result,
    };
  }

  @Delete(':publicId')
  async deleteImage(@Param('publicId') publicId: string) {
    await this.cloudinaryService.deleteImage(publicId);
    return { message: 'Image deleted successfully' };
  }

  @Put(':publicId')
  async updateImage(
    @Param('publicId') publicId: string,
    @Body() updateImageDto: UpdateImageDto,
  ) {
    const result = await this.cloudinaryService.updateImage(publicId, updateImageDto);
    return {
      message: 'Image updated successfully',
      data: result,
    };
  }
}
