import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';
import { db } from 'src/db';
import { users } from 'src/db/schema';
import { RegisterDto } from 'src/dto/register.dto';
import { LoginDto } from 'src/dto/login.dto';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async register(dto: RegisterDto) {
    const [existing] = await db
      .select()
      .from(users)
      .where(eq(users.email, dto.email));

    if (existing) throw new ConflictException('Email already in use');

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const [user] = await db
      .insert(users)
      .values({ email: dto.email, password: hashedPassword })
      .returning();

    return {
      user: this.sanitize(user),
      token: this.generateToken(user),
    };
  }

  private generateToken(user: typeof users.$inferInsert) {
    return this.jwtService.sign({
      sub: user.id,
      email: user.email,
    });
  }

  private sanitize(user: typeof users.$inferInsert) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...safe } = user;
    return safe;
  }
}
