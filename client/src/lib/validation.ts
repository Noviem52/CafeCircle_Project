export const LIMITS = {
    nameMin: 2,
    nameMax: 60,
    emailMax: 254,
    passwordMin: 8,
    passwordMax: 64,
    phoneMin: 7,
    phoneMax: 20,
} as const;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;
const PHONE_PATTERN = /^[0-9+()\-\s]+$/;

export interface PasswordRule {
    id: string;
    label: string;
    test: (value: string) => boolean;
}

export const PASSWORD_RULES: PasswordRule[] = [
    {
        id: "length",
        label: `At least ${LIMITS.passwordMin} characters`,
        test: (value) => value.length >= LIMITS.passwordMin,
    },
    {
        id: "uppercase",
        label: "One uppercase letter",
        test: (value) => /[A-Z]/.test(value),
    },
    {
        id: "number",
        label: "One number",
        test: (value) => /[0-9]/.test(value),
    },
    {
        id: "symbol",
        label: "One symbol",
        test: (value) => /[^A-Za-z0-9]/.test(value),
    },
];

export function passwordScore(value: string): number {
    return PASSWORD_RULES.filter((rule) => rule.test(value)).length;
}

export function validateName(value: string): string | null {
    const trimmed = value.trim();

    if (!trimmed) {
        return "Full name is required.";
    }

    if (trimmed.length < LIMITS.nameMin) {
        return `Name must be at least ${LIMITS.nameMin} characters.`;
    }

    if (trimmed.length > LIMITS.nameMax) {
        return `Name must be ${LIMITS.nameMax} characters or fewer.`;
    }

    return null;
}

export function validateEmail(value: string): string | null {
    const trimmed = value.trim();

    if (!trimmed) {
        return "Email address is required.";
    }

    if (trimmed.length > LIMITS.emailMax) {
        return `Email must be ${LIMITS.emailMax} characters or fewer.`;
    }

    if (!EMAIL_PATTERN.test(trimmed)) {
        return "Enter a valid email address.";
    }

    return null;
}

export function validatePassword(value: string): string | null {
    if (!value) {
        return "Password is required.";
    }

    if (value.length > LIMITS.passwordMax) {
        return `Password must be ${LIMITS.passwordMax} characters or fewer.`;
    }

    const failed = PASSWORD_RULES.filter((rule) => !rule.test(value));

    if (failed.length > 0) {
        return `Password needs: ${failed
            .map((rule) => rule.label.toLowerCase())
            .join(", ")}.`;
    }

    return null;
}

export function validateLoginPassword(value: string): string | null {
    if (!value) {
        return "Password is required.";
    }

    if (value.length > LIMITS.passwordMax) {
        return `Password must be ${LIMITS.passwordMax} characters or fewer.`;
    }

    return null;
}

export function validatePhone(value: string): string | null {
    const trimmed = value.trim();

    if (!trimmed) {
        return null;
    }

    if (!PHONE_PATTERN.test(trimmed)) {
        return "Phone can only contain digits, spaces, +, -, and ().";
    }

    const digits = trimmed.replace(/\D/g, "");

    if (digits.length < LIMITS.phoneMin || digits.length > LIMITS.phoneMax) {
        return `Phone must have ${LIMITS.phoneMin}-${LIMITS.phoneMax} digits.`;
    }

    return null;
}
