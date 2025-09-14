import {
  CreateUserDto,
  LoginDto,
  User,
  UserDto,
  UserRole,
} from '@casino-application/shared';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { compare, hash } from 'bcrypt';
import { Model } from 'mongoose';
import { firstValueFrom, timeout } from 'rxjs';

const SALT_ROUNDS = 10;

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    @Inject('PROMOTION_SERVICE') private readonly promotionService: ClientProxy,
  ) {}

  public async getByLoginCredentials({
    email,
    password,
  }: LoginDto): Promise<User> {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user)
      throw new RpcException({
        statusCode: 404,
        message: 'User not found',
      });

    const isValid = await compare(password, user.password);
    if (!isValid)
      throw new RpcException({
        statusCode: 400,
        message: 'Invalid credentials',
      });

    return user;
  }

  public async getById(id: string): Promise<UserDto> {
    const user = await this.userModel.findById(id).exec();
    if (!user)
      throw new RpcException({
        statusCode: 404,
        message: 'User not found',
      });

    return {
      _id: user._id,
      email: user.email,
      role: user.role,
      balance: user.balance,
    };
  }

  public async create(createUserDto: CreateUserDto): Promise<User> {
    const user = await this.createUser(createUserDto, UserRole.CLIENT);

    firstValueFrom(
      this.promotionService
        .send('promotion_create', {
          title: 'Welcome Bonus',
          description: 'Get 10 EUR on your first login!',
          amount: 10,
          userId: user._id,
        })
        .pipe(timeout(1000)),
    ).catch((err) =>
      Logger.error('Failed to send message to promotion_create', err),
    );

    return user;
  }

  public async createStaff(createUserDto: CreateUserDto): Promise<User> {
    return this.createUser(createUserDto, UserRole.STAFF);
  }

  private async createUser(
    createUserDto: CreateUserDto,
    role: UserRole,
  ): Promise<User> {
    const existingUser = await this.userModel
      .findOne({ email: createUserDto.email })
      .exec();

    if (existingUser !== null)
      throw new RpcException({
        statusCode: 400,
        message: `User with email ${createUserDto.email} already exists`,
      });

    createUserDto.password = await hash(createUserDto.password, SALT_ROUNDS);
    const userModel = new this.userModel({
      ...createUserDto,
      role,
      balance: 0,
    });

    return userModel.save();
  }

  public async increaseBalance(dto: {
    userId: string;
    amount: number;
  }): Promise<void> {
    const user = await this.userModel.findById(dto.userId);
    if (user === null)
      throw new RpcException({
        statusCode: 404,
        message: `User not found`,
      });

    user.balance += dto.amount;

    await user.save();
  }
}
