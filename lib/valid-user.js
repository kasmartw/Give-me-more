export async function validUser(username, password, id) {

  const validUsername = typeof username === "string" && username.trim().length > 0;
  const validPassword = typeof password === "string" && password.trim().length > 0;

  if (!validUsername || !validPassword) {
    throw new Error("Invalid information data");
  }

  if (id === "loginForm") {
    return "login";
  } else if (id === "signupForm") {
    return "create";
  } else {
    throw new Error("Invalid form ID");
  }
}
