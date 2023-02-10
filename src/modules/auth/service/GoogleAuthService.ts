import { Inject, Injectable } from '@nestjs/common';
import { google, Auth } from 'googleapis';
import { UserModel } from '../../../models';
import { CreateSocialUserDto } from '../../users/dto/UserDto';
import { IUserService } from '../../users/service/UserServiceInterface';
import { GoogleAuthTokenDto } from '../dto/AuthDto';

const scopes = [
  'https://www.googleapis.com/auth/userinfo.profile',
  'https://www.googleapis.com/auth/userinfo.email',
];

interface GoogleAuthResponse {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class GoogleAuthService {
  private client: Auth.OAuth2Client;
  constructor(@Inject(IUserService) private userService: IUserService) {
    this.client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      // `${process.env.DOMAIN}/api/v1/auth/google-sign-in`,
    );
  }

  // private getAuthUrl(): string {
  //   return this.client.generateAuthUrl({
  //     access_type: 'offline',
  //     prompt: 'consent',
  //     scope: scopes,
  //   });
  // }

  private async getUserData(token: string) {
    const userInfo = google.oauth2('v2').userinfo;
    this.client.setCredentials({ access_token: token });
    const response = await userInfo.get({ auth: this.client });
    return response.data;
  }

  async signInGoogleUser(payload: GoogleAuthTokenDto, schema: string): Promise<UserModel> {
    try {
      const { token } = payload;
      const userData = await this.getUserData(token);

      const params: CreateSocialUserDto = {
        provider: 'google',
        token: token,
        user: {
          email: userData.email,
          gender: userData.gender,
          first_name: userData.given_name,
          last_name: userData.family_name,
          google_user_id: userData.id,
          avatar: userData.picture,
        }
      };
      const createdUser = await this.userService.createSocialUser(params, schema);
      return createdUser;
    } catch (error) {
      throw error;
    }
  }
}
