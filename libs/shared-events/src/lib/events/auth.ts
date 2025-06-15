import {BaseEvent} from './base';

export interface AuthOtpCreatedEvent extends BaseEvent {
  eventType: 'auth.otp-created';
  data: {
    email: string;
    code: string;
    expires: Date;
  };
}

export interface AuthSignInEvent extends BaseEvent {
  eventType: 'auth.sign-in';
  data: {
    userId: string;
    signedInAt: Date;
  };
}

export type AuthEvent = AuthOtpCreatedEvent;
