import { Injectable } from '@nestjs/common';

@Injectable()
export class RateLimiterService {
	private readonly limitMs: number = 1000;
	private lastEventTimestamps: Map<number, number> = new Map();

	canProcess(peerId: number): boolean {
		const now = Date.now();
		const lastTime = this.lastEventTimestamps.get(peerId);
		if (!lastTime || now - lastTime > this.limitMs) {
			this.lastEventTimestamps.set(peerId, now);
			return true;
		}
		return false;
	}
}