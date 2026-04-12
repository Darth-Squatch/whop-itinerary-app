export async function getCurrentWhopUser() {
  return {
    userId: "dev-user-zac",
  };
}

export async function requireCompanyAdmin(companyId: string) {
  return {
    userId: "dev-user-zac",
    access: {
      access_level: "admin",
      has_access: true,
      companyId,
    },
  };
}

export async function requireExperienceAccess(experienceId: string) {
  return {
    userId: "dev-user-zac",
    access: {
      access_level: "customer",
      has_access: true,
      experienceId,
    },
  };
}