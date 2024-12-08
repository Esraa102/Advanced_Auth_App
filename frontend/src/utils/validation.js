const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateCredentails = (name, email, password) => {
  let newErrors = {};
  if (name !== undefined) {
    if (!name.trim().length) {
      newErrors.name = "Name is required";
    } else if (name.trim().length < 2) {
      newErrors.name = "Name should be at lease 2 characters";
    } else if (name.trim().length > 20) {
      newErrors.name = "Name can't be more than 20 characters";
    }
  }

  if (!email.trim().length) {
    newErrors.email = "Email is required";
  } else if (!emailPattern.test(email)) {
    newErrors.email = "Please enter a valid email";
  }

  if (password !== undefined) {
    if (!password.trim().length) {
      newErrors.password = "Password is required";
    } else if (password.trim().length < 8) {
      newErrors.password = "Password CAN'T be less than 8 charcters :)";
    }
  }

  return newErrors;
};

export const validateResetPassword = (password, confirm) => {
  let newErrors = {};
  if (password.trim().length < 8) {
    newErrors.password = "Password can't be less than 8 characters";
  }
  if (!confirm.trim().length) {
    newErrors.confirm = "This field is required";
  }
  if (password !== confirm) {
    newErrors.confirm = "Password and confirm password don't match";
  }
  return newErrors;
};
