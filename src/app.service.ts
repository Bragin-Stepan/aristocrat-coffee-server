import {Injectable} from '@nestjs/common';

//! Hello
@Injectable()
export class AppService {
    getHello(): string {
        return 'Hello World!';
    }
}