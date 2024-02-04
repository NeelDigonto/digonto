import axios from "axios";
import { ReadonlyHeaders } from "next/dist/server/web/spec-extension/adapters/headers";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

export async function newWebRequest(
  route: string,
  headersList: ReadonlyHeaders,
  cookiesList: ReadonlyRequestCookies
) {
  const headerKVs: { key: string; value: string }[] = [];
  headersList.forEach((value, key, parent) => headerKVs.push({ key, value }));

  const cookieNVs: { name: string; value: string }[] = [];
  cookiesList
    .getAll()
    .forEach(({ name, value }) => cookieNVs.push({ name, value }));

  await axios.post(
    "http://gateway:4000/web/new-request",
    { headerKVs, cookieNVs, route },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}
