import { HttpHeaders } from '@lib/types';

const DEFAULT_HEADERS = ((): HttpHeaders => ({
    'Access-Control-Allow-Methods': '*',
    'Access-Control-Allow-Headers': '*',
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json'
}))();

export default DEFAULT_HEADERS;
