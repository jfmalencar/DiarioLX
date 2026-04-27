const EMAIL_REGEX = /^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
const NAME_REGEX = /^[a-zA-ZáàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ'-]+$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[._@$!%*?&-])[A-Za-z\d._@$!%*?&-]{8,25}$/;

export function isValidEmail(email: string): boolean {
	return EMAIL_REGEX.test(email);
}

export function isValidName(name: string): boolean {
	return NAME_REGEX.test(name);
}

export function isValidPassword(password: string): boolean {
	return PASSWORD_REGEX.test(password);
}
