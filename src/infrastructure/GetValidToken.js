export function GetValidToken() {
  const token = sessionStorage.getItem("token");
  const expiresAt = parseInt(sessionStorage.getItem("token_expires"), 10);

  if (!token || !expiresAt || Date.now() > expiresAt) {
    sessionStorage.clear();
    return null;
  }

  return token;
}

