import { randomUUID } from "crypto";

export default async function randomUsername() {
  return "u_tdl:" + randomUUID().replace("-", "").slice(0, 8);
}
