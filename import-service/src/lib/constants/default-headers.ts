import { HttpHeaders } from '@lib/types';

const DEFAULT_HEADERS = ((): HttpHeaders => ({
    'Access-Control-Allow-Methods': '*',
    'Access-Control-Allow-Headers': '*',
    'Access-Control-Allow-Origin': '*'
}))();

export default DEFAULT_HEADERS;
