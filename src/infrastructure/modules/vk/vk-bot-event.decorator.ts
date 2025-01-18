import { SetMetadata } from '@nestjs/common';

export const EVENT_LISTENER = 'EVENT_LISTENER';

export const VKBotEvent = (event: string) => SetMetadata(EVENT_LISTENER, event);