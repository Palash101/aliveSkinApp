export function emailValidation(email) {
    const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!email) return "Email can't be empty.";
    if (!re.test(email)) return false;
    return true;
  }