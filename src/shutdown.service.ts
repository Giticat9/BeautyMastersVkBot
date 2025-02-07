import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { Subject } from 'rxjs';

@Injectable()
export class ShutdownService implements OnModuleDestroy {
	private readonly logger = new Logger(ShutdownService.name);
	private readonly shutdownListener: Subject<void> = new Subject();

	subscribeToShutdown(fnOne: () => void): void {
		this.shutdownListener.subscribe(() => fnOne());
	}

	shutdown() {
		this.shutdownListener.next();
	}

	onModuleDestroy() {
		this.logger.log('Shutting down application');
	}

}