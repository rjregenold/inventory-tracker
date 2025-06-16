import {AuthService} from '../services/auth.service';
import {ApiClient} from './client';

const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3100/api';
export const inventoryApi = new ApiClient(baseUrl, {
  Accept: 'application/json',
  'Content-Type': 'application/json',
});

function onAuthToken(token: string | null) {
  inventoryApi.setBearerToken(token);
}

AuthService.addAuthTokenListener(onAuthToken, true);
