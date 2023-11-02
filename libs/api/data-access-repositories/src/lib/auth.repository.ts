import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Auth } from '@moreloja/api/data-access-models';

@Injectable()
export class AuthRepository {
  constructor(@InjectModel(Auth.name) private authModel: Model<Auth>) {}

  async findUser(): Promise<Auth | null> {
    return await this.authModel.findOne().exec();
  }

  async createUser(password: string, twoFactorSecret: string): Promise<void> {
    const user = new this.authModel({
      password: password,
      twoFactorSecret: twoFactorSecret,
    });
    await user.save();
  }

  async updatePassword(password: string): Promise<void> {
    const updateOperation = {
      $set: { password: password },
    };
    await this.authModel.updateOne({}, updateOperation);
  }

  async updateTwoFactorSecret(twoFactorSecret: string): Promise<void> {
    const updateOperation = {
      $set: { twoFactorSecret: twoFactorSecret },
    };
    await this.authModel.updateOne({}, updateOperation);
  }

  async updateRefreshToken(refreshTokenHash: string): Promise<void> {
    const updateOperation = {
      $set: { refreshTokenHash: refreshTokenHash },
    };
    await this.authModel.updateOne({}, updateOperation);
  }
}
