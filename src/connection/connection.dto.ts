import { IsString, IsDateString, IsUUID, IsOptional } from 'class-validator';

export class ConnectionDto {
  @IsString()
  state: string;

  @IsDateString()
  created_at: string;

  @IsDateString()
  updated_at: string;

  @IsUUID()
  connection_id: string;

  @IsString()
  my_did: string;

  @IsString()
  their_did: string;

  @IsString()
  their_label: string;

  @IsString()
  their_role: string;

  @IsString()
  connection_protocol: string;

  @IsString()
  rfc23_state: string;

  @IsString()
  invitation_key: string;

  @IsString()
  accept: string;

  @IsString()
  invitation_mode: string;

  @IsString()
  @IsOptional()
  alias?: string;
}
