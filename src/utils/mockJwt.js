/**
 * @fileoverview Custom cryptographic simulation engine creating URL-safe mock JWT tokens.
 * @module utils/mockJwt
 */
const crypto = require('crypto');
const SECRET_KEY = process.env.JWT_SECRET || 'finedge_super_secret_salt_string';

const base64UrlEncode = (str) => {
    return Buffer.from(str).toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
};

exports.sign = (payload) => {
    const header = { alg: "HS256", typ: "JWT" };
    const encodedHeader = base64UrlEncode(JSON.stringify(header));
    const encodedPayload = base64UrlEncode(JSON.stringify(payload));
    const signature = crypto.createHmac('sha256', SECRET_KEY).update(`${encodedHeader}.${encodedPayload}`).digest('base64url');
    return `${encodedHeader}.${encodedPayload}.${signature}`;
};

exports.verify = (token) => {
    try {
        const [header, payload, signature] = token.split('.');
        const expectedSignature = crypto.createHmac('sha256', SECRET_KEY).update(`${header}.${payload}`).digest('base64url');
        if (signature !== expectedSignature) return null;
        return JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    } catch { return null; }
};