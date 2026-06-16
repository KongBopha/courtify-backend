export class AuthResponseDto {
  access_token: string;
  refresh_token?: string;
  message: string;
  statusCode: number;
  user: {
    id: number;
    email: string;
    fullname: string;
  };
}
