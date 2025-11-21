import { Controller, Get, Post, Body, Param, HttpCode, HttpStatus, BadRequestException } from '@nestjs/common';
import { AppService } from './app.service';

type HealthResponse = {
    status: 'ok' | 'error';
    uptime: number;
    timestamp: string;
    memory: NodeJS.MemoryUsage;
    env: Record<string, string | undefined>;
};

type RootResponse = {
    name: string;
    message: string;
    uptime: number;
    timestamp: string;
};

type EchoResponse = {
    echo: string;
};

type SumRequest = {
    a: number | string;
    b: number | string;
};

type SumResponse = {
    a: number;
    b: number;
    sum: number;
};

/**
 * AppController
 *
 * Lightweight, dependency-free controller intended for a NestJS application.
 * Provides:
 * - GET / -> basic app info
 * - GET /ping -> quick liveness check
 * - GET /health -> richer health information (uptime, memory, env)
 * - GET /echo/:text -> echoes the path parameter
 * - POST /sum -> returns the numeric sum of `a` and `b` from the request body
 *
 * This file is self-contained so it can be dropped into src/app.controller.ts
 * without requiring an AppService.
 */
@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Get()
    getRoot(): RootResponse {
        const root: any = this.appService.getRoot();
        return {
            name: root.version ?? 'app',
            message: root.message ?? '',
            uptime: process.uptime(),
            timestamp: new Date().toISOString(),
        };
    }

    @Get('ping')
    @HttpCode(HttpStatus.OK)
    ping(): { pong: boolean; timestamp: string } {
        return { pong: true, timestamp: new Date().toISOString() };
    }

    @Get('health')
    @HttpCode(HttpStatus.OK)
    health(): HealthResponse {
        return {
            status: 'ok',
            uptime: process.uptime(),
            timestamp: new Date().toISOString(),
            memory: process.memoryUsage(),
            env: {
                NODE_ENV: process.env.NODE_ENV,
                PORT: process.env.PORT,
            },
        };
    }

    @Get('echo/:text')
    echo(@Param('text') text: string): EchoResponse {
        return { echo: text ?? '' };
    }

    @Post('sum')
    @HttpCode(HttpStatus.OK)
    sum(@Body() payload: SumRequest): SumResponse {
        const parse = (v: number | string): number => {
            if (typeof v === 'number') return v;
            if (typeof v === 'string' && v.trim() !== '') {
                const n = Number(v);
                if (!Number.isFinite(n)) throw new BadRequestException('Invalid number in request body');
                return n;
            }
            throw new BadRequestException('Missing or invalid number in request body');
        };

        const a = parse(payload?.a);
        const b = parse(payload?.b);

        return { a, b, sum: a + b };
    }
}

export default AppController;