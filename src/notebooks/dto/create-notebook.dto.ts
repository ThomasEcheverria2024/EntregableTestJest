import { IsNotEmpty, IsString } from 'class-validator';

export class CreateNotebookDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;
}
