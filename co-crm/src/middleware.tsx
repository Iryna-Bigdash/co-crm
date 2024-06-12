export { default } from "next-auth/middleware";

export const config = {
matcher: [
    "/dashboard",
    "/dashboard/settings",
    "/companies",
    "/companies/:id*",
    "/companies/new",
    "/companies/:id*/new-promotion"
]
}