export const SERVER_URL = 'http://localhost'
export const SERVER_PORT = 5000
export const ROLES_API = '/api/v1/userroles'
export const USERS_API = '/api/v1/users'
export const OPTIONS = {
    headers: { "content-type": "application/json" }
}
export const getOptionsWithToken = (token) => {
    return {
        headers: {
            "Content-Type": "application/json",
            "Authorization": token
        }
    }
}