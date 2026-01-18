import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { CreateUserDto } from "src/users/dto/create-user.dto";
import { JwtPayload } from "../interfaces/jwt.interface";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(private readonly configService: ConfigService) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: true,
			secretOrKey: configService.getOrThrow('JWT_SECRET')
		});
	}

	async validate({ email }: JwtPayload) {
		return { email };
	}
}