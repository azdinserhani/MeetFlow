export const services = [
  {
    route: "/api/v1/auth",
    target: process.env.AUTH_SERVICE_URL,
  },
  {
    route: "/api/v1/user",
    target: process.env.USER_SERVICE_URL,
  },
  {
    route: "/api/v1/team",
    target: process.env.TASK_MANAGEMENT_URL,
  },
];