import { load } from "$std/dotenv/mod.ts";
import {
  create,
  Payload,
  verify,
} from "https://deno.land/x/djwt@v3.0.0/mod.ts";
import generateString from "../generateString.ts";

const env = {
  ...(await load()),
  ...Deno.env.toObject(),
};

const JSONWebKey = {
  kty: "oct",
  k: env.CRYPTO_KEY,
  alg: "HS512",
  key_ops: ["sign", "verify"],
  ext: true,
};

const key = await crypto.subtle.importKey(
  "jwk",
  JSONWebKey,
  { name: "HMAC", hash: "SHA-512" },
  true,
  ["sign", "verify"],
);

export const encrypt = (data: Payload): Promise<string> => {
  return create({ alg: "HS512", typ: "JWT" }, data, key);
};

export const decrypt = (token: string) => {
  return verify(token, key);
};

export const generateToken = async (user): Promise<string> => {
  const { password, ...publicUser } = user;

  const tokenObject = {
    ...publicUser,
    salt: generateString(16),
  };

  const token = await encrypt(tokenObject);

  return token;
};
