import { HttpHeaders } from '@lib/types';

const DEFAULT_HEADERS = ((): HttpHeaders => ({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': '*',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,OPTIONS',
    'Access-Control-Allow-Credentials': 'true',
    'Content-Type': 'application/json'
}))();

export default DEFAULT_HEADERS;
