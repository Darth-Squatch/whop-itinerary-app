import { headers } from "next/headers";
import { whopsdk } from "@/lib/whop-sdk";

export async function getCurrentWhopUser() {
  const headerStore = await headers();
  return whopsdk.verifyUserToken(headerStore);
}

export async function requireCompanyAdmin(companyId: string) {
  const { userId } = await getCurrentWhopUser();

  const access = await whopsdk.users.checkAccess(companyId, { id: userId });

  if (access.access_level !== "admin") {
    throw new Error("Admin access required.");
  }

  return { userId, access };
}

export async function requireExperienceAccess(experienceId: string) {
  const { userId } = await getCurrentWhopUser();

  const access = await whopsdk.users.checkAccess(experienceId, { id: userId });

  if (!access.has_access) {
    throw new Error("Access denied.");
  }

  return { userId, access };
}